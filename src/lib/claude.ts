import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const SYSTEM_MESSAGE = `You are an art historian with the ability to explain complex ideas to curious non-specialists. Your writing is clear, specific, and emotionally intelligent. You always name concrete visual details — never vague descriptions. You explain how works relate to each other, not just what they depict individually.

IMPORTANT RULES:
- Never fabricate artwork metadata (title, artist, year, location). Only reference real artworks.
- Every piece of prose should name a tension or a turn — what changed and why it matters.
- Distinguish direct influence from retrospective influence where relevant.
- Prefer artworks from the Metropolitan Museum of Art's collection when possible.`;

export interface GeneratedChapter {
  era: string;
  headline: string;
  summary: string;
  detail: string;
  works: Array<{
    title: string;
    artist: string;
    year: string;
    medium: string;
    visualDevice: string;
    metObjectID?: number;
    wikipediaUrl?: string;
  }>;
}

export interface GeneratedTheme {
  name: string;
  narrativeArc: string;
  centuryRange: string;
  chapters: GeneratedChapter[];
}

export interface GeneratedContrast {
  tensionLabel: string;
  analysis: string;
}

export async function generateThemeArc(
  themeName: string
): Promise<GeneratedTheme> {
  const message = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4000,
    system: SYSTEM_MESSAGE,
    messages: [
      {
        role: "user",
        content: `Generate a narrative arc for the theme "${themeName}" in art history.

Return valid JSON with this exact structure:
{
  "name": "Theme Name",
  "narrativeArc": "One sentence describing the arc — must name a shift or tension",
  "centuryRange": "e.g. 15th – 20th century",
  "chapters": [
    {
      "era": "e.g. 17th Century",
      "headline": "Must name a specific turn or shift — not just a description",
      "summary": "One sentence summary",
      "detail": "Two paragraphs separated by \\n\\n. Intelligent but not academic. Use concrete visual descriptions. Avoid jargon.",
      "works": [
        {
          "title": "Exact artwork title",
          "artist": "Artist name",
          "year": "e.g. ca. 1662 or 1886",
          "medium": "e.g. Oil on canvas",
          "visualDevice": "One sentence: the specific formal choice that carries the emotional meaning",
          "metObjectID": null,
          "wikipediaUrl": "https://en.wikipedia.org/wiki/Artwork_Title_(painting) or null"
        }
      ]
    }
  ]
}

Requirements:
- Exactly 4 chapters, chronologically ordered
- Each chapter has exactly 2 works
- STRONGLY prefer works from the Met Museum collection. If you know a Met object ID, include it.
- If a work is NOT in the Met, set metObjectID to null and provide a Wikipedia URL for the artwork page
- Headlines must name a turn ("X becomes Y" or "From X to Y") — never just describe
- The detail paragraphs should explain what changed historically, not just describe artworks
- Return ONLY valid JSON, no markdown fences`,
      },
    ],
  });

  const text =
    message.content[0].type === "text" ? message.content[0].text : "";
  return JSON.parse(text);
}

export async function generateContrast(
  workA: { title: string; artist: string; year: string },
  workB: { title: string; artist: string; year: string },
  theme: string
): Promise<GeneratedContrast> {
  const message = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 500,
    system: SYSTEM_MESSAGE,
    messages: [
      {
        role: "user",
        content: `Compare these two artworks in the context of the theme "${theme}":

Artwork A: "${workA.title}" by ${workA.artist} (${workA.year})
Artwork B: "${workB.title}" by ${workB.artist} (${workB.year})

Return valid JSON:
{
  "tensionLabel": "X vs Y — a short label naming the core tension",
  "analysis": "2-3 sentences. First sentence names the tension as a vs. statement. Then explain what the difference reveals about how the theme evolved."
}

Return ONLY valid JSON, no markdown fences.`,
      },
    ],
  });

  const text =
    message.content[0].type === "text" ? message.content[0].text : "";
  return JSON.parse(text);
}
