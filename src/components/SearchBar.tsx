"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;

    setLoading(true);
    router.push(`/theme/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder='Search by feeling — e.g. "grief", "power", "the sea"'
          disabled={loading}
          className="w-full px-5 py-3.5 bg-white border border-[#E8E6E1] text-sm text-[#333] placeholder:text-[#C4C0B8] focus:outline-none focus:border-[#999] transition-colors"
        />
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 text-xs tracking-wider uppercase bg-[#1A1A1A] text-white hover:bg-[#E4002B] disabled:bg-[#E8E6E1] disabled:text-[#C4C0B8] transition-colors"
        >
          {loading ? "Generating..." : "Explore"}
        </button>
      </div>
      <p className="text-xs text-[#C4C0B8] mt-2 italic">
        AI will generate a narrative arc from the Met&apos;s collection for any
        theme you enter
      </p>
    </form>
  );
}
