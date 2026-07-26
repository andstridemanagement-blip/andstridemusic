"use client";

import { useMemo, useState } from "react";
import type { Track } from "../data/tracks";

type BeatCatalogProps = {
  tracks: Track[];
};

export default function BeatCatalog({
  tracks,
}: BeatCatalogProps) {
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("All");

  const genres = useMemo(() => {
    return [
      "All",
      ...Array.from(
        new Set(tracks.map((track) => track.genre))
      ),
    ];
  }, [tracks]);

  const filteredTracks = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return tracks.filter((track) => {
      const matchesGenre =
        genre === "All" || track.genre === genre;

      const matchesSearch =
        normalizedSearch.length === 0 ||
        track.title.toLowerCase().includes(normalizedSearch) ||
        track.genre.toLowerCase().includes(normalizedSearch) ||
        track.subtitle.toLowerCase().includes(normalizedSearch) ||
        track.musicalKey.toLowerCase().includes(normalizedSearch);

      return matchesGenre && matchesSearch;
    });
  }, [genre, search, tracks]);

  function openTrack(track: Track) {
    window.location.href = `/ride?track=${track.slug}`;
  }

  return (
    <div className="relative z-20 mx-auto w-full max-w-[1500px] px-6 pb-20 pt-28 md:px-12 md:pt-32">
      <div className="flex flex-col gap-8 border-b border-white/10 pb-9 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[9px] uppercase tracking-[0.55em] text-white/25">
            Andstride Catalog
          </p>

          <h1 className="mt-5 text-5xl font-black uppercase tracking-[0.08em] md:text-7xl">
            Beats
          </h1>

          <p className="mt-5 max-w-xl text-sm leading-7 text-white/35">
            Atmospheric trap, dark textures, and cinematic
            instrumentals available for licensing.
          </p>
        </div>

        <div className="flex w-full flex-col gap-4 sm:flex-row lg:w-auto">
          <label className="block">
            <span className="sr-only">Search beats</span>

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search beats"
              className="h-11 w-full border border-white/10 bg-black/30 px-4 text-[10px] uppercase tracking-[0.2em] text-white outline-none placeholder:text-white/20 focus:border-white/35 sm:w-60"
            />
          </label>

          <label className="block">
            <span className="sr-only">Filter by genre</span>

            <select
              value={genre}
              onChange={(event) => setGenre(event.target.value)}
              className="h-11 w-full border border-white/10 bg-black px-4 text-[10px] uppercase tracking-[0.2em] text-white/60 outline-none focus:border-white/35 sm:w-48"
            >
              {genres.map((genreName) => (
                <option
                  key={genreName}
                  value={genreName}
                >
                  {genreName}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <p className="text-[8px] uppercase tracking-[0.35em] text-white/20">
          {filteredTracks.length}{" "}
          {filteredTracks.length === 1 ? "Track" : "Tracks"}
        </p>

        <p className="hidden text-[8px] uppercase tracking-[0.3em] text-white/15 md:block">
          Select a track to open the player
        </p>
      </div>

      {filteredTracks.length > 0 ? (
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredTracks.map((track, index) => (
            <button
              key={track.slug}
              type="button"
              onClick={() => openTrack(track)}
              className="group relative min-h-[250px] overflow-hidden border border-white/[0.08] bg-black/20 p-6 text-left backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-white/25 hover:bg-black/35"
            >
              <div
                className="absolute inset-x-0 top-0 h-px opacity-60"
                style={{
                  backgroundColor: track.accent,
                  boxShadow: `0 0 30px ${track.accent}`,
                }}
              />

              <div
                className="pointer-events-none absolute -right-24 -top-24 h-52 w-52 rounded-full opacity-[0.08] blur-[70px] transition duration-500 group-hover:opacity-[0.16]"
                style={{
                  backgroundColor: track.accent,
                }}
              />

              <div className="relative z-10 flex h-full flex-col">
                <div className="flex items-start justify-between gap-6">
                  <p className="font-mono text-[8px] text-white/20">
                    {String(index + 1).padStart(2, "0")}
                  </p>

                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{
                      backgroundColor: track.accent,
                      boxShadow: `0 0 12px ${track.accent}`,
                    }}
                  />
                </div>

                <div className="mt-12">
                  <h2 className="text-3xl font-black uppercase tracking-[0.08em] text-white/85 transition group-hover:text-white">
                    {track.title}
                  </h2>

                  <p className="mt-3 text-[8px] uppercase tracking-[0.3em] text-white/30">
                    {track.subtitle}
                  </p>
                </div>

                <div className="mt-auto grid grid-cols-3 gap-4 border-t border-white/[0.08] pt-5">
                  <div>
                    <p className="text-[7px] uppercase tracking-[0.25em] text-white/20">
                      BPM
                    </p>

                    <p className="mt-2 text-xs text-white/60">
                      {track.bpm}
                    </p>
                  </div>

                  <div>
                    <p className="text-[7px] uppercase tracking-[0.25em] text-white/20">
                      Key
                    </p>

                    <p className="mt-2 text-xs text-white/60">
                      {track.musicalKey}
                    </p>
                  </div>

                  <div>
                    <p className="text-[7px] uppercase tracking-[0.25em] text-white/20">
                      Genre
                    </p>

                    <p className="mt-2 truncate text-xs text-white/60">
                      {track.genre}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between">
                  <p className="text-[7px] uppercase tracking-[0.28em] text-white/20">
                    {track.availability}
                  </p>

                  <span className="text-sm text-white/20 transition group-hover:translate-x-1 group-hover:text-white">
                    →
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="mt-16 border border-white/[0.08] bg-black/20 px-6 py-16 text-center">
          <p className="text-[9px] uppercase tracking-[0.4em] text-white/25">
            No tracks found
          </p>

          <button
            type="button"
            onClick={() => {
              setSearch("");
              setGenre("All");
            }}
            className="mt-6 text-[8px] uppercase tracking-[0.3em] text-white/35 transition hover:text-white"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}