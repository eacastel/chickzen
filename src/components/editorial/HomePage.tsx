import Image from "next/image";
import Link from "next/link";
import JournalFeature from "./JournalFeature";
import ContactSection from "./ContactSection";

export default function EditorialHomePage() {
  return (
    <>
      <section className="wrap hero" aria-labelledby="hero-title">
        <div>
          <span className="eyebrow">
            Brand strategy &amp; messaging · For women
          </span>
          <h1 id="hero-title">
            A clearer brand.
            <br />A voice that’s
            <br />
            <em>entirely yours.</em>
          </h1>
          <p className="hero-copy">
            Your work has evolved. Let’s make sure your brand reflects it. Work
            with Jen to clarify your positioning, shape your message, and find a
            confident direction for what comes next.
          </p>
          <div className="hero-actions">
            <Link className="button" href="#begin">
              Let’s talk about your brand{" "}
              <span className="arrow" aria-hidden="true">
                ↗
              </span>
            </Link>
            <Link className="text-link" href="#work">
              Explore ways to work together <span aria-hidden="true">↓</span>
            </Link>
          </div>
        </div>
        <figure className="portrait">
          <Image
            className="portrait-image"
            src="/brand/jen-studio-headshot.png"
            alt="Jennifer Castellanos, founder of chickzen"
            width="1254"
            height="1254"
            fetchPriority="high"
          />
          <figcaption>
            <span>
              <span className="portrait-name">Jennifer Castellanos</span>Founder
              &amp; brand strategist
            </span>
            <span className="portrait-note">Strategy, with soul.</span>
          </figcaption>
        </figure>
      </section>
      <section
        className="wrap proof"
        id="testimonials"
        aria-labelledby="proof-title"
      >
        <div className="proof-head">
          <div>
            <span className="eyebrow proof-kicker">
              <svg
                className="proof-star"
                viewBox="0 0 24 24"
                aria-hidden="true"
                focusable="false"
              >
                <path
                  d="M12 1.5 15 9l7.5 3L15 15l-3 7.5L9 15l-7.5-3L9 9Z"
                  fill="currentColor"
                />
              </svg>
              Testimonials
            </span>
            <h2 id="proof-title">What it’s like to work with Jen.</h2>
          </div>
          <Link className="text-link" href="/about">
            More recommendations <span aria-hidden="true">↗</span>
          </Link>
        </div>
        <div className="proof-quotes">
          <figure>
            <blockquote>
              “An asset to anyone seeking key business advice, creativity,
              honesty, integrity and knowledge.”
            </blockquote>
            <figcaption>— L. Leshner</figcaption>
          </figure>
          <figure>
            <blockquote>
              “She is sharp, personable, and gets results.”
            </blockquote>
            <figcaption>— E. Groody</figcaption>
          </figure>
        </div>
      </section>
      <div className="wrap experience" aria-label="Jen's experience">
        <span className="eyebrow">Experience that informs the work</span>
        <div className="credential">
          <strong>20+ years</strong>
          <span>Brand, marketing &amp; business growth</span>
        </div>
        <div className="credential">
          <strong>
            Beverly Hills
            <br />
            Chamber of Commerce
          </strong>
          <span>Vice President experience</span>
        </div>
        <div className="credential">
          <strong>
            Goldman Sachs
            <br />
            10,000 Small Businesses
          </strong>
          <span>Faculty experience</span>
        </div>
      </div>
      <section className="wrap section" id="work" aria-labelledby="work-title">
        <div className="section-head">
          <div>
            <span className="eyebrow">Ways to work together</span>
            <h2 id="work-title">
              Where are you
              <br />
              <em>ready to go?</em>
            </h2>
          </div>
          <p>
            You don’t need to arrive with all the answers. Start with what feels
            familiar, and we’ll find the right shape for the work.
          </p>
        </div>
        <div className="offers">
          <details className="offer">
            <summary>
              <span>
                <span className="offer-title">Clarify your direction</span>
                <span className="offer-tag">
                  Clarity &amp; focused strategy
                </span>
              </span>
              <span className="offer-intro">
                You have ideas, experience, and a lot in motion. You need to
                know what matters next.
              </span>
              <span className="offer-toggle" aria-hidden="true"></span>
            </summary>
            <div className="offer-detail">
              <p>
                Explore a focused session or brand audit to understand where
                your message is getting lost and identify your next priorities.
                We’ll help you choose the right starting point from Jen’s
                existing clarity services.
              </p>
              <Link className="text-link" href="#begin">
                Ask Jen about a clarity session{" "}
                <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </details>
          <details className="offer">
            <summary>
              <span>
                <span className="offer-title">Shape your message</span>
                <span className="offer-tag">
                  Positioning, story &amp; website voice
                </span>
              </span>
              <span className="offer-intro">
                The work you do is strong. Your words need to make its value
                easier to see.
              </span>
              <span className="offer-toggle" aria-hidden="true"></span>
            </summary>
            <div className="offer-detail">
              <p>
                Bring your positioning, signature story, bio or website language
                into alignment. Depending on what you need, explore a personal
                brand messaging project or a Website Voice Rebrand with Jen.
              </p>
              <Link className="text-link" href="#begin">
                Discuss your messaging project{" "}
                <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </details>
          <details className="offer">
            <summary>
              <span>
                <span className="offer-title">Grow with a partner</span>
                <span className="offer-tag">Ongoing strategic guidance</span>
              </span>
              <span className="offer-intro">
                You’re building your next chapter and want a thoughtful partner
                alongside you.
              </span>
              <span className="offer-toggle" aria-hidden="true"></span>
            </summary>
            <div className="offer-detail">
              <p>
                Explore an ongoing Strategic Brand Partner engagement for
                decisions about your positioning, messaging and growth. Start
                with a conversation about the support, scope and cadence your
                business needs.
              </p>
              <Link className="text-link" href="#begin">
                Explore a strategic partnership{" "}
                <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </details>
        </div>
        <div className="services-foot">
          <p>Not sure where to begin? That’s a good place to start.</p>
          <Link className="text-link" href="#begin">
            Let’s work it out together <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>
      <section className="approach-band" aria-labelledby="approach-title">
        <div className="wrap approach">
          <div className="approach-heading">
            <div>
              <span className="eyebrow">The work behind the words</span>
              <h2 id="approach-title">
                Clarity you can
                <br />
                <em>actually put to work.</em>
              </h2>
            </div>
            <p>
              A good brand strategy connects who you are, what your audience
              needs, and how you show up. Here’s where we begin.
            </p>
          </div>
          <ol className="steps">
            <li className="step">
              <span className="step-num" aria-hidden="true">
                1
              </span>
              <h3>Find the thread.</h3>
              <p>
                Understand your strengths, your audience, and the difference you
                want your work to make.
              </p>
            </li>
            <li className="step">
              <span className="step-num" aria-hidden="true">
                2
              </span>
              <h3>Give it a voice.</h3>
              <p>
                Shape a clear position and language that sounds like you, from
                your story to your website.
              </p>
            </li>
            <li className="step">
              <span className="step-num" aria-hidden="true">
                3
              </span>
              <h3>Know what comes next.</h3>
              <p>
                Connect the strategy to practical decisions and priorities you
                can move forward with.
              </p>
            </li>
          </ol>
        </div>
      </section>
      <section
        className="wrap section about"
        id="about"
        aria-labelledby="about-title"
      >
        <div>
          <span className="eyebrow">Meet Jen</span>
          <h2 id="about-title">
            A thoughtful partner.
            <br />
            <em>A wider perspective.</em>
          </h2>
        </div>
        <div className="about-copy">
          <p>
            Jen brings more than two decades of experience across branding,
            marketing, leadership and business growth to the work of helping
            women find their voice.
          </p>
          <p>
            From working with business leaders to teaching entrepreneurs, her
            work connects strategic thinking with a deep curiosity about
            people—and what makes their stories matter.
          </p>
          <Link className="text-link" href="/about">
            Get to know Jen <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>
      <JournalFeature />
      <ContactSection />
    </>
  );
}
