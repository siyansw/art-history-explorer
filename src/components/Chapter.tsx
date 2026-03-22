"use client";

import { Chapter as ChapterType } from "@/data/types";
import ArtworkCard from "./ArtworkCard";
import { ReferenceList } from "./ReferenceBadge";
import Disclaimer from "./Disclaimer";

interface ChapterProps {
  chapter: ChapterType;
  isExpanded: boolean;
  onToggle: () => void;
  isLast: boolean;
}

export default function Chapter({
  chapter,
  isExpanded,
  onToggle,
  isLast,
}: ChapterProps) {
  return (
    <div className="relative flex gap-8">
      {/* Timeline line + dot */}
      <div className="flex flex-col items-center flex-shrink-0">
        <button
          onClick={onToggle}
          className={`w-10 h-10 rounded-full flex items-center justify-center text-sm transition-all duration-200 z-10 flex-shrink-0
            ${
              isExpanded
                ? "bg-[#1A1A1A] text-white"
                : "bg-white text-[#999] border border-[#D4D0C8] hover:border-[#999]"
            }
          `}
          style={{ fontFamily: "var(--font-serif)" }}
        >
          {chapter.number}
        </button>
        {!isLast && <div className="w-px bg-[#E8E6E1] flex-1 min-h-8" />}
      </div>

      {/* Content */}
      <div className={`flex-1 ${isLast ? "" : "pb-12"}`}>
        {/* Header — always visible */}
        <button onClick={onToggle} className="w-full text-left group">
          <span className="text-[11px] tracking-[0.2em] uppercase text-[#999]">
            {chapter.era}
          </span>
          <h3 className="font-serif text-2xl font-medium text-[#1A1A1A] mt-1 leading-snug group-hover:text-[#E4002B] transition-colors">
            {chapter.headline}
          </h3>
          <p className="text-[#666] mt-2 text-sm leading-relaxed max-w-xl">
            {chapter.summary}
          </p>
          <span className="inline-flex items-center text-xs text-[#999] mt-3 group-hover:text-[#666] transition-colors tracking-wide uppercase">
            {isExpanded ? (
              <>
                <svg
                  className="w-3 h-3 mr-1.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 15l7-7 7 7"
                  />
                </svg>
                Close
              </>
            ) : (
              <>
                <svg
                  className="w-3 h-3 mr-1.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
                Read more
              </>
            )}
          </span>
        </button>

        {/* Expanded detail */}
        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out
            ${isExpanded ? "max-h-[4000px] opacity-100 mt-8" : "max-h-0 opacity-0"}
          `}
        >
          {/* Prose */}
          <div className="max-w-xl">
            {chapter.detail.split("\n\n").map((paragraph, i) => (
              <p
                key={i}
                className="text-[#444] text-[15px] leading-[1.8] mb-5 last:mb-0"
              >
                {paragraph}
              </p>
            ))}
          </div>

          {/* Artwork cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
            {chapter.works.map((work) => (
              <ArtworkCard key={work.id} artwork={work} />
            ))}
          </div>

          {/* References */}
          <ReferenceList references={chapter.references} />

          {/* Disclaimer */}
          <Disclaimer />
        </div>
      </div>
    </div>
  );
}
