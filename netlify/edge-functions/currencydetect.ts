import type { Context } from "https://edge.netlify.net";

export default async function middleware(req: Request, ctx: Context) {
  // ─── your existing country detection ────────────────────────────────
  const country = ctx.geo?.country as { code?: string } | string | undefined;

  let countryCode = "INTL";
  if (typeof country === "string") {
    countryCode = country.toUpperCase();
  } else if (country && typeof country.code === "string") {
    countryCode = country.code.toUpperCase();
  }

  // ─── cookies you care about ─────────────────────────────────────────
  const currency    = countryCode === "US" ? "USD" : "EUR";
  const phoneRegion = countryCode === "US" ? "US"  : "EU";   // ← NEW

  const res = await ctx.next();

  // you can call append twice; Netlify sends a separate Set-Cookie header each time
  res.headers.append(
    "Set-Cookie",
    `currency=${currency}; Path=/; Max-Age=3600; SameSite=Lax`
  );
  res.headers.append(
    "Set-Cookie",
    `phoneRegion=${phoneRegion}; Path=/; Max-Age=3600; SameSite=Lax`
  );

  return res;
}
