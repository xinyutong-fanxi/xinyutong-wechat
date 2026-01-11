/**
 * WXCloud Function: guardian.verify
 * Handles guardian-mode flows (start/complete/status/linkChild).
 */

exports.main = async (event, context) => {
  const { action, payload } = event || {}
  const openid = (context && context.OPENID) || 'dev-openid'

  // TODO: Implement:
  // - phone-linked auth handling (WeChat login/openid linkage)
  // - optional real-name verification status
  // - child-parent linking (QR/pairing code)

  return {
    openid,
    action: action || 'status',
    status: {
      verificationStatus: 'unverified',
      guardianModeEnabled: false,
      linkedChildOpenId: null
    },
    echo: payload || null
  }
}


