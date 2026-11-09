"use client";
import {
  allowedOrigin, businessFields, campaignFields, CONSENT_DURATION, CONSENT_KEY,
  DEDUP_KEY, GA_ID, MEASUREMENT_VERSION, readConsent, safeCampaign, safePage,
  safeReferrer, serviceCategory, validContainer,
  type BusinessEvent, type Choice, type ContactMethod, type Placement,
} from "./policy";

type Layer = unknown[];
type AnalyticsWindow = Window & { dataLayer?: Layer; [key: `ga-disable-${string}`]: boolean };
type Context = ReturnType<typeof safePage> & { page_referrer: string } & Record<string, string>;
type InquiryContext = { context: Context; epoch: number };
let permitted = false, active = false, container = "", loaded = false, epoch = 0;
let choice: Choice | null = null, expires = 0, lastPath: string | null = null;
let referrer = "", campaign: Record<string, string> = {};
const sentInquiries = new Set<string>();
const browser = () => window as unknown as AnalyticsWindow;

function consentCommand(...args: unknown[]) {
  // Google expects an Arguments object, not an array.
  function command(...values: unknown[]) {
    void values;
    // eslint-disable-next-line prefer-rest-params -- Google consent command protocol uses Arguments.
    browser().dataLayer?.push(arguments);
  }
  command(...args);
}
function consentValues(analytics: "granted" | "denied") {
  return { analytics_storage: analytics, ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied", personalization_storage: "denied" };
}
function canSend() {
  return permitted && active && choice === "accepted" && expires > Date.now() && allowedOrigin(window.location.origin);
}
function context(): Context {
  return { ...safePage(window.location.pathname, window.location.origin), page_referrer: referrer, ...campaign };
}
function push(fields: Record<string, string>, page: Context) {
  if (!canSend()) return false;
  // Clear fields in GTM's data model as well as using per-tag field allowlists.
  browser().dataLayer?.push({
    service_id: null, service_category: null, contact_method: null,
    link_placement: null, resource_id: null, form_id: null,
    ...Object.fromEntries(Object.values(campaignFields).map((key) => [key, null])),
    ...page, ...fields, measurement_version: MEASUREMENT_VERSION,
  });
  return true;
}
function cleanBrowserUrl() {
  // Hydration has finished: server-side payment verification and form prefill
  // have already consumed their parameters. Google must not auto-read raw URLs.
  if (window.location.search || window.location.hash) {
    window.history.replaceState(window.history.state, "", window.location.pathname);
  }
}
function start() {
  if (!permitted || active || choice !== "accepted") return;
  const initialCampaign = safeCampaign(window.location.search);
  if (Object.keys(initialCampaign).length) campaign = initialCampaign;
  cleanBrowserUrl();
  active = true;
  epoch++;
  browser()[`ga-disable-${GA_ID}`] = false;
  browser().dataLayer ||= [];
  consentCommand("consent", "default", consentValues("denied"));
  consentCommand("consent", "update", consentValues("granted"));
  // Safe context exists before the Google tag initializes, including accepted UTMs.
  browser().dataLayer?.push({ ...context(), measurement_version: MEASUREMENT_VERSION });
  if (!loaded) {
    loaded = true;
    browser().dataLayer?.push({ "gtm.start": Date.now(), event: "gtm.js" });
    const script = document.createElement("script");
    script.id = "chickzen-gtm";
    script.async = true;
    script.referrerPolicy = "origin";
    script.src = `https://www.googletagmanager.com/gtm.js?id=${container}`;
    document.head.appendChild(script);
  }
  trackPage();
}
export function storedChoice() {
  try { return readConsent(localStorage.getItem(CONSENT_KEY)); } catch { return null; }
}
export function configureAnalytics(enabled: boolean, id: string) {
  permitted = enabled && validContainer(id) && allowedOrigin(window.location.origin);
  container = id;
  if (permitted && !active) {
    campaign = safeCampaign(window.location.search);
    referrer = safeReferrer(document.referrer, window.location.origin);
    try {
      const values: unknown = JSON.parse(sessionStorage.getItem(DEDUP_KEY) || "[]");
      if (Array.isArray(values)) for (const id of values) if (typeof id === "string") sentInquiries.add(id);
    } catch { /* In-memory dedup still applies when storage is unavailable. */ }
  }
  choice = storedChoice();
  if (choice === "accepted") {
    try { expires = JSON.parse(localStorage.getItem(CONSENT_KEY)!).expires; } catch { expires = 0; }
    start();
  }
  document.addEventListener("click", handleClick, true);
  return () => document.removeEventListener("click", handleClick, true);
}
function clearAnalyticsStorage() {
  for (const item of document.cookie.split(";")) {
    const name = item.trim().split("=")[0];
    if (!/^(_ga(?:_|$)|_gid$|_gat(?:_|$))/.test(name)) continue;
    for (const domain of ["", window.location.hostname, "." + window.location.hostname, "chickzen.com", ".chickzen.com"]) {
      document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax${domain ? `; Domain=${domain}` : ""}`;
    }
  }
  sentInquiries.clear();
  try { sessionStorage.removeItem(DEDUP_KEY); } catch { /* Storage can be blocked. */ }
  campaign = {};
  referrer = "";
  lastPath = null;
}
export function chooseAnalytics(value: Choice, persist = true) {
  choice = value;
  expires = Date.now() + CONSENT_DURATION;
  if (persist) {
    try { localStorage.setItem(CONSENT_KEY, JSON.stringify({version: 1, choice: value, expires})); } catch { /* Choice lasts for this document. */ }
  }
  if (value === "accepted") { start(); return; }
  const wasActive = active;
  active = false;
  epoch++;
  if (permitted) {
    browser()[`ga-disable-${GA_ID}`] = true;
    if (loaded) consentCommand("consent", "update", consentValues("denied"));
  }
  clearAnalyticsStorage();
  if (wasActive) {
    document.getElementById("chickzen-gtm")?.remove();
    // Reload unloads Google's event listeners and in-flight queues. Rejected choice persists.
    window.location.reload();
  }
}
export function trackPage() {
  if (!canSend() || lastPath === window.location.pathname) return;
  if (lastPath !== null) referrer = safePage(lastPath, window.location.origin).page_location;
  const nextCampaign = safeCampaign(window.location.search);
  if (Object.keys(nextCampaign).length) campaign = nextCampaign;
  cleanBrowserUrl();
  lastPath = window.location.pathname;
  push({ event: "ck_page_view" }, context());
}
export function captureInquiryContext(): InquiryContext | null {
  return canSend() ? { context: context(), epoch } : null;
}
export function recordInquiryAccepted(status: number, result: unknown, id: string, captured: InquiryContext | null) {
  if (!captured || captured.epoch !== epoch || !canSend() || status !== 202 || !result || typeof result !== "object") return;
  const response = result as Record<string, unknown>;
  if (response.accepted !== true || response.analyticsEligible !== true || !id || sentInquiries.has(id)) return;
  if (push(businessFields({event: "ck_inquiry_accepted"})!, captured.context)) {
    sentInquiries.add(id);
    try { sessionStorage.setItem(DEDUP_KEY, JSON.stringify([...sentInquiries].slice(-100))); } catch { /* In-memory dedup still applies. */ }
  }
}
function handleClick(event: MouseEvent) {
  if (!canSend() || event.button !== 0 || !(event.target instanceof Element)) return;
  const link = event.target.closest<HTMLAnchorElement>("a[href]");
  if (!link) return;
  let url: URL;
  try { url = new URL(link.href, window.location.href); } catch { return; }
  const placement: Placement = link.closest(".masthead") ? "header" : link.closest(".site-footer") ? "footer" : link.closest(".hero, .page-heading") ? "hero" : "content";
  let data: BusinessEvent | null = null;
  const service = link.dataset.serviceId;
  if (service && serviceCategory(service)) data = {event: "ck_service_select", service_id: service, link_placement: placement};
  else if (link.dataset.guideRequest === "strawberry_lemonade") data = {event: "ck_guide_request_click", link_placement: placement};
  else {
    let method: ContactMethod | null = null;
    if (url.protocol === "mailto:") method = "email";
    else if (url.protocol === "tel:") method = "phone";
    else if (url.protocol === "https:" && ["wa.me", "api.whatsapp.com"].includes(url.hostname)) method = "whatsapp";
    else if (url.origin === window.location.origin && (url.pathname === "/contact" || (url.pathname === "/" && url.hash === "#begin"))) method = "contact_page";
    if (method) data = {event: "ck_contact_click", contact_method: method, link_placement: placement};
  }
  if (data) {
    const fields = businessFields(data);
    if (fields) push(fields, context());
  }
}
