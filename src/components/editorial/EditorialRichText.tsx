import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS, INLINES } from "@contentful/rich-text-types";
import Image from "next/image";
import Link from "next/link";
import {
  asset,
  contentType,
  fields,
  localHref,
  richDocument,
  text,
} from "@/lib/editorial-content";
export default function EditorialRichText({ document }: { document: unknown }) {
  const body = richDocument(document);
  if (!body) return null;
  return (
    <div className="editorial-prose">
      {documentToReactComponents(body, {
        renderNode: {
          [BLOCKS.HEADING_1]: (_node, children) => <h2>{children}</h2>,
          [INLINES.HYPERLINK]: (node, children) => (
            <Link href={localHref(node.data.uri)}>{children}</Link>
          ),
          [INLINES.ASSET_HYPERLINK]: (node, children) => (
            <a href={localHref(asset(node.data.target).url)}>{children}</a>
          ),
          [INLINES.ENTRY_HYPERLINK]: (node, children) => {
            const f = fields(node.data.target);
            return (
              <Link
                href={localHref(
                  contentType(node.data.target) === "blogPost"
                    ? `/blog/${text(f.slug)}`
                    : f.slug,
                )}
              >
                {children}
              </Link>
            );
          },
          [BLOCKS.EMBEDDED_ASSET]: (node) => {
            const image = asset(node.data.target);
            if (!image.url) return null;
            if (!image.type.startsWith("image/"))
              return (
                <a href={localHref(image.url)}>{image.title || "Download"}</a>
              );
            return (
              <Image
                src={image.url}
                alt={image.title}
                width={image.width}
                height={image.height}
                sizes="(max-width: 800px) 90vw, 760px"
              />
            );
          },
          [BLOCKS.EMBEDDED_ENTRY]: (node) => {
            const f = fields(node.data.target);
            return f.slug ? (
              <Link
                href={localHref(
                  contentType(node.data.target) === "blogPost"
                    ? `/blog/${text(f.slug)}`
                    : f.slug,
                )}
              >
                {text(f.title)}
              </Link>
            ) : null;
          },
        },
      })}
    </div>
  );
}
