import type { NextConfig } from "next";
const publicProduction =
  process.env.SITE_LAUNCHED === "true" &&
  process.env.VERCEL_ENV === "production";
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.ctfassets.net", pathname: "/**" },
    ],
  },
  async headers() {
    return publicProduction
      ? []
      : [
          {
            source: "/:path*",
            headers: [
              { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
            ],
          },
        ];
  },
  async redirects() {
    return [
      { source: "/journal", destination: "/blog", permanent: true },
      { source: "/journal/:slug", destination: "/blog/:slug", permanent: true },
      {
        source: "/services/checkout",
        destination: "/services/lets-begin",
        permanent: true,
      },
    ];
  },
};
export default nextConfig;
