/**
 * Client wrapper for payments-related cloud function calls.
 */

/**
 * Get payments list for current parent
 * @param {Object} params
 * @param {string} params.status - Filter by status ('all' | 'pending' | 'paid' | 'failed' | 'refunded')
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.pageSize - Page size (default: 20)
 * @returns {Promise<Object>} Payments list
 */
export async function getPayments(params = {}) {
  const { status = 'all', page = 1, pageSize = 20 } = params
  
  // TODO: Create payment.list cloud function or use direct DB query
  // For now, return stub data
  
  // #ifdef MP-WEIXIN
  if (typeof wx !== 'undefined' && wx.cloud && wx.cloud.callFunction) {
    // const { result } = await wx.cloud.callFunction({
    //   name: 'payment.list',
    //   data: { status, page, pageSize }
    // })
    // return result
    
    // Stub response
    return {
      payments: [],
      total: 0,
      page,
      pageSize
    }
  }
  // #endif
  
  // #ifndef MP-WEIXIN
  if (typeof uniCloud !== 'undefined' && uniCloud.callFunction) {
    // const { result } = await uniCloud.callFunction({
    //   name: 'payment.list',
    //   data: { status, page, pageSize }
    // })
    // return result
    
    // Stub response
    return {
      payments: [],
      total: 0,
      page,
      pageSize
    }
  }
  // #endif
  
  // Dev fallback
  console.warn('[paymentsApi] no cloud call method; returning stub response')
  return {
    payments: [],
    total: 0,
    page,
    pageSize
  }
}
