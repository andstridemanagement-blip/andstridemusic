import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Andstride — Beats & Instrumentals",
    short_name: "Andstride",

    description:
      "Atmospheric trap, dark textures, cinematic sound design, and late-night instrumentals.",

    start_url: "/",
    display: "standalone",

    background_color: "#000000",
    theme_color: "#000000",

    orientation: "portrait-primary",

    categories: [
      "music",
      "entertainment",
    ],

    icons: [
  {
    src: "/favicon-96x96.png",
    sizes: "96x96",
    type: "image/png",
  },
  {
    src: "/android-chrome-192x192.png",
    sizes: "192x192",
    type: "image/png",
  },
  {
    src: "/android-chrome-512x512.png",
    sizes: "512x512",
    type: "image/png",
  },
  {
    src: "/apple-touch-icon.png",
    sizes: "180x180",
    type: "image/png",
  },
],
  };
}