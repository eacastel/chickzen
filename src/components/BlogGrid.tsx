"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Entry, EntrySkeletonType, EntryFieldTypes, Asset } from "contentful";
import type { Document } from "@contentful/rich-text-types";
import { documentToPlainTextString } from "@contentful/rich-text-plain-text-renderer";
import RichTextRenderer from "./RichTextRenderer";

interface BlogPostFields {
  title?: EntryFieldTypes.Symbol;
  slug?: EntryFieldTypes.Symbol;
  byline?: EntryFieldTypes.Symbol;
  tags?: EntryFieldTypes.Array<EntryFieldTypes.Symbol>;
  metaSummary?: EntryFieldTypes.Symbol;
  body: EntryFieldTypes.RichText;
  coverImage: Asset;
}

type BlogPostSkeleton = EntrySkeletonType<BlogPostFields, "blogPost">;
type BlogPostEntry = Entry<BlogPostSkeleton>;

type Props = {
  posts: BlogPostEntry[];
};

function getReadTime(text: string): string {
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

function extractLocalizedString(value: unknown, locale = "en-US"): string {
  if (typeof value === "string") return value;
  if (typeof value === "object" && value !== null && locale in value)
    return String((value as Record<string, unknown>)[locale]);
  return "";
}

export default function BlogGrid({ posts }: Props) {
  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <motion.h1
        className="text-center tracking-tighter text-5xl leading-tight font-serif mb-4 text-gray-700"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
      >
        Get Inspired
      </motion.h1>

      <motion.p
        className="flex justify-center max-w-4xl mx-auto my-12 text-center text-gray-600"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        viewport={{ once: true }}
      >
        Thoughtful stories, brand breakthroughs, and real-world strategy —
        crafted to elevate your voice and amplify your message.
      </motion.p>

      <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => {
          const title = String(post.fields.title ?? "Untitled");
          const slug = String(post.fields.slug ?? "");
          const tags = Array.isArray(post.fields.tags) ? post.fields.tags : [];
          const image = post.fields.coverImage as unknown as Asset;
          const imageUrl = image?.fields?.file?.url
            ? `https:${image.fields.file.url}`
            : null;
          const rawBody = post.fields.body;
          const body =
            typeof rawBody === "object" && "nodeType" in rawBody
              ? (rawBody as Document)
              : undefined;
          const plainText = body ? documentToPlainTextString(body) : "";
          const readTime = getReadTime(plainText);
          const byline = extractLocalizedString(post.fields.byline);


          return (
            <motion.div
              key={slug}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true, amount: 0.1 }}
            >
              <Link
                href={`/blog/${slug}`}
                className="block bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-4"
              >
                {imageUrl && (
                  <div className="flex justify-center">
                    <div className="relative w-[200px] h-[200px] mb-4 rounded-lg overflow-hidden">
                      <Image
                        src={imageUrl}
                        alt={title}
                        fill
                        className="object-cover"
                        sizes="200px"
                      />
                    </div>
                  </div>
                )}

                <h2 className="text-3xl font-medium mb-1 font-serif text-gray-700">
                  {title}
                </h2>
                {byline && <p className="text-sm text-gray-500">By {byline}</p>}

                <div className="mt-3 text-sm text-gray-700 line-clamp-3 prose prose-sm max-w-none">
                  <RichTextRenderer document={body as unknown as Document} />
                </div>

                <p className="mt-4 text-sm text-gray-400 mb-1">{readTime}</p>
                {tags.length > 0 && (
                  <div className="mt-4 flex gap-2 text-xs flex-wrap">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-gray-100 text-gray-600 px-2 py-1 rounded hover:bg-gray-200 transition"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
