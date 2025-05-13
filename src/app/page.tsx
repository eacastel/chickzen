import Hero from "@/components/Hero";
import SectionRenderer from "@/components/SectionRenderer";
import HighlightBlockRenderer from "@/components/HighlightBlockRenderer";
import { getPage } from "@/lib/contentful";

import type { SectionEntry, HighlightBlockEntry } from "@/types/contentful";
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

function isHighlightBlockEntry(entry: unknown): entry is HighlightBlockEntry {
  return (
    typeof entry === "object" &&
    entry !== null &&
    "sys" in entry &&
    "fields" in entry &&
    (entry as unknown as BaseEntry).sys?.contentType?.sys?.id === "highlightBlock"
  );
}

export default async function HomePage() {
  const page = await getPage("home");

  const raw = page?.fields?.section;
  const content = Array.isArray(raw) ? raw : [raw];

  return (
    <>
      <Hero />
      {content.map((entry, i) => {
        if (isSectionEntry(entry)) {
          return (
            <SectionRenderer key={entry.sys.id ?? i} section={entry} />
          );
        }

        if (isHighlightBlockEntry(entry)) {
          return (
            <HighlightBlockRenderer key={entry.sys.id ?? i} block={entry} />
          );
        }

        return null;
      })}
    </>
  );
}
