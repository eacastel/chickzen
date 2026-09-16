"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import type { Currency } from "@/lib/utils/currency";

const ServicesCheckoutClient = dynamic(
  () => import("./ServicesCheckoutClient"),
  { ssr: false }
);

function countryFromGeoResponse(value: unknown): string | undefined {
  if (!value || typeof value !== "object" || !("geo" in value)) return;

  const geo = value.geo;
  if (!geo || typeof geo !== "object" || !("country" in geo)) return;

  return typeof geo.country === "string" ? geo.country.toUpperCase() : undefined;
}

export default function ClientWrapper() {
  const override = process.env.NEXT_PUBLIC_CURRENCY_OVERRIDE;
  const [currency, setCurrency] = useState<Currency>(
    override === "USD" ? "USD" : "EUR"
  );

  useEffect(() => {
    if (override === "USD" || override === "EUR") return;

    const controller = new AbortController();

    fetch("/api/geo", { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: unknown) => {
        setCurrency(countryFromGeoResponse(data) === "US" ? "USD" : "EUR");
      })
      .catch((error: unknown) => {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          console.error("Failed to detect visitor currency", error);
        }
      });

    return () => controller.abort();
  }, [override]);

  return <ServicesCheckoutClient currency={currency} />;
}
