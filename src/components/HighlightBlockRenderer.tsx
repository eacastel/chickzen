"use client";

import Image from "next/image";
import type {
  HighlightBlockEntry,
  ImageBannerEntry,
  CallToActionEntry,
} from "@/types/contentful";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import type { Document } from "@contentful/rich-text-types";
import type { Asset, ChainModifiers } from "contentful";

function isImageBanner(entry: unknown): entry is ImageBannerEntry {
  return (
    typeof entry === "object" &&
    entry !== null &&
    "sys" in entry &&
    "fields" in entry &&
    (entry as { sys: { contentType?: { sys?: { id?: unknown } } } }).sys
      ?.contentType?.sys?.id === "imageBanner"
  );
}

function isCallToAction(entry: unknown): entry is CallToActionEntry {
  return (
    typeof entry === "object" &&
    entry !== null &&
    "sys" in entry &&
    "fields" in entry &&
    (entry as { sys: { contentType?: { sys?: { id?: unknown } } } }).sys
      ?.contentType?.sys?.id === "callToAction"
  );
}

type Props = {
  block: HighlightBlockEntry;
};

export default function HighlightBlockRenderer({ block }: Props) {
  const items = Array.isArray(block.fields.items) ? block.fields.items : [];

  return (
    <section className="max-w-5xl mx-auto px-4 py-8">
      {items.map((item, index) => {
        // ✅ ImageBanner block
        if (isImageBanner(item)) {
          const image = item.fields.image as unknown as Asset<
            ChainModifiers,
            string
          >;
          const fileUrl = image?.fields?.file?.url;
          const alt =
            typeof image?.fields?.title === "string"
              ? image.fields.title
              : `Banner image ${index + 1}`;

          if (typeof fileUrl === "string") {
            return (
              <div
                key={item.sys.id ?? String(index)}
                className="max-w-4 max-h-[120px] overflow-hidden"
              >
                <Image
                  src={`https:${fileUrl}`}
                  alt={alt}
                  width={1200}
                  height={400}
                  className="w-full h-auto object-cover rounded"
                />
              </div>
            );
          }
        }

        // ✅ CallToAction block
        if (isCallToAction(item)) {
          const bgImage = item.fields.backgroundImage as
            | Asset<ChainModifiers, string>
            | undefined;

          const bgUrl =
            typeof bgImage?.fields?.file?.url === "string"
              ? `https:${bgImage.fields.file.url}`
              : "";

          const body = item.fields.body as Document | undefined;
          const buttonLabel = String(item.fields.buttonLabel ?? "Let's Begin.");
          const buttonLink = String(item.fields.buttonLink ?? "#");

          return (
            <div
              key={item.sys.id ?? String(index)}
              className="relative px-6 py-10 rounded-lg overflow-hidden text-gray-800 min-h-[120px]"
            >
              {bgUrl && (
                <div className="absolute inset-0 -z-10">
                  <Image
                    src={bgUrl}
                    alt="CTA background"
                    fill
                    className="object-cover w-full h-full"
                  />
                </div>
              )}

              <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 items-center gap-6">
                <div className="md:col-span-2 text-center md:text-right md:pr-12">
                  <div className="prose prose-xl font-serif text-gray-800 [&_h2]:text-3xl [&_h2]:leading-10 [&_p]:text-lg">
                    {body && documentToReactComponents(body)}
                  </div>
                </div>

                <div className="flex justify-center md:justify-start w-full">
                  <a
                    href={buttonLink}
                    className="px-6 py-3 bg-fuchsia-100 text-black rounded-br-2xl rounded-tl-2xl hover:bg-violet-100 transition"
                  >
                    {buttonLabel}
                  </a>
                </div>
              </div>
            </div>
          );
        }

        return null;
      })}
    </section>
  );
}
