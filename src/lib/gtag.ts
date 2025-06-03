export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || "";

// Track page views
export const pageview = (url: string): void => {
  if (!GA_TRACKING_ID || typeof window.gtag !== "function") return;
  window.gtag("config", GA_TRACKING_ID, {
    page_path: url,
  });
};

// Track events
interface GTagEvent {
  action: string;
  category: string;
  label: string;
  value: number;
}

export const event = ({ action, category, label, value }: GTagEvent): void => {
  if (!GA_TRACKING_ID || typeof window.gtag !== "function") return;
  window.gtag("event", action, {
    event_category: category,
    event_label: label,
    value,
  });
};
