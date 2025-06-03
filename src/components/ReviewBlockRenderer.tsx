"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import type { ReviewBlockEntry } from "@/types/contentful";
import type { Document } from "@contentful/rich-text-types";

type Props = {
  reviews: ReviewBlockEntry[];
};

export default function ReviewBlockRenderer({ reviews }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.section
      className="pb-0 pt-10 text-center px-4 font-serif bg-white text-gray-800"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.01 }}
    >
      <div className="relative max-w-4xl mx-auto">
        {/* Collapsible container */}
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 transition-all duration-1000 ${
            expanded ? "max-h-[2000px]" : "max-h-[520px] overflow-hidden"
          }`}
        >
          {reviews.map((review, index) => {
            const title = String(review.fields.title ?? "");
            const label = String(review.fields.label ?? "");
            const showTitle = review.fields.showTitle !== false;
            const rating =
              typeof review.fields.rating === "number"
                ? review.fields.rating
                : 0;
            const body = review.fields.body;

            return (
              <motion.div
                key={review.sys.id}
                className="p-6 rounded shadow-sm bg-[#F4E9E6]"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true, amount: 0.01 }}
              >
                {rating > 0 && (
                  <div className="flex items-center justify-center mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg
                        key={i}
                        className={`w-5 h-5 ${
                          i < rating ? "text-[#D4AF7F]" : "text-gray-300"
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
              </motion.div>
            );
          })}
        </div>

        {/* Gradient fade mask when collapsed */}
        {!expanded && (
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none" />
        )}
      </div>

      {/* Toggle button */}
      <div className="!font-sans">
        <button
          className="mt-4 mb-10 text-gray-700 font-sans underline underline-offset-4 cursor-pointer"
          onClick={() => setExpanded((prev) => !prev)}
        >
          {expanded ? "Show Less" : "Show More"}
        </button>
      </div>
    </motion.section>
  );
}
