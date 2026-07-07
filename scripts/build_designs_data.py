#!/usr/bin/env python3
"""
Build designs.json from awesome-claude-design repo.
Fetches each DESIGN.md from getdesign.md and extracts color/font tokens.
"""
import json
import re
import os
import subprocess
import sys
import time

DESIGNS = [
    # AI & LLM Platforms
    {"name": "Claude", "slug": "claude", "category": "AI & LLM Platforms", "vibe": "Warm terracotta accent, clean editorial layout", "url": "https://getdesign.md/claude/design-md"},
    {"name": "Cohere", "slug": "cohere", "category": "AI & LLM Platforms", "vibe": "Vibrant gradients, data-rich dashboard aesthetic", "url": "https://getdesign.md/cohere/design-md"},
    {"name": "ElevenLabs", "slug": "elevenlabs", "category": "AI & LLM Platforms", "vibe": "Dark cinematic UI, audio-waveform aesthetics", "url": "https://getdesign.md/elevenlabs/design-md"},
    {"name": "Minimax", "slug": "minimax", "category": "AI & LLM Platforms", "vibe": "Bold dark interface with neon accents", "url": "https://getdesign.md/minimax/design-md"},
    {"name": "Mistral AI", "slug": "mistral-ai", "category": "AI & LLM Platforms", "vibe": "French-engineered minimalism, purple-toned", "url": "https://getdesign.md/mistral.ai/design-md"},
    {"name": "Ollama", "slug": "ollama", "category": "AI & LLM Platforms", "vibe": "Terminal-first, monochrome simplicity", "url": "https://getdesign.md/ollama/design-md"},
    {"name": "OpenCode AI", "slug": "opencode-ai", "category": "AI & LLM Platforms", "vibe": "Developer-centric dark theme", "url": "https://getdesign.md/opencode.ai/design-md"},
    {"name": "Replicate", "slug": "replicate", "category": "AI & LLM Platforms", "vibe": "Clean white canvas, code-forward", "url": "https://getdesign.md/replicate/design-md"},
    {"name": "RunwayML", "slug": "runwayml", "category": "AI & LLM Platforms", "vibe": "Cinematic dark UI, media-rich layout", "url": "https://getdesign.md/runwayml/design-md"},
    {"name": "Together AI", "slug": "together-ai", "category": "AI & LLM Platforms", "vibe": "Technical, blueprint-style design", "url": "https://getdesign.md/together.ai/design-md"},
    {"name": "VoltAgent", "slug": "voltagent", "category": "AI & LLM Platforms", "vibe": "Void-black canvas, emerald accent, terminal-native", "url": "https://getdesign.md/voltagent/design-md"},
    {"name": "xAI", "slug": "xai", "category": "AI & LLM Platforms", "vibe": "Stark monochrome, futuristic minimalism", "url": "https://getdesign.md/x.ai/design-md"},
    # Developer Tools & IDEs
    {"name": "Cursor", "slug": "cursor", "category": "Developer Tools & IDEs", "vibe": "Sleek dark interface, gradient accents", "url": "https://getdesign.md/cursor/design-md"},
    {"name": "Expo", "slug": "expo", "category": "Developer Tools & IDEs", "vibe": "Dark theme, tight letter-spacing, code-centric", "url": "https://getdesign.md/expo/design-md"},
    {"name": "Lovable", "slug": "lovable", "category": "Developer Tools & IDEs", "vibe": "Playful gradients, friendly dev aesthetic", "url": "https://getdesign.md/lovable/design-md"},
    {"name": "Raycast", "slug": "raycast", "category": "Developer Tools & IDEs", "vibe": "Sleek dark chrome, vibrant gradient accents", "url": "https://getdesign.md/raycast/design-md"},
    {"name": "Superhuman", "slug": "superhuman", "category": "Developer Tools & IDEs", "vibe": "Premium dark UI, keyboard-first, purple glow", "url": "https://getdesign.md/superhuman/design-md"},
    {"name": "Vercel", "slug": "vercel", "category": "Developer Tools & IDEs", "vibe": "Black and white precision, Geist font", "url": "https://getdesign.md/vercel/design-md"},
    {"name": "Warp", "slug": "warp", "category": "Developer Tools & IDEs", "vibe": "Dark IDE-like interface, block-based command UI", "url": "https://getdesign.md/warp/design-md"},
    # Backend, Database & DevOps
    {"name": "ClickHouse", "slug": "clickhouse", "category": "Backend & DevOps", "vibe": "Yellow-accented, technical documentation style", "url": "https://getdesign.md/clickhouse/design-md"},
    {"name": "Composio", "slug": "composio", "category": "Backend & DevOps", "vibe": "Modern dark with colorful integration icons", "url": "https://getdesign.md/composio/design-md"},
    {"name": "HashiCorp", "slug": "hashicorp", "category": "Backend & DevOps", "vibe": "Enterprise-clean, black and white", "url": "https://getdesign.md/hashicorp/design-md"},
    {"name": "MongoDB", "slug": "mongodb", "category": "Backend & DevOps", "vibe": "Green leaf branding, developer documentation focus", "url": "https://getdesign.md/mongodb/design-md"},
    {"name": "PostHog", "slug": "posthog", "category": "Backend & DevOps", "vibe": "Playful hedgehog branding, developer-friendly dark UI", "url": "https://getdesign.md/posthog/design-md"},
    {"name": "Sanity", "slug": "sanity", "category": "Backend & DevOps", "vibe": "Red accent, content-first editorial layout", "url": "https://getdesign.md/sanity/design-md"},
    {"name": "Sentry", "slug": "sentry", "category": "Backend & DevOps", "vibe": "Dark dashboard, data-dense, pink-purple accent", "url": "https://getdesign.md/sentry/design-md"},
    {"name": "Supabase", "slug": "supabase", "category": "Backend & DevOps", "vibe": "Dark emerald theme, code-first", "url": "https://getdesign.md/supabase/design-md"},
    # Productivity & SaaS
    {"name": "Cal.com", "slug": "cal-com", "category": "Productivity & SaaS", "vibe": "Clean neutral UI, developer-oriented simplicity", "url": "https://getdesign.md/cal/design-md"},
    {"name": "Intercom", "slug": "intercom", "category": "Productivity & SaaS", "vibe": "Friendly blue palette, conversational UI patterns", "url": "https://getdesign.md/intercom/design-md"},
    {"name": "Linear", "slug": "linear", "category": "Productivity & SaaS", "vibe": "Ultra-minimal, precise, purple accent", "url": "https://getdesign.md/linear.app/design-md"},
    {"name": "Mintlify", "slug": "mintlify", "category": "Productivity & SaaS", "vibe": "Clean, green-accented, reading-optimized", "url": "https://getdesign.md/mintlify/design-md"},
    {"name": "Notion", "slug": "notion", "category": "Productivity & SaaS", "vibe": "Warm minimalism, serif headings, soft surfaces", "url": "https://getdesign.md/notion/design-md"},
    {"name": "Resend", "slug": "resend", "category": "Productivity & SaaS", "vibe": "Minimal dark theme, monospace accents", "url": "https://getdesign.md/resend/design-md"},
    {"name": "Zapier", "slug": "zapier", "category": "Productivity & SaaS", "vibe": "Warm orange, friendly illustration-driven", "url": "https://getdesign.md/zapier/design-md"},
    # Design & Creative Tools
    {"name": "Airtable", "slug": "airtable", "category": "Design & Creative Tools", "vibe": "Colorful, friendly, structured data aesthetic", "url": "https://getdesign.md/airtable/design-md"},
    {"name": "Clay", "slug": "clay", "category": "Design & Creative Tools", "vibe": "Organic shapes, soft gradients, art-directed layout", "url": "https://getdesign.md/clay/design-md"},
    {"name": "Figma", "slug": "figma", "category": "Design & Creative Tools", "vibe": "Vibrant multi-color, playful yet professional", "url": "https://getdesign.md/figma/design-md"},
    {"name": "Framer", "slug": "framer", "category": "Design & Creative Tools", "vibe": "Bold black and blue, motion-first, design-forward", "url": "https://getdesign.md/framer/design-md"},
    {"name": "Miro", "slug": "miro", "category": "Design & Creative Tools", "vibe": "Bright yellow accent, infinite canvas aesthetic", "url": "https://getdesign.md/miro/design-md"},
    {"name": "Webflow", "slug": "webflow", "category": "Design & Creative Tools", "vibe": "Blue-accented, polished marketing site aesthetic", "url": "https://getdesign.md/webflow/design-md"},
    # Fintech & Crypto
    {"name": "Binance", "slug": "binance", "category": "Fintech & Crypto", "vibe": "Bold Binance Yellow on monochrome, trading-floor urgency", "url": "https://getdesign.md/binance/design-md"},
    {"name": "Coinbase", "slug": "coinbase", "category": "Fintech & Crypto", "vibe": "Clean blue identity, trust-focused, institutional feel", "url": "https://getdesign.md/coinbase/design-md"},
    {"name": "Kraken", "slug": "kraken", "category": "Fintech & Crypto", "vibe": "Purple-accented dark UI, data-dense dashboards", "url": "https://getdesign.md/kraken/design-md"},
    {"name": "Mastercard", "slug": "mastercard", "category": "Fintech & Crypto", "vibe": "Warm cream canvas, orbital pill shapes, editorial warmth", "url": "https://getdesign.md/mastercard/design-md"},
    {"name": "Revolut", "slug": "revolut", "category": "Fintech & Crypto", "vibe": "Sleek dark interface, gradient cards, fintech precision", "url": "https://getdesign.md/revolut/design-md"},
    {"name": "Stripe", "slug": "stripe", "category": "Fintech & Crypto", "vibe": "Signature purple gradients, weight-300 elegance", "url": "https://getdesign.md/stripe/design-md"},
    {"name": "Wise", "slug": "wise", "category": "Fintech & Crypto", "vibe": "Bright green accent, friendly and clear", "url": "https://getdesign.md/wise/design-md"},
    # E-commerce & Retail
    {"name": "Airbnb", "slug": "airbnb", "category": "E-commerce & Retail", "vibe": "Warm coral accent, photography-driven, rounded UI", "url": "https://getdesign.md/airbnb/design-md"},
    {"name": "Meta", "slug": "meta", "category": "E-commerce & Retail", "vibe": "Photography-first, binary light/dark surfaces, Meta Blue CTAs", "url": "https://getdesign.md/meta/design-md"},
    {"name": "Nike", "slug": "nike", "category": "E-commerce & Retail", "vibe": "Monochrome UI, massive uppercase Futura, full-bleed photography", "url": "https://getdesign.md/nike/design-md"},
    {"name": "Shopify", "slug": "shopify", "category": "E-commerce & Retail", "vibe": "Dark-first cinematic, neon green accent, ultra-light display type", "url": "https://getdesign.md/shopify/design-md"},
    # Media & Consumer Tech
    {"name": "Apple", "slug": "apple", "category": "Media & Consumer Tech", "vibe": "Premium white space, SF Pro, cinematic imagery", "url": "https://getdesign.md/apple/design-md"},
    {"name": "IBM", "slug": "ibm", "category": "Media & Consumer Tech", "vibe": "Carbon design system, structured blue palette", "url": "https://getdesign.md/ibm/design-md"},
    {"name": "NVIDIA", "slug": "nvidia", "category": "Media & Consumer Tech", "vibe": "Green-black energy, technical power aesthetic", "url": "https://getdesign.md/nvidia/design-md"},
    {"name": "Pinterest", "slug": "pinterest", "category": "Media & Consumer Tech", "vibe": "Red accent, masonry grid, image-first", "url": "https://getdesign.md/pinterest/design-md"},
    {"name": "PlayStation", "slug": "playstation", "category": "Media & Consumer Tech", "vibe": "Three-surface channel layout, cyan hover-scale interaction", "url": "https://getdesign.md/playstation/design-md"},
    {"name": "SpaceX", "slug": "spacex", "category": "Media & Consumer Tech", "vibe": "Stark black and white, full-bleed imagery, futuristic", "url": "https://getdesign.md/spacex/design-md"},
    {"name": "Spotify", "slug": "spotify", "category": "Media & Consumer Tech", "vibe": "Vibrant green on dark, bold type, album-art-driven", "url": "https://getdesign.md/spotify/design-md"},
    {"name": "The Verge", "slug": "the-verge", "category": "Media & Consumer Tech", "vibe": "Acid-mint and ultraviolet accents, Manuka display type", "url": "https://getdesign.md/theverge/design-md"},
    {"name": "Uber", "slug": "uber", "category": "Media & Consumer Tech", "vibe": "Bold black and white, tight type, urban energy", "url": "https://getdesign.md/uber/design-md"},
    {"name": "Vodafone", "slug": "vodafone", "category": "Media & Consumer Tech", "vibe": "Monumental uppercase display, Vodafone Red chapter bands", "url": "https://getdesign.md/vodafone/design-md"},
    {"name": "WIRED", "slug": "wired", "category": "Media & Consumer Tech", "vibe": "Paper-white broadsheet density, custom serif, ink-blue links", "url": "https://getdesign.md/wired/design-md"},
    # Automotive
    {"name": "BMW", "slug": "bmw", "category": "Automotive", "vibe": "Dark premium surfaces, precise German engineering aesthetic", "url": "https://getdesign.md/bmw/design-md"},
    {"name": "Bugatti", "slug": "bugatti", "category": "Automotive", "vibe": "Cinema-black canvas, monochrome austerity, monumental display type", "url": "https://getdesign.md/bugatti/design-md"},
    {"name": "Ferrari", "slug": "ferrari", "category": "Automotive", "vibe": "Chiaroscuro black-white editorial, Ferrari Red with extreme sparseness", "url": "https://getdesign.md/ferrari/design-md"},
    {"name": "Lamborghini", "slug": "lamborghini", "category": "Automotive", "vibe": "True black cathedral, gold accent, LamboType custom Neo-Grotesk", "url": "https://getdesign.md/lamborghini/design-md"},
    {"name": "Renault", "slug": "renault", "category": "Automotive", "vibe": "Vivid aurora gradients, NouvelR proprietary typeface, zero-radius buttons", "url": "https://getdesign.md/renault/design-md"},
    {"name": "Tesla", "slug": "tesla", "category": "Automotive", "vibe": "Radical subtraction, cinematic full-viewport photography, Universal Sans", "url": "https://getdesign.md/tesla/design-md"},
]


def fetch_page(url):
    """Fetch a page using z-ai CLI tool."""
    try:
        result = subprocess.run(
            ["z-ai", "function", "-n", "page_reader", "-a", json.dumps({"url": url})],
            capture_output=True, text=True, timeout=30
        )
        output_file = None
        for line in (result.stdout + result.stderr).split('\n'):
            if 'File saved to:' in line:
                output_file = line.split('File saved to:')[-1].strip()
                break
        if output_file and os.path.exists(output_file):
            with open(output_file) as f:
                data = json.load(f)
            # Clean up temp file
            os.remove(output_file)
            return data
        return None
    except Exception as e:
        print(f"  Error fetching {url}: {e}", file=sys.stderr)
        return None


def extract_colors(text):
    """Extract color hex codes from DESIGN.md text."""
    colors = set()
    # Match hex colors like #FFF, #FFFFFF, #ffffff
    hex_pattern = r'#[0-9a-fA-F]{3,8}\b'
    for match in re.finditer(hex_pattern, text):
        color = match.group().upper()
        if len(color) in (4, 7):  # Only #RGB or #RRGGBB
            colors.add(color)
    return sorted(list(colors))[:12]  # Top 12 colors


def extract_fonts(text):
    """Extract font names from DESIGN.md text."""
    fonts = set()
    # Common font patterns
    font_patterns = [
        r'(?:font-family|font:\s*|typeface|heading.*font|body.*font|display.*font|mono.*font)[:\s]*([A-Za-z\s]+?)[,;\n\r\[]',
        r'`([A-Za-z][\w\s]*?(?:Sans|Serif|Mono|Grotesk|Slab|Display|Pro|Condensed|Bold|Light|Medium|Regular|Thin|Black|Heavy|Ultra))`',
        r'(?:use|using|with|is)\s+([A-Z][\w]*(?:\s+[A-Z][\w]*)*(?:\s+(?:Sans|Serif|Mono|Grotesk|Slab|Display|Pro|Condensed)))\s+font',
    ]
    for pattern in font_patterns:
        for match in re.finditer(pattern, text, re.IGNORECASE):
            font = match.group(1).strip()
            # Clean up
            font = re.sub(r'\s+', ' ', font).strip()
            if len(font) > 2 and len(font) < 40:
                # Filter out non-font words
                skip_words = {'the', 'and', 'for', 'with', 'is', 'are', 'bold', 'light', 'medium', 'regular', 'italic', 'normal'}
                words = font.split()
                if words and words[0].lower() not in skip_words:
                    fonts.add(font)
    return sorted(list(fonts))[:6]


def extract_background_color(text):
    """Determine the primary background color from the design."""
    # Look for background color indicators
    bg_patterns = [
        r'background[:\s]*(?:color)?[:\s]*([#][0-9a-fA-F]{3,8})',
        r'bg-?(?:primary|default|surface|base)[:\s]*([#][0-9a-fA-F]{3,8})',
        r'(?:canvas|surface|base)\s+(?:color|tone)[:\s]*([#][0-9a-fA-F]{3,8})',
    ]
    for pattern in bg_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            return match.group(1).upper()
    
    # Heuristic: check if design mentions "dark" or "light"
    lower_text = text.lower()
    if 'dark' in lower_text[:500]:
        return '#0A0A0A'
    return '#FFFFFF'


def determine_style(vibe, text=''):
    """Determine style classification: minimal, dark, colorful, or editorial."""
    lower = (vibe + ' ' + text[:1000]).lower()
    if 'dark' in lower or 'cinematic' in lower or 'monochrome' in lower:
        return 'dark'
    if 'colorful' in lower or 'vibrant' in lower or 'gradient' in lower or 'multi-color' in lower:
        return 'colorful'
    if 'editorial' in lower or 'serif' in lower or 'reading' in lower or 'broadsheet' in lower:
        return 'editorial'
    return 'minimal'


def process_design(design, index, total):
    """Fetch and process a single design's DESIGN.md."""
    print(f"[{index+1}/{total}] Fetching {design['name']}...", end=' ', flush=True)
    
    result = fetch_page(design['url'])
    if not result:
        print("FAILED")
        return {
            **design,
            "designMdContent": "",
            "colors": [],
            "fonts": [],
            "backgroundColor": "#FFFFFF",
            "style": "minimal"
        }
    
    html = result.get('data', {}).get('html', '') if isinstance(result.get('data'), dict) else result.get('html', '')
    # Strip HTML tags
    text = re.sub(r'<[^>]+>', '\n', html)
    text = re.sub(r'\n{3,}', '\n\n', text)
    
    colors = extract_colors(text)
    fonts = extract_fonts(text)
    bg_color = extract_background_color(text)
    style = determine_style(design['vibe'], text)
    
    print(f"OK ({len(colors)} colors, {len(fonts)} fonts, style={style})")
    
    return {
        **design,
        "designMdContent": text[:3000],  # Store excerpt
        "colors": colors,
        "fonts": fonts,
        "backgroundColor": bg_color,
        "style": style
    }


def main():
    output_path = "/home/z/my-project/src/data/designs.json"
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    print(f"Processing {len(DESIGNS)} designs...\n")
    
    results = []
    for i, design in enumerate(DESIGNS):
        processed = process_design(design, i, len(DESIGNS))
        results.append(processed)
        time.sleep(0.5)  # Rate limiting
    
    # Build categories with counts
    categories = {}
    for d in results:
        cat = d['category']
        categories[cat] = categories.get(cat, 0) + 1
    
    output = {
        "meta": {
            "total": len(results),
            "categories": categories,
            "generatedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ")
        },
        "designs": results
    }
    
    with open(output_path, 'w') as f:
        json.dump(output, f, indent=2, ensure_ascii=False)
    
    print(f"\nDone! Saved {len(results)} designs to {output_path}")
    print(f"Categories: {json.dumps(categories, indent=2)}")


if __name__ == '__main__':
    main()