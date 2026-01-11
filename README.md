# XinLing Companion (心灵伙伴)

AI-driven empathetic chat + parent safety dashboard for Chinese school-going children (8–16).

This repo currently contains **design + planning** artifacts based on `requirements.md`. Implementation (uni-app + Vue3 + WXCloud) will follow after design review.

## Product pillars
- **Child Chat**: “Older Sibling (大哥哥/大姐姐)” persona, mood picker, session memory, tutor personality-fit tracking.
- **Parent Dashboard**: guardian-mode auth, weekly insights (no transcripts), alerting on “red line” risk signals.
- **Safety Layer**: local keyword triage + WeChat Content Security `msgSecCheck` + escalation workflow.

## Documentation / 文档

### Getting Started / 快速开始
- **New to the project?** Start with:
  - [`docs/DEVELOPER_GUIDE.md`](docs/DEVELOPER_GUIDE.md) - Complete developer onboarding guide (English)
  - [`docs/DEVELOPER_GUIDE_zh.md`](docs/DEVELOPER_GUIDE_zh.md) - 完整开发者入门指南（中文）
- **Need functional specifications?** See:
  - [`docs/FUNCTIONAL_REQUIREMENTS.md`](docs/FUNCTIONAL_REQUIREMENTS.md) - Detailed functional requirements (English)
  - [`docs/FUNCTIONAL_REQUIREMENTS_zh.md`](docs/FUNCTIONAL_REQUIREMENTS_zh.md) - 详细功能需求（中文）

### Design & Architecture Docs / 设计与架构文档
- `docs/PRODUCT_BRIEF.md` - Product overview and mission
- `docs/UX_FLOWS.md` - User experience flows and page maps
- `docs/UI_STYLEGUIDE.md` - UI design guidelines
- `docs/ARCHITECTURE.md` - Technical architecture overview
- `docs/DATA_MODEL.md` - Database schema and collections
- `docs/CLOUD_FUNCTIONS.md` - Cloud function API specifications
- `docs/SAFETY_COMPLIANCE.md` - Safety and compliance guidelines
- `docs/PROMPTS.md` - AI prompt engineering
- `docs/ROADMAP.md` - Implementation roadmap

### Source of truth / 需求来源
- `requirements.md` - High-level product requirements

## Run (Option A: HBuilderX + WeChat DevTools)
See `docs/RUNNING.md`.


