"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import type { Design, DesignsData } from "@/lib/designs";

/* ─── TopNav ─── */
function TopNav({
  darkMode,
  setDarkMode,
  searchQuery,
  setSearchQuery,
  setShowDetail,
  setShowSubmitModal,
}: {
  darkMode: boolean;
  setDarkMode: (v: boolean) => void;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  setShowDetail: (v: boolean) => void;
  setShowSubmitModal: (v: boolean) => void;
}) {
  return (
    <header className="astryx-topnav">
      <div className="astryx-container flex items-center justify-between h-16">
        {/* Left: Logo */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-foreground">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
          <span className="font-semibold text-foreground text-base tracking-tight hidden sm:inline">Design Showcase</span>
        </div>

        {/* Center: Search */}
        <div className="flex-1 max-w-md mx-4 lg:mx-8">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">⌕</span>
            <input
              type="text"
              className="astryx-input pl-9"
              placeholder="Search designs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="astryx-button px-3"
            title="Toggle dark mode"
          >
            {darkMode ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" />
                <path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" />
                <path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
              </svg>
            )}
          </button>
          <button onClick={() => setShowSubmitModal(true)} className="astryx-button astryx-button-primary">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14" /><path d="M5 12h14" />
            </svg>
            <span className="hidden sm:inline">Submit design</span>
          </button>
        </div>
      </div>
    </header>
  );
}

/* ─── SideNav ─── */
function SideNav({
  categories,
  selectedCategory,
  setSelectedCategory,
  selectedStyle,
  setSelectedStyle,
}: {
  categories: Record<string, number>;
  selectedCategory: string;
  setSelectedCategory: (v: string) => void;
  selectedStyle: string | null;
  setSelectedStyle: (v: string | null) => void;
}) {
  return (
    <aside className="hidden lg:block w-60 flex-shrink-0 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto sidebar-scroll border-r border-border bg-background p-4">
      {/* Categories */}
      <div className="mb-6">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 px-1">Categories</h3>
        <div className="space-y-0.5">
          <button
            onClick={() => setSelectedCategory("All")}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between transition-colors ${
              selectedCategory === "All"
                ? "bg-secondary text-foreground font-medium"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
            }`}
          >
            <span>All</span>
            <span className="text-xs opacity-60">{Object.values(categories).reduce((a, b) => a + b, 0)}</span>
          </button>
          {Object.entries(categories).map(([cat, count]) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between transition-colors ${
                selectedCategory === cat
                  ? "bg-secondary text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}
            >
              <span className="truncate">{cat}</span>
              <span className="text-xs opacity-60 flex-shrink-0 ml-2">{count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Style Filter */}
      <div className="mb-6">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 px-1">Style</h3>
        <div className="flex flex-wrap gap-1.5">
          {["Minimal", "Dark", "Colorful", "Editorial"].map((style) => (
            <button
              key={style}
              onClick={() => setSelectedStyle(selectedStyle === style ? null : style)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
                selectedStyle === style
                  ? "bg-foreground text-background border-foreground"
                  : "bg-card text-muted-foreground border-border hover:border-foreground/30"
              }`}
            >
              {style}
            </button>
          ))}
        </div>
      </div>

      {/* Reset */}
      {(selectedCategory !== "All" || selectedStyle) && (
        <button
          onClick={() => {
            setSelectedCategory("All");
            setSelectedStyle(null);
          }}
          className="astryx-button w-full text-sm justify-center text-muted-foreground"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
          Reset filters
        </button>
      )}
    </aside>
  );
}

/* ─── Hero Card ─── */
function HeroCard({ onExplore, onRandom }: { onExplore: () => void; onRandom: () => void }) {
  return (
    <div className="astryx-card p-6 sm:p-8 mb-6">
      <div className="max-w-2xl">
        <div className="flex items-center gap-2 mb-3">
          <span className="astryx-badge">Claude Design Compatible</span>
          <span className="astryx-badge">Open Source</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight mb-3">
          Browse 68 production-ready design systems
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-5">
          Each DESIGN.md scaffolds a full UI in Claude Design — colors, type, components, and a working UI kit from a single markdown file. Pick a vibe, drop it in, and ship.
        </p>
        <div className="flex flex-wrap gap-3">
          <button onClick={onExplore} className="astryx-button astryx-button-primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
            </svg>
            Explore
          </button>
          <button onClick={onRandom} className="astryx-button">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.1-8.6c.7-1.1 2-1.7 3.3-1.7H22" />
              <path d="m18 2 4 4-4 4" /><path d="M2 6h1.9c1.5 0 2.9.9 3.6 2.2" />
              <path d="M22 18h-5.9c-1.3 0-2.6-.7-3.3-1.8l-.5-.8" />
              <path d="m18 14 4 4-4 4" />
            </svg>
            Random design
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Stats Row ─── */
function StatsRow({ total, categories, designs }: { total: number; categories: Record<string, number>; designs: Design[] }) {
  const darkCount = designs.filter((d) => d.style === "Dark").length;
  const stats = [
    { value: `${total}`, label: "Designs" },
    { value: `${Object.keys(categories).length}`, label: "Categories" },
    { value: "9-section", label: "Schema" },
    { value: "MIT", label: "Licensed" },
  ];
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
      {stats.map((s) => (
        <div key={s.label} className="astryx-card p-4 text-center">
          <div className="text-xl sm:text-2xl font-bold text-foreground">{s.value}</div>
          <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
        </div>
      ))}
    </div>
  );
}

/* ─── Filter Toolbar ─── */
function FilterToolbar({
  categories,
  activeCategory,
  setActiveCategory,
}: {
  categories: string[];
  activeCategory: string;
  setActiveCategory: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none" style={{ scrollbarWidth: "none" }}>
      <button
        onClick={() => setActiveCategory("All")}
        className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
          activeCategory === "All"
            ? "bg-foreground text-background"
            : "bg-card text-muted-foreground border border-border hover:border-foreground/30"
        }`}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => setActiveCategory(cat)}
          className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
            activeCategory === cat
              ? "bg-foreground text-background"
              : "bg-card text-muted-foreground border border-border hover:border-foreground/30"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}

/* ─── Design Preview Strip ─── */
function DesignPreviewStrip({ tokens, darkMode }: { tokens: Design["tokens"]; darkMode: boolean }) {
  const bg = darkMode ? tokens.bgDark : tokens.bg;
  const surface = darkMode ? tokens.surfaceDark : tokens.surface;
  const primary = darkMode ? tokens.primaryDark : tokens.primary;
  const text = darkMode ? tokens.textDark : tokens.text;
  const muted = darkMode ? tokens.mutedDark : tokens.muted;
  const border = darkMode ? tokens.borderDark : tokens.border;
  const font = tokens.font.split(",")[0].replace(/'/g, "").trim();

  return (
    <div
      className="design-preview-strip rounded-t-xl p-4 relative"
      style={{
        background: bg,
        fontFamily: font,
        transition: "transform 0.2s ease",
      }}
    >
      {/* Mini layout preview */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2.5 h-2.5 rounded-full" style={{ background: primary }} />
        <div className="h-3 rounded-sm" style={{ background: text, width: "60px", opacity: 0.7 }} />
        <div className="flex-1" />
        <div className="h-2 rounded-full" style={{ background: muted, width: "40px" }} />
      </div>

      {/* Heading line */}
      <div className="mb-3">
        <div
          className="text-lg font-bold leading-tight"
          style={{ color: text, fontFamily: tokens.headingFont.split(",")[0].replace(/'/g, "") }}
        >
          The Quick Brown Fox
        </div>
      </div>

      {/* Sample UI elements */}
      <div className="flex items-center gap-2 mb-3">
        <div
          className="px-3 py-1.5 rounded-md text-xs font-medium"
          style={{
            background: primary,
            color: bg === "#000000" || bg === "#0A0A0A" || bg === "#050505" || bg === "#121212" || bg === "#0C0C0C" || bg === "#0D0D0D" || bg === "#0B0E11" || bg === "#0A0A1A" || bg === "#0B0C0E" || bg === "#000000" ? "#FFFFFF" : (bg === "#FFFFFF" || bg === "#FEFEFE" || bg === "#FAFAFA" || bg === "#FDF8F4" || bg === "#FAF9F7" || bg === "#FAF8F5" ? (isLightColor(primary) ? "#111111" : "#FFFFFF") : "#FFFFFF"),
            borderRadius: tokens.radius,
          }}
        >
          Primary Action
        </div>
        <div
          className="px-3 py-1.5 rounded-md text-xs font-medium"
          style={{
            background: "transparent",
            color: text,
            border: `1px solid ${border}`,
            borderRadius: tokens.radius,
          }}
        >
          Secondary
        </div>
      </div>

      {/* Color dots */}
      <div className="flex items-center gap-1.5">
        {[primary, surface, muted, border].map((color, i) => (
          <div
            key={i}
            className="w-4 h-4 rounded-full border"
            style={{ background: color, borderColor: border }}
          />
        ))}
      </div>
    </div>
  );
}

function isLightColor(hex: string): boolean {
  const c = hex.replace("#", "");
  const r = parseInt(c.substr(0, 2), 16);
  const g = parseInt(c.substr(2, 2), 16);
  const b = parseInt(c.substr(4, 2), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 150;
}

/* ─── Design Card ─── */
function DesignCard({
  design,
  darkMode,
}: {
  design: Design;
  darkMode: boolean;
  onSelect?: (d: Design) => void;
}) {
  return (
    <a
      href={`/design/${design.slug}`}
      className="astryx-card overflow-hidden cursor-pointer group block"
    >
      {/* Preview strip */}
      <div className="design-preview-strip relative" style={{ transform: "scale(1)", transition: "transform 0.2s ease" }}>
        <div
          onMouseEnter={(e) => { (e.currentTarget.parentElement as HTMLElement).style.transform = "scale(1.02)"; }}
          onMouseLeave={(e) => { (e.currentTarget.parentElement as HTMLElement).style.transform = "scale(1)"; }}
          className="rounded-t-xl"
        >
          <DesignPreviewStrip tokens={design.tokens} darkMode={darkMode} />
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3 className="font-semibold text-foreground text-sm">{design.name}</h3>
          <a
            href={design.designMdUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors"
            title="View on getdesign.md"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed mb-3 line-clamp-2">
          {design.vibe.split(". ")[1] || design.vibe}
        </p>
        <div className="flex items-center justify-between">
          <span className="astryx-badge text-[11px]">{design.category}</span>
          <span className="text-[11px] text-muted-foreground">{design.style}</span>
        </div>
      </div>
    </a>
  );
}

/* ─── Design Detail Panel ─── */
function DesignDetailPanel({
  design,
  darkMode,
  onClose,
}: {
  design: Design;
  darkMode: boolean;
  onClose: () => void;
}) {
  const [activeTab, setActiveTab] = useState<"preview" | "tokens" | "download">("preview");
  const t = design.tokens;

  const colorEntries = [
    { label: "Background", light: t.bg, dark: t.bgDark },
    { label: "Surface", light: t.surface, dark: t.surfaceDark },
    { label: "Primary", light: t.primary, dark: t.primaryDark },
    { label: "Text", light: t.text, dark: t.textDark },
    { label: "Muted", light: t.muted, dark: t.mutedDark },
    { label: "Border", light: t.border, dark: t.borderDark },
    { label: "Accent", light: t.accent, dark: t.accent },
  ];

  return (
    <div className="fixed inset-0 z-50" onClick={onClose}>
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 detail-overlay-enter" />
      {/* Panel */}
      <div
        className="absolute right-0 top-0 bottom-0 w-full max-w-2xl bg-background border-l border-border overflow-y-auto detail-panel-enter"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border p-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-foreground">{design.name}</h2>
            <p className="text-xs text-muted-foreground">{design.category} · {design.style}</p>
          </div>
          <div className="flex items-center gap-2">
            <a href={design.designMdUrl} target="_blank" rel="noopener noreferrer" className="astryx-button astryx-button-primary text-xs">
              Open in Claude Design
            </a>
            <button onClick={onClose} className="astryx-button px-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18" /><path d="m6 6 12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="sticky top-[73px] z-10 bg-background/95 backdrop-blur-sm border-b border-border px-4 flex gap-1">
          {(["preview", "tokens", "download"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-medium capitalize transition-colors border-b-2 ${
                activeTab === tab
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="p-4 sm:p-6">
          {activeTab === "preview" && (
            <div>
              {/* Full live preview */}
              <div className="mb-6">
                <DesignPreviewStrip tokens={design.tokens} darkMode={darkMode} />
              </div>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <h3 className="text-base font-semibold text-foreground mb-2">About this design</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{design.description}</p>
                <h3 className="text-base font-semibold text-foreground mt-6 mb-2">Vibe</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{design.vibe}</p>
              </div>
            </div>
          )}

          {activeTab === "tokens" && (
            <div>
              <h3 className="text-base font-semibold text-foreground mb-4">Color Palette</h3>
              <div className="space-y-3 mb-8">
                {colorEntries.map(({ label, light, dark }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className="color-swatch" style={{ background: darkMode ? dark : light }} />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-foreground">{label}</div>
                      <div className="text-xs text-muted-foreground font-mono">{darkMode ? dark : light}</div>
                    </div>
                  </div>
                ))}
              </div>

              <h3 className="text-base font-semibold text-foreground mb-4">Typography</h3>
              <div className="space-y-3 mb-8">
                {[
                  { label: "Body Font", value: t.font },
                  { label: "Heading Font", value: t.headingFont },
                  { label: "Code Font", value: t.codeFont },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{label}</span>
                    <span className="text-sm font-medium text-foreground font-mono">{value}</span>
                  </div>
                ))}
              </div>

              <h3 className="text-base font-semibold text-foreground mb-4">Radius</h3>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-muted border border-border" style={{ borderRadius: t.radius }} />
                <span className="text-sm font-mono text-foreground">{t.radius}</span>
              </div>
            </div>
          )}

          {activeTab === "download" && (
            <div>
              <h3 className="text-base font-semibold text-foreground mb-3">Get DESIGN.md</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Use the npx CLI to download the DESIGN.md file directly into your project:
              </p>
              <div className="bg-muted rounded-lg p-4 mb-4 flex items-center justify-between gap-3">
                <code className="text-sm font-mono text-foreground overflow-x-auto">
                  npx getdesign@latest add {design.slug}
                </code>
                <button
                  onClick={() => navigator.clipboard.writeText(`npx getdesign@latest add ${design.slug}`)}
                  className="astryx-button px-2 flex-shrink-0 text-xs"
                >
                  Copy
                </button>
              </div>

              <a
                href={design.designMdUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="astryx-button w-full justify-center mb-4"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                View on getdesign.md
              </a>

              <div className="bg-muted/50 rounded-lg p-4 border border-border">
                <div className="flex items-start gap-2">
                  <span className="text-xs text-muted-foreground">✦</span>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Independent analysis of publicly observable patterns, curated as a starting point for inspiration.
                    Not affiliated with or endorsed by {design.name}; trademarks belong to their respective owners.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Submit Modal ─── */
function SubmitModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 detail-overlay-enter" />
      <div
        className="relative bg-background border border-border rounded-2xl p-6 max-w-md w-full detail-panel-enter"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-foreground">Submit a Design</h2>
          <button onClick={onClose} className="astryx-button px-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18" /><path d="m6 6 12 12" />
            </svg>
          </button>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Want to add a new design system to the collection? Open a PR on the{" "}
          <a href="https://github.com/VoltAgent/awesome-claude-design" target="_blank" rel="noopener noreferrer" className="underline">
            awesome-claude-design
          </a>{" "}
          repository on GitHub.
        </p>
        <a
          href="https://github.com/VoltAgent/awesome-claude-design"
          target="_blank"
          rel="noopener noreferrer"
          className="astryx-button astryx-button-primary w-full justify-center"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
          Open GitHub
        </a>
      </div>
    </div>
  );
}

/* ─── Footer ─── */
function Footer() {
  return (
    <footer className="border-t border-border mt-12 py-8 px-4">
      <div className="astryx-container">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs text-muted-foreground leading-relaxed mb-4">
            The DESIGN.md files linked from this collection are <strong>curated starting points inspired by publicly
            observable design patterns</strong> on the referenced websites. They are not official design systems and are
            not affiliated with, endorsed by, or sponsored by the companies named. All trademarks, brand names, logos,
            and proprietary typefaces belong to their respective owners, and this showcase makes no claim of ownership
            over any brand&apos;s visual identity.
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            These documents exist for educational and development purposes — to give AI agents like Claude Design enough
            structured context to generate consistent UI. Users are responsible for ensuring their own downstream usage
            complies with the trademark, copyright, and brand-usage policies of the originating companies.
          </p>
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
            <span className="text-xs text-muted-foreground">
              Data source:{" "}
              <a
                href="https://github.com/VoltAgent/awesome-claude-design"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-foreground transition-colors"
              >
                VoltAgent/awesome-claude-design
              </a>
            </span>
            <span className="text-xs text-muted-foreground">MIT Licensed</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════ */
export default function HomePage() {
  const [data, setData] = useState<DesignsData | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [selectedDesign, setSelectedDesign] = useState<Design | null>(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  useEffect(() => {
    fetch("/data/designs.json")
      .then((r) => r.json())
      .then(setData);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const filteredDesigns = useMemo(() => {
    if (!data) return [];
    return data.designs.filter((d) => {
      if (selectedCategory !== "All" && d.category !== selectedCategory) return false;
      if (selectedStyle && d.style !== selectedStyle) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          d.name.toLowerCase().includes(q) ||
          d.vibe.toLowerCase().includes(q) ||
          d.category.toLowerCase().includes(q) ||
          d.style.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [data, selectedCategory, selectedStyle, searchQuery]);

  const handleExplore = useCallback(() => {
    const grid = document.getElementById("design-grid");
    if (grid) grid.scrollIntoView({ behavior: "smooth" });
  }, []);

  const handleRandom = useCallback(() => {
    if (!data) return;
    const random = data.designs[Math.floor(Math.random() * data.designs.length)];
    setSelectedDesign(random);
  }, [data]);

  const categoryList = useMemo(() => (data ? Object.keys(data.meta.categories) : []), [data]);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground text-sm">Loading designs...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <TopNav
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setShowDetail={() => {}}
        setShowSubmitModal={setShowSubmitModal}
      />

      <div className="flex flex-1">
        <SideNav
          categories={data.meta.categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedStyle={selectedStyle}
          setSelectedStyle={setSelectedStyle}
        />

        <main className="flex-1 min-w-0">
          <div className="astryx-container py-6">
            <HeroCard onExplore={handleExplore} onRandom={handleRandom} />
            <StatsRow total={data.meta.total} categories={data.meta.categories} designs={data.designs} />
            <FilterToolbar
              categories={categoryList}
              activeCategory={selectedCategory}
              setActiveCategory={setSelectedCategory}
            />

            {/* Results count */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">
                Showing <span className="font-medium text-foreground">{filteredDesigns.length}</span> design{filteredDesigns.length !== 1 ? "s" : ""}
              </p>
            </div>

            {/* Grid */}
            <div id="design-grid" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredDesigns.map((design) => (
                <DesignCard
                  key={design.id}
                  design={design}
                  darkMode={darkMode}
                />
              ))}
            </div>

            {filteredDesigns.length === 0 && (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-sm">No designs match your filters.</p>
                <button
                  onClick={() => {
                    setSelectedCategory("All");
                    setSelectedStyle(null);
                    setSearchQuery("");
                  }}
                  className="astryx-button mt-3 text-sm"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>

          <Footer />
        </main>
      </div>

      {/* Detail Panel */}
      {selectedDesign && (
        <DesignDetailPanel
          design={selectedDesign}
          darkMode={darkMode}
          onClose={() => setSelectedDesign(null)}
        />
      )}

      {/* Submit Modal */}
      {showSubmitModal && <SubmitModal onClose={() => setShowSubmitModal(false)} />}
    </div>
  );
}