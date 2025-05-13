"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import type { Asset, ChainModifiers } from "contentful";

type Props = {
  logos: Asset<ChainModifiers, string>[];
};

export default function LogoCarousel({ logos }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const interval = setInterval(() => {
      const maxScrollLeft =
        scrollContainer.scrollWidth - scrollContainer.clientWidth;

      if (scrollContainer.scrollLeft >= maxScrollLeft - 5) {
        scrollContainer.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        scrollContainer.scrollBy({ left: 150, behavior: "smooth" }); // ⏩ faster scroll
      }
    }, 2000); // ⏱ faster interval

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.section
      className="pt-2 pb-8 px-4 bg-white overflow-hidden"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.5 }}
    >
      <div className="max-w-5xl mx-auto">
  <div
    ref={scrollRef}
    className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar px-4 py-6"
  >
    {logos.map((logo, index) => {
      const src = `https:${logo.fields.file?.url ?? ""}`;
      const alt =
        typeof logo.fields.title === "string"
          ? logo.fields.title
          : `Logo ${index + 1}`;

      return (
        <div
          key={logo.sys.id ?? index}
          className="flex-shrink-0 snap-start flex items-center justify-center w-[140px] h-[80px] md:w-[180px] md:h-[100px] px-2"
        >
          <Image
            src={src}
            alt={alt}
            width={180}
            height={100}
            className="object-contain w-full h-full"
          />
        </div>
      );
    })}
  </div>
</div>
    </motion.section>
  );
}
