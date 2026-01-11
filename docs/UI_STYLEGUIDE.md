# UI Style Guide (Chinese Cultural Color Scheme)

## Look & feel
- **Style**: minimalist, soft pastels, clean typography, generous whitespace.
- **Goal**: calm and safe; avoid "edgy" or overly playful visuals that can trivialize stress.
- **Cultural Context**: Colors are chosen to reflect Chinese cultural sentiments and symbolism.

## Color Palette

### Primary Colors
- **Primary (Authority)**: `#323232` (Charcoal Ink / Mo 墨) - Used for headers and navigation bars. In Chinese culture, black represents water and "hidden wisdom."
- **Secondary (Softness)**: `#EFD6D2` (Blush Peony / Mu Dan 牡丹) - Softens the interface for children; represents beauty and affection.
- **Accent (Focus)**: `#4A90E2` (Sky Blue / Tian Lan 天蓝) - A bright, modern blue used for interactive buttons and links.
- **Background**: `#F2F2F2` (Cloud Gray / Yun 云) - Prevents eye strain during long reading sessions (like reading long teacher notices).

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

## Cards
- **Glassmorphism**: Apply frosted glass effects to Student Reports and Teacher Announcements cards
  - `background: rgba(255, 255, 255, 0.7-0.9)` (semi-transparent white)
  - `backdrop-filter: blur(10px)` (frosted glass blur effect)
  - `border: 1px solid rgba(255, 255, 255, 0.3)` (subtle border)
  - `box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1)` (soft shadow)
  - Note: May need fallback for WeChat mini-program compatibility

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

