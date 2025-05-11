import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SectionRenderer from "@/components/SectionRenderer";
import { getPage, getAllPageSlugs } from "@/lib/contentful";
import type { SectionEntry } from "@/types/contentful";
import type { BaseEntry } from "contentful";

function isSectionEntry(entry: unknown): entry is SectionEntry {
  return (
    typeof entry === "object" &&
    entry !== null &&
    "sys" in entry &&
    "fields" in entry &&
    (entry as unknown as BaseEntry).sys?.contentType?.sys?.id === "section"
  );
}

type Props = {
  params: {
    slug: string;
  };
};

// ✅ Metadata generator (for SEO)
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const page = await getPage(slug);
  const title = page?.fields?.title || "Chickzen";
  return { title };
}

// ✅ Static params for SSG
export async function generateStaticParams() {
  const slugs = await getAllPageSlugs();
  return slugs.map((slug) => ({ slug }));
}

// ✅ Static page component with awaited `params`
export default async function Page({ params }: Props) {
  const { slug } = await params;
  const page = await getPage(slug);

  if (!page) return <div>Page not found</div>;

  const raw = page.fields.section;
  const section = Array.isArray(raw)
    ? (raw.filter(isSectionEntry) as unknown as SectionEntry[])
    : isSectionEntry(raw)
    ? [raw as SectionEntry]
    : [];


  return (
    <>
      <Header />
      <main>
        {section.map((section, i) => (
          <SectionRenderer key={section.sys?.id || i} section={section} />
        ))}
      </main>
      <Footer />
    </>
  );
}