import ClientWrapper from "./ClientWrapper";
import Link from "next/link";
const checkoutEnabled = process.env.CHECKOUT_ENABLED === "true" && !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

export const metadata = {
  ...(!checkoutEnabled ? { robots: { index: false, follow: true } } : {}),
  title: "Services Checkout | Chickzen",
  description:
    "Select the services you need and complete payment securely.",
  alternates: {
    canonical: "https://chickzen.com/services/lets-begin",
  },
  openGraph: {
    title: "Services Checkout | Chickzen",
    description:
      "Select the services you need and complete payment securely.",
    url: "https://chickzen.com/services/lets-begin",
    siteName: "Chickzen",
    images: ["/og-default.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Services Checkout | Chickzen",
    description:
      "Select the services you need and complete payment securely.",
    images: ["/og-default.png"],
  },
};

export default function ServicesCheckoutPage() {
  if (!checkoutEnabled) return <section className="wrap journal-page">
    <span className="eyebrow">Work with Jen</span>
    <h1>Let’s choose your next step together.</h1>
    <p>Tell Jen about your brand and what you would like to change. She’ll help you find the right service and arrange the next steps with you.</p>
    <Link className="button" href="/contact">Talk with Jen <span aria-hidden="true">↗</span></Link>
  </section>;
  return <ClientWrapper checkoutEnabled={checkoutEnabled} />;
}
