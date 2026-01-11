# UI Style Guide (Chinese Cultural Color Scheme)

## Look & feel
- **Style**: Chinese painting aesthetic with rice paper texture background, ink wash effects, and brush stroke patterns. Minimalist, soft pastels, clean typography, generous whitespace.
- **Goal**: calm and safe; avoid "edgy" or overly playful visuals that can trivialize stress.
- **Cultural Context**: Colors and textures are chosen to reflect Chinese cultural sentiments and traditional art aesthetics.
- **Visual Theme**: Background features a clean, minimalist aesthetic inspired by modern calligraphy - clean white canvas with a single organic brush stroke and traditional seal element. The flowing brush stroke with subtle red accent and the wisdom character "智" (zhì) in a seal/chop mark appear very subtly, representing knowledge and traditional artistic expression.

## Color Palette

### Minimalist 3-Color Scheme
The design uses only three colors for a clean, minimalist aesthetic:

- **White**: `#FAFAF8` (warm white) or `#FFFFFF` (pure white) - Used for backgrounds and light elements
- **Charcoal/Black**: `#323232` (charcoal) or `#000000` (black) - Used for text, headers, navigation bars, and dark elements
- **Red**: `#D60000` (vibrant red) or `#C41E3A` (muted red) - Used for interactive elements (buttons, links, accents)

**Background**: Clean minimalist design (warm white `#FAFAF8`) with a single organic brush stroke and traditional seal element - Creates a modern calligraphy-inspired aesthetic while preventing eye strain. Features a flowing charcoal brush stroke with subtle red accent and a wisdom character "智" (zhì) in a red seal/chop mark.

### Semantic Colors (Error/Alert Only)
- **Error/Alert**: Red variants (e.g., `#D60000`, `#C41E3A`) - Used for error messages and critical alerts only. All other semantic colors removed in favor of minimalist palette.

## Typography
- **Fonts**: 
  - **Chinese**: PingFang SC (primary), Hiragino Sans GB, Microsoft YaHei, Noto Sans SC
  - **English**: Helvetica (primary), -apple-system, BlinkMacSystemFont, Arial
- **Text Color**: Use dark charcoal `#323232` instead of pure black `#000000` for better visual softness
- Emphasize readability: 14–16px body equivalents; line-height ~1.5.
- System fonts prioritized for WeChat/mini program compatibility.

## Chat bubbles
- **Assistant**: Minimal red tint bubble (`#D60000` with low opacity ~10%); slightly rounded corners.
- **Child**: Neutral white bubble with charcoal border; distinguish via alignment.
- Keep messages short; allow long messages but wrap cleanly.

## Buttons
- **Border radius**: 12px+ (24rpx in rpx units) for rounded corners to appear friendly to children
- **Colors**: Red (`#D60000`) for primary buttons, charcoal (`#323232`) for secondary buttons
- Avoid gradients; use flat, solid button colors
- Maintain smooth transition animations

## Mood picker
- 5–7 options max (e.g., 开心/还好/紧张/难过/生气/疲惫).
- Emoji first; labels second.
- **Colors**: Minimalist grayscale/monochrome - white background with charcoal borders, red accent for active state

## Background Aesthetic

### Minimalist Brush Stroke Design
- Base color: `#FAFAF8` (clean, slightly warm white - inspired by minimalist calligraphy canvas)
- Texture: Very minimal paper grain pattern using CSS repeating gradients
- Style: Clean, minimalist aesthetic emphasizing the organic brush stroke element
- Implementation: CSS-based for lightweight performance

### Organic Brush Stroke
- Element: Single flowing, curved brush stroke in charcoal with subtle red accent
- Position: Bottom left of page background
- Style: Organic, textured edges with varying opacity to simulate natural brush application
- Colors: 
  - Main stroke: Charcoal (#323232) with gradient opacity (6-12%)
  - Accent: Vibrant red (#D60000) with very low opacity (3-6%)
- Opacity: Overall group at 40%, with layered strokes for depth
- Format: SVG path-based for authentic brush texture and scalability

### Seal (Chop) Element
- Element: Red square seal with Chinese character "智" (zhì - wisdom)
- Position: Bottom right corner
- Style: Traditional artist's seal/chop mark design
- Colors: Red seal background (#D60000) with charcoal character (#323232)
- Opacity: 8% group opacity for very subtle presence
- Format: SVG with text element for character rendering

### Subtle Texture Patterns
- Pattern: Minimal diagonal repeating gradients for subtle stroke-like textures
- Opacity: Very low (0.4%) to maintain subtlety and not compete with main brush stroke
- Direction: 45deg angle for natural brush effect

## Cards
- **Glassmorphism**: Apply frosted glass effects to Student Reports and Teacher Announcements cards
  - `background: rgba(255, 255, 255, 0.7-0.9)` (semi-transparent white)
  - `backdrop-filter: blur(10px)` (frosted glass blur effect)
  - `border: 1px solid rgba(255, 255, 255, 0.3)` (subtle border)
  - `box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1)` (soft shadow)
  - Note: May need fallback for WeChat mini-program compatibility
  - Cards should complement the rice paper background aesthetic

## Parent dashboard
- Default to **7-day** view.
- Use cards:
  - 压力趋势
  - 情绪波动
  - 导师匹配度
  - 风险事件（若有）

## Icons
- **Teacher/Parent menus**: Use thin-line icons (outline style)
- **Student-facing features**: Use solid/filled icon versions
- Ensure consistent icon library usage

## Safety escalation UI
- Subtle banner: "我在这儿。我们先一起稳一稳呼吸。"
- Avoid flashing, alarm icons, or fear-inducing visuals.
- Use secondary color (`#EFD6D2` Blush Peony) selectively for child-friendly UI elements

