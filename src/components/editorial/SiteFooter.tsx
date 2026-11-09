import Link from "next/link";
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
          <Link href="/#work">Work with Jen</Link>
          <Link href="/about">About</Link>
          <Link href="/blog">Journal</Link>
        </nav>
      </div>
      <div className="footer-bottom">
        <span>
          © {new Date().getFullYear()} chickzen. All rights reserved.
        </span>
        <span>
          <Link href="/privacy-policy">Privacy</Link> &nbsp;·&nbsp;{" "}
          <Link href="/terms-and-conditions">Terms</Link>
        </span>
      </div>
    </footer>
  );
}
