import type { Context } from "https://edge.netlify.net";

export default async function middleware(req: Request, ctx: Context) {
  console.log("🌍 ctx.geo:", ctx.geo);

  const countryRaw = ctx.geo?.country;
  const country =
    typeof countryRaw === "string" ? countryRaw.toUpperCase() : "INTL";

  const currency = country === "US" ? "USD" : "EUR";

  console.log("🌎 Detected country:", country, "→ currency:", currency);

  const res = await ctx.next();
  res.headers.append(
    "Set-Cookie",
    `currency=${currency}; Path=/; Max-Age=3600; SameSite=Lax`
  );
  return res;
}
