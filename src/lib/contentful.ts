// src/lib/contentful.ts
import { createClient } from 'contentful'
import type { HeroEntry, MenuEntry, HeaderImageEntry } from '@/types/contentful'

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
})

export async function getHeaderImage(): Promise<HeaderImageEntry | null> {
  const res = await client.getEntries({
    content_type: "headerImage",
    limit: 1,
  });

  return res.items[0] as HeaderImageEntry || null;
}


export async function getMenuByName(name: string): Promise<MenuEntry | null> {
  const res = await client.getEntries({
    content_type: 'menu',
    'fields.menuName': name,
    include: 2,
  })

  return (res.items[0] as MenuEntry) || null
}

export async function getPage(slug: string = 'home') {
  const res = await client.getEntries({
    content_type: 'page',
    'fields.slug': slug,
    include: 2,
  })

  return res.items[0] || null
}

export async function getAllPageSlugs() {
  const res = await client.getEntries({ content_type: 'page' })
  return res.items.map((entry) => entry.fields.slug)
}

export async function getBlogPost(slug: string) {
  const res = await client.getEntries({
    content_type: 'blogPost',
    'fields.slug': slug,
    include: 1,
  })

  return res.items[0] || null
}

export async function getAllBlogSlugs() {
  const res = await client.getEntries({ content_type: 'blogPost' })
  return res.items.map((entry) => entry.fields.slug)
}

export async function getAllBlogPosts() {
  const res = await client.getEntries({
    content_type: "blogPost",
    order: ['-fields.publishDate'] as ['-fields.publishDate'],
  });
  return res.items;
}

export async function getHero(): Promise<HeroEntry> {
  const res = await client.getEntries({
    content_type: 'hero',
    limit: 1,
  })

  return res.items[0] as HeroEntry
}


