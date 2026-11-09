import Link from "next/link";
import Image from "next/image";
import type { Asset } from "contentful";
import type { Document } from "@contentful/rich-text-types";
import { documentToPlainTextString } from "@contentful/rich-text-plain-text-renderer";
import type { BlogPostEntry } from "@/types/contentful";

export default function BlogGrid({ posts }: { posts: BlogPostEntry[] }) {
  return (
    <section className="wrap journal-page">
      <span className="eyebrow">The chickzen journal</span>
      <h1>Clarity, a little at a time.</h1>
      <p>
        Ideas on voice, strategy, and the thoughtful work of building a brand
        that feels like you.
      </p>
      <div className="journal-grid">
        {posts
          .filter((p) => typeof p.fields.slug === "string")
          .map((post) => {
            const title = String(post.fields.title || "From the journal");
            const image = post.fields.coverImage as unknown as Asset;
            const imageUrl =
              typeof image?.fields?.file?.url === "string"
                ? `https:${image.fields.file.url}`
                : null;
            const body = post.fields.body as Document | undefined;
            const plain = body?.nodeType ? documentToPlainTextString(body) : "";
            const excerpt =
              typeof post.fields.metaSummary === "string"
                ? post.fields.metaSummary
                : plain.slice(0, 160) + (plain.length > 160 ? "…" : "");
            return (
              <article className="journal-card" key={post.sys.id}>
                {imageUrl && (
                  <Image
                    src={imageUrl}
                    alt=""
                    width={600}
                    height={400}
                    sizes="(max-width:700px) 90vw, (max-width:1000px) 45vw, 33vw"
                  />
                )}
                <span className="eyebrow">
                  {Math.max(1, Math.ceil(plain.split(/\s+/).length / 200))} min
                  read
                </span>
                <h2>
                  <Link href={`/blog/${post.fields.slug}`}>{title}</Link>
                </h2>
                <p>{excerpt}</p>
                <Link className="text-link" href={`/blog/${post.fields.slug}`}>
                  Read the article <span aria-hidden="true">↗</span>
                </Link>
              </article>
            );
          })}
      </div>
    </section>
  );
}
