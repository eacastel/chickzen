"use client";
import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";

export default function SiteHeader() {
  const menu = useRef<HTMLDetailsElement>(null);
  const close = () => {
    if (menu.current) menu.current.open = false;
  };
  return (
    <header className="masthead">
      <nav className="wrap nav" aria-label="Main navigation">
        <Link href="/" aria-label="chickzen home" onClick={close}>
          <Image
            className="logo"
            src="/brand/chickzen-logo.webp"
            alt="chickzen"
            width={88}
            height={85}
            priority
          />
        </Link>
        <div className="nav-links">
          <Link href="/#work">Work with Jen</Link>
          <Link href="/about">Meet Jen</Link>
          <Link href="/blog">The journal</Link>
        </div>
        <details className="mobile-menu" ref={menu}>
          <summary>Menu</summary>
          <nav aria-label="Mobile navigation">
            <Link href="/#work" onClick={close}>
              Work with Jen
            </Link>
            <Link href="/about" onClick={close}>
              Meet Jen
            </Link>
            <Link href="/blog" onClick={close}>
              The journal
            </Link>
          </nav>
        </details>
        <Link className="nav-cta" href="/#begin" onClick={close}>
          Talk with Jen <span aria-hidden="true">↗</span>
        </Link>
      </nav>
    </header>
  );
}
