"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { FiSliders } from "react-icons/fi";
import { chooseAnalytics, configureAnalytics, storedChoice, trackPage } from "@/lib/analytics/client";
import { CONSENT_KEY, type Choice } from "@/lib/analytics/policy";

export default function AnalyticsConsent({enabled, containerId}: {enabled: boolean; containerId: string}) {
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [choice, setChoice] = useState<Choice | null>(null);
  const settings = useRef<HTMLButtonElement>(null);
  const reject = useRef<HTMLButtonElement>(null);
  const reopening = useRef(false);
  useEffect(() => {
    const cleanup = configureAnalytics(enabled, containerId);
    const saved = storedChoice();
    setChoice(saved);
    setOpen(!saved);
    setReady(true);
    const sync = (event: StorageEvent) => {
      if (event.key !== CONSENT_KEY && event.key !== null) return;
      const value = storedChoice();
      chooseAnalytics(value || "rejected", false);
      setChoice(value);
      setOpen(!value);
    };
    window.addEventListener("storage", sync);
    return () => { cleanup(); window.removeEventListener("storage", sync); };
  }, [enabled, containerId]);
  useEffect(() => { trackPage(); }, [pathname]);
  useEffect(() => {
    if (open && reopening.current) reject.current?.focus();
  }, [open]);
  function choose(value: Choice) {
    setChoice(value);
    setOpen(false);
    chooseAnalytics(value);
    requestAnimationFrame(() => settings.current?.focus());
  }
  if (!ready) return null;
  return <>
    {open ? <section className="cookie-panel" role="region" aria-label="Analytics cookie choices">
      <div>
        <h2>A little clarity on cookies.</h2>
        <p>With your permission, analytics helps Jen understand which pages are useful. You can accept or reject analytics and change your choice any time. <Link href="/cookie-policy">Cookie policy</Link></p>
      </div>
      <div className="cookie-actions">
        <button ref={reject} type="button" className="cookie-choice" onClick={() => choose("rejected")}>Reject analytics</button>
        <button type="button" className="cookie-choice" onClick={() => choose("accepted")}>Accept analytics</button>
        {choice && <button className="cookie-close" type="button" onClick={() => {setOpen(false); requestAnimationFrame(() => settings.current?.focus());}}>Keep current choice</button>}
      </div>
    </section> : <button ref={settings} className="cookie-settings" type="button" aria-label="Change analytics cookie settings" onClick={() => {reopening.current = true; setOpen(true);}}>
      <FiSliders aria-hidden="true" /><span className="sr-only">Cookie settings</span>
    </button>}
  </>;
}
