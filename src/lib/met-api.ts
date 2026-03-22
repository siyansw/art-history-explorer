const BASE_URL = "https://collectionapi.metmuseum.org/public/collection/v1";

export interface MetObject {
  objectID: number;
  title: string;
  artistDisplayName: string;
  artistDisplayBio: string;
  artistNationality: string;
  artistWikidata_URL: string;
  objectDate: string;
  objectBeginDate: number;
  objectEndDate: number;
  medium: string;
  dimensions: string;
  department: string;
  classification: string;
  culture: string;
  period: string;
  primaryImage: string;
  primaryImageSmall: string;
  additionalImages: string[];
  objectURL: string;
  objectWikidata_URL: string;
  isPublicDomain: boolean;
  isHighlight: boolean;
  GalleryNumber: string;
  creditLine: string;
  accessionNumber: string;
  tags: Array<{ term: string; AAT_URL: string; Wikidata_URL: string }> | null;
}

export interface MetSearchResult {
  total: number;
  objectIDs: number[] | null;
}

/**
 * Search the Met collection. Returns object IDs matching the query.
 */
export async function searchMet(
  query: string,
  options: {
    hasImages?: boolean;
    isHighlight?: boolean;
    departmentId?: number;
    artistOrCulture?: boolean;
    dateBegin?: number;
    dateEnd?: number;
  } = {}
): Promise<MetSearchResult> {
  const params = new URLSearchParams({ q: query });
  if (options.hasImages) params.set("hasImages", "true");
  if (options.isHighlight) params.set("isHighlight", "true");
  if (options.departmentId) params.set("departmentId", String(options.departmentId));
  if (options.artistOrCulture) params.set("artistOrCulture", "true");
  if (options.dateBegin !== undefined && options.dateEnd !== undefined) {
    params.set("dateBegin", String(options.dateBegin));
    params.set("dateEnd", String(options.dateEnd));
  }

  const res = await fetch(`${BASE_URL}/search?${params}`);
  if (!res.ok) throw new Error(`Met API search failed: ${res.status}`);
  return res.json();
}

/**
 * Fetch a single object by ID.
 */
export async function getMetObject(objectID: number): Promise<MetObject> {
  const res = await fetch(`${BASE_URL}/objects/${objectID}`);
  if (!res.ok) throw new Error(`Met API object fetch failed: ${res.status}`);
  return res.json();
}

/**
 * Build a Met collection page URL for a given object ID.
 */
export function metCollectionUrl(objectID: number): string {
  return `https://www.metmuseum.org/art/collection/search/${objectID}`;
}

/**
 * Build a Google Scholar search URL for an academic reference.
 */
export function scholarUrl(query: string): string {
  return `https://scholar.google.com/scholar?q=${encodeURIComponent(query)}`;
}
