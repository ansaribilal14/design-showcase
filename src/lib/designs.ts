export interface DesignTokens {
  bg: string;
  bgDark: string;
  surface: string;
  surfaceDark: string;
  primary: string;
  primaryDark: string;
  text: string;
  textDark: string;
  muted: string;
  mutedDark: string;
  border: string;
  borderDark: string;
  accent: string;
  font: string;
  headingFont: string;
  codeFont: string;
  radius: string;
}

export interface Design {
  id: string;
  name: string;
  slug: string;
  category: string;
  style: string;
  vibe: string;
  description: string;
  designMdUrl: string;
  tokens: DesignTokens;
}

export interface DesignsData {
  meta: {
    total: number;
    categories: Record<string, number>;
    styles: string[];
  };
  designs: Design[];
}

export const CATEGORIES = [
  "AI & LLM Platforms",
  "Developer Tools & IDEs",
  "Backend & DevOps",
  "Productivity & SaaS",
  "Design & Creative Tools",
  "Fintech & Crypto",
  "E-commerce & Retail",
  "Media & Consumer Tech",
  "Automotive",
];

export const STYLES = ["Minimal", "Dark", "Colorful", "Editorial"];

export async function getDesignsData(): Promise<DesignsData> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/data/designs.json`, {
    cache: 'force-cache',
  });
  return res.json();
}