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
    <div className="max-w-5xl mx-auto py-12 px-4">
      <motion.h1
        className="text-5xl text-gray-600 font-serif tracking-tighter mb-6 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
      >
        Deep Thoughts
      </motion.h1>

            
          <motion.p
            className="text-2xl tracking-tighter text-gray-600 font-serif italic mb-6 text-center"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        viewport={{ once: true }}
          >
            Insights on voice, strategy, and the bold work of building a brand that leads.
          </motion.p>
      

      <motion.p
        className="prose prose-lg max-w-none mx-auto text-justify pb-8"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        viewport={{ once: true }}
      >
        Deep Thoughts is where brand leaders, founders, and creatives explore the voice-first strategies that move ideas forward. Inside, you’ll find insights on messaging, identity, growth, and the power of owning your narrative. Whether you&apos;re refining your brand or finding the words to lead it, this is where the bold work begins.
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
              className="relative"
            >
              <Link
                href={`/blog/${slug}`}
                className="absolute inset-0 z-10"
                aria-label={`Read ${title}`}
              />
              <article className="block bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-4">
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
                {byline && <p className="tracking-tighter text-gray-500 font-serif italic mt-4 text-lg text-left">{byline}</p>}

                <div className="mt-3 text-sm text-gray-700 line-clamp-3 prose prose-sm max-w-none">
                  <RichTextRenderer document={body as Document} />
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
              </article>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
