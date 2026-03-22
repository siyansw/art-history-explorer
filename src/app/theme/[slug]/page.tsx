import { notFound } from "next/navigation";
import Link from "next/link";
import { lonelinessTheme } from "@/data/loneliness";
import { lightAndShadowTheme } from "@/data/light-and-shadow";
import { powerTheme } from "@/data/power";
import { sublimeTheme } from "@/data/the-sublime";
import { motherhoodTheme } from "@/data/motherhood";
import { mortalityTheme } from "@/data/mortality";
import NarrativeArc from "@/components/NarrativeArc";
import { Theme } from "@/data/types";

const themeMap: Record<string, Theme> = {
  loneliness: lonelinessTheme,
  "light-and-shadow": lightAndShadowTheme,
  power: powerTheme,
  "the-sublime": sublimeTheme,
  motherhood: motherhoodTheme,
  mortality: mortalityTheme,
};

export default async function ThemePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const theme = themeMap[slug];

  if (!theme) {
    notFound();
  }

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
      <NarrativeArc theme={theme} />
    </div>
  );
}
