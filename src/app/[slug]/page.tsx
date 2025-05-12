import SectionRenderer from "@/components/SectionRenderer";
import ReviewBlockRenderer from "@/components/ReviewBlockRenderer";
import LogoCarousel from "@/components/LogoCarousel";
import { getPage, getAllPageSlugs } from "@/lib/contentful";
import { notFound } from "next/navigation";

import type {
  SectionEntry,
  ReviewBlockGroupEntry,
  LogoCarouselEntry,
} from "@/types/contentful";


// ✅ SEO metadata
// export async function generateMetadata({ params }: { params: { slug: string } }) {
//   const page = await getPage(params.slug);
//   return {
//     title: page?.fields?.title ?? "Chickzen",
//   };
// }

// ✅ Static params
export async function generateStaticParams() {
  const slugs = await getAllPageSlugs();
  return slugs.map((slug) => ({ slug }));
}

// ✅ Content type extraction helper (no `any`)
function getContentTypeId(entry: unknown): string | null {
  if (
    typeof entry === "object" &&
    entry !== null &&
    "sys" in entry &&
    "fields" in entry &&
    typeof (entry as { sys: { contentType?: { sys?: { id?: unknown } } } }).sys
      ?.contentType?.sys?.id === "string"
  ) {
    return (entry as { sys: { contentType: { sys: { id: string } } } }).sys
      .contentType.sys.id;
  }

  return null;
}

// ✅ Main page component
export default async function Page({ params }: { params: { slug: string } }) {
  const page = await getPage(params.slug);


if (!page) notFound();

  const content = Array.isArray(page.fields.section)
    ? page.fields.section
    : [page.fields.section];

  return (
    <>
      <main>
        {content.map((entry, i) => {
          if (
            typeof entry !== "object" ||
            entry === null ||
            !("sys" in entry)
          ) {
            return null;
          }

          const typeId = getContentTypeId(entry);
          const key = (entry as { sys: { id?: string } }).sys.id ?? i;

          if (typeId === "section") {
            const sectionEntry = entry as unknown as SectionEntry;
            return <SectionRenderer key={key} section={sectionEntry} />;
          }

          if (typeId === "reviewBlockGroup") {
            const reviewGroupEntry = entry as unknown as ReviewBlockGroupEntry;
            const blocks = reviewGroupEntry.fields.reviewBlocks;
            const groupTitle: string = String(
              reviewGroupEntry.fields.title ?? ""
            );

            if (Array.isArray(blocks)) {
              return (
                <div key={key} className="text-center my-12">
                  {groupTitle && (
                    <h2 className="text-6xl text-gray-600 font-serif tracking-tighter text-center">
                      {groupTitle}
                    </h2>
                  )}
                  <ReviewBlockRenderer reviews={blocks} />
                </div>
              );
            }

            return null;
          }

          if (typeId === "logoCarousel") {
            const logoEntry = entry as unknown as LogoCarouselEntry;
            const logos = logoEntry.fields.logos;

            if (Array.isArray(logos)) {
              return <LogoCarousel key={key} logos={logos} />;
            }

            return null;
          }

          return null;
        })}
      </main>
    </>
  );
}
