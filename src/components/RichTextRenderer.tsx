// components/RichTextRenderer.tsx
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import type { Document } from "@contentful/rich-text-types";

export default function RichTextRenderer({ document }: { document: Document }) {
  return (
    <div className="prose prose-lg max-w-none mx-auto text-justify">
      {documentToReactComponents(document)}
    </div>
  );
}