---
Task ID: 2
Agent: Super Z (Main)
Task: Add OG image generation, /design/[slug] page, and download API

Work Log:
- Created /api/og/[slug] route — generates 1200x630 SVG OG images per design using their own tokens (bg, primary, accent, fonts, radius). Includes mini browser frame UI mockup with the design's colors.
- Created /api/download/[slug] route — fetches DESIGN.md from getdesign.md upstream, serves as downloadable .md file with proper Content-Disposition headers.
- Created /design/[slug] page with generateStaticParams for all 68 designs, generateMetadata with OG image URLs.
- Created /design/[slug]/client.tsx with 4 tabs: Preview (mini token preview), Tokens (color swatches with copy, typography, radius), DESIGN.md (fetched via download API, displayed in pre block with copy-all), Download (direct download button + npx CLI command).
- Updated homepage DesignCard to be an <a> tag navigating to /design/[slug] instead of opening slide-in panel.
- Added OG meta tags (openGraph, twitter) to root layout.
- Fixed import paths (changed from @/../../src/data to @/data for all new routes).
- Fixed src/data/designs.json to use transformed format with tokens objects.
- Agent-browser verified: iframe loads getdesign.md preview, all 4 tabs work, OG API returns SVG, download API returns markdown, homepage cards navigate correctly.

Stage Summary:
- 3 new API/page routes: /api/og/[slug], /api/download/[slug], /design/[slug]
- All 68 designs have dedicated pages with OG images
- Git pushed: https://github.com/ansaribilal14/design-showcase