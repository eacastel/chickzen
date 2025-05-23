"use client";

import dynamic from "next/dynamic";

const ServicesCheckoutClient = dynamic(() => import("./ServicesCheckoutClient"), {
  ssr: false,
});

export default function ClientWrapper() {
  return <ServicesCheckoutClient />;
}
