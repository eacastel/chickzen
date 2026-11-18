import EditorialHomePage from "@/components/editorial/HomePage";
import type { Metadata } from "next";
import { defaultMetadata } from "@/lib/defaultMetadata";
export const revalidate = 3600;
import { getHomepage } from "@/lib/contentful";
import { fields, text } from "@/lib/editorial-content";
export async function generateMetadata(): Promise<Metadata> {
  const home = fields(await getHomepage());
  return {
  title: text(home.metaTitle) || "Brand strategy & messaging for women | chickzen",
  description: text(home.metaSummary) ||
    "Work with Jennifer Castellanos to clarify your positioning, shape your message and find a confident direction for your brand.",
  alternates: { canonical: "https://chickzen.com" },
  openGraph: { ...defaultMetadata.openGraph, url: "https://chickzen.com" },
  };
}
export default function HomePage() {
  return <EditorialHomePage />;
}
