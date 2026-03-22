"use client";

import Link from "next/link";
import { ThemePreview } from "@/data/themes";

interface ThemeGridProps {
  themes: ThemePreview[];
}

export default function ThemeGrid({ themes }: ThemeGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#E8E6E1]">
      {themes.map((theme) => {
        const inner = (
          <div
            className={`bg-white p-6 h-full flex flex-col transition-all duration-200
              ${theme.available ? "hover:bg-[#FAFAF8] cursor-pointer" : "opacity-45 cursor-default"}
            `}
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="font-serif text-xl font-medium text-[#1A1A1A]">
                {theme.name}
              </h3>
              {!theme.available && (
                <span className="text-[10px] tracking-widest uppercase text-[#C4C0B8] font-serif italic whitespace-nowrap ml-3">
                  Coming soon
                </span>
              )}
            </div>

            <p className="text-sm text-[#666] leading-relaxed flex-1 font-serif italic">
              {theme.narrativeArc}
            </p>

            <div className="mt-5 pt-4 border-t border-[#F0EDE8]">
              <div className="flex items-center justify-between text-xs text-[#999]">
                <span>{theme.centuryRange}</span>
                <span>{theme.artworkCount} works</span>
              </div>
              <div className="flex flex-wrap gap-1 mt-2.5">
                {theme.anchorArtists.map((artist) => (
                  <span
                    key={artist}
                    className="text-[11px] px-2 py-0.5 text-[#999] border border-[#E8E6E1] bg-[#FAFAF8]"
                  >
                    {artist}
                  </span>
                ))}
              </div>
            </div>
          </div>
        );

        if (theme.available) {
          return (
            <Link key={theme.slug} href={`/theme/${theme.slug}`}>
              {inner}
            </Link>
          );
        }

        return <div key={theme.slug}>{inner}</div>;
      })}
    </div>
  );
}
