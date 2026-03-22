"use client";

import { useState, useEffect } from "react";
import { Artwork, ContrastPair } from "@/data/types";
import ArtworkCard from "./ArtworkCard";
import { ReferenceList } from "./ReferenceBadge";
import Disclaimer from "./Disclaimer";

interface CompareToolProps {
  allWorks: Artwork[];
  contrasts: ContrastPair[];
  themeName: string;
}

export default function CompareTool({
  allWorks,
  contrasts,
  themeName,
}: CompareToolProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [aiContrast, setAiContrast] = useState<{
    tensionLabel: string;
    analysis: string;
  } | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const handleSelect = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 2) return [prev[1], id];
      return [...prev, id];
    });
    setAiContrast(null);
  };

  const prewrittenContrast =
    selectedIds.length === 2
      ? contrasts.find(
          (c) =>
            (c.workAId === selectedIds[0] && c.workBId === selectedIds[1]) ||
            (c.workAId === selectedIds[1] && c.workBId === selectedIds[0])
        )
      : null;

  const selectedWorks = selectedIds
    .map((id) => allWorks.find((w) => w.id === id))
    .filter(Boolean) as Artwork[];

  // Auto-generate contrast via AI when no pre-written one exists
  useEffect(() => {
    if (selectedIds.length !== 2 || prewrittenContrast || aiContrast) return;

    const [workA, workB] = selectedWorks;
    if (!workA || !workB) return;

    setAiLoading(true);
    fetch("/api/contrast", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        workA: { title: workA.title, artist: workA.artist, year: workA.year },
        workB: { title: workB.title, artist: workB.artist, year: workB.year },
        theme: themeName,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.tensionLabel) {
          setAiContrast(data);
        }
      })
      .catch(() => {})
      .finally(() => setAiLoading(false));
  }, [selectedIds, prewrittenContrast, aiContrast, selectedWorks, themeName]);

  const activeContrast = prewrittenContrast || (aiContrast ? { ...aiContrast, references: [] } : null);

  return (
    <div className="mt-16 pt-10 border-t border-[#E8E6E1]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-4 text-left group w-full"
      >
        <div className="w-10 h-10 rounded-full bg-white border border-[#E8E6E1] flex items-center justify-center group-hover:border-[#999] transition-colors flex-shrink-0">
          <svg
            className="w-4 h-4 text-[#999]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
            />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="font-serif text-xl font-medium text-[#1A1A1A] group-hover:text-[#E4002B] transition-colors">
            Compare Works Across Chapters
          </h3>
          <p className="text-[#999] text-sm mt-0.5">
            Select any two works to reveal the tension between them
          </p>
        </div>
        <svg
          className={`w-4 h-4 text-[#C4C0B8] transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
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
      </button>

      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out
          ${isOpen ? "max-h-[4000px] opacity-100" : "max-h-0 opacity-0"}
        `}
      >
        {/* Work chips */}
        <div className="flex flex-wrap gap-2 mt-8">
          {allWorks.map((work) => {
            const isSelected = selectedIds.includes(work.id);
            return (
              <button
                key={work.id}
                onClick={() => handleSelect(work.id)}
                className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm transition-all border
                  ${
                    isSelected
                      ? "bg-[#1A1A1A] text-white border-[#1A1A1A]"
                      : "bg-white text-[#666] border-[#E8E6E1] hover:border-[#999]"
                  }
                `}
              >
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: work.colorSwatch }}
                />
                <span className="truncate max-w-48 font-serif text-xs">
                  {work.artist.split(" ").pop()}:{" "}
                  {work.title.length > 30
                    ? work.title.slice(0, 30) + "\u2026"
                    : work.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected works side by side */}
        {selectedWorks.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {selectedWorks.map((work) => (
              <ArtworkCard key={work.id} artwork={work} />
            ))}
          </div>
        )}

        {/* Contrast analysis */}
        {selectedIds.length === 2 && (
          <div className="mt-8">
            {aiLoading ? (
              <div className="bg-white border border-[#E8E6E1] p-8 text-center">
                <div className="inline-block w-5 h-5 border-2 border-[#E8E6E1] border-t-[#1A1A1A] rounded-full animate-spin mb-3" />
                <p className="text-[#999] text-sm font-serif italic">
                  Generating comparison with AI...
                </p>
              </div>
            ) : activeContrast ? (
              <div className="bg-white border border-[#E8E6E1] p-8">
                <div className="flex items-center gap-2 mb-4">
                  <span className="inline-block px-3 py-1 bg-[#1A1A1A] text-white text-[11px] tracking-wider uppercase font-serif">
                    {activeContrast.tensionLabel}
                  </span>
                  {!prewrittenContrast && (
                    <span className="px-2 py-0.5 bg-amber-50/80 text-amber-700 text-[10px] tracking-wider uppercase">
                      AI-generated
                    </span>
                  )}
                </div>
                <p className="text-[#444] text-[15px] leading-[1.8] max-w-xl">
                  {activeContrast.analysis}
                </p>
                {"references" in activeContrast &&
                  activeContrast.references.length > 0 && (
                    <ReferenceList references={activeContrast.references} />
                  )}
                <Disclaimer />
              </div>
            ) : (
              <div className="bg-white border border-[#E8E6E1] p-8 text-center">
                <p className="text-[#999] text-sm font-serif italic">
                  Could not generate contrast. Please try another pair.
                </p>
              </div>
            )}
          </div>
        )}

        {selectedIds.length < 2 && isOpen && (
          <p className="text-[#C4C0B8] text-sm mt-6 font-serif italic">
            {selectedIds.length === 0
              ? "Select two works to compare."
              : "Select one more work."}
          </p>
        )}
      </div>
    </div>
  );
}
