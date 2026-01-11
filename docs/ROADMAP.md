# Implementation Roadmap (Aligned to `requirements.md`)

## Week 1 — POC (Chat + Memory)
- uni-app project scaffold (WeChat DevTools compatible).
- Child chat UI (`/pages/index/index`) + mood picker.
- Server-side `chat.sendMessage` (stub) + persistence.
- LLM integration behind `utils/ai-service` (server-side call via cloud function).
- Lightweight memory: tutor entities + rolling summary.

**Exit criteria**
- Child can chat end-to-end; mood is recorded; tutor mentions create/update an entity record.

## Week 2 — Parental Controls (Guardian + Alerts)
- Parent portal pages (`/pages/parent/login`, `/pages/parent/dashboard` skeleton).
- Guardian mode lock gating child chat until enabled (as required).
- Implement notification opt-in (subscribe message consent).
- Build `alert.triggerParent` cloud function + alert logging.

**Exit criteria**
- Parent can login, enable guardian mode, receive an alert in a test scenario.

## Week 3 — Tutor Logic (Compatibility Insights)
- Improve tutor-fit tagging (摩擦点 taxonomy).
- Add prompt logic to extract tutor friction tags from conversations.
- Build first version of weekly insights generator `insights.generateWeekly`.

**Exit criteria**
- Parent dashboard shows 7-day pressure trend + tutor fit insights derived from tags.

## Week 4 — Compliance Hardening
- Integrate `msgSecCheck` in the message pipeline (input and possibly output).
- Expand and externalize keyword triage list; add versioning.
- Safety escalation response copy review + hotline localization.
- Prepare store submission checklist.

**Exit criteria**
- Safety pipeline is enforced for every message; alerting and weekly insights are stable.

## Risks / open questions (must answer early)
- **Real-name verification**: required mechanism and feasibility in WeChat ecosystem for this app.
- **Parent-child linking UX**: QR scan vs pairing code vs device-based linking.
- **Notification policy**: how many alerts, rate-limits, user consent revocation handling.
- **LLM vendor decision**: DeepSeek vs Zhipu (latency/cost/compliance).
- **Data retention policy**: transcript retention window and deletion strategy.


