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
};
export default nextConfig;
