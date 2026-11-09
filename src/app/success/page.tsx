import Stripe from "stripe";
import Link from "next/link";
import type { Metadata } from "next";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Payment status | chickzen",
  alternates: { canonical: "https://chickzen.com/success" },
  robots: { index: false, follow: false },
};
export default async function PaymentStatus({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  let succeeded = false,
    pending = false;
  const id = params.payment_intent,
    secret = params.payment_intent_client_secret;
  if (
    typeof id === "string" &&
    /^pi_[a-zA-Z0-9]+$/.test(id) &&
    typeof secret === "string" &&
    process.env.STRIPE_SECRET_KEY
  ) {
    try {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: "2025-04-30.basil",
      });
      const intent = await stripe.paymentIntents.retrieve(id);
      if (intent.client_secret === secret) {
        succeeded = intent.status === "succeeded";
        pending = intent.status === "processing";
      }
    } catch {
      /* Do not claim success when the payment cannot be verified. */
    }
  }
  return (
    <section className="wrap journal-page">
      <span className="eyebrow">Your payment</span>
      <h1>
        {succeeded
          ? "Thank you for your order."
          : pending
            ? "Your payment is processing."
            : "Let’s check your payment."}
      </h1>
      <p>
        {succeeded
          ? "Your payment has been confirmed. Contact Jen if you have any questions about getting started."
          : pending
            ? "Your bank is still processing the payment. Please allow time for confirmation before trying again."
            : "We couldn’t confirm a completed payment from this link. Contact Jen before making another payment if you think you have already paid."}
      </p>
      <Link className="text-link" href="/#begin">
        Contact Jen <span aria-hidden="true">↗</span>
      </Link>
    </section>
  );
}
