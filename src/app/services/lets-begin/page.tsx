import ClientWrapper from "./ClientWrapper";

export const metadata = {
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
  return <ClientWrapper checkoutEnabled={process.env.CHECKOUT_ENABLED === "true" && !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY} />;
}
