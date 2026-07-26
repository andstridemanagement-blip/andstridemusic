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
        src: "/icon",
        sizes: "64x64",
        type: "image/png",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}