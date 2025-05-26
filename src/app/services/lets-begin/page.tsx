export const dynamic = "force-dynamic"; 

import { cookies } from "next/headers";
import ClientWrapper from "./ClientWrapper";
import type { Currency } from "@/lib/utils/currency";

const currencyCookie = cookies().get("currency")?.value;
console.log("🍪 Currency cookie:", currencyCookie);

export const metadata = {
  title: "StoryZen Services Checkout | Chickzen",
  description:
    "Select the StoryZen services you need and complete payment securely.",
  alternates: {
    canonical: "https://chickzen.com/services/checkout",
  },
  openGraph: {
    title: "StoryZen Services Checkout | Chickzen",
    description:
      "Select the StoryZen services you need and complete payment securely.",
    url: "https://chickzen.com/services/checkout",
    siteName: "Chickzen",
    images: ["/og-default.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "StoryZen Services Checkout | Chickzen",
    description:
      "Select the StoryZen services you need and complete payment securely.",
    images: ["/og-default.png"],
  },
};

export default async function ServicesCheckoutPage() {
  const cookieStore = await cookies();

  const devOverride = process.env.NEXT_PUBLIC_CURRENCY_OVERRIDE as
    | Currency
    | undefined;

  const currency =
    devOverride ??
    (cookieStore.get("currency")?.value as Currency | undefined) ??
    "EUR";

  return <ClientWrapper currency={currency} />;
}
