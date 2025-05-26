"use client";
import dynamic from "next/dynamic";
import type { Currency } from "@/lib/utils/currency";

const ServicesCheckoutClient = dynamic(
  () => import("./ServicesCheckoutClient"),
  { ssr: false }
);

export default function ClientWrapper({ currency }: { currency: Currency }) {
  return <ServicesCheckoutClient currency={currency} />;
}
