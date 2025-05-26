import "./globals.css";
import { Inter, Playfair_Display } from "next/font/google";
import Header from "@/components/HeaderWrapper"; 
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen flex flex-col bg-[#fdfdfc] text-black font-sans">
        <Header />

        <main className="flex-grow pt-[84px]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
