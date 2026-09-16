"use client";

import { useEffect, useState } from "react";

type Region = "US" | "EU";

function countryFromGeoResponse(value: unknown): string | undefined {
  if (!value || typeof value !== "object" || !("geo" in value)) return;

  const geo = value.geo;
  if (!geo || typeof geo !== "object" || !("country" in geo)) return;

  return typeof geo.country === "string" ? geo.country.toUpperCase() : undefined;
}

export default function ContactInfo() {
  const override = process.env.NEXT_PUBLIC_CURRENCY_OVERRIDE;
  const [region, setRegion] = useState<Region>(override === "USD" ? "US" : "EU");

  useEffect(() => {
    if (override === "USD" || override === "EUR") return;

    const controller = new AbortController();

    fetch("/api/geo", { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: unknown) => {
        setRegion(countryFromGeoResponse(data) === "US" ? "US" : "EU");
      })
      .catch((error: unknown) => {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          console.error("Failed to detect visitor region", error);
        }
      });

    return () => controller.abort();
  }, [override]);

  const contact =
    region === "US"
      ? { phone: "+1 (323) 493-1991", whatsapp: "https://wa.me/13234931991" }
      : { phone: "+34 606 989 881", whatsapp: "https://wa.me/34606989881" };

  return (
    <div className="flex flex-col justify-middle md:justify-center text-center md:text-right text-sm text-gray-500 space-y-1 h-full">
      <div className="mb-2">
        <a
          href={`tel:${contact.phone.replace(/[^+\d]/g, "")}`}
          className="hover:underline text-sm text-gray-500"
        >
          {contact.phone}
        </a>
      </div>

      <div className="mb-2">
        <a
          href={contact.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          WhatsApp
        </a>
      </div>

      <div className="mb-6 text-sm text-gray-500">
        <a
          id="email-link"
          href="mailto:&#104;&#101;&#108;&#108;&#111;&#64;&#99;&#104;&#105;&#99;&#107;&#122;&#101;&#110;&#46;&#99;&#111;&#109;"
          className="hover:underline"
        >
          Email
        </a>
      </div>
    </div>
  );
}
