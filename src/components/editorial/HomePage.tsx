import Image from "next/image";
import Link from "next/link";
import { getHomepage } from "@/lib/contentful";
import { homeBlock, homeLogos } from "@/lib/homepage-content";
import { localHref } from "@/lib/editorial-content";
import { HomeHeading, HomeLines, HomeParagraphs } from "./HomeText";
import JournalFeature from "./JournalFeature";
import ContactSection from "./ContactSection";
import TestimonialsSection from "./TestimonialsSection";
import ClientLogoCarousel from "./ClientLogoCarousel";

export default async function EditorialHomePage() {
  const page = await getHomepage();
  const hero = homeBlock(page, "hero"), portrait = homeBlock(page, "portrait"),
    offers = homeBlock(page, "offers"), footer = homeBlock(page, "offers-footer"),
    approach = homeBlock(page, "approach"), about = homeBlock(page, "about");
  const clients = homeLogos(page);
  return (
    <>
      <section className="wrap hero" aria-labelledby="hero-title">
        <div>
          <span className="eyebrow">{hero.eyebrow}</span>
          <h1 id="hero-title"><HomeHeading block={hero} /></h1>
          <HomeParagraphs className="hero-copy" text={hero.body} />
          <div className="hero-actions">
            <Link className="button" href={localHref(hero.primaryLink)}>{hero.primaryLabel} <span className="arrow" aria-hidden="true">↗</span></Link>
            <Link className="text-link" href={localHref(hero.secondaryLink)}>{hero.secondaryLabel} <span aria-hidden="true">↓</span></Link>
          </div>
        </div>
        <figure className="portrait">
          <Image className="portrait-image" src={portrait.image?.url || "/brand/jen-studio-headshot.png"}
            alt={portrait.imageAlt || portrait.image?.title || "Jennifer Castellanos"}
            width={portrait.image?.width || 1254} height={portrait.image?.height || 1254} fetchPriority="high" />
          <figcaption>
            <span><span className="portrait-name">{portrait.heading}</span>{portrait.label}</span>
            <span className="portrait-note">{portrait.body}</span>
          </figcaption>
        </figure>
      </section>
      <TestimonialsSection copy={homeBlock(page, "proof")} />
      {!!clients.logos.length && <ClientLogoCarousel {...clients} />}
      <div className="wrap experience" aria-label="Jen's experience">
        <span className="eyebrow">{homeBlock(page, "experience").eyebrow}</span>
        {(["credential-brand", "credential-chamber", "credential-faculty"] as const).map((key) => {
          const block = homeBlock(page, key);
          return <div className="credential" key={key}><strong><HomeLines text={block.heading} /></strong><span>{block.label}</span></div>;
        })}
      </div>
      <section className="wrap section" id="work" aria-labelledby="work-title">
        <div className="section-head">
          <div><span className="eyebrow">{offers.eyebrow}</span><h2 id="work-title"><HomeHeading block={offers} /></h2></div>
          <HomeParagraphs text={offers.body} />
        </div>
        <div className="offers">
          {(["offer-clarity", "offer-messaging", "offer-partner"] as const).map((key) => {
            const offer = homeBlock(page, key);
            return <details className="offer" key={key}>
              <summary><span><span className="offer-title">{offer.heading}</span><span className="offer-tag">{offer.label}</span></span>
                <span className="offer-intro">{offer.summary}</span><span className="offer-toggle" aria-hidden="true" /></summary>
              <div className="offer-detail"><HomeParagraphs text={offer.body} />
                <Link className="text-link" href={localHref(offer.primaryLink)}>{offer.primaryLabel} <span aria-hidden="true">↗</span></Link>
              </div>
            </details>;
          })}
        </div>
        <div className="services-foot"><HomeParagraphs text={footer.body} />
          <Link className="text-link" href={localHref(footer.primaryLink)}>{footer.primaryLabel} <span aria-hidden="true">↗</span></Link>
        </div>
      </section>
      <section className="approach-band" aria-labelledby="approach-title">
        <div className="wrap approach">
          <div className="approach-heading">
            <div><span className="eyebrow">{approach.eyebrow}</span><h2 id="approach-title"><HomeHeading block={approach} /></h2></div>
            <HomeParagraphs text={approach.body} />
          </div>
          <ol className="steps">
            {(["step-thread", "step-voice", "step-next"] as const).map((key, i) => {
              const step = homeBlock(page, key);
              return <li className="step" key={key}><span className="step-num" aria-hidden="true">{i + 1}</span><h3>{step.heading}</h3><HomeParagraphs text={step.body} /></li>;
            })}
          </ol>
        </div>
      </section>
      <section className="wrap section about" id="about" aria-labelledby="about-title">
        <div><span className="eyebrow">{about.eyebrow}</span><h2 id="about-title"><HomeHeading block={about} /></h2></div>
        <div className="about-copy"><HomeParagraphs text={about.body} />
          <Link className="text-link" href={localHref(about.primaryLink)}>{about.primaryLabel} <span aria-hidden="true">↗</span></Link>
        </div>
      </section>
      <JournalFeature copy={homeBlock(page, "journal")} />
      <ContactSection copy={homeBlock(page, "contact")} />
    </>
  );
}
