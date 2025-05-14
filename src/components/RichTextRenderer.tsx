"use client";

import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import {
  BLOCKS,
  INLINES,
  type Document,
} from "@contentful/rich-text-types";

export default function RichTextRenderer({ document }: { document: Document }) {
  return (
    <div className="prose prose-lg max-w-none">
      {documentToReactComponents(document, {
        renderNode: {
          [BLOCKS.HEADING_1]: (node, children) => (
            <h1>{children}</h1>
          ),
          [BLOCKS.HEADING_2]: (node, children) => (
            <h2>{children}</h2>
          ),
          [BLOCKS.HEADING_3]: (node, children) => (
            <h3>{children}</h3>
          ),
          [BLOCKS.PARAGRAPH]: (node, children) => (
            <p>{children}</p>
          ),
          [BLOCKS.UL_LIST]: (node, children) => (
            <ul>{children}</ul>
          ),
          [BLOCKS.OL_LIST]: (node, children) => (
            <ol>{children}</ol>
          ),
          [BLOCKS.LIST_ITEM]: (node, children) => (
            <li>{children}</li>
          ),
          [INLINES.HYPERLINK]: (node, children) => {
            const url = node.data.uri;
            return (
              <a href={url} target="_blank" rel="noopener noreferrer">
                {children}
              </a>
            );
          },
        },
      })}
    </div>
  );
}
