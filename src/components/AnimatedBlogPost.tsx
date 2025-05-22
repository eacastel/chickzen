"use client";

import { motion } from "framer-motion";

export default function AnimatedBlogPost({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <motion.article
      className="max-w-3xl mx-auto px-4 py-12 text-gray-700"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {children}
    </motion.article>
  );
}
