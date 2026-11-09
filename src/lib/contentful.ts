/* -------------------------------------------------------------------------- */
/*  src/lib/contentful.ts                                                     */
/*  Thin wrapper around the Contentful SDK.                                   */
/*  NOTE: This file is imported **server-side only** (App Router).            */
/* -------------------------------------------------------------------------- */

import { createClient } from "contentful";
import { unstable_cache } from "next/cache";
import type {
  HeroEntry,
  MenuEntry,
  HeaderImageEntry,
  BlogPostEntry,
  ServiceTypeEntry,
  BlogPostSkeleton,
} from "@/types/contentful";

/* -------------------------------------------------------------------------- */
/*  0. Low-level SDK client (env vars must exist at runtime).                 */
/* -------------------------------------------------------------------------- */

const client = createClient({
  space:        process.env.CONTENTFUL_SPACE_ID!,      // ⬅  non-null assertion OK in your config
  environment: process.env.CONTENTFUL_ENVIRONMENT || "master",
  accessToken:  process.env.CONTENTFUL_ACCESS_TOKEN!,
});

const CONTENTFUL_REVALIDATE_SECONDS = 60 * 60;

function cacheContentful<TArgs extends unknown[], TResult>(
  key: string,
  query: (...args: TArgs) => Promise<TResult>
) {
  return unstable_cache(query, [key], {
    revalidate: CONTENTFUL_REVALIDATE_SECONDS,
    tags: ["contentful"],
  });
}

/* -------------------------------------------------------------------------- */
/*  1. Header / Navigation helpers                                            */
/* -------------------------------------------------------------------------- */

/** Return the single `headerImage` entry (logo). `null` if none exists. */
export const getHeaderImage = cacheContentful(
  "header-image",
  async (): Promise<HeaderImageEntry | null> => {
    const res = await client.getEntries({
      content_type: "headerImage",
      limit: 1,
    });
    return (res.items[0] as HeaderImageEntry) || null;
  }
);

/**
 * Fetch a `menu` by its `menuName` field.
 * @param name – e.g. `"Main Navigation"` or `"Footer"`
 */
export const getMenuByName = cacheContentful(
  "menu-by-name",
  async (name: string): Promise<MenuEntry | null> => {
    const res = await client.getEntries({
      content_type: "menu",
      "fields.menuName": name,
      include: 2, // menu → menuItems → (assets)
    });
    return (res.items[0] as MenuEntry) || null;
  }
);

/* -------------------------------------------------------------------------- */
/*  2. Generic Page helpers                                                   */
/* -------------------------------------------------------------------------- */

/** Fetch a single `page` entry by slug (`"home"` by default). */
export const getPage = cacheContentful(
  "page-by-slug",
  async (slug: string = "home") => {
    const res = await client.getEntries({
      content_type: "page",
      "fields.slug": slug,
      include: 2,
    });
    return res.items[0] || null;
  }
);

/** All page slugs as plain strings (for `generateStaticParams`). */
export const getAllPageSlugs = cacheContentful(
  "all-page-slugs",
  async (): Promise<string[]> => {
    const res = await client.getEntries({
      content_type: "page",
      select: ["fields.slug"],
    });
    return res.items.map((entry) => entry.fields.slug as string);
  }
);

/* -------------------------------------------------------------------------- */
/*  3. Blog helpers                                                           */
/* -------------------------------------------------------------------------- */

/** Return one blog post by slug (or `null`). */
export const getBlogPost = cacheContentful(
  "blog-post-by-slug",
  async (slug: string): Promise<BlogPostEntry | null> => {
    const res = await client.getEntries({
      content_type: "blogPost",
      "fields.slug": slug,
      include: 1,
    });
    return (res.items[0] as BlogPostEntry) || null;
  }
);

/** All blog slugs (for static generation). */
export const getAllBlogSlugs = cacheContentful(
  "all-blog-slugs",
  async (): Promise<string[]> => {
    const res = await client.getEntries({
      content_type: "blogPost",
      select: ["fields.slug"],
    });
    return res.items.map((entry) => entry.fields.slug as string);
  }
);

/** All blog posts, newest first. */
export const getAllBlogPosts = cacheContentful(
  "all-blog-posts",
  async (): Promise<BlogPostEntry[]> => {
    const res = await client.getEntries<BlogPostSkeleton>({
      content_type: "blogPost",
      order: ["-fields.publishDate"],
    });
    return res.items as BlogPostEntry[];
  }
);

/**
 * Convenience: latest N blog posts (default = 3).
 * @param limit – how many posts to return
 */
export const getLatestBlogPosts = cacheContentful(
  "latest-blog-posts",
  async (limit: number = 3): Promise<BlogPostEntry[]> => {
    const res = await client.getEntries<BlogPostSkeleton>({
      content_type: "blogPost",
      order: ["-fields.publishDate"],
      limit,
    });
    return res.items as BlogPostEntry[];
  }
);

/* -------------------------------------------------------------------------- */
/*  4. Hero helper                                                            */
/* -------------------------------------------------------------------------- */

/** Top-of-page hero (always takes the first entry). */
export const getHero = cacheContentful(
  "hero",
  async (): Promise<HeroEntry> => {
    const res = await client.getEntries({
      content_type: "hero",
      limit: 1,
    });
    return res.items[0] as HeroEntry;
  }
);

/* -------------------------------------------------------------------------- */
/*  5. Services / Checkout helpers                                            */
/* -------------------------------------------------------------------------- */

/** All service types (with nested serviceProducts). */
export const getAllServiceTypes = cacheContentful(
  "all-service-types",
  async (): Promise<ServiceTypeEntry[]> => {
    const res = await client.getEntries({
      content_type: "serviceType",
      include: 2,
    });
    return res.items as ServiceTypeEntry[];
  }
);

/* -------------------------------------------------------------------------- */
/*  6. TODO: add “latest pages” or other helpers here if needed.              */
/* -------------------------------------------------------------------------- */
