"use client";

import { Artwork } from "@/data/types";
import Image from "next/image";

interface ArtworkCardProps {
  artwork: Artwork;
  selectable?: boolean;
  selected?: boolean;
  onSelect?: (id: string) => void;
}

export default function ArtworkCard({
  artwork,
  selectable = false,
  selected = false,
  onSelect,
}: ArtworkCardProps) {
  return (
    <div
      className={`group bg-white border transition-all duration-200
        ${selectable ? "cursor-pointer" : ""}
        ${selected ? "border-[#1A1A1A] shadow-sm" : "border-[#E8E6E1] hover:shadow-sm"}
      `}
      onClick={selectable ? () => onSelect?.(artwork.id) : undefined}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[#F5F3EE]">
        {artwork.imageUrl ? (
          <Image
            src={artwork.imageUrl}
            alt={`${artwork.title} by ${artwork.artist}`}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, 400px"
            unoptimized
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-[#C4C0B8]">
            <svg className="w-8 h-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-xs font-serif italic">Not in Met Open Access</span>
            {artwork.wikipediaUrl && (
              <a
                href={artwork.wikipediaUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="mt-2 text-xs text-[#999] underline underline-offset-2 hover:text-[#666] transition-colors"
              >
                View on Wikipedia &rarr;
              </a>
            )}
          </div>
        )}
        {selectable && (
          <div
            className={`absolute top-3 right-3 w-5 h-5 rounded-full border-2 transition-colors
              ${selected ? "bg-[#1A1A1A] border-[#1A1A1A]" : "bg-white/90 border-[#999]"}
            `}
          >
            {selected && (
              <svg
                className="w-full h-full text-white p-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </div>
        )}
      </div>

      {/* Tombstone — museum metadata style */}
      <div className="p-5">
        <h4 className="font-serif text-base font-medium text-[#1A1A1A] leading-snug">
          {artwork.title}
        </h4>
        <p className="text-[#666] text-sm mt-1">
          {artwork.artist}
        </p>

        {/* Metadata block */}
        <div className="mt-3 space-y-0.5 text-xs text-[#999]">
          <p>{artwork.year}</p>
          <p>{artwork.medium}</p>
          <p>{artwork.location}</p>
        </div>

        {/* Source badges */}
        <div className="mt-3 flex items-center gap-2">
          {artwork.metUrl && (
          <a
            href={artwork.metUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium bg-[#E4002B]/5 text-[#E4002B] hover:bg-[#E4002B]/10 transition-colors"
          >
            View at Met
          </a>
          )}
          {artwork.wikidataUrl && (
            <a
              href={artwork.wikidataUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium bg-[#F5F3EE] text-[#999] hover:text-[#666] transition-colors"
            >
              Wikidata
            </a>
          )}
          {!artwork.metUrl && artwork.wikipediaUrl && (
            <a
              href={artwork.wikipediaUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium bg-[#F5F3EE] text-[#999] hover:text-[#666] transition-colors"
            >
              Wikipedia &rarr;
            </a>
          )}
        </div>

        {/* Visual device */}
        <div className="mt-4 pt-4 border-t border-[#F0EDE8]">
          <p className="text-xs text-[#666] leading-relaxed font-serif italic">
            {artwork.visualDevice}
          </p>
        </div>
      </div>
    </div>
  );
}
