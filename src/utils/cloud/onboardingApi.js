// Client wrapper for onboarding/consent related cloud functions.

function canUseWxCloud() {
  return typeof wx !== 'undefined' && wx.cloud && typeof wx.cloud.callFunction === 'function'
}

function getLocalStatus() {
  const profile = uni.getStorageSync('local_child_profile')
  const consent = uni.getStorageSync('local_parent_consent')
  return {
    hasProfile: !!profile,
    hasParentConsent: !!consent,
    pairingCode: (uni.getStorageSync('local_pairing_code') || '').trim() || null,
    childProfile: profile || null
  }
}

export async function getChildOnboardingStatus() {
  if (canUseWxCloud()) {
    const { result } = await wx.cloud.callFunction({
      name: 'child.getStatus',
      data: {}
    })
    return result
  }

  const local = getLocalStatus()
  return {
    ok: true,
    hasProfile: local.hasProfile,
    hasParentConsent: local.hasParentConsent,
    pairingCode: local.pairingCode
  }
}

export async function registerChildStart({ childProfile, guardianContact }) {
  if (canUseWxCloud()) {
    const { result } = await wx.cloud.callFunction({
      name: 'child.registerStart',
      data: { childProfile, guardianContact }
    })
    return result
  }

  uni.setStorageSync('local_child_profile', childProfile || {})
  const code = String(Math.floor(100000 + Math.random() * 900000))
  uni.setStorageSync('local_pairing_code', code)
  return {
    ok: true,
    pairingCode: code
  }
}

export async function parentConsentComplete({ pairingCode, relationship, consentChecked }) {
  if (canUseWxCloud()) {
    const { result } = await wx.cloud.callFunction({
      name: 'guardian.consentComplete',
      data: { pairingCode, relationship, consentChecked }
    })
    return result
  }

  if (!consentChecked) {
    return { ok: false, error: 'CONSENT_REQUIRED' }
  }
  uni.setStorageSync('local_parent_consent', {
    pairingCode,
    relationship: relationship || 'guardian',
    consentedAt: Date.now()
  })
  return { ok: true }
}

