import type {
  Metadata,
  Viewport,
} from "next";

import "./globals.css";

import { siteConfig } from "../config/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),

  title: {
    default: siteConfig.title,
    template: "%s | Andstride",
  },

  description: siteConfig.description,

  applicationName: "Andstride",

  keywords: [
    "Andstride",
    "Andstride beats",
    "beats for sale",
    "dark trap beats",
    "atmospheric beats",
    "cinematic beats",
    "night drive beats",
    "trap instrumentals",
    "music producer",
  ],

  authors: [
    {
      name: "Andstride",
      url: siteConfig.url,
    },
  ],

  creator: "Andstride",
  publisher: "Andstride",

  alternates: {
    canonical: "/",
  },

  robots: {
    index: true,
    follow: true,

    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    siteName: "Andstride",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Andstride — Beats & Instrumentals",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: ["/opengraph-image"],
  },

  category: "music",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#000000",
  colorScheme: "dark",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "MusicGroup",
  name: "Andstride",
  url: siteConfig.url,
  description: siteConfig.description,
  sameAs: [
    siteConfig.socials.instagram,
    siteConfig.socials.youtube,
    siteConfig.socials.soundcloud,
  ],
  contactPoint: {
    "@type": "ContactPoint",
    email: siteConfig.email,
    contactType: "business inquiries",
    availableLanguage: ["English", "Russian"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(
              /</g,
              "\\u003c"
            ),
          }}
        />
      </body>
    </html>
  );
}