/**
 * Client wrapper for admin-related cloud function calls.
 */

/**
 * Approve or reject withdrawal request
 * @param {Object} params
 * @param {string} params.withdrawalId - Withdrawal ID
 * @param {string} params.action - 'approve' | 'reject'
 * @param {string} params.rejectionReason - Required if action is 'reject'
 * @returns {Promise<Object>} Approval result
 */
export async function approveWithdrawal(params) {
  const { withdrawalId, action, rejectionReason = null } = params
  
  if (!withdrawalId || !action) {
    throw new Error('Missing required fields: withdrawalId, action')
  }
  
  if (action === 'reject' && !rejectionReason) {
    throw new Error('Rejection reason is required when rejecting withdrawal')
  }
  
  const data = {
    withdrawalId,
    action,
    rejectionReason
  }
  
  // #ifdef MP-WEIXIN
  if (typeof wx !== 'undefined' && wx.cloud && wx.cloud.callFunction) {
    const { result } = await wx.cloud.callFunction({
      name: 'admin.approveWithdrawal',
      data
    })
    
    if (result.error) {
      throw new Error(result.message || 'Failed to process withdrawal')
    }
    
    return result
  }
  // #endif
  
  // #ifndef MP-WEIXIN
  if (typeof uniCloud !== 'undefined' && uniCloud.callFunction) {
    const { result } = await uniCloud.callFunction({
      name: 'admin.approveWithdrawal',
      data
    })
    
    if (result.error) {
      throw new Error(result.message || 'Failed to process withdrawal')
    }
    
    return result
  }
  // #endif
  
  // Dev fallback
  console.warn('[adminApi] no cloud call method; returning stub response')
  return {
    success: true,
    withdrawalId,
    status: action === 'approve' ? 'approved' : 'rejected',
    message: action === 'approve' ? '提现申请已通过' : '提现申请已拒绝'
  }
}

/**
 * Get withdrawals list for admin
 * @param {Object} params
 * @param {string} params.status - Filter by status ('pending' | 'approved' | 'rejected' | 'completed' | 'all')
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.pageSize - Page size (default: 20)
 * @returns {Promise<Object>} Withdrawals list
 */
export async function getWithdrawals(params = {}) {
  const { status = 'all', page = 1, pageSize = 20 } = params
  
  // TODO: Create admin.getWithdrawals cloud function or use direct DB query
  // For now, return stub data
  
  // #ifdef MP-WEIXIN
  if (typeof wx !== 'undefined' && wx.cloud && wx.cloud.callFunction) {
    // const { result } = await wx.cloud.callFunction({
    //   name: 'admin.getWithdrawals',
    //   data: { status, page, pageSize }
    // })
    // return result
    
    // Stub response
    return {
      withdrawals: [],
      total: 0,
      page,
      pageSize
    }
  }
  // #endif
  
  // Dev fallback
  console.warn('[adminApi] no cloud call method; returning stub response')
  return {
    withdrawals: [],
    total: 0,
    page,
    pageSize
  }
}

/**
 * Get withdrawal details
 * @param {string} withdrawalId - Withdrawal ID
 * @returns {Promise<Object>} Withdrawal details
 */
export async function getWithdrawalDetails(withdrawalId) {
  if (!withdrawalId) {
    throw new Error('Missing required field: withdrawalId')
  }
  
  // TODO: Create admin.getWithdrawalDetails cloud function or use direct DB query
  // For now, return stub data
  
  // #ifdef MP-WEIXIN
  if (typeof wx !== 'undefined' && wx.cloud && wx.cloud.callFunction) {
    // const { result } = await wx.cloud.callFunction({
    //   name: 'admin.getWithdrawalDetails',
    //   data: { withdrawalId }
    // })
    // return result
    
    // Stub response
    return {
      _id: withdrawalId,
      withdrawalNo: `WD${Date.now()}`,
      applicantName: '示例申请人',
      applicantType: 'teacher',
      amount: 20000, // 200 yuan in cents
      status: 'pending',
      submittedAt: Date.now(),
      commissionIds: []
    }
  }
  // #endif
  
  // #ifndef MP-WEIXIN
  if (typeof uniCloud !== 'undefined' && uniCloud.callFunction) {
    // const { result } = await uniCloud.callFunction({
    //   name: 'admin.getWithdrawalDetails',
    //   data: { withdrawalId }
    // })
    // return result
    
    // Stub response
    return {
      _id: withdrawalId,
      withdrawalNo: `WD${Date.now()}`,
      applicantName: '示例申请人',
      applicantType: 'teacher',
      amount: 20000, // 200 yuan in cents
      status: 'pending',
      submittedAt: Date.now(),
      commissionIds: []
    }
  }
  // #endif
  
  // Dev fallback
  console.warn('[adminApi] no cloud call method; returning stub response')
  return {
    _id: withdrawalId,
    withdrawalNo: `WD${Date.now()}`,
    applicantName: '示例申请人',
    applicantType: 'teacher',
    amount: 20000, // 200 yuan in cents
    status: 'pending',
    submittedAt: Date.now(),
    commissionIds: []
  }
}

/**
 * Audit teacher application (approve or reject)
 * @param {Object} params
 * @param {string} params.teacherId - Teacher ID
 * @param {string} params.action - 'approve' | 'reject'
 * @param {string} params.rejectionReason - Optional, for reject action
 * @returns {Promise<Object>} Audit result
 */
export async function auditTeacher(params) {
  const { teacherId, action, rejectionReason = null } = params
  
  if (!teacherId || !action) {
    throw new Error('Missing required fields: teacherId, action')
  }
  
  const data = {
    teacherId,
    action,
    rejectionReason
  }
  
  // #ifdef MP-WEIXIN
  if (typeof wx !== 'undefined' && wx.cloud && wx.cloud.callFunction) {
    const { result } = await wx.cloud.callFunction({
      name: 'admin.auditTeacher',
      data
    })
    
    if (result.error) {
      throw new Error(result.message || 'Failed to audit teacher')
    }
    
    return result
  }
  // #endif
  
  // #ifndef MP-WEIXIN
  if (typeof uniCloud !== 'undefined' && uniCloud.callFunction) {
    const { result } = await uniCloud.callFunction({
      name: 'admin.auditTeacher',
      data
    })
    
    if (result.error) {
      throw new Error(result.message || 'Failed to audit teacher')
    }
    
    return result
  }
  // #endif
  
  // Dev fallback
  console.warn('[adminApi] no cloud call method; returning stub response')
  return {
    success: true,
    teacherId,
    status: action === 'approve' ? 'approved' : 'rejected',
    message: action === 'approve' ? '老师审核已通过' : '老师审核已拒绝'
  }
}

/**
 * Get teachers list for admin
 * @param {Object} params
 * @param {string} params.status - Filter by status ('pending' | 'approved' | 'rejected' | 'all')
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.pageSize - Page size (default: 20)
 * @returns {Promise<Object>} Teachers list
 */
export async function getTeachers(params = {}) {
  const { status = 'all', page = 1, pageSize = 20 } = params
  
  // TODO: Create admin.getTeachers cloud function or use direct DB query
  // For now, return stub data
  
  // #ifdef MP-WEIXIN
  if (typeof wx !== 'undefined' && wx.cloud && wx.cloud.callFunction) {
    // const { result } = await wx.cloud.callFunction({
    //   name: 'admin.getTeachers',
    //   data: { status, page, pageSize }
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
  console.warn('[adminApi] no cloud call method; returning stub response')
  return {
    teachers: [],
    total: 0,
    page,
    pageSize
  }
}

/**
 * Get teacher details for audit
 * @param {string} teacherId - Teacher ID
 * @returns {Promise<Object>} Teacher details
 */
export async function getTeacherDetails(teacherId) {
  if (!teacherId) {
    throw new Error('Missing required field: teacherId')
  }
  
  // TODO: Create admin.getTeacherDetails cloud function or use direct DB query
  // For now, return stub data
  
  // #ifdef MP-WEIXIN
  if (typeof wx !== 'undefined' && wx.cloud && wx.cloud.callFunction) {
    // const { result } = await wx.cloud.callFunction({
    //   name: 'admin.getTeacherDetails',
    //   data: { teacherId }
    // })
    // return result
    
    // Stub response
    return {
      _id: teacherId,
      name: '示例老师',
      title: '心理咨询师',
      credentials: {
        university: '示例大学',
        certificates: []
      },
      expertise: ['青少年心理', '学习焦虑']
    }
  }
  // #endif
  
  // Dev fallback
  console.warn('[adminApi] no cloud call method; returning stub response')
  return {
    _id: teacherId,
    name: '示例老师',
    title: '心理咨询师',
    credentials: {
      university: '示例大学',
      certificates: []
    },
    expertise: ['青少年心理', '学习焦虑']
  }
}

/**
 * Get admin dashboard stats
 * @param {Object} params
 * @param {string} params.date - Date string (YYYY-MM-DD, optional)
 * @returns {Promise<Object>} Dashboard stats
 */
export async function getDashboardStats(params = {}) {
  const { date = null } = params
  
  // #ifdef MP-WEIXIN
  if (typeof wx !== 'undefined' && wx.cloud && wx.cloud.callFunction) {
    try {
      const { result } = await wx.cloud.callFunction({
        name: 'admin.viewDashboard',
        data: { date }
      })
      
      if (result.error) {
        throw new Error(result.message || 'Failed to get dashboard stats')
      }
      
      return result
    } catch (error) {
      // If cloud function call fails (e.g., cloud not enabled), fall back to stub data
      console.warn('[adminApi] cloud call failed, using stub response:', error.message)
      return {
        success: true,
        stats: {
          pendingTeachers: 0,
          pendingWithdrawals: 0,
          todayOrders: 0,
          todayRevenue: 0,
          totalTeachers: 0,
          totalOrders: 0,
          totalRevenue: 0
        }
      }
    }
  }
  // #endif
  
  // #ifndef MP-WEIXIN
  if (typeof uniCloud !== 'undefined' && uniCloud.callFunction) {
    try {
      const { result } = await uniCloud.callFunction({
        name: 'admin.viewDashboard',
        data: { date }
      })
      
      if (result.error) {
        throw new Error(result.message || 'Failed to get dashboard stats')
      }
      
      return result
    } catch (error) {
      // If cloud function call fails, fall back to stub data
      console.warn('[adminApi] cloud call failed, using stub response:', error.message)
      return {
        success: true,
        stats: {
          pendingTeachers: 0,
          pendingWithdrawals: 0,
          todayOrders: 0,
          todayRevenue: 0,
          totalTeachers: 0,
          totalOrders: 0,
          totalRevenue: 0
        }
      }
    }
  }
  // #endif
  
  // Dev fallback
  console.warn('[adminApi] no cloud call method; returning stub response')
  return {
    success: true,
    stats: {
      pendingTeachers: 0,
      pendingWithdrawals: 0,
      todayOrders: 0,
      todayRevenue: 0,
      totalTeachers: 0,
      totalOrders: 0,
      totalRevenue: 0
    }
  }
}

/**
 * Configure distribution settings
 * @param {Object} params
 * @param {number} params.level1Rate - Level 1 commission rate (percentage)
 * @param {number} params.level2Rate - Level 2 commission rate (percentage)
 * @param {number} params.platformRate - Platform commission rate (percentage)
 * @returns {Promise<Object>} Updated configuration
 */
export async function configureDistribution(params) {
  const { level1Rate, level2Rate, platformRate } = params
  
  if (level1Rate === undefined && level2Rate === undefined && platformRate === undefined) {
    throw new Error('At least one rate must be provided')
  }
  
  const data = {
    config: {}
  }
  
  if (level1Rate !== undefined) data.config.level1Rate = level1Rate
  if (level2Rate !== undefined) data.config.level2Rate = level2Rate
  if (platformRate !== undefined) data.config.platformRate = platformRate
  
  // #ifdef MP-WEIXIN
  if (typeof wx !== 'undefined' && wx.cloud && wx.cloud.callFunction) {
    const { result } = await wx.cloud.callFunction({
      name: 'admin.configureDistribution',
      data
    })
    
    if (result.error) {
      throw new Error(result.message || 'Failed to configure distribution')
    }
    
    return result
  }
  // #endif
  
  // #ifndef MP-WEIXIN
  if (typeof uniCloud !== 'undefined' && uniCloud.callFunction) {
    const { result } = await uniCloud.callFunction({
      name: 'admin.configureDistribution',
      data
    })
    
    if (result.error) {
      throw new Error(result.message || 'Failed to configure distribution')
    }
    
    return result
  }
  // #endif
  
  // Dev fallback
  console.warn('[adminApi] no cloud call method; returning stub response')
  return {
    success: true,
    config: data.config,
    message: 'Distribution configuration updated'
  }
}

/**
 * Get distribution configuration
 * @returns {Promise<Object>} Current distribution configuration
 */
export async function getDistributionConfig() {
  // TODO: Create admin.getDistributionConfig cloud function or use direct DB query
  // For now, return stub data
  
  // #ifdef MP-WEIXIN
  if (typeof wx !== 'undefined' && wx.cloud && wx.cloud.callFunction) {
    // const { result } = await wx.cloud.callFunction({
    //   name: 'admin.getDistributionConfig'
    // })
    // return result
    
    // Stub response
    return {
      config: {
        level1Rate: 10,
        level2Rate: 5,
        platformRate: 30
      }
    }
  }
  // #endif
  
  // Dev fallback
  console.warn('[adminApi] no cloud call method; returning stub response')
  return {
    config: {
      level1Rate: 10,
      level2Rate: 5,
      platformRate: 30
    }
  }
}

/**
 * Get distribution stats
 * @returns {Promise<Object>} Distribution statistics
 */
export async function getDistributionStats() {
  // TODO: Create admin.getDistributionStats cloud function or use direct DB query
  // For now, return stub data
  
  // #ifdef MP-WEIXIN
  if (typeof wx !== 'undefined' && wx.cloud && wx.cloud.callFunction) {
    // const { result } = await wx.cloud.callFunction({
    //   name: 'admin.getDistributionStats'
    // })
    // return result
    
    // Stub response
    return {
      totalDistributors: 0,
      totalReferrals: 0,
      totalCommissions: 0
    }
  }
  // #endif
  
  // Dev fallback
  console.warn('[adminApi] no cloud call method; returning stub response')
  return {
    totalDistributors: 0,
    totalReferrals: 0,
    totalCommissions: 0
  }
}

/**
 * Get orders list for admin
 * @param {Object} params
 * @param {string} params.status - Filter by status ('all' | 'pending' | 'paid' | 'completed' | 'refunded' | 'cancelled')
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.pageSize - Page size (default: 20)
 * @returns {Promise<Object>} Orders list
 */
export async function getOrders(params = {}) {
  const { status = 'all', page = 1, pageSize = 20 } = params
  
  // TODO: Create admin.getOrders cloud function or use direct DB query
  // For now, return stub data
  
  // #ifdef MP-WEIXIN
  if (typeof wx !== 'undefined' && wx.cloud && wx.cloud.callFunction) {
    // const { result } = await wx.cloud.callFunction({
    //   name: 'admin.getOrders',
    //   data: { status, page, pageSize }
    // })
    // return result
    
    // Stub response
    return {
      orders: [],
      total: 0,
      page,
      pageSize
    }
  }
  // #endif
  
  // Dev fallback
  console.warn('[adminApi] no cloud call method; returning stub response')
  return {
    orders: [],
    total: 0,
    page,
    pageSize
  }
}
