# Product Brief — XinLing Companion (心灵伙伴)

## Mission
Provide a safe, culturally fluent “third space” chat companion for Chinese students (8–16) to vent, reflect, and develop coping strategies—while giving parents **safety insights** without violating the child’s trust.

## Target users
- **Primary**: students (8–16) under academic pressure (内卷), tutor/teacher relationship stress, social anxiety.
- **Secondary**: parents/guardians who want safety monitoring, trend insights, and timely alerts.

## Core promise (must hold)
- **To the child**: private, supportive, non-judgmental conversation.
- **To the parent**: safety is prioritized; *alerts and trend summaries* are available without exposing transcripts.

## Key features (MVP)
### Child
- Mood picker at session start (simple emoji + optional label).
- Chat UI with “Older Sibling” persona (星辰/Xingchen).
- Lightweight memory: tutor/teacher entities + sentiment signals + recurring stressors.
- “Venting” button: rapid speech-to-text (WeChat/uni-app voice input).

### Parent
- Guardian mode (phone-linked auth; real-name verification requirement).
- Weekly insights: stress trend, tutoring compatibility trend, risk level trend.
- Alerts: immediate notifications on “red line” signals (self-harm / severe withdrawal).

### Safety layer
- Local keyword triage + sentiment/risk scoring.
- WeChat Content Security `msgSecCheck` (input and/or generated content).
- Escalation mode: empathetic emergency response + parent alert + guidance placeholder.

## Non-goals (initial)
- Full clinical diagnosis or therapy.
- Sharing chat transcripts with parents.
- Social features (friends, groups).

## Success metrics (initial)
- Child retention: 7-day return rate.
- Safety precision/recall proxy: % of alerts confirmed meaningful by parent (feedback).
- Time-to-first-supportive-response: median latency.
- Guardian completion rate: % households completing guardian verification.

## Open questions
- Real-name verification specifics (WeChat capability + compliance expectation).
- Notification channel: subscribe message vs other push method (WeChat Mini Program constraints).
- LLM vendor choice (DeepSeek-V3 vs Zhipu GLM-4), cost/latency targets, region compliance.


