import Link from "next/link";
import { getPage } from "@/lib/contentful";
import { reviewsFromPage } from "@/lib/editorial-content";
import TestimonialCarousel from "./TestimonialCarousel";
export default async function TestimonialsSection() {
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
            Kind words · Client recommendations
          </span>
          <h2 id="proof-title">What it’s like to work with Jen.</h2>
        </div>
        <Link className="text-link" href="/about#recommendations">
          Read all recommendations <span aria-hidden="true">↗</span>
        </Link>
      </div>
      <TestimonialCarousel reviews={reviews} />
    </section>
  );
}
