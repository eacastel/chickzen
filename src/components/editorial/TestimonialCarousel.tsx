"use client";
import { useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import type { Testimonial } from "@/lib/editorial-content";
import ReviewCard from "./ReviewCard";

export default function TestimonialCarousel({
  reviews,
}: {
  reviews: Testimonial[];
}) {
  const autoplay = useRef(
    Autoplay({ delay: 8000, playOnInit: false, stopOnInteraction: true }),
  );
  const [viewport, api] = useEmblaCarousel(
    { loop: true, align: "start", slidesToScroll: 1 },
    [autoplay.current],
  );
  const root = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);
  const [reduced, setReduced] = useState(true);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.2 },
    );
    if (root.current) observer.observe(root.current);
    return () => {
      observer.disconnect();
      media.removeEventListener("change", update);
    };
  }, []);
  useEffect(() => {
    if (!api) return;
    const select = () => setSelected(api.selectedScrollSnap());
    const stop = () => setPaused(true);
    select();
    api.on("select", select).on("reInit", select).on("pointerDown", stop);
    return () => {
      api.off("select", select).off("reInit", select).off("pointerDown", stop);
    };
  }, [api]);
  useEffect(() => {
    if (!api) return;
    const plugin = autoplay.current;
    const update = () => {
      if (paused || hovered || reduced || !visible || document.hidden)
        plugin.stop();
      else plugin.play();
    };
    update();
    document.addEventListener("visibilitychange", update);
    return () => {
      plugin.stop();
      document.removeEventListener("visibilitychange", update);
    };
  }, [api, paused, hovered, visible, reduced]);
  const move = (direction: number) => {
    setPaused(true);
    autoplay.current.stop();
    if (direction < 0) api?.scrollPrev(reduced);
    else api?.scrollNext(reduced);
  };
  return (
    <div
      className="reviews-carousel"
      ref={root}
      role="region"
      aria-roledescription="carousel"
      aria-label="Client recommendations"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={(event) => {
        if (
          !(
            event.target instanceof HTMLElement &&
            event.target.closest(".reviews-pause")
          )
        ) {
          setPaused(true);
          autoplay.current.stop();
        }
      }}
    >
      <div
        className="reviews-viewport"
        ref={viewport}
        tabIndex={0}
        aria-label="Reviews. Use left and right arrow keys to browse."
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
            e.preventDefault();
            move(e.key === "ArrowLeft" ? -1 : 1);
          }
        }}
      >
        <div className="reviews-track">
          {reviews.map((review, i) => (
            <div
              className="review-slide"
              key={review.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${reviews.length}`}
            >
              <ReviewCard review={review} />
            </div>
          ))}
        </div>
      </div>
      <div className="reviews-controls">
        <span
          className="reviews-count"
          aria-live={paused || reduced ? "polite" : "off"}
        >
          {selected + 1} / {reviews.length} recommendations
        </span>
        <div>
          {!reduced && (
            <button
              type="button"
              className="reviews-pause"
              onClick={() => setPaused((p) => !p)}
              aria-label={
                paused ? "Play review slideshow" : "Pause review slideshow"
              }
            >
              {paused ? "Play" : "Pause"}
            </button>
          )}
          <button
            type="button"
            onClick={() => move(-1)}
            aria-label="Previous review"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => move(1)}
            aria-label="Next review"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}
