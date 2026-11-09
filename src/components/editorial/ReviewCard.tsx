import type { Testimonial } from "@/lib/editorial-content";
export default function ReviewCard({ review }: { review: Testimonial }) {
  return (
    <figure className="review-card">
      {review.rating && (
        <div
          className="review-stars"
          role="img"
          aria-label={`${review.rating} out of 5 stars`}
        >
          <span aria-hidden="true">{"★".repeat(review.rating)}</span>
        </div>
      )}
      <blockquote>“{review.quote}”</blockquote>
      <figcaption>— {review.name}</figcaption>
    </figure>
  );
}
