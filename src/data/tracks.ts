export type Track = {
  slug: string;
  title: string;
  subtitle: string;
  quote: string;
  bpm: number;
  genre: string;
  format: string;
  musicalKey: string;
  availability: "available" | "reserved" | "sold" | "coming";
  audio: string;
  video: string;
  duration: number;
  downloadName: string;
  accent: string;
};

export const tracks: Track[] = [
  {
    slug: "midnight",
    title: "Midnight",
    subtitle: "Night Drive • Dark Trap",
    quote: "Late nights. Empty roads. No destination.",
    bpm: 142,
    genre: "Dark Trap",
    format: "MP3 Preview",
    musicalKey: "G Minor",
    availability: "available",
    audio: "/audio/drift-preview.mp3",
    video: "/video/ride.mp4",
    duration: 54,
    downloadName: "andstride-midnight-preview.mp3",
    accent: "#58a6ff",
  },
  {
    slug: "lost-signal",
    title: "Lost Signal",
    subtitle: "Atmospheric Trap • Night Ride",
    quote: "Static fades. The city disappears.",
    bpm: 142,
    genre: "Atmospheric Trap",
    format: "MP3 Preview",
    musicalKey: "G Minor",
    availability: "sold",
    audio: "/audio/lost-signal-preview.mp3",
    video: "/video/ride3.mp4",
    duration: 54,
    downloadName: "andstride-lost-signal-preview.mp3",
    accent: "#8b7cff",
  },
  {
    slug: "overload",
    title: "Overload",
    subtitle: "Dark Trap • High Energy",
    quote: "Too much speed. Never enough silence.",
    bpm: 140,
    genre: "Dark Trap",
    format: "MP3 Preview",
    musicalKey: "E Minor",
    availability: "available",
    audio: "/audio/overload-preview.mp3",
    video: "/video/ride2.mp4",
    duration: 54,
    downloadName: "andstride-overload-preview.mp3",
    accent: "#ff6a6a",
  },
];