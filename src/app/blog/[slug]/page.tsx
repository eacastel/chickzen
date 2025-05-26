import Image from "next/image";
const AnimatedBlogPost = (await import("@/components/AnimatedBlogPost")).default;
import { notFound } from "next/navigation";
import { defaultMetadata } from "@/lib/defaultMetadata";
import type { Metadata } from "next";
import { getAllBlogPosts } from "@/lib/contentful";
import type { Asset } from "contentful";
import type { Document } from "@contentful/rich-text-types";
import { documentToPlainTextString } from "@contentful/rich-text-plain-text-renderer";
import Link from "next/link";

export const revalidate = 60;
export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { getBlogPost } = await import("@/lib/contentful");
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return defaultMetadata;

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

  const imagePosition = fields.imagePosition;
  const floatClass =
    imagePosition === "left"
      ? "md:float-left md:mr-6"
      : imagePosition === "right"
      ? "md:float-right md:ml-6"
      : "";

  const body = fields.body as Document;
  const plainText = body ? documentToPlainTextString(body) : "";
  const readTime = getReadTime(plainText);

  const allPosts = await getAllBlogPosts();
  const index = allPosts.findIndex((p) => p.fields.slug === slug);
  const previousPost = allPosts[index - 1] || null;
  const nextPost = allPosts[index + 1] || null;

  const RichTextRenderer = (await import("@/components/RichTextRenderer")).default;


  return (
    <AnimatedBlogPost>
    <article className="max-w-3xl mx-auto px-4 py-2  text-gray-700">
      <header className="mb-6">
        <h1 className="tracking-tighter text-5xl leading-tight font-serif mb-4">{title}</h1>
        {byline && <p className="text-2xl tracking-tighter text-gray-600 font-serif italic mb-4 text-left">{byline}</p>}
        {publishDate && (
          <p className="text-xs text-gray-400 mb-8">
            {publishDate.toLocaleDateString("en-US")} • {readTime}
          </p>
        )}
        
      </header>

{imageUrl && (
  <div
    className={`mb-6  mt-4 w-full max-w-xs overflow-hidden rounded-lg hover:brightness-105
      ${floatClass} md:mx-0 mx-auto md:mb-4`}
  >
    <Image
      src={imageUrl}
      alt={title}
      width={300}
      height={0}
      className="h-auto w-full object-cover rounded-lg"
      priority
    />
  </div>
)}

<div className=" max-w-none text-gray-700 ">
  <RichTextRenderer document={body} />
</div>

      <div className="mt-16 border-t pt-6 grid sm:grid-cols-1 md:grid-cols-2 gap-6">
        {previousPost && (
          <Link href={`/blog/${previousPost.fields.slug}`} className="block p-4 rounded-lg bg-gray-100 hover:border-gray-300 hover:shadow-sm transition text-right">
            <p className="text-sm text-gray-500 mb-1">← Previous</p>
            <h3 className="text-xl text-gray-700 font-serif tracking-tight hover:none leading-snug">
              {String(previousPost.fields.title)}
            </h3>
          </Link>
        )}
{nextPost && (
  <Link
    href={`/blog/${nextPost.fields.slug}`}
    className="block p-4 rounded-lg bg-gray-100 hover:border-gray-300 hover:shadow-sm transition text-left"
  >
    <p className="text-sm text-gray-500 mb-1">Next →</p>
    <h3 className="text-xl text-gray-700 font-serif tracking-tight hover:none leading-snug">
      {String(nextPost.fields.title)}
    </h3>
  </Link>
)}

      </div>
              <div className="flex flex-auto justify-center m-6 width-full max-w-5xl text-center">
        {tags.length > 0 && (
          <ul className="flex gap-8 mt-2 text-xs text-gray-500 flex-wrap">
            {tags.map((tag) => (
              <li key={tag} className="bg-gray-100 px-2 py-1 rounded">
                #{tag}
              </li>
            ))}
          </ul>
        )}
        </div>
    </article>
    </AnimatedBlogPost>
  );
}
