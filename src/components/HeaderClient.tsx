"use client";

import { useEffect, useRef, useState } from "react";
import { getLocalized } from "@/lib/utils/contentful";
import Image from "next/image";
import Link from "next/link";
import type { Asset } from "contentful";
import { Squash as Hamburger } from "hamburger-react";
import type { HeaderImageEntry, MenuItemEntry } from "@/types/contentful";

interface Props {
  headerImage: HeaderImageEntry;
  menuItems: MenuItemEntry[];
}

export default function HeaderClient({ headerImage, menuItems }: Props) {
  // sticky / hide-on-scroll
  const [show, setShow] = useState(true);
  const lastY = useRef(0);
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setShow(y <= 10 || y < lastY.current);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // mobile menu
  const [open, setOpen] = useState(false);

  const rawImage = headerImage.fields.image;
  const image = rawImage as unknown as Asset;

  const imageUrl = image?.fields?.file?.url
    ? `https:${image.fields.file.url}`
    : "/fallback.png";

  const imageAlt = getLocalized(image?.fields.title) ?? "Header logo";

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 bg-white border-b border-gray-50 shadow-xs transition-transform duration-300 ${
        show ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <nav className="max-w-5xl mx-auto px-4 py-0 flex items-center justify-between">
        {/* logo */}
        <Link href="/" aria-label="Home" className="z-50">
          <Image
            src={imageUrl}
            alt={imageAlt}
            width={80}
            height={0}
            className="h-auto w-[80px]"
            priority
          />
        </Link>

        {/* hamburger */}
        <div className="md:hidden">
          <Hamburger
            toggled={open}
            toggle={setOpen}
            size={28}
            color="#333"
            rounded
            label={open ? "Close menu" : "Open menu"}
          />
        </div>

        {/* desktop nav */}
        <nav className="hidden md:flex space-x-4 text-sm text-gray-500">
          {menuItems.map((item) => {
            const rawHref =
              typeof item.fields.href === "string"
                ? item.fields.href.trim()
                : "";
            const href = rawHref.startsWith("http")
              ? rawHref
              : `/${rawHref.replace(/^\/+/, "")}`;
            return (
              <Link
                key={item.sys.id}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={
                  href.startsWith("http") ? "noopener noreferrer" : undefined
                }
                className="hover:underline"
              >
                {getLocalized(item.fields.title)}
              </Link>
            );
          })}
        </nav>

        {/* mobile nav < md : width ≈ 80 % (max-w 5/6) */}
        {open && (
          <nav className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-50 shadow-xs">
            <div className="w-5/6 max-w-xs mx-auto flex flex-col items-center gap-y-4 py-4">
              {menuItems.map((item) => {
                const rawHref = getLocalized(item.fields.href) ?? "";
                const href = rawHref.startsWith("http")
                  ? rawHref
                  : `/${rawHref.replace(/^\/+/, "")}`;
                return (
                  <Link
                    key={item.sys.id}
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={
                      href.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className="hover:underline"
                    onClick={() => setOpen(false)}
                  >
                    {getLocalized(item.fields.title)}
                  </Link>
                );
              })}
            </div>
          </nav>
        )}
      </nav>
    </header>
  );
}
