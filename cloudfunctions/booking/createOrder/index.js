/**
 * WXCloud Function: booking.createOrder
 * Creates a booking order when parent selects teacher, student, and time slot.
 * 
 * Input:
 * - teacherId: string (teacher _id)
 * - studentId: string (student _id)
 * - parentOpenId: string (parent's openid)
 * - scheduledAt: number (timestamp)
 * - duration: number (minutes, default 60)
 * - serviceType: string ('counseling' | 'guidance' | 'ai_chat')
 * - referralCode: string | null (optional, for distribution tracking)
 * 
 * Output:
 * - bookingId: string
 * - orderId: string
 * - orderNo: string
 * - amount: number (total amount in cents)
 * - platformFee: number (commission in cents)
 * - teacherEarning: number (in cents)
 * - distributorCommission: number (in cents, if applicable)
 */

// const cloud = require('wx-server-sdk')
// cloud.init()
const db = null // TODO: Initialize with cloud.database() when WXCloud is set up

function generateOrderNo() {
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  return `XYT${timestamp}${random}`
}

function calculatePricing(teacherPricePerHour, duration, platformRate = 0.3) {
  const totalAmount = Math.round((teacherPricePerHour * duration) / 60) // in cents
  const platformFee = Math.round(totalAmount * platformRate)
  const teacherEarning = totalAmount - platformFee
  
  return {
    totalAmount,
    platformFee,
    teacherEarning
  }
}

async function checkTimeSlotAvailability(teacherId, scheduledAt, duration) {
  // TODO: Query bookings collection to check for conflicts
  // Check if teacher has any overlapping bookings at scheduledAt
  // Return true if available, false if conflicted
  
  // Placeholder implementation
  return true
}

async function trackReferral(parentOpenId, referralCode) {
  // Call distribution.trackReferral cloud function
  // This should be called when parent registers, not when creating order
  // Here we just check if referral relationship exists and return distributor info
  
  if (!referralCode) {
    return {
      distributorId: null,
      referralLevel: null
    }
  }
  
  // TODO: Query referrals collection to check if referral relationship exists
  // const referralResult = await db.collection('referrals')
  //   .where({
  //     referredParentOpenId: parentOpenId,
  //     referralCode
  //   })
  //   .get()
  // 
  // if (referralResult.data.length === 0) {
  //   // No referral relationship yet, return null (will be tracked on first order)
  //   return {
  //     distributorId: null,
  //     referralLevel: null
  //   }
  // }
  // 
  // const referral = referralResult.data[0]
  // 
  // // Find distributor
  // const distributorResult = await db.collection('distributors').doc(referral.distributorId).get()
  // const distributor = distributorResult.data
  // 
  // return {
  //   distributorId: distributor._id,
  //   referralLevel: referral.referralLevel
  // }
  
  // Placeholder: return null for now, will be tracked on first order payment
  return {
    distributorId: null,
    referralLevel: null,
    referralCode // Store for later use
  }
}

exports.main = async (event, context) => {
  const { teacherId, studentId, parentOpenId, scheduledAt, duration = 60, serviceType = 'counseling', referralCode = null } = event || {}
  const openid = (context && context.OPENID) || parentOpenId || 'dev-openid'
  
  // Validate input
  if (!teacherId || !studentId || !parentOpenId || !scheduledAt) {
    return {
      error: 'INVALID_INPUT',
      message: 'Missing required fields: teacherId, studentId, parentOpenId, scheduledAt'
    }
  }
  
  try {
    // 1. Verify teacher exists and is approved
    // TODO: Query teachers collection
    // const teacher = await db.collection('teachers').doc(teacherId).get()
    // if (!teacher.data || teacher.data.status !== 'approved') {
    //   return { error: 'TEACHER_UNAVAILABLE', message: 'Teacher is not available' }
    // }
    
    const teacher = {
      _id: teacherId,
      pricePerHour: 20000, // 200 yuan = 20000 cents (placeholder)
      status: 'approved'
    }
    
    if (teacher.status !== 'approved') {
      return {
        error: 'TEACHER_UNAVAILABLE',
        message: 'Teacher is not available for booking'
      }
    }
    
    // 2. Check time slot availability
    const isAvailable = await checkTimeSlotAvailability(teacherId, scheduledAt, duration)
    if (!isAvailable) {
      return {
        error: 'SLOT_UNAVAILABLE',
        message: 'Selected time slot is not available'
      }
    }
    
    // 3. Calculate pricing
    const pricing = calculatePricing(teacher.pricePerHour, duration)
    
    // 4. Track referral if applicable
    const referral = referralCode ? await trackReferral(parentOpenId, referralCode) : { distributorId: null, referralLevel: null }
    
    // 5. Calculate distributor commission (placeholder - will be implemented in distribution phase)
    const distributorCommission = 0 // TODO: Calculate based on referral level and rates
    
    // 6. Generate order number
    const orderNo = generateOrderNo()
    
    // 7. Create booking record
    const bookingData = {
      parentOpenId,
      studentId,
      teacherId,
      serviceType,
      scheduledAt: new Date(scheduledAt),
      duration,
      status: 'pending',
      paymentStatus: 'unpaid',
      createdAt: new Date(),
      referralCode,
      distributorId: referral.distributorId,
      referralLevel: referral.referralLevel
    }
    
    // TODO: Save booking to DB
    // const bookingResult = await db.collection('bookings').add({ data: bookingData })
    // const bookingId = bookingResult._id
    
    const bookingId = `booking_${Date.now()}` // Placeholder
    
    // 8. Create order record
    const orderData = {
      orderNo,
      parentOpenId,
      studentId,
      teacherId,
      serviceType,
      amount: pricing.totalAmount,
      platformFee: pricing.platformFee,
      teacherEarning: pricing.teacherEarning,
      distributorCommission,
      distributorId: referral.distributorId,
      referralLevel: referral.referralLevel,
      status: 'pending',
      paymentMethod: 'wechat_pay',
      createdAt: new Date(),
      bookingId
    }
    
    // TODO: Save order to DB
    // const orderResult = await db.collection('orders').add({ data: orderData })
    // const orderId = orderResult._id
    // 
    // await db.collection('bookings').doc(bookingId).update({
    //   data: { orderId }
    // })
    
    const orderId = `order_${Date.now()}` // Placeholder
    
    return {
      bookingId,
      orderId,
      orderNo,
      amount: pricing.totalAmount,
      platformFee: pricing.platformFee,
      teacherEarning: pricing.teacherEarning,
      distributorCommission,
      scheduledAt: bookingData.scheduledAt.getTime()
    }
  } catch (error) {
    console.error('createOrder error:', error)
    return {
      error: 'INTERNAL_ERROR',
      message: error.message || 'Failed to create order'
    }
  }
}
