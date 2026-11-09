import type { MetadataRoute } from "next";
import { getAllBlogSlugs, getAllPageSlugs } from "@/lib/contentful";

const SITE_URL = "https://chickzen.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [pageSlugs, blogSlugs] = await Promise.all([
    getAllPageSlugs(),
    getAllBlogSlugs(),
  ]);

  return [
    { url: SITE_URL },
    { url: `${SITE_URL}/blog` },
    { url: `${SITE_URL}/contact` },
    ...(process.env.CHECKOUT_ENABLED === "true" && process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
      ? [{ url: `${SITE_URL}/services/lets-begin` }] : []),
    ...pageSlugs
      .filter((slug) => slug !== "home" && slug !== "contact" && slug !== "blog" && !slug.includes("/"))
      .map((slug) => ({ url: `${SITE_URL}/${slug}` })),
    ...blogSlugs.map((slug) => ({ url: `${SITE_URL}/blog/${slug}` })),
  ];
}

export const revalidate = 3600;
