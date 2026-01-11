# UI Style Guide (Chinese Cultural Color Scheme)

## Look & feel
- **Style**: Chinese painting aesthetic with rice paper texture background, ink wash effects, and brush stroke patterns. Minimalist, soft pastels, clean typography, generous whitespace.
- **Goal**: calm and safe; avoid "edgy" or overly playful visuals that can trivialize stress.
- **Cultural Context**: Colors and textures are chosen to reflect Chinese cultural sentiments and traditional art aesthetics.
- **Visual Theme**: Background resembles warm, slightly yellowed rice paper scroll. Foreground elements styled like Chinese ink painting with soft gradients (ink wash effects) and subtle brush stroke textures. The Chinese character "智" (zhì - wisdom) appears very subtly in the background in traditional calligraphy style, representing knowledge and tradition.

## Color Palette

### Primary Colors
- **Primary (Authority)**: `#323232` (Charcoal Ink / Mo 墨) - Used for headers and navigation bars. In Chinese culture, black represents water and "hidden wisdom."
- **Secondary (Softness)**: `#EFD6D2` (Blush Peony / Mu Dan 牡丹) - Softens the interface for children; represents beauty and affection.
- **Accent (Focus)**: `#4A90E2` (Sky Blue / Tian Lan 天蓝) - A bright, modern blue used for interactive buttons and links.
- **Background**: Rice paper texture (warm yellowed tone `#F5F1E8`) with ink wash gradients and brush stroke patterns - Creates a traditional Chinese painting aesthetic while preventing eye strain. Includes subtle wisdom character "智" (zhì) in traditional calligraphy style in the background.

### Semantic Colors
- **Warning**: amber (non-alarming caution) - Status badges remain as-is for semantic meaning
- **Risk/Alert**: muted red (serious, not sensational) - Status badges remain as-is for semantic meaning

## Typography
- **Fonts**: 
  - **Chinese**: PingFang SC (primary), Hiragino Sans GB, Microsoft YaHei, Noto Sans SC
  - **English**: Helvetica (primary), -apple-system, BlinkMacSystemFont, Arial
- **Text Color**: Use dark charcoal `#323232` instead of pure black `#000000` for better visual softness
- Emphasize readability: 14–16px body equivalents; line-height ~1.5.
- System fonts prioritized for WeChat/mini program compatibility.

## Chat bubbles
- **Assistant**: Soft accent color tint bubble (`#4A90E2` with low opacity); slightly rounded corners.
- **Child**: Neutral bubble; distinguish via alignment.
- Keep messages short; allow long messages but wrap cleanly.

## Buttons
- **Border radius**: 12px+ (24rpx in rpx units) for rounded corners to appear friendly to children
- **Colors**: Solid and desaturated for professionalism (use `#4A90E2` accent color)
- Avoid gradients; use flat, solid button colors
- Maintain smooth transition animations

## Mood picker
- 5–7 options max (e.g., 开心/还好/紧张/难过/生气/疲惫).
- Emoji first; labels second.

## Background Aesthetic

### Rice Paper Texture
- Base color: `#F5F1E8` (warm, slightly yellowed rice paper)
- Texture: Subtle grain pattern using CSS repeating gradients
- Aged effect: Soft radial gradients simulating paper yellowing over time
- Implementation: CSS-based for lightweight performance

### Ink Wash Effects
- Soft gradients: Radial gradients in corners with very low opacity
- Color: Charcoal (#323232) at 1.5-2% opacity
- Positioning: Multiple subtle gradients for natural ink wash appearance
- Style: Mimics traditional Chinese ink painting technique

### Brush Stroke Patterns
- Pattern: Diagonal repeating gradients creating subtle stroke-like textures
- Opacity: Very low (0.6-0.8%) to maintain subtlety
- Direction: Multiple angles (45deg, -45deg) for natural brush effect

### Wisdom Character
- Element: Chinese character "智" (zhì - wisdom) in traditional calligraphy style
- Position: Bottom right of page background
- Opacity: 6% for very subtle presence (overall overlay at 35% opacity)
- Format: SVG path-based strokes for scalability and lightweight implementation
- Cultural meaning: Represents wisdom and traditional learning (智 = wisdom, intelligence, knowledge)

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

