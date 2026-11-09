import Image from "next/image";
import Link from "next/link";
import {
  asset,
  contentType,
  entries,
  entryId,
  fields,
  localHref,
  reviewsFromGroup,
  text,
} from "@/lib/editorial-content";
import EditorialRichText from "./EditorialRichText";
import ReviewCard from "./ReviewCard";
import ContactLinks from "./ContactLinks";

function Invitation({ guide = false }: { guide?: boolean }) {
  return (
    <aside className="page-invitation">
      <span className="eyebrow">
        {guide ? "Find your flavor" : "A conversation is a good place to start"}
      </span>
      <h2>
        {guide
          ? "A little inspiration for your next chapter."
          : "Let’s find your next right step."}
      </h2>
      <p>
        {guide
          ? "Ask Jen for The Strawberry Lemonade guide and explore what makes your brand distinctly yours."
          : "Tell Jen where you are, what’s changing, and what you’d like to build."}
      </p>
      <Link
        className="button"
        data-guide-request={guide ? "strawberry_lemonade" : undefined}
        href={
          guide
            ? "mailto:hello@chickzen.com?subject=The%20Strawberry%20Lemonade%20guide"
            : "/contact"
        }
      >
        {guide ? "Email Jen for the guide" : "Talk with Jen"}
        <span aria-hidden="true">↗</span>
      </Link>
    </aside>
  );
}

export default function CmsPage({
  page,
  slug,
}: {
  page: unknown;
  slug: string;
}) {
  const pageFields = fields(page),
    blocks = entries(pageFields.section);
  const first = blocks.find((e) => contentType(e) === "section"),
    intro = fields(first);
  const about = slug === "about",
    services = slug === "services";
  const guide = ["find-your-flavor", "the-strawberry-lemonade-effect"].includes(
    slug,
  );
  const legal = [
    "privacy-policy",
    "terms-and-conditions",
    "cookie-policy",
    "disclaimer",
    "accessibility-statement",
  ].includes(slug);
  const title =
    text(intro.title) ||
    text(pageFields.title) ||
    "The Strawberry Lemonade Effect";
  const firstImage = asset(intro.image);
  return (
    <div className={`wrap content-page${legal ? " policy-page" : ""}`}>
      <header
        className={`page-heading${about ? " page-heading-portrait" : ""}`}
      >
        <div>
          <span className="eyebrow">
            {about
              ? "Meet Jen"
              : services
                ? "Work with Jen"
                : guide
                  ? "Ideas to make your brand your own"
                  : "chickzen · Information"}
          </span>
          <h1>{title}</h1>
          {text(intro.byline) && (
            <p className="page-byline">{text(intro.byline)}</p>
          )}
          {(about || services) && (
            <Link className="button" href="/contact">
              Let’s talk about your brand <span aria-hidden="true">↗</span>
            </Link>
          )}
        </div>
        {about && (
          <figure className="portrait">
            <Image
              className="portrait-image"
              src="/brand/jen-studio-headshot.png"
              alt="Jennifer Castellanos, founder of chickzen"
              width={1254}
              height={1254}
              sizes="(max-width: 700px) 90vw, 400px"
              priority
            />
            <figcaption>
              <span className="portrait-name">Jennifer Castellanos</span>
              <span className="portrait-note">Strategy, with soul.</span>
            </figcaption>
          </figure>
        )}
      </header>
      {!!first && (
        <div className="page-intro">
          {!about && firstImage.url && (
            <Image
              className="content-image"
              src={firstImage.url}
              alt={text(intro.imageAlt) || firstImage.title}
              width={firstImage.width}
              height={firstImage.height}
              sizes="(max-width: 700px) 90vw, 760px"
            />
          )}
          <EditorialRichText document={intro.body} />
        </div>
      )}
      {!blocks.length && (
        <div className="page-intro editorial-prose">
          <p>
            Your uniqueness is your greatest strength. The Strawberry Lemonade
            guide explores how to find your voice and build a brand that feels
            like you.
          </p>
          <p>Request a copy directly from Jen using the link below.</p>
        </div>
      )}
      {blocks
        .filter((e) => e !== first)
        .map((entry, index) => {
          const f = fields(entry),
            type = contentType(entry),
            key = entryId(entry) || index;
          if (type === "section") {
            const image = asset(f.image);
            return (
              <section className="content-section" key={key}>
                {f.showTitle !== false && <h2>{text(f.title)}</h2>}
                {text(f.byline) && (
                  <p className="page-byline">{text(f.byline)}</p>
                )}
                {image.url && (
                  <Image
                    className="content-image"
                    src={image.url}
                    alt={text(f.imageAlt) || image.title}
                    width={image.width}
                    height={image.height}
                    sizes="(max-width: 700px) 90vw, 760px"
                  />
                )}
                <EditorialRichText document={f.body} />
              </section>
            );
          }
          if (type === "serviceOverviewBlock")
            return (
              <nav
                className="service-index"
                aria-label="Explore services"
                key={key}
              >
                {blocks
                  .filter((block) => contentType(block) === "serviceType")
                  .map((t) => (
                    <Link
                      key={entryId(t)}
                      href={`#${text(fields(t).anchorId).replace(/^#/, "")}`}
                    >
                      {text(fields(t).title)} <span aria-hidden="true">↓</span>
                    </Link>
                  ))}
              </nav>
            );
          if (type === "serviceType")
            return (
              <section
                className="service-category"
                id={text(f.anchorId).replace(/^#/, "")}
                key={key}
              >
                <div>
                  <h2>{text(f.title)}</h2>
                  <p>{text(f.byline)}</p>
                </div>
                <div className="service-list">
                  {entries(f.services)
                    .filter((p) => text(fields(p).title))
                    .map((product) => {
                      const p = fields(product);
                      return (
                        <details
                          className="service-product"
                          key={entryId(product)}
                        >
                          <summary>
                            <h3>{text(p.title)}</h3>
                            <span aria-hidden="true">+</span>
                          </summary>
                          <div className="service-description">
                            <EditorialRichText document={p.description} />
                            <Link
                              className="text-link"
                              data-service-id={text(p.slug)}
                              href={`/contact?service=${encodeURIComponent(text(p.title))}#begin`}
                            >
                              Ask Jen about this service{" "}
                              <span aria-hidden="true">↗</span>
                            </Link>
                          </div>
                        </details>
                      );
                    })}
                </div>
              </section>
            );
          if (type === "reviewBlockGroup")
            return (
              <section
                className="content-section recommendations"
                id="recommendations"
                key={key}
              >
                <span className="eyebrow">Client recommendations</span>
                <h2>{text(f.title)}</h2>
                <p className="page-byline">{text(f.byline)}</p>
                <EditorialRichText document={f.body} />
                <div className="recommendations-grid">
                  {reviewsFromGroup(entry).map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>
              </section>
            );
          if (type === "logoCarousel")
            return (
              <section className="content-section clients-section" key={key}>
                <h2>{text(f.title)}</h2>
                <div className="clients-grid">
                  {entries(f.logos).map((logo) => {
                    const image = asset(logo);
                    return image.url ? (
                      <Image
                        key={entryId(logo)}
                        src={image.url}
                        alt={image.title}
                        width={image.width}
                        height={image.height}
                        sizes="(max-width: 700px) 100px, 160px"
                      />
                    ) : null;
                  })}
                </div>
              </section>
            );
          if (type === "highlightBlock")
            return (
              <div key={key}>
                {entries(f.items).map((item) => {
                  const i = fields(item);
                  if (contentType(item) !== "callToAction") return null;
                  const href = localHref(i.buttonLink);
                  const consulting = href.includes("lets-begin");
                  return (
                    <aside className="page-invitation" key={entryId(item)}>
                      <EditorialRichText document={i.body} />
                      <Link
                        className="button"
                        href={consulting ? "/contact" : href}
                      >
                        {consulting ? "Talk with Jen" : text(i.buttonLabel)}{" "}
                        <span aria-hidden="true">↗</span>
                      </Link>
                    </aside>
                  );
                })}
              </div>
            );
          return null;
        })}
      {!blocks.length && <Invitation guide={guide} />}
      {!legal && (
        <div className="page-contact">
          <p>Prefer to connect directly?</p>
          <ContactLinks />
        </div>
      )}
    </div>
  );
}
