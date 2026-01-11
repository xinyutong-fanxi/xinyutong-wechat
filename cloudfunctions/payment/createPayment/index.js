/**
 * WXCloud Function: payment.createPayment
 * Creates WeChat Pay payment for an order.
 * 
 * Input:
 * - orderId: string
 * - amount: number (in cents)
 * - description: string
 * 
 * Output:
 * - paymentId: string
 * - paymentNo: string
 * - timeStamp: string
 * - nonceStr: string
 * - package: string (prepay_id)
 * - signType: string ('RSA' | 'MD5')
 * - paySign: string
 */

// const cloud = require('wx-server-sdk')
// cloud.init()
const crypto = require('crypto')

const db = null // TODO: Initialize with cloud.database() when WXCloud is set up

// WeChat Pay configuration (should be in environment variables or config file)
const WECHAT_PAY_CONFIG = {
  appId: process.env.WECHAT_APPID || 'your_appid',
  mchId: process.env.WECHAT_MCHID || 'your_mchid',
  apiKey: process.env.WECHAT_PAY_API_KEY || 'your_api_key',
  certPath: process.env.WECHAT_PAY_CERT_PATH || null,
  notifyUrl: process.env.WECHAT_PAY_NOTIFY_URL || 'https://your-domain.com/api/payment/callback'
}

function generateNonceStr(length = 32) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

function generatePaymentNo() {
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  return `PAY${timestamp}${random}`
}

function generateSign(params, apiKey) {
  // Sort parameters alphabetically
  const sortedKeys = Object.keys(params).sort()
  const signString = sortedKeys
    .filter(key => params[key] && key !== 'sign')
    .map(key => `${key}=${params[key]}`)
    .join('&')
  
  const signStringWithKey = `${signString}&key=${apiKey}`
  
  // MD5 hash (for MD5 sign type) or use RSA for RSA sign type
  const md5Hash = crypto.createHash('md5').update(signStringWithKey, 'utf8').digest('hex')
  return md5Hash.toUpperCase()
}

async function createWeChatPayOrder(orderData) {
  // This is a placeholder implementation
  // In production, you would call WeChat Pay unified order API
  // https://pay.weixin.qq.com/wiki/doc/apiv3/apis/chapter3_1_1.shtml
  
  const { orderNo, amount, description, openid } = orderData
  
  const params = {
    appid: WECHAT_PAY_CONFIG.appId,
    mch_id: WECHAT_PAY_CONFIG.mchId,
    nonce_str: generateNonceStr(),
    body: description || '心理咨询服务',
    out_trade_no: orderNo,
    total_fee: amount, // in cents
    spbill_create_ip: '127.0.0.1',
    notify_url: WECHAT_PAY_CONFIG.notifyUrl,
    trade_type: 'JSAPI',
    openid: openid
  }
  
  // Generate sign
  params.sign = generateSign(params, WECHAT_PAY_CONFIG.apiKey)
  
  // TODO: Make actual HTTP request to WeChat Pay API
  // const response = await axios.post('https://api.mch.weixin.qq.com/pay/unifiedorder', params, {
  //   headers: { 'Content-Type': 'application/xml' }
  // })
  // Parse XML response and extract prepay_id
  
  // Placeholder response
  const prepayId = `prepay_${Date.now()}_${generateNonceStr(10)}`
  
  return {
    prepay_id: prepayId,
    return_code: 'SUCCESS',
    result_code: 'SUCCESS'
  }
}

function generatePaymentParams(prepayId, appId, apiKey) {
  const timeStamp = Math.floor(Date.now() / 1000).toString()
  const nonceStr = generateNonceStr()
  const packageValue = `prepay_id=${prepayId}`
  const signType = 'MD5'
  
  const signParams = {
    appId,
    timeStamp,
    nonceStr,
    package: packageValue,
    signType
  }
  
  const paySign = generateSign(signParams, apiKey)
  
  return {
    timeStamp,
    nonceStr,
    package: packageValue,
    signType,
    paySign
  }
}

exports.main = async (event, context) => {
  const { orderId, amount, description } = event || {}
  const openid = (context && context.OPENID) || 'dev-openid'
  
  if (!orderId || !amount) {
    return {
      error: 'INVALID_INPUT',
      message: 'Missing required fields: orderId, amount'
    }
  }
  
  if (amount <= 0) {
    return {
      error: 'INVALID_AMOUNT',
      message: 'Amount must be greater than 0'
    }
  }
  
  try {
    // 1. Verify order exists and is in pending status
    // TODO: Query orders collection
    // const orderResult = await db.collection('orders').doc(orderId).get()
    // const order = orderResult.data
    // 
    // if (!order) {
    //   return { error: 'ORDER_NOT_FOUND', message: 'Order not found' }
    // }
    // 
    // if (order.status !== 'pending') {
    //   return { error: 'INVALID_ORDER_STATUS', message: 'Order is not in pending status' }
    // }
    // 
    // if (order.amount !== amount) {
    //   return { error: 'AMOUNT_MISMATCH', message: 'Amount does not match order amount' }
    // }
    
    // Placeholder order
    const order = {
      _id: orderId,
      orderNo: `XYT${Date.now()}`,
      amount: amount,
      status: 'pending'
    }
    
    // 2. Generate payment number
    const paymentNo = generatePaymentNo()
    
    // 3. Create payment record
    const paymentData = {
      orderId,
      paymentNo,
      amount,
      status: 'pending',
      createdAt: new Date()
    }
    
    // TODO: Save payment to DB
    // const paymentResult = await db.collection('payments').add({ data: paymentData })
    // const paymentId = paymentResult._id
    
    const paymentId = `payment_${Date.now()}`
    
    // 4. Call WeChat Pay unified order API
    const wechatPayResult = await createWeChatPayOrder({
      orderNo: order.orderNo,
      amount,
      description: description || '心理咨询服务',
      openid
    })
    
    if (wechatPayResult.return_code !== 'SUCCESS' || wechatPayResult.result_code !== 'SUCCESS') {
      return {
        error: 'WECHAT_PAY_ERROR',
        message: 'Failed to create WeChat Pay order'
      }
    }
    
    // 5. Update payment record with prepay_id
    // TODO: Update payment in DB
    // await db.collection('payments').doc(paymentId).update({
    //   data: {
    //     wechatPayPrepayId: wechatPayResult.prepay_id
    //   }
    // })
    
    // 6. Generate payment parameters for client
    const paymentParams = generatePaymentParams(
      wechatPayResult.prepay_id,
      WECHAT_PAY_CONFIG.appId,
      WECHAT_PAY_CONFIG.apiKey
    )
    
    return {
      paymentId,
      paymentNo,
      ...paymentParams
    }
  } catch (error) {
    console.error('createPayment error:', error)
    return {
      error: 'INTERNAL_ERROR',
      message: error.message || 'Failed to create payment'
    }
  }
}
