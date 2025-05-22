"use client";
import RichTextRenderer from "@/components/RichTextRenderer";
import type { Document } from "@contentful/rich-text-types";
import type { ServiceProductEntry } from "@/types/contentful";

type Props = {
  product: ServiceProductEntry;
  showPrice?: boolean;
};

export default function ServiceProductCard({ product, showPrice = false }: Props) {
  const title = typeof product.fields.title === "string" ? product.fields.title : "";
  const description = product.fields.description as Document;
  const price = product.fields.price;

  return (
    <div className="bg-[#F4E9E6] p-6 rounded shadow-sm text-left">
      <h3 className="text-xl font-serif mb-2 text-gray-800">{title}</h3>

      <div className="text-gray-600 mb-4">
         <RichTextRenderer document={description} />
      </div>

      {showPrice && typeof price === "number" && (
        <p className="text-md font-semibold text-gray-700">€{price.toFixed(2)}</p>
      )}
    </div>
  );
}
