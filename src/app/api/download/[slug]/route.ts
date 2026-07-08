import { NextRequest, NextResponse } from "next/server";
import designsData from "@/data/designs.json";

const designs = designsData.designs;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const design = designs.find((d: { slug: string }) => d.slug === slug);

  if (!design) {
    return NextResponse.json({ error: "Design not found" }, { status: 404 });
  }

  try {
    // Fetch the raw DESIGN.md from getdesign.md
    const rawUrl = `https://raw.githubusercontent.com/nicekid1/getdesign-md-files/main/designs/${slug}/DESIGN.md`;
    const response = await fetch(rawUrl, {
      next: { revalidate: 86400 }, // Cache for 24h
    });

    if (!response.ok) {
      // Fallback: fetch the preview page
      const previewUrl = design.designMdUrl;
      const fallbackResponse = await fetch(previewUrl);
      if (!fallbackResponse.ok) {
        return NextResponse.json(
          { error: "Failed to fetch DESIGN.md" },
          { status: 502 }
        );
      }
      const html = await fallbackResponse.text();
      // Extract text content from HTML
      const text = html
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
        .replace(/<[^>]+>/g, "\n")
        .replace(/\n{3,}/g, "\n\n")
        .trim();

      return new NextResponse(text, {
        headers: {
          "Content-Type": "text/markdown; charset=utf-8",
          "Content-Disposition": `attachment; filename="${slug}-DESIGN.md"`,
          "Cache-Control": "public, max-age=3600",
        },
      });
    }

    const content = await response.text();

    return new NextResponse(content, {
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Content-Disposition": `attachment; filename="${slug}-DESIGN.md"`,
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch DESIGN.md from upstream" },
      { status: 502 }
    );
  }
}