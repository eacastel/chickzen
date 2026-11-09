import type { MetadataRoute } from "next";
import { isPublicProduction } from "@/lib/deployment";
export default function robots(): MetadataRoute.Robots {
  return isPublicProduction()
    ? {
        rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/success"] },
        sitemap: "https://chickzen.com/sitemap.xml",
      }
    : { rules: { userAgent: "*", disallow: "/" } };
}
