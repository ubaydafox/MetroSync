import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MetroSync",
  description: "MetroSync - Smart Scheduling",
  authors: [{ name: "AHNayef", url: "https://github.com/ahnayef" }],
  keywords: [
    "education",
    "school",
    "college",
    "university",
    "scheduling",
    "management",
  ],
  metadataBase: new URL("https://neub-timely.vercel.app"),
  openGraph: {
    url: "https://neub-timely.vercel.app",
    siteName: "MetroSync",
    images: [
      {
        url: "meta.png",
        width: 177,
        height: 112,
        alt: "Meta Image",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div>
    <Navbar/>
    {children}
    <Footer/>
    </div>;
}