// Local safety triage (MVP).
// This runs client-side for fast detection and to attach hints to the server call.
// Authoritative decisions must happen server-side.

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

// Very lightweight sentiment proxy for MVP: flags strong negative cues.
// Replace with a model-based scorer later (server-side).
function naiveSentimentScore(text) {
  const t = text || ''
  const negative = ['讨厌', '崩溃', '受不了', '绝望', '没用', '废物', '很累', '压力大']
  const hit = negative.filter((k) => t.includes(k)).length
  // 1.0 = positive/neutral, 0.0 = very negative
  return Math.max(0, 1 - hit * 0.18)
}

export function safetyTriage(text) {
  const sentimentScore = naiveSentimentScore(text)
  const containsHighRiskKeywords = containsAny(text, HIGH_RISK_KEYWORDS)
  const riskHint = containsHighRiskKeywords || sentimentScore < 0.2

  return {
    sentimentScore,
    containsHighRiskKeywords,
    riskHint,
    matchedKeywords: containsHighRiskKeywords
      ? HIGH_RISK_KEYWORDS.filter((k) => (text || '').includes(k))
      : []
  }
}


