/**
 * Client wrapper for payment-related cloud function calls.
 */

/**
 * Create WeChat Pay payment
 * @param {Object} params
 * @param {string} params.orderId - Order ID
 * @param {number} params.amount - Amount in cents
 * @param {string} params.description - Payment description
 * @returns {Promise<Object>} Payment parameters for wx.requestPayment()
 */
export async function createPayment(params) {
  const { orderId, amount, description = '心理咨询服务' } = params
  
  if (!orderId || !amount) {
    throw new Error('Missing required fields: orderId, amount')
  }
  
  if (amount <= 0) {
    throw new Error('Amount must be greater than 0')
  }
  
  const data = {
    orderId,
    amount,
    description
  }
  
  // #ifdef MP-WEIXIN
  if (typeof wx !== 'undefined' && wx.cloud && wx.cloud.callFunction) {
    const { result } = await wx.cloud.callFunction({
      name: 'payment.createPayment',
      data
    })
    
    if (result.error) {
      throw new Error(result.message || 'Failed to create payment')
    }
    
    return result
  }
  // #endif
  
  // #ifndef MP-WEIXIN
  if (typeof uniCloud !== 'undefined' && uniCloud.callFunction) {
    const { result } = await uniCloud.callFunction({
      name: 'payment.createPayment',
      data
    })
    
    if (result.error) {
      throw new Error(result.message || 'Failed to create payment')
    }
    
    return result
  }
  // #endif
  
  // Dev fallback
  console.warn('[paymentApi] no cloud call method; returning stub response')
  return {
    paymentId: `payment_${Date.now()}`,
    paymentNo: `PAY${Date.now()}`,
    timeStamp: Math.floor(Date.now() / 1000).toString(),
    nonceStr: 'dev_nonce',
    package: 'prepay_id=dev_prepay_id',
    signType: 'MD5',
    paySign: 'dev_sign'
  }
}
