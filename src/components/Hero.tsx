import { getHero } from "@/lib/contentful";
import type { HeroEntry } from "@/types/contentful";
import type { Asset } from "contentful";
import Image from "next/image";

export default async function Hero() {
  const hero = (await getHero()) as HeroEntry;

  const title = String(hero.fields.title);
  const byline = String(hero.fields.byline);
  const image = hero.fields.image;

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
    ? String(image.fields.title ?? "Hero image")
    : "Hero image";

  return (
    <section className="text-center py-4">
      {imageUrl && (
        <div className="mb-0 flex justify-center">
          <Image
            src={imageUrl}
            alt={imageAlt}
            width={200}
            height={0}
            className="h-auto w-[200px] "
            priority
          />
        </div>
      )}
      <h1 className="hidden"> {title} </h1>
      <p className="mt-0 text-[23px] tracking-wider text-gray-500 font-sans"> {byline} </p>
    </section>
  );
}
