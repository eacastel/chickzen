import Link from "next/link";
import ContactLinks from "./ContactLinks";
export default function SiteFooter() {
  return (
    <footer className="wrap site-footer">
      <div className="footer-main">
        <p className="footer-mantra">
          Your voice is power.
          <br />
          Your brand is the roadmap.
        </p>
        <nav className="footer-links" aria-label="Footer navigation">
          <Link href="/services">Work with Jen</Link>
          <Link href="/about">About</Link>
          <Link href="/blog">Journal</Link>
          <Link href="/find-your-flavor">Find your flavor</Link>
          <Link href="/contact">Contact</Link>
        </nav>
      </div>
      <ContactLinks />
      <div className="footer-bottom">
        <span>
          © {new Date().getFullYear()} chickzen. All rights reserved.
        </span>
        <span>
          <Link href="/privacy-policy">Privacy</Link> &nbsp;·&nbsp;{" "}
          <Link href="/terms-and-conditions">Terms</Link> &nbsp;·&nbsp;{" "}
          <Link href="/cookie-policy">Cookies</Link> &nbsp;·&nbsp;{" "}
          <Link href="/accessibility-statement">Accessibility</Link>{" "}
          &nbsp;·&nbsp; <Link href="/disclaimer">Disclaimer</Link>
        </span>
      </div>
    </footer>
  );
}
