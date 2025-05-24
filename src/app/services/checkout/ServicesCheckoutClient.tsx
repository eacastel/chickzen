// src/app/services/checkout/ServicesCheckoutClient.tsx
"use client";

import { useEffect, useState } from "react";
import StripeWrapper from "@/components/StripeWrapper";
import type { ServiceTypeEntry, ServiceProductEntry } from "@/types/contentful";
import { filterResolvedEntries, getLocalized } from "@/lib/utils/contentful";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { FaCheckSquare, FaRegSquare } from "react-icons/fa";
import type { Document } from "@contentful/rich-text-types";

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

export default function ServicesCheckoutClient() {
  const [serviceTypes, setServiceTypes] = useState<ServiceTypeEntry[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<
    ServiceProductEntry[]
  >([]);
  const [clientSecret, setClientSecret] = useState("");
  const [hoveredProductId, setHoveredProductId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/service-types")
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`API error: ${res.status} – ${text}`);
        }
        return res.json();
      })
      .then((data) => {


        const sorted = data.sort((a: ServiceTypeEntry, b: ServiceTypeEntry) => {
          return (
            (getLocalized(a.fields.sortOrder) ?? 0) -
            (getLocalized(b.fields.sortOrder) ?? 0)
          );
        });
        setServiceTypes(sorted);
      })
      .catch((err) => console.error("Failed to load service types", err));
  }, []);

  const toggleProduct = (product: ServiceProductEntry) => {
    setSelectedProducts((prev) => {
      const exists = prev.find((p) => p.sys.id === product.sys.id);
      return exists
        ? prev.filter((p) => p.sys.id !== product.sys.id)
        : [...prev, product];
    });
  };

  const total = selectedProducts.reduce(
    (sum, p) => sum + (getLocalized(p.fields.price) ?? 0),
    0
  );

  const handleCheckout = async () => {
    const res = await fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Guest",
        email: "guest@example.com",
        products: selectedProducts.map((p) => ({
          id: p.sys.id,
          title: p.fields.title,
          price: p.fields.price,
        })),
        total,
      }),
    });

    const data = await res.json();
    if (data.clientSecret) {
      setClientSecret(data.clientSecret);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h2 className="text-5xl font-serif text-gray-500 text-center mb-10">
        Select Your Services
      </h2>
      <div className="space-y-8 relative">
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
              <div className="max-w-2xl mx-auto px-6">
                <ul className="space-y-4">
                  {products.map((product) => {
                    const isSelected = selectedProducts.some(
                      (p) => p.sys.id === product.sys.id
                    );
                    const description = getLocalized(
                      product.fields.description
                    );

                    return (
                      <li
                        key={product.sys.id}
                        className="flex justify-between items-start text-sm md:text-base bg-white p-3 rounded-md hover:bg-gray-50 transition border border-gray-200 relative"
                        onMouseEnter={() => setHoveredProductId(product.sys.id)}
                        onMouseLeave={() => setHoveredProductId(null)}
                        onClick={() => toggleProduct(product)}
                      >
                        <div className="flex items-center gap-3 w-full cursor-pointer">
                          <CustomCheckbox
                            checked={isSelected}
                            onChange={() => toggleProduct(product)}
                          />
                          <div className="flex-1">
                            <p className="font-medium font-sans-serif text-gray-700">
                              {getLocalized(product.fields.title)}
                            </p>
                          </div>
                        </div>
                        <span className="text-m font-medium text-gray-600 whitespace-nowrap ml-2 ">
                          € {getLocalized(product.fields.price)?.toFixed(0)}
                        </span>

                        {/* Tooltip-like description */}
                        {hoveredProductId === product.sys.id &&
                          description &&
                          typeof description !== "string" && (
                            <div className="absolute top-full mt-1 right-0 z-20 w-[80%] p-4 bg-white shadow-xl border border-gray-200 rounded text-sans-serif text-gray-600 hidden md:block">
                              {documentToReactComponents(
                                description as Document
                              )}
                            </div>
                          )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      {selectedProducts.length > 0 && (
        <div className="mt-12 text-center">
          <h4 className="text-xl mb-2 font-serif">Selected Services:</h4>
          <ul className="mb-4">
            {selectedProducts.map((p) => (
              <li key={p.sys.id}>
                {getLocalized(p.fields.title)} – €
                {getLocalized(p.fields.price)?.toFixed(2)}
              </li>
            ))}
          </ul>
          <p className="text-lg font-semibold mb-4">
            Total: €{total.toFixed(2)}
          </p>
          {clientSecret ? (
            <StripeWrapper clientSecret={clientSecret} />
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
