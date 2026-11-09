// app/[slug]/page.tsx

import { notFound } from "next/navigation";
import { getAllPageSlugs, getPage } from "@/lib/contentful";
import { defaultMetadata } from "@/lib/defaultMetadata";
import type { Metadata } from "next";
import type { Asset } from "contentful";
import CmsPage from "@/components/editorial/CmsPage";

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await getAllPageSlugs();

  return slugs
    .filter((slug) => slug !== "home" && !slug.includes("/"))
    .map((slug) => ({ slug }));
}

async function isKnownPageSlug(slug: string) {
  const slugs = await getAllPageSlugs();
  return slugs.includes(slug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  if (!(await isKnownPageSlug(slug))) return defaultMetadata;

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
    page.fields?.metaTitle ?? page.fields?.title ?? defaultMetadata.title,
  );

  const description = String(
    page.fields?.metaSummary ?? defaultMetadata.description,
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

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!(await isKnownPageSlug(slug))) notFound();
  const page = await getPage(slug);
  if (!page) notFound();
  return <CmsPage page={page} slug={slug} />;
}
