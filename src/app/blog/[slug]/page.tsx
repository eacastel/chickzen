import Image from "next/image";
import { notFound } from "next/navigation";
import { defaultMetadata } from "@/lib/defaultMetadata";
import type { Metadata } from "next";
import type { Asset } from "contentful";
import type { Document } from "@contentful/rich-text-types";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { getBlogPost } = await import("@/lib/contentful");
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return defaultMetadata;

  const { metaTitle, title, metaSummary, coverImage } = post.fields;
  const safeTitle = String(metaTitle ?? title ?? defaultMetadata.title);
  const safeDescription = String(metaSummary ?? defaultMetadata.description);
  const img = coverImage as Asset;
  const imageUrl = img?.fields?.file?.url ? `https:${img.fields.file.url}` : null;

  return {
    title: safeTitle,
    description: safeDescription,
    alternates: { canonical: `https://chickzen.com/blog/${slug}` },
    openGraph: {
      ...defaultMetadata.openGraph,
      title: safeTitle,
      description: safeDescription,
      url: `https://chickzen.com/blog/${slug}`,
      images: [{ url: imageUrl ?? "/og-default.png" }],
    },
    twitter: {
      ...defaultMetadata.twitter,
      title: safeTitle,
      description: safeDescription,
      images: [imageUrl ?? "/og-default.png"],
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { getBlogPost } = await import("@/lib/contentful");
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) notFound();

  const fields = post.fields;
  const title = String(fields.title ?? "Untitled");
  const byline = typeof fields.byline === "string" ? fields.byline : null;
  const publishDate =
    typeof fields.publishDate === "string" || typeof fields.publishDate === "number"
      ? new Date(fields.publishDate)
      : null;

  const tags = Array.isArray(fields.tags)
    ? fields.tags.filter((tag): tag is string => typeof tag === "string")
    : [];

  const image = fields.coverImage as Asset;
  const imageUrl = image?.fields?.file?.url ? `https:${image.fields.file.url}` : null;

  const imagePosition = fields.imagePosition;
  const floatClass =
    imagePosition === "left"
      ? "md:float-left md:mr-6"
      : imagePosition === "right"
      ? "md:float-right md:ml-6"
      : "";

  const body = fields.body as Document;

  const RichTextRenderer = (await import("@/components/RichTextRenderer")).default;

  return (
    <article className="max-w-3xl mx-auto px-4 py-12 prose prose-lg text-gray-700">
      <header className="mb-6">
        <h1 className="text-4xl font-serif mb-1">{title}</h1>
        {byline && <p className="text-sm text-gray-500">By {byline}</p>}
        {publishDate && (
          <p className="text-xs text-gray-400">
            {publishDate.toLocaleDateString("en-US")}
          </p>
        )}
        {tags.length > 0 && (
          <ul className="flex gap-2 mt-2 text-xs text-gray-500 flex-wrap">
            {tags.map((tag) => (
              <li key={tag} className="bg-gray-100 px-2 py-1 rounded">
                #{tag}
              </li>
            ))}
          </ul>
        )}
      </header>

      {imageUrl && (
  <div
    className={`mb-6 ${floatClass} hhover:brightness-105 max-w-xs w-full rounded-lg overflow-hidden`}
  >
    <Image
      src={imageUrl}
      alt={typeof title === "string" ? title : "Blog cover"}
      width={300}
      height={0}
      className="h-auto w-full object-cover rounded-lg"
      priority
    />
  </div>
)}

      <RichTextRenderer document={body} />
    </article>
  );
}
