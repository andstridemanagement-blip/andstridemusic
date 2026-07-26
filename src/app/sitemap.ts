import type { MetadataRoute } from "next";

import { siteConfig } from "../config/site";
import { tracks } from "../data/tracks";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const mainPages: MetadataRoute.Sitemap = [
    {
      url: siteConfig.url,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
    },

    {
      url: `${siteConfig.url}/ride`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },

    {
      url: `${siteConfig.url}/beats`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  const trackPages: MetadataRoute.Sitemap = tracks.map(
    (track) => ({
      url: `${siteConfig.url}/ride?track=${track.slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    })
  );

  return [...mainPages, ...trackPages];
}