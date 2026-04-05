import { Metadata } from "next";
import React from "react";
import Credits from "./Credits";

export const metadata: Metadata = {
  title: "MetroSync | Credits",
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

export default function CreditsPage() {
  return <Credits />;
}
