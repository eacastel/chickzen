import { getAllBlogPosts } from "@/lib/contentful";
import BlogGrid from "@/components/BlogGrid";

export const revalidate = 60;

export default async function BlogIndexPage() {
  const posts = await getAllBlogPosts(); 
  return <BlogGrid posts={posts} />;
}