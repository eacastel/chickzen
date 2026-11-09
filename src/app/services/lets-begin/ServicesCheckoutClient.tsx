"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import StripeWrapper from "@/components/StripeWrapper";
import type { ServiceTypeEntry, ServiceProductEntry } from "@/types/contentful";
import { filterResolvedEntries, getLocalized } from "@/lib/utils/contentful";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";

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

export default function ServicesCheckoutClient({
  currency,
  checkoutEnabled,
}: {
  currency: Currency;
  checkoutEnabled: boolean;
}) {
  const [serviceTypes, setServiceTypes] = useState<ServiceTypeEntry[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<
    ServiceProductEntry[]
  >([]);
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const [checkoutError, setCheckoutError] = useState("");
  const [checkoutPending, setCheckoutPending] = useState(false);
  const [quotedAmount, setQuotedAmount] = useState(0);

  /* ---------- fetch tiers ------------------------------------------- */
  useEffect(() => {
    fetch("/api/service-types")
      .then(async (res) => {
        if (!res.ok) throw new Error("Services unavailable");
        return res.json();
      })
      .then((data) => {
        const sorted = data.sort(
          (a: ServiceTypeEntry, b: ServiceTypeEntry) =>
            (getLocalized(a.fields.sortOrder) ?? 0) -
            (getLocalized(b.fields.sortOrder) ?? 0),
        );
        setServiceTypes(sorted);
      })
      .catch(() => setLoadError(true))
      .finally(() => setLoading(false));
  }, []);

  /* ---------- helpers ---------------------------------------------- */
  const priceForProduct = (p: ServiceProductEntry) => {
    const raw =
      currency === "USD"
        ? (p.fields.usPrice ?? p.fields.price)
        : p.fields.price;
    return extractNumber(raw);
  };

  const total = selectedProducts.reduce(
    (sum, p) => sum + priceForProduct(p),
    0,
  );

  /* ---------- toggle ------------------------------------------------ */
  const toggleProduct = (product: ServiceProductEntry) => {
    setClientSecret("");
    setCheckoutError("");
    setSelectedProducts((prev) => {
      const exists = prev.some((p) => p.sys.id === product.sys.id);
      return exists
        ? prev.filter((p) => p.sys.id !== product.sys.id)
        : [...prev, product];
    });
  };

  /* ---------- checkout --------------------------------------------- */
  const handleCheckout = async () => {
    if (checkoutPending) return;
    setCheckoutPending(true);
    setCheckoutError("");
    try {
      const res = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currency,
          productIds: selectedProducts.map((p) => p.sys.id),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.clientSecret)
        throw new Error(
          data.error || "Checkout is unavailable. Please contact Jen.",
        );
      setQuotedAmount(data.amount);
      setClientSecret(data.clientSecret);
    } catch (error) {
      setCheckoutError(
        error instanceof Error
          ? error.message
          : "Please contact Jen to arrange payment.",
      );
    } finally {
      setCheckoutPending(false);
    }
  };

  return (
    <div className="wrap content-page checkout-page">
      <header className="page-heading">
        <span className="eyebrow">Your next chapter</span>
        <h1>Let’s begin.</h1>
        <p className="page-byline">
          Choose the support that fits your next step.
        </p>
      </header>
      <div className="editorial-prose">
        <p>
          Already spoken with Jen? Select your agreed services below. If you’re
          still exploring,{" "}
          <Link href="/contact">start with a conversation</Link> and we’ll find
          the right fit.
        </p>
      </div>
      {!checkoutEnabled && (
        <p className="checkout-notice">
          Online payment is currently unavailable.{" "}
          <Link href="/contact">Contact Jen to arrange your services.</Link>
        </p>
      )}
      {loading && <p role="status">Loading services…</p>}
      {loadError && (
        <p role="alert">
          Services couldn’t load. Please{" "}
          <Link href="/contact">contact Jen</Link> to get started.
        </p>
      )}
      {serviceTypes.map((tier) => {
        const products = filterResolvedEntries(
          getLocalized(tier.fields.services) ?? [],
        ) as ServiceProductEntry[];
        return (
          <section className="service-category" key={tier.sys.id}>
            <div>
              <h2>{getLocalized(tier.fields.title)}</h2>
              <p>{getLocalized(tier.fields.byline)}</p>
            </div>
            <div className="service-list">
              {products.map((product) => {
                const description = getLocalized(product.fields.description);
                return (
                  <div className="checkout-product" key={product.sys.id}>
                    <label>
                      <input
                        type="checkbox"
                        checked={selectedProducts.some(
                          (p) => p.sys.id === product.sys.id,
                        )}
                        onChange={() => toggleProduct(product)}
                      />
                      <span>{getLocalized(product.fields.title)}</span>
                      <strong>
                        {formatCurrency(priceForProduct(product), currency)}
                      </strong>
                    </label>
                    {description && typeof description !== "string" && (
                      <details>
                        <summary>Service details</summary>
                        <div className="editorial-prose">
                          {documentToReactComponents(description as Document)}
                        </div>
                      </details>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
      {selectedProducts.length > 0 && (
        <section className="checkout-summary" aria-labelledby="summary-title">
          <h2 id="summary-title">Your selected services</h2>
          <ul>
            {selectedProducts.map((p) => (
              <li key={p.sys.id}>
                {getLocalized(p.fields.title)}{" "}
                <span>{formatCurrency(priceForProduct(p), currency)}</span>
              </li>
            ))}
          </ul>
          <p className="checkout-total">
            Total: {formatCurrency(total, currency)}
          </p>
          {checkoutError && <p role="alert">{checkoutError}</p>}
          {clientSecret ? (
            <StripeWrapper
              clientSecret={clientSecret}
              amountCents={quotedAmount}
              currency={currency}
            />
          ) : (
            <button
              className="button"
              onClick={handleCheckout}
              disabled={!checkoutEnabled || checkoutPending}
            >
              {checkoutPending ? "Preparing payment…" : "Proceed to payment"}
            </button>
          )}
        </section>
      )}
    </div>
  );
}
