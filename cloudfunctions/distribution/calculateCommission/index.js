/**
 * WXCloud Function: distribution.calculateCommission
 * Calculates commission for distributor when order is completed.
 * 
 * Input:
 * - orderId: string
 * 
 * Output:
 * - success: boolean
 * - commissions: Array<{distributorId: string, commissionAmount: number, referralLevel: number}>
 * - message: string
 */

// const cloud = require('wx-server-sdk')
// cloud.init()
const db = null // TODO: Initialize with cloud.database() when WXCloud is set up

// Commission configuration (should be in database or config)
const COMMISSION_CONFIG = {
  platformRate: 0.3, // 30% platform commission
  level1Rate: 0.15, // 15% of order amount for Level 1 referral
  level2Rate: 0.05, // 5% of order amount for Level 2 referral
  commissionOn: 'order_amount' // 'order_amount' | 'platform_fee'
}

async function getOrderDetails(orderId) {
  // TODO: Query orders collection
  // const orderResult = await db.collection('orders').doc(orderId).get()
  // return orderResult.data
  
  // Placeholder
  return {
    _id: orderId,
    parentOpenId: 'parent_123',
    amount: 20000, // 200 yuan in cents
    platformFee: 6000, // 30% of 20000
    teacherEarning: 14000,
    status: 'paid'
  }
}

async function getReferralForOrder(orderId, parentOpenId) {
  // TODO: Query referrals collection
  // Find referral relationship for this parent that matches this order
  // const referralResult = await db.collection('referrals')
  //   .where({ 
  //     referredParentOpenId: parentOpenId,
  //     $or: [
  //       { firstOrderId: orderId },
  //       { totalOrders: db.command.gt(0) }
  //     ]
  //   })
  //   .get()
  // 
  // if (referralResult.data.length === 0) {
  //   return null
  // }
  // 
  // // For this order, find the referral relationship
  // const referral = referralResult.data.find(r => r.firstOrderId === orderId) || referralResult.data[0]
  // return referral
  
  // Placeholder
  return null
}

async function getDistributor(distributorId) {
  // TODO: Query distributors collection
  // const distributorResult = await db.collection('distributors').doc(distributorId).get()
  // return distributorResult.data
  
  // Placeholder
  return {
    _id: distributorId,
    commissionRate: 10, // 10% (may override default)
    status: 'approved'
  }
}

async function calculateCommissionAmount(orderAmount, referralLevel, distributorRate = null) {
  // Calculate commission based on referral level and distributor's rate
  const rate = distributorRate || (referralLevel === 1 ? COMMISSION_CONFIG.level1Rate : COMMISSION_CONFIG.level2Rate)
  
  // Commission can be calculated on order amount or platform fee
  if (COMMISSION_CONFIG.commissionOn === 'platform_fee') {
    const platformFee = Math.round(orderAmount * COMMISSION_CONFIG.platformRate)
    return Math.round(platformFee * rate)
  } else {
    // Commission on order amount
    return Math.round(orderAmount * rate)
  }
}

async function createCommissionRecord(orderId, distributorId, referralLevel, commissionAmount, rate) {
  // Create commission record
  const commissionData = {
    orderId,
    distributorId,
    referralLevel,
    commissionAmount,
    commissionRate: rate * 100, // Store as percentage
    status: 'pending',
    settledAt: null,
    withdrawalId: null,
    createdAt: new Date()
  }
  
  // TODO: Save commission to commissions collection
  // const commissionResult = await db.collection('commissions').add({ data: commissionData })
  // return commissionResult._id
  
  const commissionId = `commission_${Date.now()}`
  return commissionId
}

exports.main = async (event, context) => {
  const { orderId } = event || {}
  
  if (!orderId) {
    return {
      error: 'INVALID_INPUT',
      message: 'Missing required field: orderId'
    }
  }
  
  try {
    // 1. Get order details
    const order = await getOrderDetails(orderId)
    
    if (!order) {
      return {
        error: 'ORDER_NOT_FOUND',
        message: 'Order not found'
      }
    }
    
    if (order.status !== 'paid' && order.status !== 'completed') {
      return {
        error: 'INVALID_ORDER_STATUS',
        message: 'Commission can only be calculated for paid/completed orders'
      }
    }
    
    // 2. Check if commissions already calculated for this order
    // TODO: Query commissions collection
    // const existingCommissions = await db.collection('commissions')
    //   .where({ orderId })
    //   .get()
    // 
    // if (existingCommissions.data.length > 0) {
    //   return {
    //     error: 'COMMISSIONS_ALREADY_CALCULATED',
    //     message: 'Commissions already calculated for this order',
    //     commissions: existingCommissions.data
    //   }
    // }
    
    // 3. Find referral relationship for this order's parent
    const referral = await getReferralForOrder(orderId, order.parentOpenId)
    
    if (!referral) {
      // No referral relationship, no commission
      return {
        success: true,
        commissions: [],
        message: 'No referral relationship found, no commission'
      }
    }
    
    // 4. Get distributor info
    const distributor = await getDistributor(referral.distributorId)
    
    if (!distributor || distributor.status !== 'approved') {
      return {
        error: 'DISTRIBUTOR_NOT_APPROVED',
        message: 'Distributor not approved'
      }
    }
    
    // 5. Calculate commission for Level 1 referral
    const distributorRate = distributor.commissionRate ? distributor.commissionRate / 100 : null
    const level1CommissionAmount = await calculateCommissionAmount(
      order.amount,
      1,
      distributorRate
    )
    
    const commissions = []
    
    // Create Level 1 commission record
    if (level1CommissionAmount > 0) {
      const commissionId = await createCommissionRecord(
        orderId,
        distributor._id,
        1,
        level1CommissionAmount,
        distributorRate || COMMISSION_CONFIG.level1Rate
      )
      
      commissions.push({
        commissionId,
        distributorId: distributor._id,
        referralLevel: 1,
        commissionAmount: level1CommissionAmount
      })
      
      // Update distributor stats
      // TODO: Update distributors collection
      // await db.collection('distributors').doc(distributor._id).update({
      //   data: {
      //     totalCommissionEarned: (distributor.totalCommissionEarned || 0) + level1CommissionAmount
      //   }
      // })
    }
    
    // 6. If Level 2 referral exists, calculate commission for parent's referrer
    if (referral.referralLevel === 2 && referral.parentReferrerId) {
      const parentReferrer = await getDistributor(referral.parentReferrerId)
      
      if (parentReferrer && parentReferrer.status === 'approved') {
        const level2CommissionAmount = await calculateCommissionAmount(
          order.amount,
          2,
          null // Use default level 2 rate
        )
        
        if (level2CommissionAmount > 0) {
          const commissionId = await createCommissionRecord(
            orderId,
            parentReferrer._id,
            2,
            level2CommissionAmount,
            COMMISSION_CONFIG.level2Rate
          )
          
          commissions.push({
            commissionId,
            distributorId: parentReferrer._id,
            referralLevel: 2,
            commissionAmount: level2CommissionAmount
          })
          
          // Update parent referrer stats
          // TODO: Update distributors collection
        }
      }
    }
    
    // 7. Update referral total commission
    // TODO: Update referrals collection
    // await db.collection('referrals').doc(referral._id).update({
    //   data: {
    //     totalCommission: (referral.totalCommission || 0) + level1CommissionAmount
    //   }
    // })
    
    return {
      success: true,
      commissions,
      message: `Calculated ${commissions.length} commission(s) for order ${orderId}`
    }
  } catch (error) {
    console.error('calculateCommission error:', error)
    return {
      error: 'INTERNAL_ERROR',
      message: error.message || 'Failed to calculate commission'
    }
  }
}
