/**
 * Client wrapper for student bookings-related cloud function calls.
 */

/**
 * Get student's bookings (read-only, filtered by authorization level)
 * @param {Object} params
 * @param {string} params.status - Filter by status ('all' | 'upcoming' | 'past')
 * @returns {Promise<Object>} Student bookings list
 */
export async function getStudentBookings(params = {}) {
  const { status = 'all' } = params
  
  // TODO: Create student.getBookings cloud function or use direct DB query
  // For now, return stub data
  // This should filter bookings based on student's authorizationLevel
  
  // #ifdef MP-WEIXIN
  if (typeof wx !== 'undefined' && wx.cloud && wx.cloud.callFunction) {
    // const { result } = await wx.cloud.callFunction({
    //   name: 'student.getBookings',
    //   data: { status }
    // })
    // return result
    
    // Stub response
    return {
      bookings: [],
      total: 0
    }
  }
  // #endif
  
  // #ifndef MP-WEIXIN
  if (typeof uniCloud !== 'undefined' && uniCloud.callFunction) {
    // const { result } = await uniCloud.callFunction({
    //   name: 'student.getBookings',
    //   data: { status }
    // })
    // return result
    
    // Stub response
    return {
      bookings: [],
      total: 0
    }
  }
  // #endif
  
  // Dev fallback
  console.warn('[studentBookingsApi] no cloud call method; returning stub response')
  return {
    bookings: [],
    total: 0
  }
}
