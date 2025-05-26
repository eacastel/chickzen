"use client";

import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import {
  BLOCKS,
  INLINES,
  MARKS,
  type Document,
} from "@contentful/rich-text-types";

type Props = {
  document: Document;
};

function stripMarks(children: React.ReactNode): React.ReactNode {
  if (Array.isArray(children)) {
    return children.map((child, i) =>
      typeof child === "object" && child !== null && "type" in child ? (
        child.type === "strong" || child.type === "em" ? (
          <span key={i}>{child.props.children}</span>
        ) : (
          child
        )
      ) : (
        child
      )
    );
  }

  return children;
}

export default function RichTextRenderer({ document }: Props) {
  return (
    <div className="max-w-none text-foreground leading-relaxed font-sans">
      {documentToReactComponents(document, {
        renderMark: {
          [MARKS.BOLD]: (text) => (
            <strong className="font-semibold">{text}</strong>
          ),
          [MARKS.ITALIC]: (text) => <em className="italic">{text}</em>,
        },
        renderNode: {
          [BLOCKS.HEADING_1]: (_, children) => (
            <h1 className="text-5xl mb-6 font-serif font-bold tracking-tight text-foreground">
              {stripMarks(children)}
            </h1>
          ),
          [BLOCKS.HEADING_2]: (_, children) => (
            <h2 className="text-3xl mb-5 mt-6 pt-3 font-serif font-medium text-foreground tracking-tight">
              {stripMarks(children)}
            </h2>
          ),
          [BLOCKS.HEADING_3]: (_, children) => (
            <h3 className="text-2xl mb-4 mt-5 font-serif font-medium text-gray-700 tracking-tight">
              {stripMarks(children)}
            </h3>
          ),
          [BLOCKS.PARAGRAPH]: (_, children) => (
            <p className="mb-5 leading-relaxed text-gray-700">{children}</p>
          ),
          [BLOCKS.UL_LIST]: (_, children) => (
            <ul className="list-disc list-inside mb-6 space-y-2">{children}</ul>
          ),
          [BLOCKS.OL_LIST]: (_, children) => (
            <ol className="list-decimal list-inside mb-6 space-y-2">
              {children}
            </ol>
          ),
          [BLOCKS.LIST_ITEM]: (node, children) => {
            const onlyParagraph =
              node.content.length === 1 &&
              node.content[0].nodeType === BLOCKS.PARAGRAPH;

            if (onlyParagraph) {
              const paragraphNode = node.content[0];
              if (
                "content" in paragraphNode &&
                Array.isArray(paragraphNode.content)
              ) {
                return (
                  <li className="ml-4">
                    {paragraphNode.content.map((childNode, index) => {
                      const output = documentToReactComponents(
                        {
                          nodeType: BLOCKS.DOCUMENT,
                          data: {},
                          content: [childNode as never],
                        },
                        {}
                      );

                      return Array.isArray(output) ? (
                        output.map((el, elIndex) => (
                          <span key={`${index}-${elIndex}`}>{el}</span>
                        ))
                      ) : (
                        <span key={index}>{output}</span>
                      );
                    })}
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
              style={{ color: "#5a7d88" }}
              className="underline hover:opacity-80 transition-opacity"
            >
              {children}
            </a>
          ),
        },
        renderText: (text: string) => {
          return text
            .split("\n")
            .reduce<React.ReactNode[]>((acc, segment, index) => {
              if (index > 0) acc.push(<br key={index} />);
              acc.push(segment);
              return acc;
            }, []);
        },
      })}
    </div>
  );
}
