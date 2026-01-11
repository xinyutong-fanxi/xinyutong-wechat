/**
 * WXCloud Function: distribution.trackReferral
 * Tracks referral relationship when parent registers with referral code or makes first order.
 * 
 * Input:
 * - action: 'register' | 'firstOrder'
 * - parentOpenId: string (referred parent's openid, auto from context)
 * - referralCode: string (for 'register' action)
 * - orderId: string (for 'firstOrder' action)
 * 
 * Output:
 * - success: boolean
 * - referralId: string (for 'register' action)
 * - commissionId: string (for 'firstOrder' action, if commission calculated)
 * - message: string
 */

// const cloud = require('wx-server-sdk')
// cloud.init()
const db = null // TODO: Initialize with cloud.database() when WXCloud is set up

function generateReferralCode(parentOpenId) {
  // Generate unique referral code based on parent openid and timestamp
  const timestamp = Date.now().toString(36)
  const hash = parentOpenId.slice(-6).toUpperCase()
  return `XYT${hash}${timestamp}`
}

async function findDistributorByCode(referralCode) {
  // TODO: Query distributors collection by referralCode
  // const distributorResult = await db.collection('distributors')
  //   .where({ referralCode, status: 'approved' })
  //   .get()
  // 
  // if (distributorResult.data.length === 0) {
  //   return null
  // }
  // 
  // return distributorResult.data[0]
  
  // Placeholder
  return null
}

async function findExistingReferral(parentOpenId) {
  // TODO: Check if referral relationship already exists
  // const referralResult = await db.collection('referrals')
  //   .where({ referredParentOpenId: parentOpenId })
  //   .get()
  // 
  // if (referralResult.data.length > 0) {
  //   return referralResult.data[0]
  // }
  
  return null
}

async function getParentReferrer(parentOpenId) {
  // TODO: Get parent's referrer (if parent was referred by someone)
  // Query users collection for parent's parentProfile.distributorCode
  // Then find distributor who owns that code
  // This is for Level 2 referral tracking
  
  return null
}

exports.main = async (event, context) => {
  const { action, parentOpenId, referralCode, orderId } = event || {}
  const openid = (context && context.OPENID) || parentOpenId || 'dev-openid'
  
  if (!action || (action === 'register' && !referralCode) || (action === 'firstOrder' && !orderId)) {
    return {
      error: 'INVALID_INPUT',
      message: 'Missing required fields'
    }
  }
  
  if (action !== 'register' && action !== 'firstOrder') {
    return {
      error: 'INVALID_ACTION',
      message: 'Action must be "register" or "firstOrder"'
    }
  }
  
  try {
    if (action === 'register') {
      // 1. Check if referral code exists and distributor is approved
      const distributor = await findDistributorByCode(referralCode)
      
      if (!distributor) {
        return {
          error: 'INVALID_REFERRAL_CODE',
          message: 'Referral code not found or distributor not approved'
        }
      }
      
      // 2. Check if referral relationship already exists
      const existingReferral = await findExistingReferral(openid)
      if (existingReferral) {
        return {
          error: 'REFERRAL_EXISTS',
          message: 'Referral relationship already exists',
          referralId: existingReferral._id
        }
      }
      
      // 3. Determine referral level
      // Check if this parent was referred by someone (Level 2)
      const parentReferrer = await getParentReferrer(openid)
      const referralLevel = parentReferrer ? 2 : 1
      const parentReferrerId = parentReferrer ? parentReferrer._id : null
      
      // 4. Create referral record (Level 1 - direct referral)
      const referralData = {
        distributorId: distributor._id,
        referralCode,
        referredParentOpenId: openid,
        referralLevel: 1, // Direct referral from distributor
        parentReferrerId: null,
        firstOrderId: null,
        totalOrders: 0,
        totalCommission: 0,
        createdAt: new Date(),
        firstOrderAt: null
      }
      
      // TODO: Save referral to DB
      // const referralResult = await db.collection('referrals').add({ data: referralData })
      // const referralId = referralResult._id
      
      const referralId = `referral_${Date.now()}`
      
      // 5. If Level 2 referral, create secondary referral record for parent's referrer
      if (referralLevel === 2 && parentReferrer) {
        const secondaryReferralData = {
          distributorId: distributor._id,
          referralCode: distributor.referralCode,
          referredParentOpenId: openid,
          referralLevel: 2,
          parentReferrerId: parentReferrer.distributorId || parentReferrer._id,
          firstOrderId: null,
          totalOrders: 0,
          totalCommission: 0,
          createdAt: new Date(),
          firstOrderAt: null
        }
        
        // TODO: Save secondary referral to DB
        // await db.collection('referrals').add({ data: secondaryReferralData })
      }
      
      // 6. Update distributor stats
      // TODO: Update distributors collection
      // await db.collection('distributors').doc(distributor._id).update({
      //   data: {
      //     totalReferrals: (distributor.totalReferrals || 0) + 1
      //   }
      // })
      
      return {
        success: true,
        referralId,
        message: 'Referral relationship recorded successfully'
      }
    }
    
    if (action === 'firstOrder') {
      // 1. Find referral relationship for this parent
      const referral = await findExistingReferral(openid)
      
      if (!referral) {
        // No referral relationship, no commission
        return {
          success: true,
          message: 'No referral relationship found, no commission'
        }
      }
      
      // 2. Verify order exists and is paid
      // TODO: Query orders collection
      // const orderResult = await db.collection('orders').doc(orderId).get()
      // const order = orderResult.data
      // 
      // if (!order || order.status !== 'paid') {
      //   return {
      //     error: 'INVALID_ORDER',
      //     message: 'Order not found or not paid'
      //   }
      // }
      
      // Placeholder order
      const order = {
        _id: orderId,
        parentOpenId: openid,
        amount: 20000, // 200 yuan in cents
        status: 'paid'
      }
      
      // 3. Update referral with first order
      if (!referral.firstOrderId) {
        // TODO: Update referral record
        // await db.collection('referrals').doc(referral._id).update({
        //   data: {
        //     firstOrderId: orderId,
        //     firstOrderAt: new Date(),
        //     totalOrders: 1
        //   }
        // })
      } else {
        // Increment total orders
        // await db.collection('referrals').doc(referral._id).update({
        //   data: {
        //     totalOrders: (referral.totalOrders || 0) + 1
        //   }
        // })
      }
      
      // 4. Calculate and record commission (call calculateCommission)
      // Commission calculation will be handled by finance.calculateCommission
      // This function just tracks the referral relationship
      
      return {
        success: true,
        message: 'Referral tracking updated for first order'
      }
    }
  } catch (error) {
    console.error('trackReferral error:', error)
    return {
      error: 'INTERNAL_ERROR',
      message: error.message || 'Failed to track referral'
    }
  }
}
