import Hero from "@/components/Hero";
import ShopClient from "./ShopClient";

export const metadata = {
  title: "StoryZen™ – Craft Your Pitch in 3 Powerful Steps | Chickzen",
  description:
    "Buy the StoryZen™ package — a guided process to clarify your startup’s audience, value, and story. Created for founders ready to pitch with confidence.",
  alternates: {
    canonical: "https://chickzen.com/shop",
  },
  openGraph: {
    title: "StoryZen™ – Pitch Clarity for Founders | Chickzen",
    description:
      "Refine your pitch with the StoryZen™ process. Get clear on your audience, value proposition, and tagline — all in one powerful session.",
    url: "https://chickzen.com/shop",
    siteName: "Chickzen",
    images: ["/og-default.png"],
    type: "product",
  },
  twitter: {
    card: "summary_large_image",
    title: "StoryZen™ – Clarify Your Pitch | Chickzen",
    description:
      "Get your founder pitch sharp and impactful. StoryZen™ guides you through clarity in audience, offer, and messaging.",
    images: ["/og-default.png"],
  },
};


export default async function ShopPage() {

  return (
    <>
      <Hero />
      <ShopClient />
    </>
  );
}
