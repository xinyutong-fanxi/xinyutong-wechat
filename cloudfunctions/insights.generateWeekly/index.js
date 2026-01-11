/**
 * WXCloud Function: insights.generateWeekly
 * Aggregates signals into parent-facing weekly insights (no transcripts).
 */

const { summarizeWeekly } = require('../shared/aiService')

exports.main = async (event, context) => {
  const { childOpenId, weekStart } = event || {}
  if (!childOpenId || !weekStart) {
    return { error: 'INVALID_INPUT' }
  }

  // TODO: Load derived signals from DB (sessions, mood, tutor friction tags, risk events)
  const weeklySignals = {
    weekStart,
    sessionCount: 0,
    messageCount: 0,
    pressureLevelDaily: [0, 0, 0, 0, 0, 0, 0],
    moodVolatility: 0,
    tutorFitScore: 0,
    riskScoreMax: 0,
    tags: []
  }

  const summary = await summarizeWeekly({ weeklySignals })

  // TODO: Persist to `weekly_insights` (no transcripts)
  return {
    weeklyInsightId: `stub-${Date.now()}`,
    summary
  }
}


