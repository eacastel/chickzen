import { cookies } from "next/headers";
import ClientWrapper from "./ClientWrapper";
import type { Currency } from "@/lib/utils/currency";

export const dynamic = "force-dynamic";

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

export default async function ServicesCheckoutPage() {
  const cookieStore = await cookies(); 

  const devOverride = process.env.NEXT_PUBLIC_CURRENCY_OVERRIDE as Currency | undefined;

  const currency =
    devOverride ??
    (cookieStore.get("currency")?.value as Currency | undefined) ??
    "EUR";

  return <ClientWrapper currency={currency} />;
}