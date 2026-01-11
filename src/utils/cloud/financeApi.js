/**
 * Client wrapper for finance-related cloud function calls.
 */

/**
 * Calculate commission for an order
 * @param {string} orderId - Order ID
 * @returns {Promise<Object>} Commission calculation result
 */
export async function calculateCommission(orderId) {
  if (!orderId) {
    throw new Error('Missing required field: orderId')
  }
  
  // #ifdef MP-WEIXIN
  if (typeof wx !== 'undefined' && wx.cloud && wx.cloud.callFunction) {
    const { result } = await wx.cloud.callFunction({
      name: 'distribution.calculateCommission',
      data: { orderId }
    })
    
    if (result.error) {
      throw new Error(result.message || 'Failed to calculate commission')
    }
    
    return result
  }
  // #endif
  
  // #ifndef MP-WEIXIN
  if (typeof uniCloud !== 'undefined' && uniCloud.callFunction) {
    const { result } = await uniCloud.callFunction({
      name: 'distribution.calculateCommission',
      data: { orderId }
    })
    
    if (result.error) {
      throw new Error(result.message || 'Failed to calculate commission')
    }
    
    return result
  }
  // #endif
  
  // Dev fallback
  console.warn('[financeApi] no cloud call method; returning stub response')
  return {
    success: true,
    commissions: [],
    message: 'Commission calculated (stub)'
  }
}

/**
 * Request withdrawal
 * @param {Object} params
 * @param {string} params.applicantType - 'teacher' | 'distributor'
 * @param {number} params.amount - Amount in cents
 * @returns {Promise<Object>} Withdrawal request result
 */
export async function requestWithdrawal(params) {
  const { applicantType, amount } = params
  
  if (!applicantType || !amount) {
    throw new Error('Missing required fields: applicantType, amount')
  }
  
  if (amount <= 0) {
    throw new Error('Amount must be greater than 0')
  }
  
  const data = {
    applicantType,
    amount
  }
  
  // #ifdef MP-WEIXIN
  if (typeof wx !== 'undefined' && wx.cloud && wx.cloud.callFunction) {
    const { result } = await wx.cloud.callFunction({
      name: 'finance.requestWithdrawal',
      data
    })
    
    if (result.error) {
      throw new Error(result.message || 'Failed to request withdrawal')
    }
    
    return result
  }
  // #endif
  
  // Dev fallback
  console.warn('[financeApi] no cloud call method; returning stub response')
  return {
    success: true,
    withdrawalId: `withdrawal_${Date.now()}`,
    withdrawalNo: `WD${Date.now()}`,
    status: 'pending',
    message: '提现申请已提交，等待审核'
  }
}

/**
 * Get withdrawal history
 * @param {Object} params
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.pageSize - Page size (default: 20)
 * @returns {Promise<Object>} Withdrawal history
 */
export async function getWithdrawalHistory(params = {}) {
  const { page = 1, pageSize = 20 } = params
  
  // TODO: Create finance.getWithdrawalHistory cloud function
  // For now, return stub data
  
  // #ifdef MP-WEIXIN
  if (typeof wx !== 'undefined' && wx.cloud && wx.cloud.callFunction) {
    // const { result } = await wx.cloud.callFunction({
    //   name: 'finance.getWithdrawalHistory',
    //   data: { page, pageSize }
    // })
    // return result
    
    // Stub response
    return {
      withdrawals: [],
      total: 0,
      page,
      pageSize
    }
  }
  // #endif
  
  // Dev fallback
  console.warn('[financeApi] no cloud call method; returning stub response')
  return {
    withdrawals: [],
    total: 0,
    page,
    pageSize
  }
}
