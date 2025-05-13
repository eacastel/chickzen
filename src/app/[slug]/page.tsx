import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPage } from "@/lib/contentful";
import SectionRenderer from "@/components/SectionRenderer";
import HighlightBlockRenderer from "@/components/HighlightBlockRenderer";
import ReviewBlockRenderer from "@/components/ReviewBlockRenderer";
import LogoCarousel from "@/components/LogoCarousel";
import type {
  SectionEntry,
  ReviewBlockGroupEntry,
  LogoCarouselEntry,
  HighlightBlockEntry,
} from "@/types/contentful";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPage(slug);
  return {
    title: String(page?.fields?.title ?? "Chickzen"),
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await getPage(slug);
  if (!page) notFound();

  const content = Array.isArray(page.fields.section)
    ? page.fields.section
    : [page.fields.section];

  function getContentTypeId(entry: unknown): string | null {
    if (
      typeof entry === "object" &&
      entry !== null &&
      "sys" in entry &&
      "fields" in entry &&
      typeof (entry as { sys: { contentType?: { sys?: { id?: unknown } } } }).sys
        ?.contentType?.sys?.id === "string"
    ) {
      return (entry as { sys: { contentType: { sys: { id: string } } } }).sys
        .contentType.sys.id;
    }
    return null;
  }

  function isHighlightBlockEntry(entry: unknown): entry is HighlightBlockEntry {
    return (
      typeof entry === "object" &&
      entry !== null &&
      "sys" in entry &&
      "fields" in entry &&
      (entry as { sys: { contentType: { sys: { id: string } } } }).sys
        .contentType.sys.id === "highlightBlock"
    );
  }

  return (
    <main>
      {content.map((entry, i) => {
        if (typeof entry !== "object" || entry === null || !("sys" in entry)) {
          return null;
        }

        const typeId = getContentTypeId(entry);
        const key = (entry as { sys: { id?: string } }).sys.id ?? i;

        if (typeId === "section") {
          return (
            <SectionRenderer
              key={key}
              section={entry as SectionEntry}
            />
          );
        }

        if (isHighlightBlockEntry(entry)) {
          return (
            <HighlightBlockRenderer key={key} block={entry} />
          );
        }

        if (typeId === "reviewBlockGroup") {
          const reviewGroupEntry = entry as ReviewBlockGroupEntry;
          const blocks = reviewGroupEntry.fields.reviewBlocks;
          const groupTitle: string = String(
            reviewGroupEntry.fields.title ?? ""
          );

          if (Array.isArray(blocks)) {
            return (
              <div key={key} className="text-center my-12">
                {groupTitle && (
                  <h2 className="text-6xl text-gray-600 font-serif tracking-tighter text-center">
                    {groupTitle}
                  </h2>
                )}
                <ReviewBlockRenderer reviews={blocks} />
              </div>
            );
          }

          return null;
        }

        if (typeId === "logoCarousel") {
          const logoEntry = entry as LogoCarouselEntry;
          const logos = logoEntry.fields.logos;

          if (Array.isArray(logos)) {
            return <LogoCarousel key={key} logos={logos} />;
          }

          return null;
        }

        return null;
      })}
    </main>
  );
}
