"use client";

import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import {
  BLOCKS,
  INLINES,
  type Document,
} from "@contentful/rich-text-types";

export default function RichTextRenderer({ document }: { document: Document }) {
  return (
    <div className="max-w-none text-gray-700 leading-relaxed">
      {documentToReactComponents(document, {
        renderNode: {
          [BLOCKS.HEADING_1]: (_, children) => (
            <h1 className="text-5xl mb-6 font-serif tracking-tight">
              {children}
            </h1>
          ),
          [BLOCKS.HEADING_2]: (_, children) => (
            <h2 className="text-3xl mb-5 pt-3 font-serif text-gray-800">
              {children}
            </h2>
          ),
          [BLOCKS.HEADING_3]: (_, children) => (
            <h3 className="text-2xl mb-4 font-serif text-gray-700">
              {children}
            </h3>
          ),

          [BLOCKS.PARAGRAPH]: (_, children) => (
            <p className="mb-5 leading-relaxed">{children}</p>
          ),

          [BLOCKS.UL_LIST]: (_, children) => (
            <ul className="list-disc ml-5 mb-4 space-y-1">{children}</ul>
          ),

          [BLOCKS.OL_LIST]: (_, children) => (
            <ol className="list-decimal ml-5 mb-4 space-y-1">{children}</ol>
          ),

          [BLOCKS.LIST_ITEM]: (node, children) => {
  const onlyParagraph =
    node.content.length === 1 &&
    node.content[0].nodeType === BLOCKS.PARAGRAPH;

  if (onlyParagraph) {
    const paragraphNode = node.content[0];
    if ("content" in paragraphNode && Array.isArray(paragraphNode.content)) {
      return (
        <li className="ml-1">
          {paragraphNode.content.map((childNode) =>
            documentToReactComponents(
              {
                nodeType: BLOCKS.DOCUMENT,
                data: {},
                content: [childNode as never], 
              },
              {}
            )
          )}
        </li>
      );
    }
  }

  return <li className="ml-1">{children}</li>;
},

          [INLINES.HYPERLINK]: (node, children) => (
            <a
              href={node.data.uri}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {children}
            </a>
          ),
        },
      })}
    </div>
  );
}
