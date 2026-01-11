/**
 * WXCloud Function: safety.msgSecCheckProxy
 * Wraps WeChat Content Security API `msgSecCheck` and normalizes results.
 *
 * NOTE: Implementation depends on your WXCloud runtime/API availability.
 */

// TODO: Replace with actual invocation to WeChat Content Security API.
// In some setups, you call an HTTP endpoint with access_token; in others, SDK helpers exist.

exports.main = async (event, context) => {
  const { scene, content } = event || {}
  if (!content || typeof content !== 'string') {
    return { result: 'reject', raw: { error: 'INVALID_INPUT' } }
  }

  // TODO: call msgSecCheck
  // For now, always pass.
  return {
    result: 'pass',
    raw: {
      scene: scene || 'unknown',
      stub: true
    }
  }
}


