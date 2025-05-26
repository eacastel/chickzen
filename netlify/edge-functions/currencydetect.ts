import type { Context } from "https://edge.netlify.net";

export default async function middleware(req: Request, ctx: Context) {
  const countryRaw = ctx.geo?.country;

  const country =
    typeof countryRaw === "string"
      ? countryRaw.toUpperCase()
      : "INTL"; // fallback if undefined or malformed

  const currency = country === "US" ? "USD" : "EUR";

  const res = await ctx.next();
  res.headers.append(
    "Set-Cookie",
    `currency=${currency}; Path=/; Max-Age=3600; SameSite=Lax`
  );
  return res;
}
