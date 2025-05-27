import type { Context } from "https://edge.netlify.net";

export default async function middleware(req: Request, ctx: Context) {
  const rawCountry = ctx.geo?.country;

  let countryCode = "INTL";

  if (typeof rawCountry === "string") {
    countryCode = rawCountry.toUpperCase();
  } else if (
    rawCountry &&
    typeof rawCountry === "object" &&
    typeof rawCountry.code === "string"
  ) {
    countryCode = rawCountry.code.toUpperCase();
  }

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
