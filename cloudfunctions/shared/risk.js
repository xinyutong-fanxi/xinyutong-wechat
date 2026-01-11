const HIGH_RISK_KEYWORDS = [
  '不想活了',
  '想死',
  '自杀',
  '割腕',
  '离开',
  '放弃一切',
  '活着没意思',
  '结束生命'
]

function containsAny(text, keywords) {
  const t = (text || '').toLowerCase()
  return keywords.some((k) => t.includes(String(k).toLowerCase()))
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n))
}

/**
 * MVP risk scoring. Replace with a proper model later.
 * Returns a normalized risk object used by the pipeline.
 */
function scoreRisk({ content, clientTriage }) {
  const keywordHit = containsAny(content, HIGH_RISK_KEYWORDS)
  const clientSentiment =
    clientTriage && typeof clientTriage.sentimentScore === 'number'
      ? clientTriage.sentimentScore
      : 1

  // Simple scoring: keyword hit dominates; otherwise use (1 - sentiment) as risk.
  const base = keywordHit ? 1 : clamp(1 - clientSentiment, 0, 1)

  const highRiskFlag = keywordHit || base >= 0.8
  const category = keywordHit ? 'self_harm' : highRiskFlag ? 'high' : base >= 0.5 ? 'medium' : 'low'

  return {
    highRiskFlag,
    category,
    riskScore: base
  }
}

module.exports = { scoreRisk }


