import type { Metadata } from "next";
import designsData from "@/data/designs.json";
import DesignDetailPageClient from "./client";

const designs = designsData.designs;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return designs.map((d: { slug: string }) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const design = designs.find((d: { slug: string }) => d.slug === slug);

  if (!design) {
    return { title: "Design Not Found" };
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";

  return {
    title: `${design.name} Design System — Design Showcase`,
    description: `${design.vibe}. A production-ready DESIGN.md that scaffolds a complete design system in Claude Design.`,
    openGraph: {
      title: `${design.name} Design System`,
      description: design.vibe,
      type: "article",
      images: [
        {
          url: `${baseUrl}/api/og/${design.slug}`,
          width: 1200,
          height: 630,
          alt: `${design.name} Design System Preview`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${design.name} Design System`,
      description: design.vibe,
      images: [`${baseUrl}/api/og/${design.slug}`],
    },
  };
}

export default async function DesignDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const design = designs.find((d: { slug: string }) => d.slug === slug);

  if (!design) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Design not found</h1>
          <p className="text-muted-foreground mb-4">
            The design &quot;{slug}&quot; does not exist in our collection.
          </p>
          <a href="/" className="astryx-button astryx-button-primary">
            Back to Showcase
          </a>
        </div>
      </div>
    );
  }

  return <DesignDetailPageClient design={JSON.parse(JSON.stringify(design))} />;
}