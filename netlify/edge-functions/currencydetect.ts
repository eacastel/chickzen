import type { Context } from "https://edge.netlify.net";

export default async function middleware(req: Request, ctx: Context) {

  const country = ctx.geo?.country?.toUpperCase() || "INTL";
const currency =
  country === "US" ? "USD" : country === "UN" ? "EUR" : "EUR";

  const res = await ctx.next();
  res.headers.append(
    "Set-Cookie",
    `currency=${currency}; Path=/; Max-Age=3600; SameSite=Lax`
  );
  return res;
}
