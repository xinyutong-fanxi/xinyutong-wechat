/**
 * Client wrapper for teacher bookings-related cloud function calls.
 */

/**
 * Get teacher's bookings list
 * @param {Object} params
 * @param {string} params.status - Filter by status ('pending' | 'confirmed' | 'completed' | 'all')
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.pageSize - Page size (default: 20)
 * @returns {Promise<Object>} Bookings list
 */
export async function getTeacherBookings(params = {}) {
  const { status = 'all', page = 1, pageSize = 20 } = params
  
  const data = {
    status,
    page,
    pageSize
  }
  
  // TODO: Create teacher.bookings cloud function or use direct DB query
  // For now, return stub data
  
  // #ifdef MP-WEIXIN
  if (typeof wx !== 'undefined' && wx.cloud && wx.cloud.callFunction) {
    // const { result } = await wx.cloud.callFunction({
    //   name: 'teacher.bookings',
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
    //   name: 'teacher.bookings',
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
  console.warn('[teacherBookingsApi] no cloud call method; returning stub response')
  return {
    bookings: [],
    total: 0,
    page,
    pageSize
  }
}

/**
 * Get teacher's booking details
 * @param {string} bookingId - Booking ID
 * @returns {Promise<Object>} Booking details
 */
export async function getTeacherBookingDetails(bookingId) {
  if (!bookingId) {
    throw new Error('Missing required field: bookingId')
  }
  
  // TODO: Create teacher.bookingDetails cloud function or use direct DB query
  // For now, return stub data
  
  // #ifdef MP-WEIXIN
  if (typeof wx !== 'undefined' && wx.cloud && wx.cloud.callFunction) {
    // const { result } = await wx.cloud.callFunction({
    //   name: 'teacher.bookingDetails',
    //   data: { bookingId }
    // })
    // return result
    
    // Stub response
    return {
      _id: bookingId,
      studentName: '示例学生',
      parentName: '示例家长',
      scheduledAt: Date.now() + 86400000, // Tomorrow
      duration: 60,
      serviceType: 'counseling',
      status: 'pending',
      paymentStatus: 'paid',
      counselingLog: null
    }
  }
  // #endif
  
  // Dev fallback
  console.warn('[teacherBookingsApi] no cloud call method; returning stub response')
  return {
    _id: bookingId,
    studentName: '示例学生',
    parentName: '示例家长',
    scheduledAt: Date.now() + 86400000,
    duration: 60,
    serviceType: 'counseling',
    status: 'pending',
    paymentStatus: 'paid',
    counselingLog: null
  }
}
