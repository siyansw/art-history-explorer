export type ReferenceType = "met" | "wikidata" | "scholar";

export interface Reference {
  num: number;
  text: string;
  url: string;
  type: ReferenceType;
}

export interface Artwork {
  id: string;
  metObjectID: number; // Met Museum object ID
  title: string;
  artist: string;
  year: string; // using string to match Met's "ca. 1662" format
  medium: string;
  location: string; // "Gallery 614, The Met" or similar
  imageUrl: string; // primaryImageSmall from Met API
  imageLarge: string; // primaryImage from Met API
  metUrl: string; // link to Met collection page
  wikidataUrl: string; // artwork Wikidata entity
  artistWikidataUrl: string;
  colorSwatch: string;
  visualDevice: string;
  isPublicDomain: boolean;
  tags: string[];
  wikipediaUrl?: string; // fallback link for non-Met works
}

export interface Chapter {
  number: number;
  era: string;
  headline: string;
  summary: string;
  detail: string;
  works: Artwork[];
  references: Reference[];
}

export interface ContrastPair {
  workAId: string;
  workBId: string;
  tensionLabel: string;
  analysis: string;
  references: Reference[];
}

export interface Theme {
  slug: string;
  name: string;
  narrativeArc: string;
  centuryRange: string;
  artworkCount: number;
  chapters: Chapter[];
  contrasts: ContrastPair[];
}
