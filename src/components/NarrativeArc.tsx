"use client";

import { useState } from "react";
import { Theme } from "@/data/types";
import Chapter from "./Chapter";
import CompareTool from "./CompareTool";

interface NarrativeArcProps {
  theme: Theme;
}

export default function NarrativeArc({ theme }: NarrativeArcProps) {
  const [expandedChapter, setExpandedChapter] = useState<number | null>(null);

  const allWorks = theme.chapters.flatMap((c) => c.works);

  return (
    <div>
      {/* Theme header */}
      <header className="mb-14">
        <span className="text-xs tracking-widest uppercase text-[#999] font-serif">
          {theme.centuryRange} &middot; {theme.artworkCount} works in the Met
          collection
        </span>
        <h1 className="font-serif text-4xl md:text-5xl font-medium text-[#1A1A1A] mt-3 leading-tight">
          {theme.name}
        </h1>
        <p className="font-serif italic text-lg text-[#666] mt-4 max-w-2xl leading-relaxed">
          {theme.narrativeArc}
        </p>
      </header>

      {/* Divider */}
      <div className="border-t border-[#E8E6E1] mb-10" />

      {/* Chapters */}
      <div>
        {theme.chapters.map((chapter, i) => (
          <Chapter
            key={chapter.number}
            chapter={chapter}
            isExpanded={expandedChapter === chapter.number}
            onToggle={() =>
              setExpandedChapter(
                expandedChapter === chapter.number ? null : chapter.number
              )
            }
            isLast={i === theme.chapters.length - 1}
          />
        ))}
      </div>

      {/* Compare tool */}
      <CompareTool allWorks={allWorks} contrasts={theme.contrasts} themeName={theme.name} />
    </div>
  );
}
