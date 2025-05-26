import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const devOverride =
    process.env.NEXT_PUBLIC_CURRENCY_OVERRIDE as "USD" | "EUR" | undefined;

  const country = (req as any).geo?.country?.toUpperCase() || "INTL";
  const currency: "USD" | "EUR" =
    devOverride ?? (country === "US" ? "USD" : "EUR");

  const res = NextResponse.next();

  // 👇— transient cookie (Path=/ so every request gets it)
  res.cookies.set("currency", currency, { path: "/", maxAge: 60 * 60 });

  return res;
}

export const config = {
  matcher: ["/((?!_next|static|favicon.ico).*)"],
};
