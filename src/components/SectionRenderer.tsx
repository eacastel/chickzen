import Image from "next/image";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import type { Document } from "@contentful/rich-text-types";
import type { Asset } from 'contentful'
import type { SectionEntry } from "@/types/contentful";

// ✅ Type guard for Contentful Asset
function isAsset(img: unknown): img is Asset {
  return (
    typeof img === 'object' &&
    img !== null &&
    'fields' in img &&
    'file' in (img as Asset).fields
  )
}

type Props = {
  section: SectionEntry;
};

export default function SectionRenderer({ section }: Props) {
  const { body, image } = section.fields;

  const title: string = String(section.fields.title ?? "");
  const byline: string = String(section.fields.byline ?? "");

  const anchorId =
    typeof title === "string"
      ? title
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .trim()
          .replace(/\s+/g, "-")
      : undefined;

  return (
    <section
      id={anchorId}
      className="py-20 px-4 bg-background text-foreground text-center scroll-mt-16"
    >
      <div className="max-w-3xl mx-auto">
        {title && (
          <h2 className="text-[2rem] font-serif tracking-tight mb-1">
            {title}
          </h2>
        )}
        {byline && (
          <p className="text-sm text-gray-600 italic font-serif mb-6">
            {byline}
          </p>
        )}
        {body && (
          <div className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl mx-auto text-justify">
            {documentToReactComponents(body as Document)}
          </div>
        )}
         {isAsset(image) && image.fields.file?.url && (
          <div className="relative w-full h-64 mt-10 rounded overflow-hidden">
            <Image
              src={`https:${image.fields.file.url}`}
              alt={String(image.fields.title ?? 'Section image')}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
            />
          </div>
        )}
      </div>
    </section>
  );
}
