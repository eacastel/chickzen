import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import SectionRenderer from "@/components/SectionRenderer";
import { getPage } from "@/lib/contentful";
import type { SectionEntry } from "@/types/contentful";
import type { Entry } from "contentful";

function isSectionEntry(entry: unknown): entry is SectionEntry {
  return (
    typeof entry === "object" &&
    entry !== null &&
    "sys" in entry &&
    "fields" in entry &&
    (entry as Entry<any>).sys?.contentType?.sys?.id === "section"
  );
}

export default async function HomePage() {
  const page = await getPage("home");

  const raw = page?.fields?.sections;
const sections = Array.isArray(raw)
  ? (raw.filter(isSectionEntry) as unknown as SectionEntry[])
  : isSectionEntry(raw)
  ? [raw]
  : []

  return (
    <>
      <Header />
      <Hero />
      <main>
        {sections.map((section, i) => (
          <SectionRenderer key={section.sys?.id || i} section={section} />
        ))}
      </main>
      <Footer />
    </>
  );
}
