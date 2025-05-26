// src/components/StripeWrapper.tsx
"use client";

import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";
import { formatCurrency, type Currency } from "@/lib/utils/currency";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

/* ------------------------------------------------------------------ */
/*  Inline form (name + email + card all together)                    */
/* ------------------------------------------------------------------ */
function InlineCheckoutForm({
  clientSecret,
  amountCents,
  currency,
}: {
  clientSecret: string;
  amountCents: number;
  currency: Currency;
}) {
  const stripe = useStripe();
  const elements = useElements();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    // validate card + other Stripe elements first
    const res = await elements.submit();
    if (res.error) {
      setMsg(res.error.message ?? "Something went wrong.");
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        payment_method_data: {
          billing_details: { name },
        },
        receipt_email: email,
        return_url: `${window.location.origin}/success`,
      },
    });

    if (error) setMsg(error.message ?? "Something went wrong.");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-6">
      <input
        type="text"
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name"
        className="w-full border p-2 rounded"
      />
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email address"
        className="w-full border p-2 rounded"
      />

      <PaymentElement />

      <button
        type="submit"
        disabled={!stripe}
        className={`bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition ${
          !stripe ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        Pay {formatCurrency(amountCents / 100, currency)}
      </button>

      {msg && <p className="text-red-500 mt-2">{msg}</p>}
    </form>
  );
}

/* ------------------------------------------------------------------ */
/*  Wrapper exported to parent component                              */
/* ------------------------------------------------------------------ */
export default function StripeWrapper({
  clientSecret,
  amountCents,
  currency,
}: {
  clientSecret: string;
  amountCents: number;
  currency: Currency;
}) {
  if (!clientSecret) return null; // still preparing intent

  return (
    <Elements options={{ clientSecret }} stripe={stripePromise}>
      <InlineCheckoutForm
        clientSecret={clientSecret}
        amountCents={amountCents}
        currency={currency}
      />
    </Elements>
  );
}
