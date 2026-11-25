"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { FiSliders } from "react-icons/fi";
import { chooseAnalytics, configureAnalytics, storedChoice, trackPage } from "@/lib/analytics/client";
import { CONSENT_KEY, type Choice } from "@/lib/analytics/policy";

type Panel = "banner" | "preferences" | "closed";

export default function AnalyticsConsent({enabled, containerId}: {enabled: boolean; containerId: string}) {
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const [panel, setPanel] = useState<Panel>("closed");
  const [choice, setChoice] = useState<Choice | null>(null);
  const [analytics, setAnalytics] = useState(false);
  const settings = useRef<HTMLButtonElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const focusPanel = useRef(false);
  useEffect(() => {
    const cleanup = configureAnalytics(enabled, containerId);
    const saved = storedChoice();
    setChoice(saved);
    setPanel(saved ? "closed" : "banner");
    setReady(true);
    const sync = (event: StorageEvent) => {
      if (event.key !== CONSENT_KEY && event.key !== null) return;
      const value = storedChoice();
      chooseAnalytics(value || "rejected", false);
      setChoice(value);
      setAnalytics(value === "accepted");
      setPanel(value ? "closed" : "banner");
    };
    window.addEventListener("storage", sync);
    return () => { cleanup(); window.removeEventListener("storage", sync); };
  }, [enabled, containerId]);
  useEffect(() => { trackPage(); }, [pathname]);
  useEffect(() => {
    if (!focusPanel.current) return;
    if (panel === "closed") settings.current?.focus();
    else heading.current?.focus();
    focusPanel.current = false;
  }, [panel]);
  function choose(value: Choice) {
    setChoice(value);
    focusPanel.current = true;
    setPanel("closed");
    chooseAnalytics(value);
  }
  function preferences() {
    setAnalytics(choice === "accepted");
    focusPanel.current = true;
    setPanel("preferences");
  }
  function cancel() {
    focusPanel.current = true;
    setPanel(choice ? "closed" : "banner");
  }
  if (!ready) return null;
  return <>
    {panel !== "closed" ? <section className={`cookie-panel${panel === "preferences" ? " cookie-preferences" : ""}`} role="region" aria-labelledby="cookie-heading" onKeyDown={event => {
      if (panel === "preferences" && event.key === "Escape") { event.preventDefault(); cancel(); }
    }}>
      <div>
        <h2 id="cookie-heading" ref={heading} tabIndex={-1}>{panel === "preferences" ? "Your cookie preferences." : "A little clarity on cookies."}</h2>
        <p>With your permission, analytics helps Jen understand which pages are useful. You can change your choice any time. <Link href="/cookie-policy">Cookie policy</Link></p>
      </div>
      {panel === "preferences" ? <>
        <div className="cookie-categories">
          <div className="cookie-category">
            <div><h3>Essential settings</h3><p>Remember your privacy choices and keep the site working.</p></div>
            <span className="cookie-required">Always on</span>
          </div>
          <label className="cookie-category" htmlFor="cookie-analytics">
            <div><h3>Analytics</h3><p id="cookie-analytics-description">Help Jen understand visits and improve the site.</p></div>
            <input id="cookie-analytics" type="checkbox" checked={analytics} onChange={event => setAnalytics(event.target.checked)} aria-label="Analytics" aria-describedby="cookie-analytics-description" />
          </label>
        </div>
        <div className="cookie-actions">
          <button type="button" className="cookie-choice cookie-primary" onClick={() => choose(analytics ? "accepted" : "rejected")}>Save preferences</button>
          <button type="button" className="cookie-choice" onClick={cancel}>Cancel</button>
        </div>
      </> : <div className="cookie-actions">
        <button type="button" className="cookie-choice cookie-primary" onClick={() => choose("accepted")}>Accept cookies</button>
        <button type="button" className="cookie-choice" onClick={() => choose("rejected")}>Reject</button>
        <button type="button" className="cookie-choice" onClick={preferences}>Preferences</button>
      </div>}
    </section> : <button ref={settings} className="cookie-settings" type="button" aria-label="Change analytics cookie settings" onClick={preferences}>
      <FiSliders aria-hidden="true" /><span className="sr-only">Cookie settings</span>
    </button>}
  </>;
}
