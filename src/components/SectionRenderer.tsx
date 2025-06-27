"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import RichTextRenderer from "@/components/RichTextRenderer";
import type { Document } from "@contentful/rich-text-types";
import type { Asset } from "contentful";
import type { SectionEntry, SectionFields } from "@/types/contentful";

// ✅ Type guard for Contentful Asset
function isAsset(img: unknown): img is Asset {
  return (
    typeof img === "object" &&
    img !== null &&
    "fields" in img &&
    "file" in (img as Asset).fields
  );
}

type Props = {
  section: SectionEntry;
};

export default function SectionRenderer({ section }: Props) {
  const fields = section.fields as SectionFields;
  const { body, showTitle, image, imageAlt, imagePosition = "float-right" } = fields;

  const title: string = String(fields.title ?? "");
  const byline: string = String(fields.byline ?? "");
  const position = imagePosition as "float-left" | "float-right";
  const alt = typeof imageAlt === "string" ? imageAlt : "Section image";

  const imageBlock =
    isAsset(image) && image.fields.file?.url ? (
      <motion.div
        className={`${
          position === "float-left"
            ? "md:float-left md:mr-6"
            : "md:float-right md:ml-6"
        } w-full max-w-[300px] mx-auto md:mx-0 mb-6`}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, amount: 0.01 }}
      >
        <Image
          src={`https:${image.fields.file.url}`}
          alt={alt}
          width={300}
          height={0}
          className="w-full mt-4 h-auto md:rounded object-cover aspect-2/3"
          priority
        />
      </motion.div>
    ) : null;

  const anchorId =
    typeof title === "string"
      ? title
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .trim()
          .replace(/\s+/g, "-")
      : undefined;

  return (
    <motion.section
      id={anchorId}
      className="pt-6 pb-4 px-6 bg-background text-foreground text-center scroll-mt-8"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.01 }}
    >
      <div className="max-w-4xl mx-auto text-gray-600 text-left clear-both">
        {(showTitle ?? true) && Boolean(title) && (
          <motion.h2
            className="text-5xl text-gray-600 font-serif tracking-tighter mb-4 text-center"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.01 }}
          >
            {title}
          </motion.h2>
        )}

        {byline && (
          <motion.p
            className="text-2xl tracking-tighter text-gray-600 font-serif italic mb-6 text-center"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true, amount: 0.01 }}
          >
            {byline}
          </motion.p>
        )}

        {position === "float-left" || position === "float-right" ? (
          <motion.div
            className="prose prose-lg max-w-none mx-auto text-left md:text-justify clear-both"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true, amount: 0.01 }}
          >
            {imageBlock}
            <RichTextRenderer document={body as unknown as Document} />
            <div className="clear-both" />
          </motion.div>
        ) : (
          <motion.div
            className="prose prose-lg max-w-none mx-auto text-left md:text-justify"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true, amount: 0.01 }}
          >
            <RichTextRenderer document={body as unknown as Document} />
          </motion.div>
        )}
      </div>
    </motion.section>
  );
}
