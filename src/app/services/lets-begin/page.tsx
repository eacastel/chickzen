import ClientWrapper from "./ClientWrapper";

export const metadata = {
  title: "Services Checkout | Chickzen",
  description:
    "Select the services you need and complete payment securely.",
  alternates: {
    canonical: "https://chickzen.com/services/checkout",
  },
  openGraph: {
    title: "Services Checkout | Chickzen",
    description:
      "Select the services you need and complete payment securely.",
    url: "https://chickzen.com/services/checkout",
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
  return <ClientWrapper />;
}
