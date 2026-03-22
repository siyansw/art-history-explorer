"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import NarrativeArc from "@/components/NarrativeArc";
import { Theme } from "@/data/types";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [theme, setTheme] = useState<Theme | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!query) return;

    setLoading(true);
    setError("");

    fetch(`/api/theme/generate?q=${encodeURIComponent(query)}`)
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Generation failed");
        }
        return res.json();
      })
      .then((data) => {
        setTheme(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [query]);

  if (!query) {
    return (
      <div className="text-center py-20">
        <p className="text-[#999] font-serif italic">
          No search query provided.
        </p>
        <Link
          href="/"
          className="inline-block mt-4 text-xs tracking-widest uppercase text-[#999] hover:text-[#E4002B] transition-colors"
        >
          Back to themes
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="py-20">
        <div className="max-w-md mx-auto text-center">
          <div className="inline-block w-8 h-8 border-2 border-[#E8E6E1] border-t-[#1A1A1A] rounded-full animate-spin mb-6" />
          <h2 className="font-serif text-2xl text-[#1A1A1A] mb-3">
            Exploring &ldquo;{query}&rdquo;
          </h2>
          <p className="text-sm text-[#999] leading-relaxed">
            Searching the Met&apos;s collection and generating a narrative
            arc&hellip; This may take a few moments.
          </p>
          <div className="mt-8 space-y-3 text-xs text-[#C4C0B8]">
            <p className="animate-pulse">Generating chapters with Claude...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20 text-center">
        <p className="text-[#E4002B] font-serif text-lg mb-2">
          Something went wrong
        </p>
        <p className="text-sm text-[#999] mb-6">{error}</p>
        <Link
          href="/"
          className="inline-block text-xs tracking-widest uppercase text-[#999] hover:text-[#E4002B] transition-colors"
        >
          Back to themes
        </Link>
      </div>
    );
  }

  if (!theme) return null;

  return (
    <div>
      <Link
        href="/"
        className="inline-flex items-center text-xs tracking-widest uppercase text-[#999] hover:text-[#E4002B] transition-colors mb-10"
      >
        <svg
          className="w-3.5 h-3.5 mr-1.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        All Themes
      </Link>

      {/* AI-generated badge */}
      <div className="mb-6 inline-flex items-center gap-2 px-3 py-1.5 bg-amber-50/80 text-amber-700 text-[11px] tracking-wider uppercase">
        <svg
          className="w-3 h-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
        AI-generated theme
      </div>

      <NarrativeArc theme={theme} />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center">
          <div className="inline-block w-8 h-8 border-2 border-[#E8E6E1] border-t-[#1A1A1A] rounded-full animate-spin" />
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
