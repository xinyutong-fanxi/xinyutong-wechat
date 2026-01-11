/**
 * Client wrapper for teacher earnings-related cloud function calls.
 */

/**
 * Get teacher earnings statistics
 * @param {Object} params
 * @param {string} params.period - Period filter ('today' | 'week' | 'month' | 'all')
 * @returns {Promise<Object>} Earnings statistics
 */
export async function getTeacherEarnings(params = {}) {
  const { period = 'all' } = params
  
  // TODO: Create teacher.getEarnings cloud function or use direct DB query
  // For now, return stub data
  
  // #ifdef MP-WEIXIN
  if (typeof wx !== 'undefined' && wx.cloud && wx.cloud.callFunction) {
    // const { result } = await wx.cloud.callFunction({
    //   name: 'teacher.getEarnings',
    //   data: { period }
    // })
    // return result
    
    // Stub response
    return {
      totalEarnings: 0, // in cents
      availableBalance: 0, // in cents (total - withdrawn)
      withdrawnAmount: 0, // in cents
      earnings: [] // List of earning transactions
    }
  }
  // #endif
  
  // #ifndef MP-WEIXIN
  if (typeof uniCloud !== 'undefined' && uniCloud.callFunction) {
    // const { result } = await uniCloud.callFunction({
    //   name: 'teacher.getEarnings',
    //   data: { period }
    // })
    // return result
    
    // Stub response
    return {
      totalEarnings: 0,
      availableBalance: 0,
      withdrawnAmount: 0,
      earnings: []
    }
  }
  // #endif
  
  // Dev fallback
  console.warn('[teacherEarningsApi] no cloud call method; returning stub response')
  return {
    totalEarnings: 0,
    availableBalance: 0,
    withdrawnAmount: 0,
    earnings: []
  }
}
