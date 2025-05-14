import Image from "next/image";
import Link from "next/link";
import { getAllBlogPosts } from "@/lib/contentful";
import { documentToPlainTextString } from "@contentful/rich-text-plain-text-renderer";
import type { Asset } from "contentful";
import type { Document } from "@contentful/rich-text-types";

export const revalidate = 300;

function getReadTime(text: string): string {
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

export default async function BlogIndexPage() {
  const posts = await getAllBlogPosts();

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-serif mb-10 text-center">The Chickzen Blog</h1>
      <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2">
        {posts.map((post) => {
          const fields = post.fields;
          const title = String(fields.title ?? "Untitled");
          const slug = String(fields.slug ?? "");
          const byline = typeof fields.byline === "string" ? fields.byline : null;
          const publishDateRaw = fields.publishDate;
          const publishDate =
            typeof publishDateRaw === "string" || typeof publishDateRaw === "number"
              ? new Date(publishDateRaw)
              : null;

          const tags = Array.isArray(fields.tags)
            ? fields.tags.filter((tag): tag is string => typeof tag === "string")
            : [];

          const image = fields.coverImage as Asset;
          const imageUrl = image?.fields?.file?.url ? `https:${image.fields.file.url}` : null;

          const body = fields.body as Document;
          const plainText = body ? documentToPlainTextString(body) : "";
          const summary =
            typeof fields.metaSummary === "string"
              ? fields.metaSummary
              : plainText.slice(0, 180);

          const readTime = getReadTime(plainText);

          return (
            <Link
              key={slug}
              href={`/blog/${slug}`}
              className="block bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6"
            >
              {imageUrl && (
                <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
                  <Image
                    src={imageUrl}
                    alt={title}
                    fill
                    className="object-cover w-full h-full"
                    sizes="(max-width: 768px) 100vw, 400px"
                  />
                </div>
              )}
              <h2 className="text-2xl font-semibold mb-1 font-serif">{title}</h2>
              {byline && <p className="text-sm text-gray-500">By {byline}</p>}
              {publishDate && (
                <p className="text-xs text-gray-400 mb-1">
                  {publishDate.toLocaleDateString("en-US")} • {readTime}
                </p>
              )}
              {tags.length > 0 && (
                <div className="flex gap-2 text-xs mt-1 flex-wrap">
                  {tags.map((tag) => (
                    <span key={tag} className="bg-gray-100 text-gray-600 px-2 py-1 rounded hover:bg-gray-200 transition">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
              <p className="mt-3 text-sm text-gray-700 line-clamp-3">{summary}...</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
