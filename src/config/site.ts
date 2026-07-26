const fallbackUrl = "http://localhost:3000";

export const siteConfig = {
  name: "Andstride",

  title: "Andstride — Beats & Instrumentals",

  description:
    "Atmospheric trap, dark textures, cinematic sound design, and late-night instrumentals produced by Andstride.",

  url:
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    fallbackUrl,

  email: "andstridebeats@gmail.com",

  socials: {
    instagram: "https://www.instagram.com/andstride",
    youtube: "https://www.youtube.com/@andstride",
    soundcloud: "https://soundcloud.com/andstride",
  },
};