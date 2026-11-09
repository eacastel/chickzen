import catalog from "./catalog.json";

export const MEASUREMENT_VERSION = "2026-11-09";
export const GA_ID = "G-6PCNC6QKXE";
export const CONSENT_KEY = "chickzen.analytics-consent.v1";
export const DEDUP_KEY = "chickzen.analytics-inquiries.v1";
export const CONSENT_DURATION = 180 * 24 * 60 * 60 * 1000;
export type Choice = "accepted" | "rejected";
export type Placement = "header" | "footer" | "hero" | "content";
export type ContactMethod = "phone" | "email" | "whatsapp" | "contact_page";
export type BusinessEvent =
  | { event: "ck_service_select"; service_id: string; link_placement: Placement }
  | { event: "ck_contact_click"; contact_method: ContactMethod; link_placement: Placement }
  | { event: "ck_guide_request_click"; link_placement: Placement }
  | { event: "ck_inquiry_accepted" };
export const campaignFields = {
  utm_source: "campaign_source", utm_medium: "campaign_medium",
  utm_campaign: "campaign_name", utm_id: "campaign_id",
  utm_term: "campaign_term", utm_content: "campaign_content",
} as const;
export function allowedOrigin(origin: string) {
  return origin === "https://chickzen.com" || origin === "https://www.chickzen.com";
}
export function validContainer(id: string) { return /^GTM-[A-Z0-9]+$/.test(id); }
export function safePath(path: string) {
  return Object.hasOwn(catalog.pages, path) ? path : "/404";
}
export function safePage(path: string, origin: string) {
  const page = safePath(path);
  return {
    page_path: page,
    page_location: `${allowedOrigin(origin) ? origin : "https://chickzen.com"}${page}`,
    page_title: (catalog.pages as Record<string, string>)[page],
  };
}
export function safeReferrer(raw: string, origin: string) {
  if (!raw) return "";
  try {
    const url = new URL(raw);
    if (!["https:", "http:"].includes(url.protocol) || url.username || url.password) return "";
    return allowedOrigin(url.origin)
      ? `${allowedOrigin(origin) ? origin : "https://chickzen.com"}${safePath(url.pathname)}`
      : url.origin;
  } catch { return ""; }
}
export function safeCampaignValue(value: string | null) {
  return value !== null && /^[a-z0-9][a-z0-9_-]{0,79}$/.test(value) && !/\d{7}/.test(value)
    ? value : null;
}
export function safeCampaign(search: string) {
  const params = new URLSearchParams(search);
  const values: Record<string, string> = {};
  for (const [key, field] of Object.entries(campaignFields)) {
    const value = params.getAll(key).length === 1 ? safeCampaignValue(params.get(key)) : null;
    if (value) values[field] = value;
  }
  return values;
}
export function readConsent(raw: string | null, now = Date.now()): Choice | null {
  try {
    const value = JSON.parse(raw || "null");
    return value?.version === 1 && Number.isFinite(value.expires) && value.expires > now &&
      value.expires <= now + CONSENT_DURATION + 60000 &&
      ["accepted", "rejected"].includes(value.choice) ? value.choice : null;
  } catch { return null; }
}
export function serviceCategory(id: string) {
  return Object.hasOwn(catalog.services, id) ? (catalog.services as Record<string, string>)[id] : null;
}
// A new object for every event; nothing from a form or a previous event is spread here.
export function businessFields(value: BusinessEvent): Record<string, string> | null {
  if (value.event === "ck_inquiry_accepted") return { event: value.event, form_id: "contact_general" };
  if (!["header", "footer", "hero", "content"].includes(value.link_placement)) return null;
  if (value.event === "ck_service_select") {
    const category = serviceCategory(value.service_id);
    return category ? {event: value.event, service_id: value.service_id, service_category: category, link_placement: value.link_placement} : null;
  }
  if (value.event === "ck_contact_click") {
    return ["phone", "email", "whatsapp", "contact_page"].includes(value.contact_method)
      ? {event: value.event, contact_method: value.contact_method, link_placement: value.link_placement} : null;
  }
  if (value.event === "ck_guide_request_click") return {event: value.event, resource_id: "strawberry_lemonade", link_placement: value.link_placement};
  return null;
}
