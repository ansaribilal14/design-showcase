"use client";

import { useState, useMemo } from "react";
import type { Design } from "@/lib/designs";

function isLightColor(hex: string): boolean {
  const c = hex.replace("#", "");
  if (c.length !== 6) return true;
  const r = parseInt(c.substr(0, 2), 16);
  const g = parseInt(c.substr(2, 2), 16);
  const b = parseInt(c.substr(4, 2), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 140;
}

export default function DesignDetailPageClient({
  design,
}: {
  design: Design;
}) {
  const [activeTab, setActiveTab] = useState<"preview" | "tokens" | "designMd" | "download">("preview");
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeError, setIframeError] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const t = design.tokens;

  const colorEntries = useMemo(
    () => [
      { label: "Background", light: t.bg, dark: t.bgDark },
      { label: "Surface", light: t.surface, dark: t.surfaceDark },
      { label: "Primary", light: t.primary, dark: t.primaryDark },
      { label: "Text", light: t.text, dark: t.textDark },
      { label: "Muted", light: t.muted, dark: t.mutedDark },
      { label: "Border", light: t.border, dark: t.borderDark },
      { label: "Accent", light: t.accent, dark: t.accent },
    ],
    [t]
  );

  const previewUrl = design.designMdUrl;
  const downloadUrl = `/api/download/${design.slug}`;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Nav */}
      <header className="astryx-topnav">
        <div className="astryx-container flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6" />
              </svg>
              <span className="text-sm hidden sm:inline">Back to Showcase</span>
            </a>
            <div className="w-px h-5 bg-border mx-1" />
            <span className="font-semibold text-foreground text-sm">{design.name}</span>
            <span className="astryx-badge text-[11px]">{design.style}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="astryx-button px-2.5"
              title="Toggle dark mode"
            >
              {darkMode ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" />
                  <path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" />
                  <path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                </svg>
              )}
            </button>
            <a href={previewUrl} target="_blank" rel="noopener noreferrer" className="astryx-button astryx-button-primary text-sm">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              Open in Claude Design
            </a>
          </div>
        </div>
      </header>

      {/* Main content: iframe left, panel right */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Iframe Preview (left) */}
        <div className="flex-1 min-w-0 border-r border-border flex flex-col">
          <div className="px-4 py-2.5 border-b border-border flex items-center justify-between bg-background/50">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
              </div>
              <span className="text-xs text-muted-foreground font-mono ml-2 truncate max-w-xs">
                getdesign.md/{design.slug}
              </span>
            </div>
            <a
              href={previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              Open externally
            </a>
          </div>

          {!iframeError ? (
            <div className="flex-1 relative bg-muted/20">
              {!iframeLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
                    <span className="text-sm text-muted-foreground">Loading preview...</span>
                  </div>
                </div>
              )}
              <iframe
                src={previewUrl}
                className="w-full h-full min-h-[400px] lg:min-h-0 border-0"
                onLoad={() => setIframeLoaded(true)}
                onError={() => setIframeError(true)}
                title={`${design.name} design preview`}
                sandbox="allow-same-origin"
                loading="lazy"
              />
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center max-w-sm">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-2">Preview unavailable</h3>
                <p className="text-xs text-muted-foreground mb-4">
                  The preview couldn&apos;t be loaded in an iframe due to security restrictions.
                </p>
                <a
                  href={previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="astryx-button astryx-button-primary text-sm"
                >
                  Open on getdesign.md
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel */}
        <div className="w-full lg:w-[420px] flex-shrink-0 flex flex-col bg-background border-t lg:border-t-0 border-border">
          {/* Tabs */}
          <div className="flex border-b border-border px-2">
            {(["preview", "tokens", "designMd", "download"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 capitalize ${
                  activeTab === tab
                    ? "border-foreground text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab === "designMd" ? "DESIGN.md" : tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto sidebar-scroll p-4 sm:p-5">
            {activeTab === "preview" && (
              <div>
                <h3 className="text-base font-semibold text-foreground mb-1">{design.name}</h3>
                <p className="text-xs text-muted-foreground mb-4">{design.category} · {design.style}</p>

                {/* Mini live token preview */}
                <MiniTokenPreview tokens={t} darkMode={darkMode} />

                <h3 className="text-sm font-semibold text-foreground mt-6 mb-2">About this design</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{design.description}</p>

                <h3 className="text-sm font-semibold text-foreground mb-2">Vibe</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{design.vibe}</p>
              </div>
            )}

            {activeTab === "tokens" && (
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3">Color Palette</h3>
                <div className="space-y-2.5 mb-6">
                  {colorEntries.map(({ label, light, dark }) => {
                    const color = darkMode ? dark : light;
                    const isGradientOrRgba = color.startsWith("rgba") || color.startsWith("linear");
                    return (
                      <div key={label} className="flex items-center gap-3 group">
                        <div
                          className="color-swatch cursor-pointer group-hover:ring-2 group-hover:ring-ring transition-all"
                          style={{
                            background: isGradientOrRgba ? (darkMode ? "#333" : "#CCC") : color,
                          }}
                          title="Click to copy"
                          onClick={() => !isGradientOrRgba && handleCopy(color, label)}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-foreground">{label}</div>
                          <div className="text-xs text-muted-foreground font-mono">{color}</div>
                        </div>
                        {!isGradientOrRgba && (
                          <button
                            onClick={() => handleCopy(color, label)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
                          >
                            {copied === label ? (
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            ) : (
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                              </svg>
                            )}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>

                <h3 className="text-sm font-semibold text-foreground mb-3">Typography</h3>
                <div className="space-y-2.5 mb-6">
                  {[
                    { label: "Body Font", value: t.font },
                    { label: "Heading Font", value: t.headingFont },
                    { label: "Code Font", value: t.codeFont },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between group">
                      <span className="text-sm text-muted-foreground">{label}</span>
                      <div className="flex items-center gap-1.5">
                        <code className="text-sm font-medium text-foreground">{value}</code>
                        <button
                          onClick={() => handleCopy(value, `font-${label}`)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
                        >
                          {copied === `font-${label}` ? (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          ) : (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <h3 className="text-sm font-semibold text-foreground mb-3">Border Radius</h3>
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-muted border border-border" style={{ borderRadius: t.radius }} />
                  <code className="text-sm font-mono text-foreground">{t.radius}</code>
                </div>
              </div>
            )}

            {activeTab === "designMd" && (
              <DesignMdTab slug={design.slug} />
            )}

            {activeTab === "download" && (
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-2">Download DESIGN.md</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Download the {design.name} DESIGN.md file directly to your project.
                </p>

                {/* Direct download button */}
                <a
                  href={downloadUrl}
                  className="astryx-button astryx-button-primary w-full justify-center mb-4"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Download DESIGN.md
                </a>

                {/* npx command */}
                <h3 className="text-sm font-semibold text-foreground mb-2 mt-6">Install via CLI</h3>
                <p className="text-xs text-muted-foreground mb-3">
                  Use the npx CLI to add the design system to any project:
                </p>
                <div className="bg-muted rounded-lg p-3 mb-4 flex items-center justify-between gap-2">
                  <code className="text-xs font-mono text-foreground overflow-x-auto whitespace-nowrap">
                    npx getdesign@latest add {design.slug}
                  </code>
                  <button
                    onClick={() => handleCopy(`npx getdesign@latest add ${design.slug}`, "npx")}
                    className="astryx-button px-2 flex-shrink-0 text-xs"
                  >
                    {copied === "npx" ? "Copied!" : "Copy"}
                  </button>
                </div>

                {/* External link */}
                <a
                  href={previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="astryx-button w-full justify-center mb-6"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                  View on getdesign.md
                </a>

                {/* Disclaimer */}
                <div className="bg-muted/50 rounded-lg p-3 border border-border">
                  <div className="flex items-start gap-2">
                    <span className="text-xs text-muted-foreground mt-0.5">✦</span>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Independent analysis of publicly observable patterns, curated as a starting point
                      for inspiration. Not affiliated with or endorsed by {design.name}; trademarks
                      belong to their respective owners.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-4 px-4">
        <div className="astryx-container flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Data source:{" "}
            <a href="https://github.com/VoltAgent/awesome-claude-design" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">
              VoltAgent/awesome-claude-design
            </a>
          </p>
          <span className="text-xs text-muted-foreground">MIT Licensed</span>
        </div>
      </footer>
    </div>
  );
}

/* ─── Mini Token Preview ─── */
function MiniTokenPreview({ tokens, darkMode }: { tokens: Design["tokens"]; darkMode: boolean }) {
  const t = tokens;
  const bg = darkMode ? t.bgDark : t.bg;
  const surface = darkMode ? t.surfaceDark : t.surface;
  const primary = darkMode ? t.primaryDark : t.primary;
  const text = darkMode ? t.textDark : t.text;
  const muted = darkMode ? t.mutedDark : t.muted;
  const border = darkMode ? t.borderDark : t.border;
  const font = t.font.split(",")[0].replace(/'/g, "").trim();

  return (
    <div
      className="rounded-xl overflow-hidden border border-border mb-4"
      style={{ background: bg, fontFamily: font }}
    >
      <div className="p-4">
        {/* Mini nav */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: primary }} />
          <div className="h-3 rounded-sm" style={{ background: text, width: "60px", opacity: 0.7 }} />
          <div className="flex-1" />
          <div className="h-2 rounded-full" style={{ background: muted, width: "40px" }} />
        </div>

        {/* Heading */}
        <div className="mb-3">
          <div className="text-lg font-bold leading-tight" style={{ color: text, fontFamily: t.headingFont.split(",")[0].replace(/'/g, "") }}>
            The Quick Brown Fox
          </div>
          <div className="text-xs mt-1" style={{ color: muted }}>
            Jumps over the lazy dog with style
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2 mb-3">
          <div
            className="px-3 py-1.5 rounded-md text-xs font-medium"
            style={{
              background: primary,
              color: isLightColor(bg) ? (isLightColor(primary) ? "#111" : "#FFF") : "#FFF",
              borderRadius: t.radius,
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
              borderRadius: t.radius,
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
    </div>
  );
}

/* ─── DESIGN.md Tab ─── */
function DesignMdTab({ slug }: { slug: string }) {
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useState(() => {
    fetch(`/api/download/${slug}`)
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch");
        return r.text();
      })
      .then((text) => {
        setContent(text);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-6 h-6 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-muted-foreground mb-3">Could not load DESIGN.md content.</p>
        <a
          href={`https://getdesign.md/${slug}/design-md`}
          target="_blank"
          rel="noopener noreferrer"
          className="astryx-button text-sm"
        >
          View on getdesign.md
        </a>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-foreground">Raw DESIGN.md</h3>
        <button
          onClick={() => navigator.clipboard.writeText(content)}
          className="astryx-button text-xs px-2.5"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          Copy all
        </button>
      </div>
      <pre className="bg-muted rounded-lg p-4 text-xs font-mono text-foreground overflow-auto max-h-[calc(100vh-280px)] leading-relaxed whitespace-pre-wrap">
        {content}
      </pre>
    </div>
  );
}