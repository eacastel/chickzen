/** Explicit release gate: preview deployments never index or record production analytics. */
export function isPublicProduction() {
  return (
    process.env.SITE_LAUNCHED === "true" &&
    process.env.VERCEL_ENV === "production"
  );
}

/** Enable collection only after the shared GA4 stream is ready for manual views. */
export function isAnalyticsProduction() {
  return isPublicProduction() && process.env.ANALYTICS_ENABLED === "true";
}
