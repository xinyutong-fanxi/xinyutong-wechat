# Safety & Compliance (MVP Policy)

## Principles
- **Safety over privacy** only for *imminent risk*; otherwise prioritize child trust.
- **Data minimization**: store only what is needed to deliver the feature.
- **No clinical claims**: the assistant is not a doctor; it offers supportive guidance and encourages trusted adults/professional resources when needed.

## Safety layers (required)
1. **Local triage (client)**: keyword triage + lightweight sentiment proxy.
2. **WeChat Content Security**: `msgSecCheck` for user content (and optionally assistant content).
3. **Server-side risk scoring**: authoritative risk decision in `chat.sendMessage`.
4. **Escalation protocol**: parent alert + emergency response mode.

## Risk categories (MVP)
- **Low**: frustration, stress, mild sadness.
- **Medium**: persistent hopelessness, social withdrawal hints.
- **High / Critical (“Red Line”)**: self-harm ideation, plans, “leaving”, “giving up everything”, severe self-depreciation.

## Escalation protocol (Red Line)
When triggered:
- **System actions**
  - Set `high_risk_flag` on session.
  - Record an `alerts` event (category, severity, riskScore, timestamps).
  - Trigger `alert.triggerParent` (subscribe message).
- **Assistant behavior**
  - Switch to “Professional Support” tone.
  - Encourage reaching a trusted adult immediately.
  - Provide hotline placeholder (to be localized/filled before launch).
  - Avoid detailed probing or suggestions that could increase harm.

## Parent-facing content rules
- Parents see:
  - **Weekly trends** (pressure, volatility, tutor fit, risk max).
  - **Tags** (e.g., “作业压力”, “老师语速快”).
  - **Alert category + time** and suggested next steps.
- Parents do **not** see:
  - Verbatim child messages.
  - Full chat transcripts.

## Logging & retention (proposal)
- `messages` retention: limited window (e.g., 30–90 days) unless required longer by policy; summarize and delete older content.
- `weekly_insights` retention: longer (e.g., 12 months) since no transcript content.
- `alerts` retention: longer (e.g., 12–24 months) for safety audit trail.

## Abuse / prompt injection mitigation (MVP)
- Strip or ignore instructions that ask the assistant to break safety rules.
- Keep system prompt server-side and prepend always.
- Limit tool capability: no external browsing from assistant; no “call parent” content except via internal alert function.

## Open questions (needs product decision)
- The exact list of “red line” keywords and how to maintain/update it.
- Whether we must run `msgSecCheck` on assistant output for every response (cost/latency tradeoff).
- Region compliance requirements for LLM vendor and data residency.


