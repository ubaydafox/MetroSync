import { Metadata } from "next";
import React from "react";
import About from "./About";

export const metadata: Metadata = {
  title: "MetroSync | About Us",
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

export default function AboutPage() {
  return <About />;
}
