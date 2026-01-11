/**
 * Client wrapper for teacher-related cloud function calls.
 */

/**
 * Get teachers list
 * @param {Object} params
 * @param {string} params.expertise - Filter by expertise
 * @param {string} params.searchKeyword - Search keyword
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.pageSize - Page size (default: 10)
 * @returns {Promise<Object>} Teachers list
 */
export async function getTeachers(params = {}) {
  const { expertise, searchKeyword, page = 1, pageSize = 10 } = params
  
  const data = {
    expertise,
    searchKeyword,
    page,
    pageSize
  }
  
  // TODO: Create teacher.list cloud function or use direct DB query
  // For now, return stub data
  
  // #ifdef MP-WEIXIN
  if (typeof wx !== 'undefined' && wx.cloud && wx.cloud.callFunction) {
    // const { result } = await wx.cloud.callFunction({
    //   name: 'teacher.list',
    //   data
    // })
    // return result
    
    // Stub response
    return {
      teachers: [],
      total: 0,
      page,
      pageSize
    }
  }
  // #endif
  
  // Dev fallback
  console.warn('[teacherApi] no cloud call method; returning stub response')
  return {
    teachers: [],
    total: 0,
    page,
    pageSize
  }
}

/**
 * Get teacher details
 * @param {string} teacherId - Teacher ID
 * @returns {Promise<Object>} Teacher details
 */
export async function getTeacherDetails(teacherId) {
  if (!teacherId) {
    throw new Error('Missing required field: teacherId')
  }
  
  // TODO: Create teacher.getDetails cloud function or use direct DB query
  // For now, return stub data
  
  // #ifdef MP-WEIXIN
  if (typeof wx !== 'undefined' && wx.cloud && wx.cloud.callFunction) {
    // const { result } = await wx.cloud.callFunction({
    //   name: 'teacher.getDetails',
    //   data: { teacherId }
    // })
    // return result
    
    // Stub response
    return {
      _id: teacherId,
      name: '示例老师',
      title: '心理咨询师',
      avatarUrl: '',
      rating: 4.8,
      totalSessions: 120,
      expertise: ['心理辅导', '情绪管理'],
      serviceModes: ['online', 'offline'],
      pricePerHour: 20000, // 200 yuan
      bio: '资深心理咨询师',
      credentials: {
        certificates: []
      }
    }
  }
  // #endif
  
  // Dev fallback
  console.warn('[teacherApi] no cloud call method; returning stub response')
  return {
    _id: teacherId,
    name: '示例老师',
    title: '心理咨询师',
    avatarUrl: '',
    rating: 4.8,
    totalSessions: 120,
    expertise: ['心理辅导', '情绪管理'],
    serviceModes: ['online', 'offline'],
    pricePerHour: 20000,
    bio: '资深心理咨询师',
    credentials: {
      certificates: []
    }
  }
}

/**
 * Get teacher's available time slots
 * @param {string} teacherId - Teacher ID
 * @param {string} startDate - Start date (YYYY-MM-DD)
 * @param {string} endDate - End date (YYYY-MM-DD)
 * @returns {Promise<Array>} Available time slots
 */
export async function getTeacherSchedule(teacherId, startDate, endDate) {
  if (!teacherId) {
    throw new Error('Missing required field: teacherId')
  }
  
  // #ifdef MP-WEIXIN
  if (typeof wx !== 'undefined' && wx.cloud && wx.cloud.callFunction) {
    const { result } = await wx.cloud.callFunction({
      name: 'teacher.manageSchedule',
      data: {
        action: 'get',
        teacherId,
        startDate,
        endDate
      }
    })
    
    if (result.error) {
      throw new Error(result.message || 'Failed to get schedule')
    }
    
    return result.schedule || []
  }
  // #endif
  
  // #ifndef MP-WEIXIN
  if (typeof uniCloud !== 'undefined' && uniCloud.callFunction) {
    const { result } = await uniCloud.callFunction({
      name: 'teacher.manageSchedule',
      data: {
        action: 'get',
        teacherId,
        startDate,
        endDate
      }
    })
    
    if (result.error) {
      throw new Error(result.message || 'Failed to get schedule')
    }
    
    return result.schedule || []
  }
  // #endif
  
  // Dev fallback
  console.warn('[teacherApi] no cloud call method; returning stub response')
  return []
}

/**
 * Set teacher's schedule (availability)
 * @param {Array} timeSlots - Array of {date: string, time: string, available: boolean}
 * @returns {Promise<Object>} Success result
 */
export async function setTeacherSchedule(timeSlots) {
  if (!timeSlots || !Array.isArray(timeSlots)) {
    throw new Error('Missing required field: timeSlots (array)')
  }
  
  // #ifdef MP-WEIXIN
  if (typeof wx !== 'undefined' && wx.cloud && wx.cloud.callFunction) {
    const { result } = await wx.cloud.callFunction({
      name: 'teacher.manageSchedule',
      data: {
        action: 'set',
        timeSlots
      }
    })
    
    if (result.error) {
      throw new Error(result.message || 'Failed to set schedule')
    }
    
    return result
  }
  // #endif
  
  // #ifndef MP-WEIXIN
  if (typeof uniCloud !== 'undefined' && uniCloud.callFunction) {
    const { result } = await uniCloud.callFunction({
      name: 'teacher.manageSchedule',
      data: {
        action: 'set',
        timeSlots
      }
    })
    
    if (result.error) {
      throw new Error(result.message || 'Failed to set schedule')
    }
    
    return result
  }
  // #endif
  
  // Dev fallback
  console.warn('[teacherApi] no cloud call method; returning stub response')
  return { success: true }
}

/**
 * Update teacher profile
 * @param {Object} profile - Profile data to update
 * @returns {Promise<Object>} Updated profile
 */
export async function updateTeacherProfile(profile) {
  if (!profile || typeof profile !== 'object') {
    throw new Error('Missing required field: profile (object)')
  }
  
  // #ifdef MP-WEIXIN
  if (typeof wx !== 'undefined' && wx.cloud && wx.cloud.callFunction) {
    const { result } = await wx.cloud.callFunction({
      name: 'teacher.updateProfile',
      data: { profile }
    })
    
    if (result.error) {
      throw new Error(result.message || 'Failed to update profile')
    }
    
    return result
  }
  // #endif
  
  // #ifndef MP-WEIXIN
  if (typeof uniCloud !== 'undefined' && uniCloud.callFunction) {
    const { result } = await uniCloud.callFunction({
      name: 'teacher.updateProfile',
      data: { profile }
    })
    
    if (result.error) {
      throw new Error(result.message || 'Failed to update profile')
    }
    
    return result
  }
  // #endif
  
  // Dev fallback
  console.warn('[teacherApi] no cloud call method; returning stub response')
  return { success: true, teacherId: 'teacher_stub' }
}

/**
 * Submit counseling session log
 * @param {Object} params
 * @param {string} params.bookingId - Booking ID
 * @param {string} params.logContent - Session summary
 * @param {number} params.sessionDate - Timestamp
 * @param {number} params.duration - Duration in minutes
 * @returns {Promise<Object>} Log submission result
 */
export async function submitCounselingLog(params) {
  const { bookingId, logContent, sessionDate, duration } = params
  
  if (!bookingId || !logContent || !sessionDate) {
    throw new Error('Missing required fields: bookingId, logContent, sessionDate')
  }
  
  // #ifdef MP-WEIXIN
  if (typeof wx !== 'undefined' && wx.cloud && wx.cloud.callFunction) {
    const { result } = await wx.cloud.callFunction({
      name: 'teacher.submitLog',
      data: {
        bookingId,
        logContent,
        sessionDate,
        duration
      }
    })
    
    if (result.error) {
      throw new Error(result.message || 'Failed to submit log')
    }
    
    return result
  }
  // #endif
  
  // #ifndef MP-WEIXIN
  if (typeof uniCloud !== 'undefined' && uniCloud.callFunction) {
    const { result } = await uniCloud.callFunction({
      name: 'teacher.submitLog',
      data: {
        bookingId,
        logContent,
        sessionDate,
        duration
      }
    })
    
    if (result.error) {
      throw new Error(result.message || 'Failed to submit log')
    }
    
    return result
  }
  // #endif
  
  // Dev fallback
  console.warn('[teacherApi] no cloud call method; returning stub response')
  return { success: true, logId: 'log_stub' }
}
