import { getAllBlogPosts } from "@/lib/contentful";
import BlogGrid from "@/components/BlogGrid";
import type { Metadata } from "next";
export const revalidate = 3600;
export const metadata: Metadata = {
  title: "The journal | chickzen",
  description:
    "Ideas on brand strategy, messaging and finding your voice, from Jennifer Castellanos.",
  alternates: { canonical: "https://chickzen.com/blog" },
};
export default async function BlogIndexPage() {
  return <BlogGrid posts={await getAllBlogPosts()} />;
}
