"use client";

import { useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    // 👉 Call elements.submit() first
    const submitResult = await elements.submit();
    if (submitResult.error) {
      setMessage(submitResult.error.message || "Something went wrong.");
      return;
    }

    const res = await fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    });

    const { clientSecret } = await res.json();

    const result = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `${window.location.origin}/success`,
      },
    });

    if (result.error) {
      setMessage(result.error.message || "Something went wrong.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name"
        className="w-full border p-2"
      />
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email address"
        className="w-full border p-2"
      />
      <PaymentElement />
      <button
        type="submit"
        disabled={!stripe}
        className={`bg-black text-white px-4 py-2 mt-4 rounded hover:bg-gray-900 transition cursor-pointer ${
          !stripe ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        Pay €327.07
      </button>
      {message && <p className="text-red-500 mt-2">{message}</p>}
    </form>
  );
}
