import "./globals.css";
import { Inter, Playfair_Display } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata = {
  title:
    "chickzen™: Empowering Women to Convey their Unique Value Proposition to their Target Audience",
  description:
    "Ready to elevate your story? Explore our “Let’s Begin” page to learn how chickzen™ empowers women with targeted storytelling tools. Discover the process that helps you convey your unique value proposition and authentically communicate your message for extraordinary outcomes to your target audience.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen flex flex-col bg-[#fdfdfc] text-black font-sans">
        <Header />

        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
