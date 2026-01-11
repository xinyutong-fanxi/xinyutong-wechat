# Agentic Development Loop

This repository is configured so Cursor AI follows a **two-agent workflow** on every prompt:

1. **AI Architect** produces a plan + acceptance criteria and hands off to Lead Engineer.
2. **Lead Engineer** implements the plan in code, iterating in small slices.
3. **AI Architect** validates the implementation and requests fixes until it states **APPROVED**.

## Where this is configured
- `.cursorrules` (primary enforcement)
- `.cursor/rules/` (role checklists + workflow details)

If you want to disable this behavior for a single prompt, explicitly say:
> "Skip the architect/engineer loop for this request."


