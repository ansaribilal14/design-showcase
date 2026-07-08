import { NextRequest, NextResponse } from "next/server";
import designsData from "@/data/designs.json";

const designs = designsData.designs;

function isLightColor(hex: string): boolean {
  const c = hex.replace("#", "");
  const r = parseInt(c.substr(0, 2), 16);
  const g = parseInt(c.substr(2, 2), 16);
  const b = parseInt(c.substr(4, 2), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 140;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const design = designs.find((d: { slug: string }) => d.slug === slug);

  if (!design) {
    return new NextResponse("Not found", { status: 404 });
  }

  const t = design.tokens;
  const isDark = !isLightColor(t.bg);
  const textColor = isDark ? "#F5F5F5" : "#171717";
  const mutedColor = isDark ? "#A3A3A3" : "#737373";
  const surfaceColor = isDark ? (t.surfaceDark || "rgba(255,255,255,0.05)") : (t.surface || "#F5F5F5");
  const primaryColor = t.primary;
  const accentColor = t.accent;
  const headingFont = t.headingFont.split(",")[0].replace(/'/g, "").trim();
  const bodyFont = t.font.split(",")[0].replace(/'/g, "").trim();
  const radius = t.radius;
  const borderStroke = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)";
  const btnText = isLightColor(primaryColor) ? "#111" : "#FFF";

  const svg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${primaryColor};stop-opacity:0.15" />
      <stop offset="100%" style="stop-color:${accentColor};stop-opacity:0.08" />
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="${t.bg}" />
  <rect width="1200" height="630" fill="url(#accentGrad)" />
  <circle cx="1050" cy="100" r="200" fill="${primaryColor}" opacity="0.06" />
  <circle cx="150" cy="530" r="150" fill="${accentColor}" opacity="0.05" />

  <g transform="translate(80, 80)">
    <rect x="0" y="0" width="180" height="32" rx="16" fill="${surfaceColor}" />
    <text x="90" y="21" text-anchor="middle" font-family="${bodyFont}, Inter, sans-serif" font-size="13" font-weight="500" fill="${mutedColor}">${design.category}</text>
    <text x="0" y="90" font-family="${headingFont}, Inter, sans-serif" font-size="56" font-weight="700" fill="${textColor}">${design.name}</text>
    <rect x="0" y="115" width="80" height="26" rx="${radius}" fill="${primaryColor}" />
    <text x="40" y="133" text-anchor="middle" font-family="${bodyFont}, Inter, sans-serif" font-size="12" font-weight="600" fill="${btnText}">${design.style}</text>
    <text x="0" y="185" font-family="${bodyFont}, Inter, sans-serif" font-size="18" fill="${mutedColor}">${design.vibe.length > 80 ? design.vibe.substring(0, 80) + "..." : design.vibe}</text>

    <g transform="translate(0, 230)">
      <rect x="0" y="0" width="56" height="56" rx="12" fill="${t.bg}" stroke="${borderStroke}" stroke-width="1" />
      <rect x="68" y="0" width="56" height="56" rx="12" fill="${t.surface}" stroke="${borderStroke}" stroke-width="1" />
      <rect x="136" y="0" width="56" height="56" rx="12" fill="${t.primary}" />
      <rect x="204" y="0" width="56" height="56" rx="12" fill="${t.accent}" />
      <rect x="272" y="0" width="56" height="56" rx="12" fill="${t.muted}" stroke="${borderStroke}" stroke-width="1" />
      <g transform="translate(0, 80)">
        <rect x="0" y="0" width="140" height="38" rx="${radius}" fill="${primaryColor}" />
        <text x="70" y="24" text-anchor="middle" font-family="${bodyFont}, Inter, sans-serif" font-size="13" font-weight="600" fill="${btnText}">Primary Action</text>
        <rect x="155" y="0" width="120" height="38" rx="${radius}" fill="transparent" stroke="${borderStroke}" stroke-width="1.5" />
        <text x="215" y="24" text-anchor="middle" font-family="${bodyFont}, Inter, sans-serif" font-size="13" font-weight="500" fill="${textColor}">Secondary</text>
      </g>
    </g>
    <text x="0" y="420" font-family="${bodyFont}, Inter, sans-serif" font-size="14" fill="${mutedColor}">Claude Design Compatible  ·  DESIGN.md  ·  68 Design Systems</text>
  </g>

  <g transform="translate(720, 80)">
    <rect x="0" y="0" width="410" height="470" rx="12" fill="${surfaceColor}" stroke="${borderStroke}" stroke-width="1" />
    <circle cx="20" cy="18" r="5" fill="#FF5F57" />
    <circle cx="36" cy="18" r="5" fill="#FEBC2E" />
    <circle cx="52" cy="18" r="5" fill="#28C840" />
    <rect x="70" y="10" width="320" height="16" rx="8" fill="${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'}" />
    <rect x="20" y="45" width="370" height="30" rx="6" fill="${isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'}" />
    <circle cx="38" cy="60" r="6" fill="${primaryColor}" />
    <rect x="52" y="55" width="80" height="5" rx="2.5" fill="${textColor}" opacity="0.4" />
    <rect x="260" y="56" width="40" height="4" rx="2" fill="${mutedColor}" opacity="0.5" />
    <rect x="310" y="56" width="40" height="4" rx="2" fill="${mutedColor}" opacity="0.5" />
    <text x="20" y="110" font-family="${headingFont}, Inter, sans-serif" font-size="22" font-weight="700" fill="${textColor}">Build something</text>
    <text x="20" y="140" font-family="${headingFont}, Inter, sans-serif" font-size="22" font-weight="700" fill="${textColor}">amazing today</text>
    <rect x="20" y="155" width="200" height="4" rx="2" fill="${textColor}" opacity="0.2" />
    <rect x="20" y="168" width="160" height="4" rx="2" fill="${textColor}" opacity="0.12" />
    <rect x="20" y="190" width="110" height="30" rx="${radius}" fill="${primaryColor}" />
    <text x="75" y="210" text-anchor="middle" font-family="${bodyFont}, Inter, sans-serif" font-size="11" font-weight="600" fill="${btnText}">Get Started</text>
    <rect x="140" y="190" width="90" height="30" rx="${radius}" fill="transparent" stroke="${borderStroke}" stroke-width="1" />
    <text x="185" y="210" text-anchor="middle" font-family="${bodyFont}, Inter, sans-serif" font-size="11" font-weight="500" fill="${textColor}">Learn More</text>

    <g transform="translate(20, 245)">
      <rect x="0" y="0" width="115" height="90" rx="8" fill="${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)'}" stroke="${borderStroke}" />
      <rect x="0" y="0" width="115" height="35" rx="8" fill="${primaryColor}" opacity="0.15" />
      <rect x="12" y="50" width="90" height="5" rx="2.5" fill="${textColor}" opacity="0.25" />
      <rect x="12" y="64" width="60" height="4" rx="2" fill="${mutedColor}" opacity="0.4" />
      <rect x="128" y="0" width="115" height="90" rx="8" fill="${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)'}" stroke="${borderStroke}" />
      <rect x="128" y="0" width="115" height="35" rx="8" fill="${accentColor}" opacity="0.15" />
      <rect x="140" y="50" width="90" height="5" rx="2.5" fill="${textColor}" opacity="0.25" />
      <rect x="140" y="64" width="60" height="4" rx="2" fill="${mutedColor}" opacity="0.4" />
      <rect x="256" y="0" width="115" height="90" rx="8" fill="${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)'}" stroke="${borderStroke}" />
      <rect x="256" y="0" width="115" height="35" rx="8" fill="${primaryColor}" opacity="0.1" />
      <rect x="268" y="50" width="90" height="5" rx="2.5" fill="${textColor}" opacity="0.25" />
      <rect x="268" y="64" width="60" height="4" rx="2" fill="${mutedColor}" opacity="0.4" />
    </g>
    <g transform="translate(20, 360)">
      <rect x="0" y="0" width="115" height="55" rx="8" fill="${isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'}" />
      <text x="58" y="28" text-anchor="middle" font-family="${bodyFont}, Inter, sans-serif" font-size="18" font-weight="700" fill="${textColor}">99.9%</text>
      <text x="58" y="45" text-anchor="middle" font-family="${bodyFont}, Inter, sans-serif" font-size="10" fill="${mutedColor}">Uptime</text>
      <rect x="128" y="0" width="115" height="55" rx="8" fill="${isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'}" />
      <text x="186" y="28" text-anchor="middle" font-family="${bodyFont}, Inter, sans-serif" font-size="18" font-weight="700" fill="${textColor}">50ms</text>
      <text x="186" y="45" text-anchor="middle" font-family="${bodyFont}, Inter, sans-serif" font-size="10" fill="${mutedColor}">Latency</text>
      <rect x="256" y="0" width="115" height="55" rx="8" fill="${isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'}" />
      <text x="314" y="28" text-anchor="middle" font-family="${bodyFont}, Inter, sans-serif" font-size="18" font-weight="700" fill="${primaryColor}">10K+</text>
      <text x="314" y="45" text-anchor="middle" font-family="${bodyFont}, Inter, sans-serif" font-size="10" fill="${mutedColor}">Users</text>
    </g>
    <rect x="20" y="435" width="370" height="1" fill="${borderStroke}" />
  </g>

  <rect x="0" y="590" width="1200" height="40" fill="${isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.02)'}" />
  <text x="80" y="615" font-family="Inter, sans-serif" font-size="13" fill="${mutedColor}">Design Showcase  ·  awesome-claude-design  ·  getdesign.md</text>
  <text x="1120" y="615" text-anchor="end" font-family="Inter, sans-serif" font-size="13" fill="${mutedColor}">design-showcase</text>
</svg>`;

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}