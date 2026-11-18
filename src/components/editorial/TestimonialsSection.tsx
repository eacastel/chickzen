import { homeBlock, type HomeBlock } from "@/lib/homepage-content";
import { localHref } from "@/lib/editorial-content";
import Link from "next/link";
import { getPage } from "@/lib/contentful";
import { reviewsFromPage } from "@/lib/editorial-content";
import TestimonialCarousel from "./TestimonialCarousel";
export default async function TestimonialsSection({ copy = homeBlock(null, "proof") }: { copy?: HomeBlock }) {
  const reviews = reviewsFromPage(await getPage("about"));
  if (!reviews.length) return null;
  return (
    <section
      className="wrap proof"
      id="testimonials"
      aria-labelledby="proof-title"
    >
      <div className="proof-head">
        <div>
          <span className="eyebrow proof-kicker">
            {copy.eyebrow}
          </span>
          <h2 id="proof-title">{copy.heading}</h2>
        </div>
        <Link className="text-link" href={localHref(copy.primaryLink)}>
          {copy.primaryLabel} <span aria-hidden="true">↗</span>
        </Link>
      </div>
      <TestimonialCarousel reviews={reviews} />
    </section>
  );
}
