"use client";

import { useEffect, useState } from "react";
import StripeWrapper from "@/components/StripeWrapper";

export default function ShopClient() {
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Guest",
        email: "guest@example.com",
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
          console.error("Stripe error:", data);
        }
      });
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-3xl font-serif mb-4 text-center">StoryZen</h2>
      <p className="text-lg text-center text-gray-700 mb-8">
        Invest in your story: receive a 3-part pitch plus a powerful tagline,
        crafted to capture attention and express your core value.
      </p>

      {clientSecret ? (
        <StripeWrapper clientSecret={clientSecret} />
      ) : (
        <div className="text-center text-gray-500">Loading checkout…</div>
      )}
    </div>
  );
}