export type Currency = "USD" | "EUR";

export const DEFAULT_CURRENCY: Currency = "EUR";

export function formatCurrency(value: number, currency: Currency): string {
  return new Intl.NumberFormat(
    currency === "USD" ? "en-US" : "de-DE", // choose any EU locale you like
    { style: "currency", currency, minimumFractionDigits: 0 }
  ).format(value);
}


export function extractNumber(raw: unknown): number {
  if (typeof raw === "number") return raw;

  if (raw && typeof raw === "object") {
    for (const value of Object.values(raw as Record<string, unknown>)) {
      if (typeof value === "number") return value;
      if (typeof value === "object") {
        const nested = extractNumber(value);
        if (nested) return nested;
      }
    }
  }
  return 0;
}