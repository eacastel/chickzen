import Image from "next/image";
import EditorialRichText from "@/components/editorial/EditorialRichText";
import { asset } from "@/lib/editorial-content";
import { notFound } from "next/navigation";
import { defaultMetadata, notFoundMetadata } from "@/lib/defaultMetadata";
import type { Metadata } from "next";
import { getAllBlogPosts, getAllBlogSlugs } from "@/lib/contentful";
import type { Asset } from "contentful";
import type { Document } from "@contentful/rich-text-types";
import { documentToPlainTextString } from "@contentful/rich-text-plain-text-renderer";
import Link from "next/link";

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await getAllBlogSlugs();
  return slugs.map((slug) => ({ slug }));
}

async function isKnownBlogSlug(slug: string) {
  const slugs = await getAllBlogSlugs();
  return slugs.includes(slug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { getBlogPost } = await import("@/lib/contentful");
  const { slug } = await params;
  if (!(await isKnownBlogSlug(slug))) return notFoundMetadata;

  const post = await getBlogPost(slug);
  if (!post) return notFoundMetadata;

  const { metaTitle, title, metaSummary, coverImage } = post.fields;
  const safeTitle = String(metaTitle ?? title ?? defaultMetadata.title);
  const safeDescription = String(metaSummary ?? defaultMetadata.description);
  const img = coverImage as unknown as Asset;
  const imageUrl = img?.fields?.file?.url
    ? `https:${img.fields.file.url}`
    : null;

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

function getReadTime(text: string): string {
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { getBlogPost } = await import("@/lib/contentful");
  const { slug } = await params;
  if (!(await isKnownBlogSlug(slug))) notFound();

  const post = await getBlogPost(slug);
  if (!post) notFound();

  const fields = post.fields;
  const title = String(fields.title ?? "Untitled");
  const byline = typeof fields.byline === "string" ? fields.byline : null;
  const publishDate =
    typeof fields.publishDate === "string" ||
    typeof fields.publishDate === "number"
      ? new Date(fields.publishDate)
      : null;

  const tags = Array.isArray(fields.tags)
    ? fields.tags.filter((tag): tag is string => typeof tag === "string")
    : [];

  const image = fields.coverImage as unknown as Asset;
  const imageUrl = image?.fields?.file?.url
    ? `https:${image.fields.file.url}`
    : null;

  const body = fields.body as Document;
  const plainText = body ? documentToPlainTextString(body) : "";
  const readTime = getReadTime(plainText);

  const allPosts = await getAllBlogPosts();
  const index = allPosts.findIndex((p) => p.fields.slug === slug);
  const previousPost = allPosts[index - 1] || null;
  const nextPost = allPosts[index + 1] || null;

  const cover = asset(fields.coverImage);
  return (
    <article className="wrap journal-article">
      <header className="page-heading">
        <Link className="eyebrow journal-back" href="/blog">
          ← The journal
        </Link>
        <h1>{title}</h1>
        {byline && <p className="page-byline">{byline}</p>}
        <p className="article-meta">
          {publishDate && !Number.isNaN(publishDate.getTime()) && (
            <>
              <time dateTime={publishDate.toISOString()}>
                {publishDate.toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                  timeZone: "UTC",
                })}
              </time>
              <span aria-hidden="true"> · </span>
            </>
          )}
          {readTime}
        </p>
      </header>
      {imageUrl && (
        <Image
          className="article-cover"
          src={imageUrl}
          alt={cover.title || title}
          width={cover.width}
          height={cover.height}
          sizes="(max-width: 900px) 90vw, 820px"
          priority
        />
      )}
      <EditorialRichText document={body} />
      {tags.length > 0 && (
        <ul className="article-tags" aria-label="Topics">
          {tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
      )}
      <nav className="article-neighbors" aria-label="More journal articles">
        {previousPost && (
          <Link href={`/blog/${previousPost.fields.slug}`}>
            <span className="eyebrow">← Previous article</span>
            <h2>{String(previousPost.fields.title)}</h2>
          </Link>
        )}
        {nextPost && (
          <Link href={`/blog/${nextPost.fields.slug}`}>
            <span className="eyebrow">Next article →</span>
            <h2>{String(nextPost.fields.title)}</h2>
          </Link>
        )}
      </nav>
      <aside className="page-invitation">
        <span className="eyebrow">From ideas to your next step</span>
        <h2>What could this mean for your brand?</h2>
        <p>
          Talk it through with Jen and find a direction that feels like you.
        </p>
        <Link className="button" href="/contact">
          Start a conversation <span aria-hidden="true">↗</span>
        </Link>
      </aside>
    </article>
  );
}
