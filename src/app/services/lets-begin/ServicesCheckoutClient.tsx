"use client";

import { useEffect, useState } from "react";
import StripeWrapper from "@/components/StripeWrapper";
import type { ServiceTypeEntry, ServiceProductEntry } from "@/types/contentful";
import { filterResolvedEntries, getLocalized } from "@/lib/utils/contentful";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { FaCheckSquare, FaRegSquare } from "react-icons/fa";
import type { Document } from "@contentful/rich-text-types";
import { formatCurrency, type Currency } from "@/lib/utils/currency";

/* ---------- numeric helper (handles localized objects) -------------- */
function extractNumber(raw: unknown): number {
  if (typeof raw === "number") return raw;

  if (raw && typeof raw === "object") {
    for (const v of Object.values(raw as Record<string, unknown>)) {
      const n = extractNumber(v);
      if (n) return n;
    }
  }
  return 0;
}

/* ---------- checkbox component -------------------------------------- */
function CustomCheckbox({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onChange();
      }}
      className="text-[#D4AF7F] text-2xl focus:outline-none"
      aria-label="Toggle selection"
    >
      {checked ? <FaCheckSquare /> : <FaRegSquare />}
    </button>
  );
}

/* ==================================================================== */
/*  MAIN                                                                */
/* ==================================================================== */
export default function ServicesCheckoutClient({
  currency,
}: {
  currency: Currency;
}) {
  const [serviceTypes, setServiceTypes] = useState<ServiceTypeEntry[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<
    ServiceProductEntry[]
  >([]);
  const [clientSecret, setClientSecret] = useState("");
  const [hoveredProductId, setHoveredProductId] = useState<string | null>(null);

  /* ---------- fetch tiers ------------------------------------------- */
  useEffect(() => {
    fetch("/api/service-types")
      .then(async (res) => res.json())
      .then((data) => {
        const sorted = data.sort(
          (a: ServiceTypeEntry, b: ServiceTypeEntry) =>
            (getLocalized(a.fields.sortOrder) ?? 0) -
            (getLocalized(b.fields.sortOrder) ?? 0)
        );
        setServiceTypes(sorted);
      })
      .catch((err) => console.error("Failed to load service types", err));
  }, []);

  /* ---------- helpers ---------------------------------------------- */
  const priceForProduct = (p: ServiceProductEntry) => {
    const raw =
      currency === "USD" ? p.fields.usPrice ?? p.fields.price : p.fields.price;
    return extractNumber(raw);
  };

  const total = selectedProducts.reduce(
    (sum, p) => sum + priceForProduct(p),
    0
  );

  /* ---------- toggle ------------------------------------------------ */
  const toggleProduct = (product: ServiceProductEntry) => {
    setSelectedProducts((prev) => {
      const exists = prev.some((p) => p.sys.id === product.sys.id);
      return exists
        ? prev.filter((p) => p.sys.id !== product.sys.id)
        : [...prev, product];
    });
  };

  /* ---------- checkout --------------------------------------------- */
  const handleCheckout = async () => {
    const res = await fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Guest",
        email: "guest@example.com",
        currency,
        amount: Math.round(total * 100),
        products: selectedProducts.map((p) => ({
          id: p.sys.id,
          title: getLocalized(p.fields.title),
          price: priceForProduct(p),
        })),
      }),
    });

    const data = await res.json();
    if (data.clientSecret) setClientSecret(data.clientSecret);
  };

  /* ================================================================= */
  /*  RENDER                                                           */
  /* ================================================================= */
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h2 className="text-5xl text-gray-600 font-serif tracking-tighter mb-8 text-center">
        Select Your Services
      </h2>

      {/* ---------- tiers -------------------------------------------- */}
      <div className="space-y-8">
        {serviceTypes.map((tier) => {
          const products = filterResolvedEntries(
            getLocalized(tier.fields.services) ?? []
          ) as ServiceProductEntry[];

          return (
            <div
              key={tier.sys.id}
              className="rounded-2xl shadow-md px-6 py-8 border border-gray-100"
            >
              <h3 className="text-4xl mb-4 font-serif font-medium text-center text-gray-700">
                {getLocalized(tier.fields.title)}
              </h3>
              <p className="text-center text-lg text-gray-600 mb-6">
                {getLocalized(tier.fields.byline)}
              </p>

              <ul className="space-y-4">
                {products.map((product) => {
                  const isSelected = selectedProducts.some(
                    (p) => p.sys.id === product.sys.id
                  );
                  const description = getLocalized(product.fields.description);
                  const price = priceForProduct(product);

                  return (
                    <li
                      key={product.sys.id}
                      className="flex justify-between items-start bg-white p-3 rounded-md hover:bg-gray-50 transition border border-gray-200 relative cursor-pointer"
                      onClick={() => toggleProduct(product)}
                      onMouseEnter={() => setHoveredProductId(product.sys.id)}
                      onMouseLeave={() => setHoveredProductId(null)}
                    >
                      {/* checkbox + title */}
                      <div className="flex items-center gap-3 w-full">
                        <CustomCheckbox
                          checked={isSelected}
                          onChange={() => toggleProduct(product)}
                        />
                        <p className="font-medium text-gray-700 flex-1">
                          {getLocalized(product.fields.title)}
                        </p>
                      </div>

                      {/* price */}
                      <span className="text-m font-medium text-gray-600 whitespace-nowrap ml-2">
                        {formatCurrency(price, currency)}
                      </span>

                      {/* tooltip */}
                      {hoveredProductId === product.sys.id &&
                        description &&
                        typeof description !== "string" && (
                          <div className="absolute top-full mt-1 right-0 z-20 w-[80%] p-4 bg-white shadow-xl border border-gray-200 rounded text-gray-600 hidden md:block">
                            {documentToReactComponents(description as Document)}
                          </div>
                        )}
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>

      {/* ---------- summary ------------------------------------------ */}
      {selectedProducts.length > 0 && (
        <div className="mt-12 text-center">
          <h4 className="text-xl mb-2 font-serif">Selected Services:</h4>
          <ul className="mb-4">
            {selectedProducts.map((p) => (
              <li key={p.sys.id}>
                {getLocalized(p.fields.title)} –{" "}
                {formatCurrency(priceForProduct(p), currency)}
              </li>
            ))}
          </ul>
          <p className="text-lg font-semibold mb-4">
            Total: {formatCurrency(total, currency)}
          </p>

          {clientSecret ? (
            <StripeWrapper
              clientSecret={clientSecret}
              amountCents={Math.round(total * 100)}
              currency={currency}
            />
          ) : (
            <button
              onClick={handleCheckout}
              className="bg-black text-white px-6 py-3 rounded hover:bg-gray-700"
            >
              Proceed to Payment
            </button>
          )}
        </div>
      )}
    </div>
  );
}
