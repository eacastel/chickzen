// app/[slug]/page.tsx

import { notFound } from "next/navigation";
import { getPage } from "@/lib/contentful";
import { defaultMetadata } from "@/lib/defaultMetadata";
import type { Metadata } from "next";
import type { Asset } from "contentful";
import type { Document } from "@contentful/rich-text-types";
import RichTextRenderer from "@/components/RichTextRenderer";
import SectionRenderer from "@/components/SectionRenderer";
import HighlightBlockRenderer from "@/components/HighlightBlockRenderer";
import ReviewBlockRenderer from "@/components/ReviewBlockRenderer";
import LogoCarousel from "@/components/LogoCarousel";
import ServiceOverviewBlockRenderer from "@/components/ServiceOverviewBlockRenderer";
import ServiceTypeRenderer from "@/components/ServiceTypeRenderer";

import type {
  SectionEntry,
  ReviewBlockGroupEntry,
  LogoCarouselEntry,
  HighlightBlockEntry,
  ServiceOverviewBlockEntry,
  ServiceTypeEntry,
} from "@/types/contentful";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const page = await getPage(slug);
  if (!page) return defaultMetadata;

  const previewImage = page.fields?.previewImage as Asset | undefined;

  // Determine image URL
  let imageUrl = "https://chickzen.com/og-default.png";

  if (previewImage?.fields?.file?.url) {
    imageUrl = `https:${previewImage.fields.file.url}`;
  } else {
    const fallback = defaultMetadata.openGraph?.images;

    if (Array.isArray(fallback)) {
      const first = fallback[0];
      if (typeof first === "string") {
        imageUrl = first;
      } else if (first && typeof first === "object" && "url" in first) {
        imageUrl = first.url as string;
      }
    } else if (typeof fallback === "string") {
      imageUrl = fallback;
    } else if (fallback && typeof fallback === "object" && "url" in fallback) {
      imageUrl = fallback.url as string;
    }
  }

  const title = String(
    page.fields?.metaTitle ?? page.fields?.title ?? defaultMetadata.title
  );

  const description = String(
    page.fields?.metaSummary ?? defaultMetadata.description
  );

  return {
    metadataBase: new URL("https://chickzen.com"),
    title,
    description,
    alternates: {
      canonical: `https://chickzen.com/${slug}`,
    },
    openGraph: {
      ...defaultMetadata.openGraph,
      title,
      description,
      url: `https://chickzen.com/${slug}`,
      images: [imageUrl],
    },
    twitter: {
      ...defaultMetadata.twitter,
      title,
      description,
      images: [imageUrl],
    },
  };
}

// === Type guards ===

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
  return getContentTypeId(entry) === "highlightBlock";
}

function isServiceOverviewBlockEntry(
  entry: unknown
): entry is ServiceOverviewBlockEntry {
  return getContentTypeId(entry) === "serviceOverviewBlock";
}

function isServiceTypeEntry(entry: unknown): entry is ServiceTypeEntry {
  return getContentTypeId(entry) === "serviceType";
}

// === Main Page Component ===

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

  return (
    <main>
      {content.map((entry, i) => {
        if (typeof entry !== "object" || entry === null || !("sys" in entry)) {
          return null;
        }

        const key = (entry as { sys: { id?: string } }).sys.id ?? i;

        if (getContentTypeId(entry) === "section") {
          return (
            <SectionRenderer
              key={key}
              section={entry as unknown as SectionEntry}
            />
          );
        }

        if (isHighlightBlockEntry(entry)) {
          return <HighlightBlockRenderer key={key} block={entry} />;
        }

        if (getContentTypeId(entry) === "reviewBlockGroup") {
          const reviewGroupEntry = entry as ReviewBlockGroupEntry;
          const blocks = reviewGroupEntry.fields.reviewBlocks;
          const groupTitle: string = String(
            reviewGroupEntry.fields.title ?? ""
          );
          const byline: string = String(reviewGroupEntry.fields.byline ?? "");
          const body = reviewGroupEntry.fields.body;

          if (Array.isArray(blocks)) {
            return (
              
              <div key={key} className="text-center my-1 max-w-4xl mx-auto text-gray-600 clear-both">
                
                {groupTitle && (
                  <h2 className="text-5xl text-gray-600 font-serif tracking-tighter mb-6 text-center">
                    {groupTitle}
                  </h2>
                )}
                {byline && (
                  <p className="text-2xl tracking-tighter text-gray-600 font-serif italic mb-6 text-center">
                    {byline}
                  </p>
                )}
                {body && typeof body !== "string" && (
                  <div className="prose prose-lg max-w-none mx-auto text-justify">
                    <RichTextRenderer document={body as unknown as Document} />
                  </div>
                )}
                <ReviewBlockRenderer reviews={blocks} />
              </div>
            );
          }

          return null;
        }

        if (getContentTypeId(entry) === "logoCarousel") {
          const logoEntry = entry as LogoCarouselEntry;
          const logos = logoEntry.fields.logos;

          if (Array.isArray(logos)) {
            return <LogoCarousel key={key} logos={logos} />;
          }

          return null;
        }

        if (isServiceOverviewBlockEntry(entry)) {
          return (
            <ServiceOverviewBlockRenderer
              key={key}
              serviceTypes={
                Array.isArray(entry.fields.serviceTypes)
                  ? entry.fields.serviceTypes.filter(
                      (type): type is ServiceTypeEntry =>
                        type !== undefined &&
                        typeof type === "object" &&
                        "fields" in type &&
                        "sys" in type &&
                        "metadata" in type
                    )
                  : []
              }
            />
          );
        }

        if (isServiceTypeEntry(entry)) {
          return <ServiceTypeRenderer key={key} serviceType={entry} />;
        }

        return null;
      })}
    </main>
  );
}
