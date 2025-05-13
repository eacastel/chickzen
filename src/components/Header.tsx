import { getHeaderImage } from "@/lib/contentful";
import type { HeaderImageEntry } from "@/types/contentful";
import type { Asset } from "contentful";
import Menu from "./Menu";
import Image from "next/image";
import Link from "next/link";

export default async function Header() {
  const headerImage = (await getHeaderImage()) as HeaderImageEntry;

  const title = String(headerImage.fields.title);
  const image = headerImage.fields.image;

  const isAsset = (img: unknown): img is Asset =>
    typeof img === "object" &&
    img !== null &&
    "fields" in img &&
    "file" in (img as Asset).fields;

  const imageUrl =
    isAsset(image) && image.fields.file?.url
      ? `https:${image.fields.file.url}`
      : "";

  const imageAlt: string = isAsset(image)
    ? String(image.fields.title ?? "Header Logo")
    : "Header Logo";

  return (
    <header className="bg-white text-black">
      <div className="max-w-6xl mx-auto py-4 px-6 flex justify-between items-center">
      <div className="font-serif text-lg ">
        <span className="sr-only">{title}</span>
        {imageUrl && (
          <div className="mb-0 justify-left">
            <Link href="/">
              <Image
                src={imageUrl}
                alt={imageAlt}
                width={50}
                height={0}
                className="h-auto w-[50px] "
                priority
              />
            </Link>
          </div>
        )}
      </div>

      <Menu
        menuName="Main Navigation"
        className="flex space-x-4 text-sm text-gray-500"
      />
      </div>
    </header>
  );
}
