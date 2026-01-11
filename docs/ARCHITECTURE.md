# Architecture (High-level)

## Goals
- Provide a fast, empathetic chat experience in a WeChat Mini Program (uni-app + Vue 3).
- Enforce a multi-layer safety pipeline (local triage + WeChat `msgSecCheck` + escalation).
- Provide parent insights **without exposing transcripts**.

## System components
### Client (Mini Program)
- **Child app**: chat UI, mood picker, local safety pre-check, calls to WXCloud functions.
- **Parent app**: guardian auth, dashboard, alerts history, notification opt-in.

### Backend (WeChat Cloud Development / WXCloud)
- **Cloud Functions**:
  - `chat.sendMessage`: orchestrates safety checks + LLM call + persistence.
  - `safety.msgSecCheckProxy`: wraps WeChat `msgSecCheck` calls.
  - `alert.triggerParent`: sends notification + records alert event.
  - `insights.generateWeekly`: aggregates and generates weekly summaries.
  - `guardian.verify`: guardian-mode flows (auth/linking/verification).
- **Database** (Cloud DB):
  - collections for users, sessions, messages, mood entries, tutor entities, insights, alerts.
- **Storage** (optional): for voice uploads if used (ideally avoid storing raw audio in MVP).

## Key design decision: transcript privacy boundary
- **Child transcript store**: persisted per child, accessible only within child context (and for safety audit if required).
- **Parent insight store**: derived summaries, trend metrics, tags, and risk events—**no verbatim chat content**.

## Message processing pipeline (happy path)
1. Child submits message (text or STT result).
2. Client runs `safetyFilter` locally:
   - keyword scan + lightweight sentiment proxy (MVP).
   - if high risk: mark request as `risk_hint`.
3. Cloud function `chat.sendMessage`:
   - calls `msgSecCheck` (input).
   - persists message.
   - composes LLM prompt (persona + relevant memory).
   - calls LLM API (DeepSeek / Zhipu).
   - calls `msgSecCheck` (output) if required.
   - persists assistant response.
4. Returns response to client.

## Risk escalation pipeline
Trigger conditions (MVP):
- High-risk keyword hit OR sentiment score below threshold.

Flow:
1. Set `high_risk_flag` on the session + log `alert_event` (severity, category).
2. Call `alert.triggerParent` (subscribe message) + store event.
3. LLM response switches to “Professional Support” tone + encourages trusted adult outreach + hotline placeholder.

## Performance & cost considerations
- Keep memory short: use summarized memory (entities + tags) rather than long transcripts.
- Cache persona/system prompt on client; send only deltas.
- Prefer server-side LLM calls (protect API keys).

## Security considerations
- Never embed LLM API keys in client.
- Use per-user auth context (OpenID) on WXCloud.
- Minimize sensitive data: store insights rather than raw content for parents.


