/* -------------------------------------------------------------------------- */
/*  src/lib/contentful.ts                                                     */
/*  Thin wrapper around the Contentful SDK.                                   */
/*  NOTE: This file is imported **server-side only** (App Router).            */
/* -------------------------------------------------------------------------- */

import { createClient } from "contentful";
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
  accessToken:  process.env.CONTENTFUL_ACCESS_TOKEN!,
});

/* -------------------------------------------------------------------------- */
/*  1. Header / Navigation helpers                                            */
/* -------------------------------------------------------------------------- */

/** Return the single `headerImage` entry (logo). `null` if none exists. */
export async function getHeaderImage(): Promise<HeaderImageEntry | null> {
  const res = await client.getEntries({
    content_type: "headerImage",
    limit: 1,
  });
  return (res.items[0] as HeaderImageEntry) || null;
}

/**
 * Fetch a `menu` by its `menuName` field.
 * @param name – e.g. `"Main Navigation"` or `"Footer"`
 */
export async function getMenuByName(name: string): Promise<MenuEntry | null> {
  const res = await client.getEntries({
    content_type: "menu",
    "fields.menuName": name,
    include: 2, // menu → menuItems → (assets)
  });
  return (res.items[0] as MenuEntry) || null;
}

/* -------------------------------------------------------------------------- */
/*  2. Generic Page helpers                                                   */
/* -------------------------------------------------------------------------- */

/** Fetch a single `page` entry by slug (`"home"` by default). */
export async function getPage(slug = "home") {
  const res = await client.getEntries({
    content_type: "page",
    "fields.slug": slug,
    include: 2,
  });
  return res.items[0] || null;
}

/** All page slugs as plain strings (for `generateStaticParams`). */
export async function getAllPageSlugs(): Promise<string[]> {
const res = await client.getEntries({
  content_type: "page",
  select: ["fields.slug"],   // ← array, not string
});  return res.items.map((entry) => entry.fields.slug as string);
}

/* -------------------------------------------------------------------------- */
/*  3. Blog helpers                                                           */
/* -------------------------------------------------------------------------- */

/** Return one blog post by slug (or `null`). */
export async function getBlogPost(slug: string): Promise<BlogPostEntry | null> {
  const res = await client.getEntries({
    content_type: "blogPost",
    "fields.slug": slug,
    include: 1,
  });
  return (res.items[0] as BlogPostEntry) || null;
}

/** All blog slugs (for static generation). */
export async function getAllBlogSlugs(): Promise<string[]> {
const res = await client.getEntries({
  content_type: "blogPost",
  select: ["fields.slug"],   // ← array
});  return res.items.map((entry) => entry.fields.slug as string);
}

/** All blog posts, newest first. */
export async function getAllBlogPosts(): Promise<BlogPostEntry[]> {
  const res = await client.getEntries<BlogPostSkeleton>({
    content_type: "blogPost",
    order: ["-fields.publishDate"],
  });
  return res.items as BlogPostEntry[];
}

/**
 * Convenience: latest N blog posts (default = 3).
 * @param limit – how many posts to return
 */
export async function getLatestBlogPosts(limit = 3): Promise<BlogPostEntry[]> {
  const res = await client.getEntries<BlogPostSkeleton>({
    content_type: "blogPost",
    order: ["-fields.publishDate"],
    limit,
  });
  return res.items as BlogPostEntry[];
}

/* -------------------------------------------------------------------------- */
/*  4. Hero helper                                                            */
/* -------------------------------------------------------------------------- */

/** Top-of-page hero (always takes the first entry). */
export async function getHero(): Promise<HeroEntry> {
  const res = await client.getEntries({
    content_type: "hero",
    limit: 1,
  });
  return res.items[0] as HeroEntry;
}

/* -------------------------------------------------------------------------- */
/*  5. Services / Checkout helpers                                            */
/* -------------------------------------------------------------------------- */

/** All service types (with nested serviceProducts). */
export async function getAllServiceTypes(): Promise<ServiceTypeEntry[]> {
  const res = await client.getEntries({
    content_type: "serviceType",
    include: 2,
  });
  return res.items as ServiceTypeEntry[];
}

/* -------------------------------------------------------------------------- */
/*  6. TODO: add “latest pages” or other helpers here if needed.              */
/* -------------------------------------------------------------------------- */
