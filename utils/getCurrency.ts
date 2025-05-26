// utils/getCurrency.ts
export async function getCurrency(): Promise<"USD" | "EUR"> {
  if (typeof window === "undefined") return "EUR"; // SSR fallback

  // In production: read from edge-set header
  const res = await fetch("/", { method: "HEAD" });
  const currency = res.headers.get("x-currency");

  if (currency === "USD" || currency === "EUR") {
    return currency;
  }

  // Local dev fallback
  return process.env.NODE_ENV === "development" ? "EUR" : "EUR";
}
