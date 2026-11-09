import EditorialHomePage from "@/components/editorial/HomePage";
import type { Metadata } from "next";
import { defaultMetadata } from "@/lib/defaultMetadata";
export const revalidate = 3600;
export const metadata: Metadata = {
  title: "Brand strategy & messaging for women | chickzen",
  description:
    "Work with Jennifer Castellanos to clarify your positioning, shape your message and find a confident direction for your brand.",
  alternates: { canonical: "https://chickzen.com" },
  openGraph: { ...defaultMetadata.openGraph, url: "https://chickzen.com" },
};
export default function HomePage() {
  return <EditorialHomePage />;
}
