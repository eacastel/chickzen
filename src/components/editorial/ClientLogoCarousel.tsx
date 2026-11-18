"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import type { ClientLogo } from "@/lib/homepage-content";

export default function ClientLogoCarousel({ title, logos }: { title: string; logos: ClientLogo[] }) {
  const autoplay = useRef(Autoplay({ delay: 4500, playOnInit: false, stopOnInteraction: true }));
  const [viewport, api] = useEmblaCarousel({ loop: true, align: "start" }, [autoplay.current]);
  const root = useRef<HTMLElement>(null);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);
  const [reduced, setReduced] = useState(true);
  const [selected, setSelected] = useState(0);
  const [scrollable, setScrollable] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.2 });
    if (root.current) observer.observe(root.current);
    return () => { observer.disconnect(); media.removeEventListener("change", update); };
  }, []);
  useEffect(() => {
    if (!api) return;
    const select = () => { setSelected(api.selectedScrollSnap()); setScrollable(api.canScrollNext() || api.canScrollPrev()); };
    const stop = () => setPaused(true);
    select();
    api.on("select", select).on("reInit", select).on("pointerDown", stop);
    return () => { api.off("select", select).off("reInit", select).off("pointerDown", stop); };
  }, [api]);
  useEffect(() => {
    if (!api) return;
    const plugin = autoplay.current;
    const update = () => {
      if (paused || hovered || reduced || !visible || !scrollable || document.hidden) plugin.stop();
      else plugin.play();
    };
    update();
    document.addEventListener("visibilitychange", update);
    return () => { plugin.stop(); document.removeEventListener("visibilitychange", update); };
  }, [api, paused, hovered, visible, reduced, scrollable]);
  const move = (direction: number) => {
    setPaused(true);
    autoplay.current.stop();
    if (direction < 0) api?.scrollPrev(reduced); else api?.scrollNext(reduced);
  };
  return (
    <section className="wrap client-logos" ref={root} aria-roledescription="carousel" aria-labelledby="clients-title"
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      onFocusCapture={(event) => {
        if (!(event.target instanceof HTMLElement && event.target.closest(".logos-pause"))) {
          setPaused(true); autoplay.current.stop();
        }
      }}>
      <div className="client-logos-heading"><h2 id="clients-title">{title}</h2><span>Clients &amp; collaborations</span></div>
      <div className="client-logos-viewport" ref={viewport} tabIndex={0} aria-label="Client logos. Use left and right arrow keys to browse."
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft" || event.key === "ArrowRight") { event.preventDefault(); move(event.key === "ArrowLeft" ? -1 : 1); }
        }}>
        <div className="client-logos-track">
          {logos.map((logo, i) => <figure className="client-logo-slide" key={logo.id} role="group" aria-roledescription="slide" aria-label={`${i + 1} of ${logos.length}`}>
            <div className="client-logo-image"><Image src={logo.url} alt="" width={logo.width} height={logo.height} sizes="(max-width: 600px) 140px, 190px" /></div>
            <figcaption>{logo.name}</figcaption>
          </figure>)}
        </div>
      </div>
      {scrollable && <div className="reviews-controls client-logos-controls">
        <span aria-live={paused || reduced ? "polite" : "off"}>{selected + 1} / {logos.length}</span>
        <div>
          {!reduced && <button type="button" className="reviews-pause logos-pause" onClick={() => setPaused((value) => !value)} aria-label={paused ? "Play client logo slideshow" : "Pause client logo slideshow"}>{paused ? "Play" : "Pause"}</button>}
          <button type="button" onClick={() => move(-1)} aria-label="Previous client logo">←</button>
          <button type="button" onClick={() => move(1)} aria-label="Next client logo">→</button>
        </div>
      </div>}
    </section>
  );
}
