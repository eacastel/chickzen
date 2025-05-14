import Hero from "@/components/Hero";
import { defaultMetadata } from "@/lib/defaultMetadata";
import SectionRenderer from "@/components/SectionRenderer";
import HighlightBlockRenderer from "@/components/HighlightBlockRenderer";
import type { Metadata } from "next";
import type { Asset } from "contentful";
import { getPage } from "@/lib/contentful";

import type { SectionEntry, HighlightBlockEntry } from "@/types/contentful";
import type { BaseEntry } from "contentful";

export const revalidate = 300;
export const dynamicParams = true;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("home");
  const image = page?.fields?.previewImage as Asset;

  const imageUrl =
    typeof image?.fields?.file?.url === "string"
      ? `https:${image.fields.file.url}`
      : (defaultMetadata.openGraph?.images as { url: string }[])?.[0]?.url ??
        "https://chickzen.com/og-default.png";

  const title = String(
    page?.fields?.metaTitle ?? page?.fields?.title ?? defaultMetadata.title
  );

  const description = String(
    page?.fields?.metaSummary ?? defaultMetadata.description
  );

  return {
    ...defaultMetadata,
    title,
    description,
    alternates: {
      canonical: "https://chickzen.com",
    },
    openGraph: {
      ...defaultMetadata.openGraph,
      title,
      description,
      url: "https://chickzen.com",
      images: [{ url: imageUrl }],
    },
    twitter: {
      ...defaultMetadata.twitter,
      title,
      description,
      images: [imageUrl],
    },
  };
}

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
