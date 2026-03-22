export interface ThemePreview {
  slug: string;
  name: string;
  narrativeArc: string;
  centuryRange: string;
  artworkCount: number;
  available: boolean; // true if data exists (Phase 1: only loneliness)
  anchorArtists: string[];
}

export const curatedThemes: ThemePreview[] = [
  {
    slug: "loneliness",
    name: "Loneliness",
    narrativeArc:
      "From the private room to the crowded street — isolation moves outward",
    centuryRange: "17th – 20th century",
    artworkCount: 8,
    available: true,
    anchorArtists: ["Vermeer", "Friedrich", "Rembrandt", "Degas", "Seurat", "Homer", "Cézanne"],
  },
  {
    slug: "light-and-shadow",
    name: "Light & Shadow",
    narrativeArc:
      "Light as revelation, then atmosphere, then abstraction",
    centuryRange: "16th – 20th century",
    artworkCount: 10,
    available: false,
    anchorArtists: ["Caravaggio", "Vermeer", "Monet", "Van Gogh", "Rothko"],
  },
  {
    slug: "power",
    name: "Power",
    narrativeArc:
      "From divine right to corporate satire — power and its discontents",
    centuryRange: "16th – 20th century",
    artworkCount: 10,
    available: false,
    anchorArtists: ["Raphael", "Goya", "Picasso", "Warhol", "Kruger"],
  },
  {
    slug: "the-sublime",
    name: "The Sublime",
    narrativeArc:
      "Awe as spiritual experience, then terror, then numbness",
    centuryRange: "17th – 20th century",
    artworkCount: 8,
    available: false,
    anchorArtists: ["Claude Lorrain", "Friedrich", "Turner", "Newman"],
  },
  {
    slug: "motherhood",
    name: "Motherhood",
    narrativeArc: "The sacred, the domestic, the political",
    centuryRange: "16th – 20th century",
    artworkCount: 8,
    available: false,
    anchorArtists: ["Raphael", "Cassatt", "Kollwitz", "Kara Walker"],
  },
  {
    slug: "mortality",
    name: "Mortality",
    narrativeArc: "Vanitas, heroic death, and modern absence",
    centuryRange: "16th – 21st century",
    artworkCount: 10,
    available: false,
    anchorArtists: ["Holbein", "Rembrandt", "Rodin", "Magritte", "Hirst"],
  },
];
