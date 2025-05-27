"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import type { Asset, ChainModifiers } from "contentful";

type Props = {
  logos: Asset<ChainModifiers, string>[];
};

export default function LogoCarousel({ logos }: Props) {
  const autoplay = useRef(Autoplay({ delay: 3000, stopOnInteraction: false }));

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    autoplay.current,
  ]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (emblaApi) autoplay.current?.play();
  }, [emblaApi]);

  console.log("🎯 All logos from Contentful:", logos);




  return (
    <section className="pt-20 px-4 bg-white">
      <div className="max-w-4xl mx-auto relative">
        {/* Carousel */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {logos.map((logo, index) => {
              const src = `https:${logo.fields.file?.url ?? ""}`;
              const alt =
                typeof logo.fields.title === "string"
                  ? logo.fields.title
                  : `Logo ${index + 1}`;

              return (
                <div
                  key={logo.sys.id ?? index}
                  className="min-w-[33.33%] sm:min-w-[25%] md:min-w-[20%] px-1 py-2 flex justify-center items-center"
                >
                  <div className="relative w-[140px] h-[80px] md:w-[160px] md:h-[100px] flex items-center justify-center">

                    <Image
                      src={src}
                      alt={alt}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100px, 120px"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Arrows */}
        <button
          onClick={scrollPrev}
          aria-label="Previous"
          className="absolute left-[-1rem] top-1/2 -translate-y-1/2 w-10 h-10 bg-[#F4E9E6] text-white rounded-full flex items-center justify-center shadow hover:opacity-80 transition-opacity"
        >
          ◀
        </button>
        <button
          onClick={scrollNext}
          aria-label="Next"
          className="absolute right-[-1rem] top-1/2 -translate-y-1/2 w-10 h-10 bg-[#F4E9E6] text-white rounded-full flex items-center justify-center shadow hover:opacity-80 transition-opacity"
        >
          ▶
        </button>
      </div>
    </section>
  );
}
