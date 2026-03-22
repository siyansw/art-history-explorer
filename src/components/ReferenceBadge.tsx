"use client";

import { Reference, ReferenceType } from "@/data/types";

const badgeStyles: Record<
  ReferenceType,
  { bg: string; text: string; label: string }
> = {
  met: {
    bg: "bg-[#E4002B]/5 hover:bg-[#E4002B]/10",
    text: "text-[#E4002B]",
    label: "Met",
  },
  wikidata: {
    bg: "bg-[#F5F3EE] hover:bg-[#EBE8E1]",
    text: "text-[#999]",
    label: "Wikidata",
  },
  scholar: {
    bg: "bg-amber-50/80 hover:bg-amber-50",
    text: "text-amber-700",
    label: "Scholar \u2197",
  },
};

export function ReferenceBadge({ reference }: { reference: Reference }) {
  const style = badgeStyles[reference.type];
  return (
    <a
      href={reference.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1 px-1.5 py-0.5 text-[11px] font-medium transition-colors ${style.bg} ${style.text}`}
      title={reference.text}
    >
      <span className="opacity-50">[{reference.num}]</span>
      <span>{style.label}</span>
    </a>
  );
}

export function ReferenceList({ references }: { references: Reference[] }) {
  if (!references.length) return null;

  return (
    <div className="mt-8 pt-5 border-t border-[#F0EDE8]">
      <p className="text-[11px] tracking-[0.15em] uppercase text-[#C4C0B8] mb-3">
        Sources
      </p>
      <ol className="space-y-1.5">
        {references.map((ref) => (
          <li key={ref.num} className="flex items-start gap-2 text-xs">
            <ReferenceBadge reference={ref} />
            <span className="text-[#999] leading-relaxed">{ref.text}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
