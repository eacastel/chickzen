/** Explicit release gate: preview deployments never index or record production analytics. */
export function isPublicProduction() {
  return (
    process.env.SITE_LAUNCHED === "true" &&
    process.env.VERCEL_ENV === "production"
  );
}
