import Menu from "./Menu";
import { getHeaderImage } from "@/lib/contentful";
import type { HeaderImageEntry } from "@/types/contentful";
import type { Asset } from "contentful";
import Image from "next/image";
import Link from "next/link";

function isAsset(img: unknown): img is Asset {
  return (
    typeof img === "object" &&
    img !== null &&
    "fields" in img &&
    "file" in (img as Asset).fields
  );
}

export default async function Footer() {
  const headerImage = (await getHeaderImage()) as HeaderImageEntry;
  const image = headerImage.fields.image;

  const imageUrl =
    isAsset(image) && image.fields.file?.url
      ? `https:${image.fields.file.url}`
      : "";

  const imageAlt = isAsset(image)
    ? String(image.fields.title ?? "Footer Logo")
    : "Footer Logo";

  return (
    <footer className="bg-pink-50 text-foreground px-6 pt-12 pb-4">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-start text-sm">
        {/* Left: Footer Menu */}
        <Menu
          menuName="Footer"
          className="flex flex-wrap justify-center md:flex-col md:items-start md:space-y-1 gap-x-4 gap-y-2 text-sm text-gray-500"
        />

        {/* Center: Logo */}
        <div className="flex justify-center">
          {imageUrl && (
            <Link href="/">
            <Image
              src={imageUrl}
              alt={imageAlt}
              width={150}
              height={150}
              className="h-auto w-[150px]"
              priority
            />
            </Link>
          )}
        </div>

        {/* Right: Contact Info */}
        <div className="text-center md:text-right text-xs text-gray-500 space-y-1">
          <div className="mb-4">hello@chickzen.com</div>
          <div className="italic">
            © {new Date().getFullYear()} chickzen. All rights reserved.
          </div>
        </div>
      </div>
          {/* Legal Footer */}
    <div className="mt-8 border-t border-gray-300 pt-4">
      <Menu
        menuName="Legal Footer"
        className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-xs text-gray-500"
      />
    </div>
    </footer>
  );
}
