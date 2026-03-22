import { NextRequest } from "next/server";
import { generateContrast } from "@/lib/claude";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { workA, workB, theme } = body;

    if (!workA || !workB || !theme) {
      return Response.json(
        { error: "Missing workA, workB, or theme" },
        { status: 400 }
      );
    }

    const contrast = await generateContrast(workA, workB, theme);

    return Response.json(contrast);
  } catch (error) {
    console.error("Contrast generation failed:", error);
    return Response.json(
      { error: "Failed to generate contrast. Please try again." },
      { status: 500 }
    );
  }
}
