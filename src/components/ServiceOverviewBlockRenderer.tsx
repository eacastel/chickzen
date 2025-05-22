"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { ServiceTypeEntry } from "@/types/contentful";

type Props = {
  serviceTypes: ServiceTypeEntry[];
};

export default function ServiceOverviewBlockRenderer({ serviceTypes }: Props) {
  return (
    <motion.section
      className="pb-10 pt-2 px-4 bg-[#fffefb] text-center"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.01 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {serviceTypes.map((type) => {
          const rawTitle = type.fields.title;
          const rawByline = type.fields.byline;

          const title =
            typeof rawTitle === "string" ? rawTitle : "";
          const byline =
            typeof rawByline === "string" ? rawByline : "";

          const anchorId = title.toLowerCase().replace(/[^\w]+/g, "-");

          return (
            <Link
              key={type.sys.id}
              href={`#${anchorId}`}
              className="block bg-[#F4E9E6] rounded-xl p-6 hover:bg-[#ebd8d3] transition shadow-sm"
            >
              <h3 className="text-2xl font-serif text-gray-800 mb-2">{title}</h3>
              <p className="text-gray-600">{byline}</p>
            </Link>
          );
        })}
      </div>
    </motion.section>
  );
}
