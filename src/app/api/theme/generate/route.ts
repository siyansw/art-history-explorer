import { NextRequest } from "next/server";
import { generateThemeArc } from "@/lib/claude";
import { searchMet, getMetObject, metCollectionUrl } from "@/lib/met-api";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q");

  if (!query || query.trim().length === 0) {
    return Response.json(
      { error: "Missing query parameter 'q'" },
      { status: 400 }
    );
  }

  try {
    // 1. Generate theme arc from Claude
    const generated = await generateThemeArc(query.trim());

    // Track used Met IDs to avoid duplicates
    const usedMetIds = new Set<number>();

    // 2. Try to enrich artworks with Met API data
    const chapters = [];
    for (let chapterIdx = 0; chapterIdx < generated.chapters.length; chapterIdx++) {
      const chapter = generated.chapters[chapterIdx];
      const works = [];

      for (let workIdx = 0; workIdx < chapter.works.length; workIdx++) {
        const work = chapter.works[workIdx];
        let metObjectID = work.metObjectID || null;
        let imageUrl = "";
        let imageLarge = "";
        let metUrl = "";
        let wikidataUrl = "";
        let artistWikidataUrl = "";
        let location = "";
        let isPublicDomain = false;
        let tags: string[] = [];

        // If Claude provided a Met object ID and it's not already used, try it
        if (metObjectID && !usedMetIds.has(metObjectID)) {
          try {
            const obj = await getMetObject(metObjectID);
            if (obj.primaryImageSmall && obj.isPublicDomain) {
              imageUrl = obj.primaryImageSmall;
              imageLarge = obj.primaryImage;
              metUrl = metCollectionUrl(metObjectID);
              wikidataUrl = obj.objectWikidata_URL || "";
              artistWikidataUrl = obj.artistWikidata_URL || "";
              location = obj.GalleryNumber
                ? `Gallery ${obj.GalleryNumber}, The Metropolitan Museum of Art`
                : "The Metropolitan Museum of Art";
              isPublicDomain = obj.isPublicDomain;
              tags = (obj.tags || []).map((t) => t.term);
              usedMetIds.add(metObjectID);
              // Use verified Met metadata
              work.title = obj.title;
              work.artist = obj.artistDisplayName;
              work.year = obj.objectDate;
              work.medium = obj.medium;
            }
          } catch {
            metObjectID = null;
          }
        } else {
          metObjectID = null;
        }

        // If no Met ID or it failed, search by artist name, then by title
        if (!imageUrl) {
          const searches = [
            { q: work.artist, opts: { hasImages: true, artistOrCulture: true } },
            { q: `${work.title}`, opts: { hasImages: true } },
          ];

          for (const search of searches) {
            if (imageUrl) break;
            try {
              const searchResult = await searchMet(search.q, search.opts);
              const ids = (searchResult.objectIDs || []).slice(0, 10);
              for (const id of ids) {
                if (usedMetIds.has(id)) continue;
                try {
                  const obj = await getMetObject(id);
                  const artistLastName = work.artist.split(" ").pop()!.toLowerCase();
                  if (
                    obj.isPublicDomain &&
                    obj.primaryImageSmall &&
                    obj.artistDisplayName.toLowerCase().includes(artistLastName)
                  ) {
                    metObjectID = obj.objectID;
                    imageUrl = obj.primaryImageSmall;
                    imageLarge = obj.primaryImage;
                    metUrl = metCollectionUrl(obj.objectID);
                    wikidataUrl = obj.objectWikidata_URL || "";
                    artistWikidataUrl = obj.artistWikidata_URL || "";
                    location = obj.GalleryNumber
                      ? `Gallery ${obj.GalleryNumber}, The Metropolitan Museum of Art`
                      : "The Metropolitan Museum of Art";
                    isPublicDomain = obj.isPublicDomain;
                    tags = (obj.tags || []).map((t) => t.term);
                    usedMetIds.add(obj.objectID);
                    work.title = obj.title;
                    work.artist = obj.artistDisplayName;
                    work.year = obj.objectDate;
                    work.medium = obj.medium;
                    break;
                  }
                } catch {
                  // skip
                }
              }
            } catch {
              // search failed
            }
          }
        }

        // Ensure unique ID even without Met data
        const id = metObjectID
          ? `met-${metObjectID}`
          : `gen-${chapterIdx}-${workIdx}`;

        const swatches = ["#8B7355", "#4A5568", "#A89B8C", "#2B6CB0"];
        const colorSwatch = swatches[chapterIdx % swatches.length];

        works.push({
          id,
          metObjectID: metObjectID || 0,
          title: work.title,
          artist: work.artist,
          year: work.year,
          medium: work.medium,
          location: location || "Location unknown",
          imageUrl: imageUrl || "",
          imageLarge: imageLarge || "",
          metUrl: metUrl || "",
          wikidataUrl,
          artistWikidataUrl,
          colorSwatch,
          visualDevice: work.visualDevice,
          isPublicDomain,
          tags,
          wikipediaUrl: !imageUrl && work.wikipediaUrl ? work.wikipediaUrl : undefined,
        });
      }

      chapters.push({
        number: chapterIdx + 1,
        era: chapter.era,
        headline: chapter.headline,
        summary: chapter.summary,
        detail: chapter.detail,
        works,
        references: works
          .filter((w) => w.metUrl)
          .map((w, i) => ({
            num: i + 1,
            text: `Metropolitan Museum of Art. "${w.title}." Object ID ${w.metObjectID}.`,
            url: w.metUrl,
            type: "met" as const,
          })),
      });
    }

    const slug = query
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const theme = {
      slug,
      name: generated.name,
      narrativeArc: generated.narrativeArc,
      centuryRange: generated.centuryRange,
      artworkCount: chapters.reduce((sum, ch) => sum + ch.works.length, 0),
      chapters,
      contrasts: [],
    };

    return Response.json(theme);
  } catch (error) {
    console.error("Theme generation failed:", error);
    return Response.json(
      { error: "Failed to generate theme. Please try again." },
      { status: 500 }
    );
  }
}
