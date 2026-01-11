/**
 * WXCloud Function: payment.handleCallback
 * Handles WeChat Pay payment callback (notify URL).
 * 
 * This function should be called by WeChat Pay server when payment is completed.
 * It verifies the signature, updates payment and order status, and triggers booking confirmation.
 * 
 * Input (from WeChat Pay XML):
 * - return_code: 'SUCCESS' | 'FAIL'
 * - result_code: 'SUCCESS' | 'FAIL'
 * - out_trade_no: string (order number)
 * - transaction_id: string (WeChat Pay transaction ID)
 * - total_fee: number (amount in cents)
 * - sign: string (signature)
 * - ... other WeChat Pay callback fields
 * 
 * Output (XML response for WeChat Pay):
 * - <xml><return_code><![CDATA[SUCCESS]]></return_code><return_msg><![CDATA[OK]]></return_msg></xml>
 */

// const cloud = require('wx-server-sdk')
// cloud.init()
const crypto = require('crypto')
const xml2js = require('xml2js')

const db = null // TODO: Initialize with cloud.database() when WXCloud is set up

const WECHAT_PAY_CONFIG = {
  apiKey: process.env.WECHAT_PAY_API_KEY || 'your_api_key'
}

function verifySign(params, sign) {
  const calculatedSign = generateSign(params, WECHAT_PAY_CONFIG.apiKey)
  return calculatedSign === sign
}

function generateSign(params, apiKey) {
  const sortedKeys = Object.keys(params).sort()
  const signString = sortedKeys
    .filter(key => params[key] && key !== 'sign')
    .map(key => `${key}=${params[key]}`)
    .join('&')
  
  const signStringWithKey = `${signString}&key=${apiKey}`
  const md5Hash = crypto.createHash('md5').update(signStringWithKey, 'utf8').digest('hex')
  return md5Hash.toUpperCase()
}

function parseXML(xmlString) {
  return new Promise((resolve, reject) => {
    const parser = new xml2js.Parser({ explicitArray: false, ignoreAttrs: true })
    parser.parseString(xmlString, (err, result) => {
      if (err) reject(err)
      else resolve(result.xml)
    })
  })
}

function buildXMLResponse(returnCode, returnMsg) {
  return `<xml><return_code><![CDATA[${returnCode}]]></return_code><return_msg><![CDATA[${returnMsg}]]></return_msg></xml>`
}

async function updateOrderStatus(orderNo, transactionId, amount) {
  // TODO: Update order in DB
  // const orderResult = await db.collection('orders')
  //   .where({ orderNo })
  //   .get()
  // 
  // if (orderResult.data.length === 0) {
  //   throw new Error('Order not found')
  // }
  // 
  // const order = orderResult.data[0]
  // 
  // if (order.amount !== amount) {
  //   throw new Error('Amount mismatch')
  // }
  // 
  // if (order.status === 'paid') {
  //   // Already processed, return order info
  //   return {
  //     orderId: order._id,
  //     parentOpenId: order.parentOpenId,
  //     referralCode: order.referralCode,
  //     isFirstOrder: false
  //   }
  // }
  // 
  // // Check if this is parent's first paid order
  // const previousOrdersResult = await db.collection('orders')
  //   .where({
  //     parentOpenId: order.parentOpenId,
  //     status: 'paid'
  //   })
  //   .get()
  // 
  // const isFirstOrder = previousOrdersResult.data.length === 0
  // 
  // // Update order status
  // await db.collection('orders').doc(order._id).update({
  //   data: {
  //     status: 'paid',
  //     paymentTransactionId: transactionId,
  //     paidAt: new Date()
  //   }
  // })
  // 
  // // Update payment status
  // const paymentResult = await db.collection('payments')
  //   .where({ orderId: order._id })
  //   .get()
  // 
  // if (paymentResult.data.length > 0) {
  //   await db.collection('payments').doc(paymentResult.data[0]._id).update({
  //     data: {
  //       status: 'paid',
  //       wechatPayTransactionId: transactionId,
  //       paidAt: new Date()
  //     }
  //   })
  // }
  // 
  // // Update booking payment status
  // await db.collection('bookings').where({ orderId: order._id }).update({
  //   data: {
  //     paymentStatus: 'paid'
  //   }
  // })
  // 
  // // Return order info for referral tracking
  // return {
  //   orderId: order._id,
  //   parentOpenId: order.parentOpenId,
  //   referralCode: order.referralCode,
  //   isFirstOrder
  // }
  
  // Placeholder
  return {
    orderId: `order_${Date.now()}`,
    parentOpenId: 'parent_123',
    referralCode: null,
    isFirstOrder: false
  }
}

exports.main = async (event, context) => {
  // WeChat Pay callback sends XML data
  const xmlData = event.xml || event.body || event
  
  if (typeof xmlData === 'string') {
    try {
      const parsedData = await parseXML(xmlData)
      
      const {
        return_code,
        result_code,
        out_trade_no,
        transaction_id,
        total_fee,
        sign,
        ...otherParams
      } = parsedData
      
      // 1. Verify return_code
      if (return_code !== 'SUCCESS') {
        return {
          xml: buildXMLResponse('FAIL', 'Invalid return_code'),
          statusCode: 400
        }
      }
      
      // 2. Verify signature
      const allParams = { return_code, result_code, out_trade_no, transaction_id, total_fee, ...otherParams }
      if (!verifySign(allParams, sign)) {
        return {
          xml: buildXMLResponse('FAIL', 'Invalid signature'),
          statusCode: 400
        }
      }
      
      // 3. Verify result_code
      if (result_code !== 'SUCCESS') {
        // Payment failed, but return SUCCESS to WeChat Pay to acknowledge receipt
        return {
          xml: buildXMLResponse('SUCCESS', 'OK'),
          statusCode: 200
        }
      }
      
      // 4. Update order and payment status
      try {
        const amount = parseInt(total_fee)
        const orderUpdate = await updateOrderStatus(out_trade_no, transaction_id, amount)
        
        // 5. Track referral on first order (if applicable)
        // TODO: Check if this is parent's first paid order
        // If yes, call distribution.trackReferral with action 'firstOrder'
        // if (orderUpdate && orderUpdate.isFirstOrder) {
        //   const { trackReferralOnFirstOrder } = require('../distribution/trackReferral/index.js')
        //   await trackReferralOnFirstOrder({
        //     action: 'firstOrder',
        //     orderId: orderUpdate.orderId
        //   })
        //   
        //   // Calculate commission for referral
        //   const { calculateCommission } = require('../distribution/calculateCommission/index.js')
        //   await calculateCommission({
        //     orderId: orderUpdate.orderId
        //   })
        // }
        
        // 6. Trigger booking confirmation flow (booking status remains 'pending' until teacher confirms)
        // TODO: Send notification to teacher
        
        return {
          xml: buildXMLResponse('SUCCESS', 'OK'),
          statusCode: 200
        }
      } catch (updateError) {
        console.error('updateOrderStatus error:', updateError)
        // Still return SUCCESS to WeChat Pay, but log error for manual processing
        return {
          xml: buildXMLResponse('SUCCESS', 'OK'),
          statusCode: 200,
          error: updateError.message
        }
      }
    } catch (parseError) {
      console.error('parseXML error:', parseError)
      return {
        xml: buildXMLResponse('FAIL', 'Invalid XML format'),
        statusCode: 400
      }
    }
  }
  
  // If not XML, might be called directly for testing
  return {
    error: 'INVALID_FORMAT',
    message: 'Expected XML format from WeChat Pay callback',
    statusCode: 400
  }
}
