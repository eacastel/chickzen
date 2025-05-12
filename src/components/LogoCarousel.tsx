"use client";

import { useRef, useEffect } from "react";
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
      const maxScrollLeft = scrollContainer.scrollWidth - scrollContainer.clientWidth;

      if (scrollContainer.scrollLeft >= maxScrollLeft - 5) {
        scrollContainer.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        scrollContainer.scrollBy({ left: 200, behavior: "smooth" });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-6 px-4 bg-white overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <div
          ref={scrollRef}
          className="flex gap-8 overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar"
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
                className="min-w-[180px] flex-shrink-0 snap-start flex items-center justify-center"
              >
                <Image
                  src={src}
                  alt={alt}
                  width={180}
                  height={0}
                  className="h-auto w-auto max-h-30 object-contain"
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
