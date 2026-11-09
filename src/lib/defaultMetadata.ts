// src/lib/defaultMetadata.ts

import type { Metadata } from "next";

export const defaultMetadata: Metadata = {
  title: "Brand strategy & messaging for women | chickzen",
  description: "chickzen™ empowers women to clarify their story and connect with the right audience. Learn how our process helps you pitch with confidence and purpose.",
  openGraph: {
    title: "Brand strategy & messaging for women | chickzen",
    description: "chickzen™ empowers women to clarify their story and connect with the right audience. Learn how our process helps you pitch with confidence and purpose."
,
    siteName: "Chickzen",
    images: ["/og-default.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Chickzen",
    description: "Brand strategy and messaging for women building their next chapter.",
    images: ["/og-default.png"],
  },
};

export const notFoundMetadata: Metadata = {
  title: "Page not found | chickzen",
  alternates: { canonical: null },
  openGraph: null,
  robots: { index: false, follow: false },
};
