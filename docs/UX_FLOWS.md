# UX Flows & Information Architecture

## Page map (uni-app routes)
- **Child**
  - `/pages/index/index` — Chat entry + mood picker + chat
  - `/pages/child/onboarding` — lightweight intro + privacy + safety notice (age-appropriate)
  - `/pages/child/mood` — mood picker (may be modal in chat)
  - `/pages/child/settings` — nickname/avatar, privacy, guardian link status
- **Parent**
  - `/pages/parent/login` — guardian auth (phone-linked)
  - `/pages/parent/verify` — real-name verification (if required/available)
  - `/pages/parent/dashboard` — weekly insights + alerts history
  - `/pages/parent/settings` — notification opt-in, child link management

## Primary user journeys

### A) Child first run (happy path)
1. Open mini program → see onboarding (what it is, privacy, safety boundaries).
2. Enter chat → choose mood (emoji + optional “why”).
3. Send message → receive empathetic response.
4. If guardian is required before chat: show a friendly lock screen explaining “需要家长开启守护模式”.

### B) Daily child chat session
1. Open → mood picker shown (quick tap).
2. Chat messages in bubbles; optional “Venting” (voice to text).
3. The assistant remembers: recurring stressors + tutor mentions.
4. If risk escalates: UI subtly shifts to “support mode” (calm colors, shorter prompts, encourages reaching out).

### C) Parent setup (guardian mode)
1. Parent opens parent portal → phone login.
2. Accept terms (safety, privacy, what is *not* shared).
3. Verification flow (if applicable).
4. Link to child account (QR code or device-based linking; see open questions).
5. Enable notifications (WeChat subscribe message consent).

### D) Parent weekly review
1. Dashboard shows 7-day pressure trend and notes (summaries).
2. Tutor fit trend: “摩擦点” tags (e.g., “老师语速快/声音大”).
3. Alerts history: timestamp + risk category + actions taken (no transcript).

### E) Risk escalation (red line)
1. Child message triggers local triage → `containsHighRiskKeywords` or sentiment below threshold.
2. Call `msgSecCheck` (platform content safety).
3. Set `high_risk_flag` for the session.
4. Trigger parent alert cloud function.
5. Assistant responds in “Professional Support” tone + hotline placeholder + encourages reaching a trusted adult.

## UX principles (child)
- **Empathy first**: always validate feelings before guidance.
- **Low cognitive load**: minimal UI, short microcopy, avoid long forms.
- **Non-judgmental language**: avoid “should/必须”.
- **Privacy clarity**: explain what parents can see (summaries + safety alerts only).

## UX principles (parent)
- **Safety without surveillance**: insight not transcript.
- **Actionable summaries**: “what changed”, “what might help”, “when to check in”.
- **Clear alert severity**: green/yellow/red with guidance and resources.

## Key UI components (MVP)
- Chat message list (virtualized if needed).
- Message bubble (child vs assistant).
- Mood picker row (emoji + label).
- Venting button (press-to-talk).
- Safety banner (only during escalation).
- Parent dashboard charts (7 days) + insight cards.


