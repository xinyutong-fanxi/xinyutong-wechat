/**
 * Client wrapper for distribution-related cloud function calls.
 */

/**
 * Apply to become a distributor
 * @param {Object} params
 * @param {string} params.distributorType - 'parent' | 'teacher' | 'institution'
 * @param {string} params.description - Optional application description
 * @returns {Promise<Object>} Application result
 */
export async function applyToBecomeDistributor(params) {
  const { distributorType, description = '' } = params
  
  if (!distributorType) {
    throw new Error('Missing required field: distributorType')
  }
  
  const data = {
    distributorType,
    description
  }
  
  // TODO: Create distribution.applyDistributor cloud function
  // For now, return stub data
  
  // #ifdef MP-WEIXIN
  if (typeof wx !== 'undefined' && wx.cloud && wx.cloud.callFunction) {
    // const { result } = await wx.cloud.callFunction({
    //   name: 'distribution.applyDistributor',
    //   data
    // })
    // 
    // if (result.error) {
    //   throw new Error(result.message || 'Failed to apply')
    // }
    // 
    // return result
    
    // Stub response
    return {
      success: true,
      distributorId: `distributor_${Date.now()}`,
      status: 'pending',
      message: '申请已提交，等待审核'
    }
  }
  // #endif
  
  // Dev fallback
  console.warn('[distributionApi] no cloud call method; returning stub response')
  return {
    success: true,
    distributorId: `distributor_${Date.now()}`,
    status: 'pending',
    message: '申请已提交，等待审核'
  }
}

/**
 * Track referral when parent registers
 * @param {string} referralCode - Referral code
 * @returns {Promise<Object>} Tracking result
 */
export async function trackReferralOnRegister(referralCode) {
  if (!referralCode) {
    throw new Error('Missing required field: referralCode')
  }
  
  // #ifdef MP-WEIXIN
  if (typeof wx !== 'undefined' && wx.cloud && wx.cloud.callFunction) {
    const { result } = await wx.cloud.callFunction({
      name: 'distribution.trackReferral',
      data: {
        action: 'register',
        referralCode
      }
    })
    
    if (result.error) {
      throw new Error(result.message || 'Failed to track referral')
    }
    
    return result
  }
  // #endif
  
  // #ifndef MP-WEIXIN
  if (typeof uniCloud !== 'undefined' && uniCloud.callFunction) {
    const { result } = await uniCloud.callFunction({
      name: 'distribution.trackReferral',
      data: {
        action: 'register',
        referralCode
      }
    })
    
    if (result.error) {
      throw new Error(result.message || 'Failed to track referral')
    }
    
    return result
  }
  // #endif
  
  // Dev fallback
  console.warn('[distributionApi] no cloud call method; returning stub response')
  return {
    success: true,
    referralId: `referral_${Date.now()}`
  }
}

/**
 * Track referral when parent makes first order
 * @param {string} orderId - Order ID
 * @returns {Promise<Object>} Tracking result
 */
export async function trackReferralOnFirstOrder(orderId) {
  if (!orderId) {
    throw new Error('Missing required field: orderId')
  }
  
  // #ifdef MP-WEIXIN
  if (typeof wx !== 'undefined' && wx.cloud && wx.cloud.callFunction) {
    const { result } = await wx.cloud.callFunction({
      name: 'distribution.trackReferral',
      data: {
        action: 'firstOrder',
        orderId
      }
    })
    
    if (result.error) {
      throw new Error(result.message || 'Failed to track referral')
    }
    
    return result
  }
  // #endif
  
  // #ifndef MP-WEIXIN
  if (typeof uniCloud !== 'undefined' && uniCloud.callFunction) {
    const { result } = await uniCloud.callFunction({
      name: 'distribution.trackReferral',
      data: {
        action: 'firstOrder',
        orderId
      }
    })
    
    if (result.error) {
      throw new Error(result.message || 'Failed to track referral')
    }
    
    return result
  }
  // #endif
  
  // Dev fallback
  console.warn('[distributionApi] no cloud call method; returning stub response')
  return {
    success: true,
    message: 'Referral tracked'
  }
}

/**
 * Generate promotional poster
 * @param {string} template - Optional template ID
 * @returns {Promise<Object>} Poster generation result
 */
export async function generatePoster(template = 'default') {
  // #ifdef MP-WEIXIN
  if (typeof wx !== 'undefined' && wx.cloud && wx.cloud.callFunction) {
    const { result } = await wx.cloud.callFunction({
      name: 'distribution.generatePoster',
      data: { template }
    })
    
    if (result.error) {
      throw new Error(result.message || 'Failed to generate poster')
    }
    
    return result
  }
  // #endif
  
  // #ifndef MP-WEIXIN
  if (typeof uniCloud !== 'undefined' && uniCloud.callFunction) {
    const { result } = await uniCloud.callFunction({
      name: 'distribution.generatePoster',
      data: { template }
    })
    
    if (result.error) {
      throw new Error(result.message || 'Failed to generate poster')
    }
    
    return result
  }
  // #endif
  
  // Dev fallback
  console.warn('[distributionApi] no cloud call method; returning stub response')
  return {
    success: true,
    posterUrl: 'https://placeholder.com/poster.png',
    qrCodeUrl: 'https://placeholder.com/qrcode.png',
    referralCode: 'XYTABC123'
  }
}

/**
 * Get distribution stats
 * @param {Object} params
 * @param {string} params.tab - Tab filter ('referrals' | 'commissions' | 'all')
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.pageSize - Page size (default: 20)
 * @returns {Promise<Object>} Distribution statistics
 */
export async function getDistributionStats(params = {}) {
  const { tab = 'all', page = 1, pageSize = 20 } = params
  
  // TODO: Create distribution.getStats cloud function
  // For now, return stub data
  
  // #ifdef MP-WEIXIN
  if (typeof wx !== 'undefined' && wx.cloud && wx.cloud.callFunction) {
    // const { result } = await wx.cloud.callFunction({
    //   name: 'distribution.getStats',
    //   data: { tab, page, pageSize }
    // })
    // return result
    
    // Stub response
    return {
      totalReferrals: 0,
      totalCommission: 0,
      availableBalance: 0,
      withdrawnAmount: 0,
      totalOrders: 0,
      referralCode: '',
      status: 'none',
      referrals: [],
      commissions: []
    }
  }
  // #endif
  
  // Dev fallback
  console.warn('[distributionApi] no cloud call method; returning stub response')
  return {
    totalReferrals: 0,
    totalCommission: 0,
    availableBalance: 0,
    withdrawnAmount: 0,
    totalOrders: 0,
    referralCode: '',
    status: 'none',
    referrals: [],
    commissions: []
  }
}
