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
    <section className="max-w-5xl mx-auto px-4 py-12">
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
                className="max-w-4 max-h-[400px] overflow-hidden mb-12"
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
              className="relative mb-12 px-6 py-12 rounded-lg overflow-hidden text-gray-800"
            >
              {bgUrl && (
                <div className="absolute inset-0  -z-10">
                  <Image
                    src={bgUrl}
                    alt="CTA background"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="max-w-4xl mx-auto flex flex-col items-center md:grid md:grid-cols-3 md:items-center md:gap-2">
                <div className="w-full md:col-span-2 md:mr-8 text-center md:text-right">
                  <div className="prose prose-xl font-serif [&_h2]:text-3xl [&_p]:text-lg [&_h2]:leading-10 text-gray-800">
                    {body && documentToReactComponents(body)}
                  </div>
                </div>
                <div className="mt-6 md:mt-0 flex justify-center md:justify-start w-full">
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
