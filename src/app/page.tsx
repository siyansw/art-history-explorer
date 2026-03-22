import { curatedThemes } from "@/data/themes";
import ThemeGrid from "@/components/ThemeGrid";
import SearchBar from "@/components/SearchBar";

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <header className="mb-14">
        <h1 className="font-serif text-4xl md:text-5xl font-medium text-[#1A1A1A] leading-tight">
          Explore Art Through
          <br />
          <em className="text-[#E4002B]">Human Feeling</em>
        </h1>
        <p className="text-[#666] mt-4 max-w-lg text-base leading-relaxed">
          How have artists across five centuries responded to the same emotions?
          Pick a theme and follow the story through the Met&apos;s collection.
        </p>
        <p className="text-xs text-[#999] mt-3 leading-relaxed">
          Artwork data and images from the{" "}
          <a
            href="https://metmuseum.github.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="met-link"
          >
            Met Museum Open Access API
          </a>{" "}
          (CC0). Interpretive content is AI-generated.
        </p>
      </header>

      {/* Search */}
      <div className="mb-14">
        <SearchBar />
      </div>

      {/* Divider */}
      <div className="border-t border-[#E8E6E1] mb-8" />

      {/* Curated themes */}
      <section>
        <h2 className="font-serif text-sm tracking-widest uppercase text-[#999] mb-6">
          Curated Themes
        </h2>
        <ThemeGrid themes={curatedThemes} />
      </section>
    </div>
  );
}
