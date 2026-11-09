import { campaignFields, safeCampaignValue, safePath } from "./analytics/policy";
const routes: Record<string, string> = {
  "/home": "/", "/journal": "/blog", "/services/checkout": "/services/lets-begin",
  "/origin-story": "/about", "/good-vibes": "/about#recommendations",
  "/lets-begin": "/contact", "/shop": "/services",
};
export function legacyDestination(input: URL) {
  let path = routes[input.pathname];
  if (!path && input.pathname.startsWith("/journal/")) {
    const candidate = input.pathname.replace(/^\/journal\//, "/blog/");
    if (safePath(candidate) !== "/404") path = candidate;
  }
  if (!path) return null;
  const output = new URL(path, input.origin);
  for (const key of Object.keys(campaignFields)) {
    const value = input.searchParams.getAll(key).length === 1 ? safeCampaignValue(input.searchParams.get(key)) : null;
    if (value) output.searchParams.set(key, value);
  }
  return output;
}
