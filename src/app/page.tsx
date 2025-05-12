import Hero from "@/components/Hero";
import SectionRenderer from "@/components/SectionRenderer";
import { getPage } from "@/lib/contentful";
import type { SectionEntry } from "@/types/contentful";
import type { BaseEntry } from "contentful";

function isSectionEntry(entry: unknown): entry is SectionEntry {
  return (
    typeof entry === "object" &&
    entry !== null &&
    "sys" in entry &&
    "fields" in entry &&
    (entry as unknown as BaseEntry).sys?.contentType?.sys?.id === "section"
  );
}

export default async function HomePage() {
  const page = await getPage("home");

  const raw = page?.fields?.section;
  const section = Array.isArray(raw)
    ? (raw.filter(isSectionEntry) as unknown as SectionEntry[])
    : isSectionEntry(raw)
    ? [raw]
    : [];

  return (
    <>
      <Hero />
        {section.map((section, i) => (
          <SectionRenderer key={section.sys?.id || i} section={section} />
        ))}
    </>
  );
}
