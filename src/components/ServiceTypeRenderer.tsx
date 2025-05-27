"use client";
import { motion } from "framer-motion";
import RichTextRenderer from "@/components/RichTextRenderer";
import type { ServiceTypeEntry, ServiceProductEntry } from "@/types/contentful";
import type { Document } from "@contentful/rich-text-types";

type Props = {
  serviceType: ServiceTypeEntry;
};


export default function ServiceTypeRenderer({ serviceType }: Props) {
  const rawTitle = serviceType.fields.title;
  const rawByline = serviceType.fields.byline;
  const rawProducts = serviceType.fields.services;

  const title = typeof rawTitle === "string" ? rawTitle : "";
  const byline = typeof rawByline === "string" ? rawByline : "";

  const servicesArray = Array.isArray(rawProducts) ? rawProducts : [];
  const products = servicesArray.filter(
  (entry): entry is ServiceProductEntry =>
    entry !== undefined &&
    typeof entry === "object" &&
    "fields" in entry &&
    "sys" in entry &&
    "metadata" in entry
);


  const anchorId = title.toLowerCase().replace(/[^\w]+/g, "-");

  return (
    <motion.section
      id={anchorId}
      className="pt-6 pb-4 px-4 text-left scroll-mt-6 bg-white"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.01 }}
    >
      <div className="max-w-4xl mx-auto">
        <h2 className="text-5xl font-serif mb-4 text-gray-800 text-center">
          {title}
        </h2>
        {byline && (
          <p className="text-2xl tracking-tighter text-gray-600 font-serif italic mb-6 text-center">
            {byline}
          </p>
        )}

        {products.map((product) => {
          const productTitle =
            typeof product.fields.title === "string"
              ? product.fields.title
              : "";
          const description = product.fields.description;

          return (
            <div key={product.sys.id} className="mb-2">
              <h3 className="text-2xl font-serif text-gray-800 mb-2">
                {productTitle}
              </h3>
              <div className="text-gray-700 prose prose-sm">
                <RichTextRenderer document={description as unknown as Document}
                />
              </div>
            </div>
          );
        })}
      </div>
    </motion.section>
  );
}
