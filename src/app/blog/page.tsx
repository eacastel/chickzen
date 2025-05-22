import { getAllBlogPosts } from "@/lib/contentful";
import BlogGrid from "@/components/BlogGrid"; // <-- this will be the motion-rich client component

export const revalidate = 60;

export default async function BlogIndexPage() {
  const posts = await getAllBlogPosts();
  return <BlogGrid posts={posts} />;
}
