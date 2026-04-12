import { Metadata } from "next";
import React from "react";
import Contact from "./Contact";

export const metadata: Metadata = {
  title: "MetroSync | Contact Us",
  description: "MetroSync - Smart Scheduling",
  authors: [{ name: "Ubayda & Rony", url: "https://github.com/ubaydafox/MetroSync" }],
  keywords: [
    "education",
    "school",
    "college",
    "university",
    "scheduling",
    "management",
  ],
  metadataBase: new URL("https://metrosync-eta.vercel.app"),
  openGraph: {
    url: "https://metrosync-eta.vercel.app",
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

export default function ContactPage() {
  return <Contact />;
}
