import Menu from "./Menu";
import { getHeaderImage } from "@/lib/contentful";
import type { HeaderImageEntry } from "@/types/contentful";
import type { Asset } from "contentful";
import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";

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

  const cookieStore = await cookies();
  const region = cookieStore.get("phoneRegion")?.value ?? "EU";

  const contact =
    region === "US"
      ? {
          phone: "+1 (323) 493-1991",
          whatsapp: "https://wa.me/13234931991",
        }
      : {
          phone: "+34 606 989 881",
          whatsapp: "https://wa.me/34606989881",
        };

  

  return (
    <footer className="bg-pink-50 text-foreground px-6 pt-12 pb-4">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-md items-start">
        {/* Left: Footer Menu (do not wrap in flex) */}
        <Menu
          menuName="Footer"
          className="flex flex-wrap justify-center md:flex-col md:items-start md:space-y-1 gap-x-4 gap-y-2 text-sm text-gray-500"
        />

        {/* Center: Logo */}
        <div className="flex justify-center items-start">
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
        

        {/* Right: Contact Info - aligned to bottom on md+ */}
        <div className="flex flex-col justify-middle md:justify-center text-center md:text-right text-sm text-gray-500 space-y-1 h-full">
          <div className="mb-2">
            <a
              href={`tel:${contact.phone.replace(/[^+\d]/g, "")}`}
              className="hover:underline text-sm text-gray-500"
            >
              {contact.phone}
            </a>
          </div>

          <div className="mb-2">
            <a
              href={contact.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              WhatsApp
            </a>
          </div>
          
          <div className="mb-6 text-sm text-gray-500"><a id="email-link"
  href="mailto:&#104;&#101;&#108;&#108;&#111;&#64;&#99;&#104;&#105;&#99;&#107;&#122;&#101;&#110;&#46;&#99;&#111;&#109;"
  className="hover:underline"
>
  Email
</a></div>
          
        </div>
      </div>

      {/* Legal Footer */}
      <div className="mt-8 border-t border-gray-300 pt-4">
        <Menu
          menuName="Legal Footer"
          className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-xs text-gray-500"
        />
      </div>
      <div className="flex flex-wrap justify-center mt-4 mb-2 gap-y-2 text-xs text-gray-500 italic">
            © {new Date().getFullYear()} chickzen. All rights reserved.
          </div>
    </footer>
  );
}
