/**
 * Client wrapper for bookings-related cloud function calls.
 */

/**
 * Get bookings list for current parent
 * @param {Object} params
 * @param {string} params.status - Filter by status ('upcoming' | 'past' | 'all')
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.pageSize - Page size (default: 20)
 * @returns {Promise<Object>} Bookings list
 */
export async function getBookings(params = {}) {
  const { status = 'all', page = 1, pageSize = 20 } = params
  
  const data = {
    status,
    page,
    pageSize
  }
  
  // TODO: Create booking.list cloud function or use direct DB query
  // For now, return stub data
  
  // #ifdef MP-WEIXIN
  if (typeof wx !== 'undefined' && wx.cloud && wx.cloud.callFunction) {
    // const { result } = await wx.cloud.callFunction({
    //   name: 'booking.list',
    //   data
    // })
    // return result
    
    // Stub response
    return {
      bookings: [],
      total: 0,
      page,
      pageSize
    }
  }
  // #endif
  
  // #ifndef MP-WEIXIN
  if (typeof uniCloud !== 'undefined' && uniCloud.callFunction) {
    // const { result } = await uniCloud.callFunction({
    //   name: 'booking.list',
    //   data
    // })
    // return result
    
    // Stub response
    return {
      bookings: [],
      total: 0,
      page,
      pageSize
    }
  }
  // #endif
  
  // Dev fallback
  console.warn('[bookingsApi] no cloud call method; returning stub response')
  return {
    bookings: [],
    total: 0,
    page,
    pageSize
  }
}

/**
 * Get booking details
 * @param {string} bookingId - Booking ID
 * @returns {Promise<Object>} Booking details
 */
export async function getBookingDetails(bookingId) {
  if (!bookingId) {
    throw new Error('Missing required field: bookingId')
  }
  
  // TODO: Create booking.getDetails cloud function or use direct DB query
  // For now, return stub data
  
  // #ifdef MP-WEIXIN
  if (typeof wx !== 'undefined' && wx.cloud && wx.cloud.callFunction) {
    // const { result } = await wx.cloud.callFunction({
    //   name: 'booking.getDetails',
    //   data: { bookingId }
    // })
    // return result
    
    // Stub response
    return {
      _id: bookingId,
      orderId: `order_${bookingId}`,
      orderNo: `ORD${Date.now()}`,
      teacherName: '示例老师',
      studentName: '示例学生',
      scheduledAt: Date.now() + 86400000, // Tomorrow
      duration: 60,
      serviceType: 'counseling',
      status: 'pending',
      paymentStatus: 'unpaid',
      amount: 20000 // 200 yuan in cents
    }
  }
  // #endif
  
  // Dev fallback
  console.warn('[bookingsApi] no cloud call method; returning stub response')
  return {
    _id: bookingId,
    orderId: `order_${bookingId}`,
    orderNo: `ORD${Date.now()}`,
    teacherName: '示例老师',
    studentName: '示例学生',
    scheduledAt: Date.now() + 86400000,
    duration: 60,
    serviceType: 'counseling',
    status: 'pending',
    paymentStatus: 'unpaid',
    amount: 20000 // 200 yuan in cents
  }
}

/**
 * Submit feedback for a completed booking
 * @param {Object} params
 * @param {string} params.bookingId - Booking ID
 * @param {number} params.rating - Rating (1-5)
 * @param {string} params.comment - Optional comment
 * @returns {Promise<Object>} Feedback submission result
 */
export async function submitFeedback(params) {
  const { bookingId, rating, comment = null } = params
  
  if (!bookingId || !rating) {
    throw new Error('Missing required fields: bookingId, rating')
  }
  
  if (rating < 1 || rating > 5) {
    throw new Error('Rating must be between 1 and 5')
  }
  
  const data = {
    bookingId,
    rating,
    comment
  }
  
  // #ifdef MP-WEIXIN
  if (typeof wx !== 'undefined' && wx.cloud && wx.cloud.callFunction) {
    const { result } = await wx.cloud.callFunction({
      name: 'booking.submitFeedback',
      data
    })
    
    if (result.error) {
      throw new Error(result.message || 'Failed to submit feedback')
    }
    
    return result
  }
  // #endif
  
  // #ifndef MP-WEIXIN
  if (typeof uniCloud !== 'undefined' && uniCloud.callFunction) {
    const { result } = await uniCloud.callFunction({
      name: 'booking.submitFeedback',
      data
    })
    
    if (result.error) {
      throw new Error(result.message || 'Failed to submit feedback')
    }
    
    return result
  }
  // #endif
  
  // Dev fallback
  console.warn('[bookingsApi] no cloud call method; returning stub response')
  return {
    success: true,
    bookingId,
    message: 'Feedback submitted (stub)'
  }
}
