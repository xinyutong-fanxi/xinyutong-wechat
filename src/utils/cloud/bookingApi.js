/**
 * Client wrapper for booking-related cloud function calls.
 */

/**
 * Create a booking order
 * @param {Object} params
 * @param {string} params.teacherId - Teacher ID
 * @param {string} params.studentId - Student ID
 * @param {string} params.parentOpenId - Parent openid (optional, will use context if not provided)
 * @param {number|string} params.scheduledAt - Timestamp of scheduled time
 * @param {number} params.duration - Duration in minutes (default: 60)
 * @param {string} params.serviceType - Service type ('counseling' | 'guidance' | 'ai_chat')
 * @param {string} params.referralCode - Optional referral code
 * @returns {Promise<Object>} Booking and order details
 */
export async function createBookingOrder(params) {
  const { teacherId, studentId, parentOpenId, scheduledAt, duration = 60, serviceType = 'counseling', referralCode = null } = params
  
  if (!teacherId || !studentId || !scheduledAt) {
    throw new Error('Missing required fields: teacherId, studentId, scheduledAt')
  }
  
  const data = {
    teacherId,
    studentId,
    parentOpenId: parentOpenId || null, // Will be auto from context if not provided
    scheduledAt: typeof scheduledAt === 'number' ? scheduledAt : new Date(scheduledAt).getTime(),
    duration,
    serviceType,
    referralCode
  }
  
  // #ifdef MP-WEIXIN
  if (typeof wx !== 'undefined' && wx.cloud && wx.cloud.callFunction) {
    const { result } = await wx.cloud.callFunction({
      name: 'booking.createOrder',
      data
    })
    return result
  }
  // #endif
  
  // #ifndef MP-WEIXIN
  if (typeof uniCloud !== 'undefined' && uniCloud.callFunction) {
    const { result } = await uniCloud.callFunction({
      name: 'booking.createOrder',
      data
    })
    return result
  }
  // #endif
  
  // Dev fallback
  console.warn('[bookingApi] no cloud call method; returning stub response')
  return {
    bookingId: `booking_${Date.now()}`,
    orderId: `order_${Date.now()}`,
    orderNo: `XYT${Date.now()}`,
    amount: 20000, // 200 yuan
    platformFee: 6000,
    teacherEarning: 14000,
    distributorCommission: 0,
    scheduledAt: scheduledAt
  }
}

/**
 * Confirm an appointment (teacher action)
 * @param {Object} params
 * @param {string} params.bookingId - Booking ID
 * @param {string} params.action - 'confirm' | 'reject'
 * @param {string} params.rejectionReason - Optional rejection reason
 * @returns {Promise<Object>} Confirmation result
 */
export async function confirmAppointment(params) {
  const { bookingId, action, rejectionReason = null } = params
  
  if (!bookingId || !action) {
    throw new Error('Missing required fields: bookingId, action')
  }
  
  const data = {
    bookingId,
    action,
    rejectionReason
  }
  
  // #ifdef MP-WEIXIN
  if (typeof wx !== 'undefined' && wx.cloud && wx.cloud.callFunction) {
    const { result } = await wx.cloud.callFunction({
      name: 'booking.confirmAppointment',
      data
    })
    return result
  }
  // #endif
  
  // #ifndef MP-WEIXIN
  if (typeof uniCloud !== 'undefined' && uniCloud.callFunction) {
    const { result } = await uniCloud.callFunction({
      name: 'booking.confirmAppointment',
      data
    })
    return result
  }
  // #endif
  
  // Dev fallback
  console.warn('[bookingApi] no cloud call method; returning stub response')
  return {
    success: true,
    bookingId,
    status: action === 'confirm' ? 'confirmed' : 'cancelled'
  }
}

/**
 * Cancel a booking
 * @param {Object} params
 * @param {string} params.bookingId - Booking ID
 * @param {string} params.role - 'parent' | 'teacher'
 * @param {string} params.cancellationReason - Cancellation reason
 * @returns {Promise<Object>} Cancellation result
 */
export async function cancelBooking(params) {
  const { bookingId, role, cancellationReason = 'User cancelled' } = params
  
  if (!bookingId || !role) {
    throw new Error('Missing required fields: bookingId, role')
  }
  
  const data = {
    bookingId,
    role,
    cancellationReason
  }
  
  // #ifdef MP-WEIXIN
  if (typeof wx !== 'undefined' && wx.cloud && wx.cloud.callFunction) {
    const { result } = await wx.cloud.callFunction({
      name: 'booking.cancelBooking',
      data
    })
    return result
  }
  // #endif
  
  // #ifndef MP-WEIXIN
  if (typeof uniCloud !== 'undefined' && uniCloud.callFunction) {
    const { result } = await uniCloud.callFunction({
      name: 'booking.cancelBooking',
      data
    })
    return result
  }
  // #endif
  
  // Dev fallback
  console.warn('[bookingApi] no cloud call method; returning stub response')
  return {
    success: true,
    bookingId,
    refundAmount: 0
  }
}
