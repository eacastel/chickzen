import type { Context } from "https://edge.netlify.net";

export default async function middleware(req: Request, ctx: Context) {
  const country = ctx.geo?.country as { code?: string } | string | undefined;

  let countryCode = "INTL";

  if (typeof country === "string") {
    countryCode = country.toUpperCase();
  } else if (country && typeof country.code === "string") {
    countryCode = country.code.toUpperCase();
  }

  const currency = countryCode === "US" ? "USD" : "EUR";

  const res = await ctx.next();
  res.headers.append(
    "Set-Cookie",
    `currency=${currency}; Path=/; Max-Age=3600; SameSite=Lax`
  );
  return res;
}
