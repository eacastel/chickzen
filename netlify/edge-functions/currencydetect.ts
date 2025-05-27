import type { Context } from "https://edge.netlify.net";

export default async function middleware(req: Request, ctx: Context) {
  const countryCode = ctx.geo?.country?.code?.toUpperCase?.() || "INTL";

  const currency = countryCode === "US" ? "USD" : "EUR";

  console.log("🌍 ctx.geo:", ctx.geo);
  console.log("🌎 Detected country code:", countryCode, "→ currency:", currency);

  const res = await ctx.next();
  res.headers.append(
    "Set-Cookie",
    `currency=${currency}; Path=/; Max-Age=3600; SameSite=Lax`
  );
  return res;
}
