import { homeBlock, type HomeBlock } from "@/lib/homepage-content";
import { HomeLines } from "./HomeText";
import Link from "next/link";
import { getLatestBlogPosts } from "@/lib/contentful";

export default async function JournalFeature({ copy = homeBlock(null, "journal") }: { copy?: HomeBlock }) {
  const posts = await getLatestBlogPosts(1);
  const post = posts.find((p) => typeof p.fields.slug === "string");
  if (!post) return null;
  return (
    <aside className="wrap journal" aria-labelledby="journal-title">
      <div className="journal-label">
        <HomeLines text={copy.heading} />
      </div>
      <div>
        <span className="eyebrow">{copy.eyebrow}</span>
        <h2 id="journal-title">{String(post.fields.title)}</h2>
        <p>
          {typeof post.fields.metaSummary === "string"
            ? post.fields.metaSummary
            : "Ideas on voice, brand strategy and the next chapter of your business."}
        </p>
      </div>
      <Link className="text-link" href={`/blog/${post.fields.slug}`}>
        {copy.primaryLabel} <span aria-hidden="true">↗</span>
      </Link>
    </aside>
  );
}
