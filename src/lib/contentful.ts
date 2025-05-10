// src/lib/contentful.ts
import { createClient } from 'contentful'

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
})

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
