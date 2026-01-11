/**
 * WXCloud Function: alert.triggerParent
 * Sends a subscribe-message notification and records an alert event.
 *
 * NOTE: This is a stub. Actual WeChat subscribe-message sending requires template IDs and user consent.
 */

exports.main = async (event, context) => {
  const { childOpenId, severity, category, riskScore } = event || {}
  const parentOpenId = 'TODO_PARENT_OPENID' // TODO: look up linked parent

  // TODO: write to `alerts` collection
  // TODO: send subscribe message via WeChat API

  return {
    status: 'queued',
    meta: {
      parentOpenId,
      childOpenId,
      severity,
      category,
      riskScore
    }
  }
}


