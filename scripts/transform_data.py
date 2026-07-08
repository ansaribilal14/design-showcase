#!/usr/bin/env python3
"""
Transform designs data to match the page's expected Design/DesignTokens format.
"""
import json
import time
import os

# Load our static data
with open("/home/z/my-project/src/data/designs.json") as f:
    src = json.load(f)

def is_light(hex_color):
    """Check if a hex color is light."""
    hex_color = hex_color.lstrip('#')
    if len(hex_color) != 6:
        return True
    r, g, b = int(hex_color[0:2], 16), int(hex_color[2:4], 16), int(hex_color[4:6], 16)
    return (r * 299 + g * 587 + b * 114) / 1000 > 140

def darken(hex_color, factor=0.7):
    """Darken a hex color."""
    hex_color = hex_color.lstrip('#')
    if len(hex_color) != 6:
        return hex_color
    r, g, b = int(hex_color[0:2], 16), int(hex_color[2:4], 16), int(hex_color[4:6], 16)
    r, g, b = int(r * factor), int(g * factor), int(b * factor)
    return f"#{r:02x}{g:02x}{b:02x}"

def lighten(hex_color, factor=1.3):
    """Lighten a hex color."""
    hex_color = hex_color.lstrip('#')
    if len(hex_color) != 6:
        return hex_color
    r, g, b = int(hex_color[0:2], 16), int(hex_color[2:4], 16), int(hex_color[4:6], 16)
    r = min(255, int(r * factor))
    g = min(255, int(g * factor))
    b = min(255, int(b * factor))
    return f"#{r:02x}{g:02x}{b:02x}"

def get_radius(style, name):
    """Get border radius based on style and brand."""
    if name in ["Airbnb", "Notion", "Zapier", "Cal.com", "Intercom"]:
        return "12px"
    if name in ["Nike", "Tesla", "Renault"]:
        return "0px"
    if name in ["Linear", "Vercel", "Resend"]:
        return "6px"
    if style == "editorial":
        return "2px"
    if style == "dark":
        return "8px"
    return "8px"

def get_code_font(fonts, name):
    """Determine code/mono font."""
    if any("Mono" in f or "mono" in f or "JetBrains" in f for f in fonts):
        for f in fonts:
            if "Mono" in f or "mono" in f or "JetBrains" in f:
                return f
    if name in ["Vercel"]:
        return "Geist Mono"
    if name in ["Apple"]:
        return "SF Mono"
    return "JetBrains Mono"

results = []
for d in src["designs"]:
    bg = d["backgroundColor"]
    primary = d["primaryColor"]
    accent = d["accentColor"]
    colors = d["colors"]
    fonts = d["fonts"]
    name = d["name"]
    style = d["style"]
    vibe = d["vibe"]
    
    light_bg = is_light(bg)
    
    # Surface: slightly different from bg
    surface = colors[2] if len(colors) > 2 and colors[2] != bg else (lighten(bg) if light_bg else lighten(bg, 1.2))
    
    # Text color
    if light_bg:
        text = "#171717"
        textDark = "#F5F5F5"
    else:
        text = "#F5F5F5"
        textDark = "#F5F5F5"
    
    # Muted
    muted = "#F5F5F5" if light_bg else "#333333"
    mutedDark = "#333333"
    
    # Border
    border = "#E5E5E5" if light_bg else "rgba(255,255,255,0.1)"
    borderDark = "rgba(255,255,255,0.1)"
    
    # Dark mode variants
    if light_bg:
        bgDark = darken(bg, 0.3) if bg == "#FFFFFF" else "#0A0A0A"
        surfaceDark = lighten(bgDark, 1.2)
    else:
        bgDark = bg
        surfaceDark = surface
    
    # Primary dark
    primaryDark = primary if not is_light(primary) else darken(primary)
    
    # Fonts
    heading_font = fonts[0] if fonts else "Inter"
    body_font = fonts[1] if len(fonts) > 1 else fonts[0] if fonts else "Inter"
    code_font = get_code_font(fonts, name)
    
    results.append({
        "id": d["slug"],
        "name": name,
        "slug": d["slug"],
        "category": d["category"],
        "style": style.capitalize(),
        "vibe": vibe,
        "description": f"Inspired by {name}'s design language — {vibe.lower()}. A ready-to-use DESIGN.md that scaffolds a complete design system in Claude Design with color tokens, type scale, component styles, and a working UI kit.",
        "designMdUrl": d["designMdUrl"],
        "tokens": {
            "bg": bg,
            "bgDark": bgDark,
            "surface": surface,
            "surfaceDark": surfaceDark,
            "primary": primary,
            "primaryDark": primaryDark,
            "text": text,
            "textDark": textDark,
            "muted": muted,
            "mutedDark": mutedDark,
            "border": border,
            "borderDark": borderDark,
            "accent": accent,
            "font": f"'{body_font}', sans-serif",
            "headingFont": f"'{heading_font}', sans-serif",
            "codeFont": f"'{code_font}', monospace",
            "radius": get_radius(style, name),
        }
    })

output = {
    "meta": {
        "total": len(results),
        "categories": src["meta"]["categories"],
        "styles": ["Minimal", "Dark", "Colorful", "Editorial"],
        "generatedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ"),
        "source": "VoltAgent/awesome-claude-design"
    },
    "designs": results
}

with open("/home/z/my-project/public/data/designs.json", 'w') as f:
    json.dump(output, f, indent=2, ensure_ascii=False)

print(f"Done! {len(results)} designs written to public/data/designs.json")
# Verify first entry
print(f"Sample: {json.dumps(results[0], indent=2)[:500]}")