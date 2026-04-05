import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MetroSync",
  description: "MetroSync - Smart Scheduling",
  authors: [{ name: "Abu Ubayda", url: "https://github.com/ubaydafox" }],
  keywords: [
    "education",
    "school",
    "college",
    "university",
    "scheduling",
    "management",
  ],
  metadataBase: new URL("https://metrosync-eta.vercel.app/"),
  openGraph: {
    url: "https://metrosync-eta.vercel.app/",
    siteName: "MetroSync",
    images: [
      {
        url: "favicon.jpg",
        alt: "MetroSync Logo",
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