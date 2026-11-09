import Link from "next/link";
import { getLatestBlogPosts } from "@/lib/contentful";

export default async function JournalFeature() {
  const posts = await getLatestBlogPosts(1);
  const post = posts.find((p) => typeof p.fields.slug === "string");
  if (!post) return null;
  return (
    <aside className="wrap journal" aria-labelledby="journal-title">
      <div className="journal-label">
        A little clarity
        <br />
        before you begin.
      </div>
      <div>
        <span className="eyebrow">From the chickzen journal</span>
        <h2 id="journal-title">{String(post.fields.title)}</h2>
        <p>
          {typeof post.fields.metaSummary === "string"
            ? post.fields.metaSummary
            : "Ideas on voice, brand strategy and the next chapter of your business."}
        </p>
      </div>
      <Link className="text-link" href={`/blog/${post.fields.slug}`}>
        Read the article <span aria-hidden="true">↗</span>
      </Link>
    </aside>
  );
}
