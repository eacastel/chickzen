"use client";

import { motion } from "framer-motion";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import type { ReviewBlockEntry } from "@/types/contentful";
import type { Document } from "@contentful/rich-text-types";

type Props = {
  reviews: ReviewBlockEntry[];
};

export default function ReviewBlockRenderer({ reviews }: Props) {
  return (
    <motion.section
      className="pb-0 pt-10 text-center px-4 font-serif bg-white text-gray-800"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
        {reviews.map((review) => {
          const title = String(review.fields.title ?? "");
          const label = String(review.fields.label ?? "");
          const showTitle = review.fields.showTitle !== false;
          const rating =
            typeof review.fields.rating === "number" ? review.fields.rating : 0;
          const body = review.fields.body;

          return (
            <div
              key={review.sys.id}
              className="p-6 rounded shadow-sm bg-fuchsia-50"
            >
              {rating > 0 && (
                <div
                  className="flex items-center justify-center mb-2"
                  aria-label={`Rating: ${rating} stars`}
                >
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${
                        i < rating ? "text-pink-600" : "text-gray-300"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.03 3.17a1 1 0 00.95.69h3.356c.969 0 1.371 1.24.588 1.81l-2.717 1.972a1 1 0 00-.364 1.118l1.03 3.17c.3.921-.755 1.688-1.54 1.118l-2.717-1.972a1 1 0 00-1.176 0l-2.717 1.972c-.784.57-1.838-.197-1.539-1.118l1.03-3.17a1 1 0 00-.364-1.118L2.175 8.597c-.783-.57-.38-1.81.588-1.81h3.356a1 1 0 00.95-.69l1.03-3.17z" />
                    </svg>
                  ))}
                </div>
              )}

              {showTitle && !!title && (
                <h3 className="text-xl mb-2 text-gray-700">{title}</h3>
              )}

              {body && (
                <div className="prose prose-sm mb-4">
                  {documentToReactComponents(body as unknown as Document)}
                </div>
              )}

              {label && (
                <p className="text-sm text-gray-500 italic">— {label}</p>
              )}
            </div>
          );
        })}
      </div>
    </motion.section>
  );
}
