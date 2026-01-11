/**
 * Client wrapper for student records-related cloud function calls.
 */

/**
 * Get student's counseling records (read-only, filtered by authorization level)
 * @param {Object} params
 * @param {number} params.page - Page number (default: 1)
 * @param {number} params.pageSize - Page size (default: 20)
 * @returns {Promise<Object>} Student records list
 */
export async function getStudentRecords(params = {}) {
  const { page = 1, pageSize = 20 } = params
  
  // TODO: Create student.getRecords cloud function or use direct DB query
  // This should filter records based on student's authorizationLevel:
  // - 'full': Show complete log content
  // - 'summary': Show summary only (first 100 chars or summary field)
  // - 'alerts_only': Show only alerts/summaries when flagged
  
  // #ifdef MP-WEIXIN
  if (typeof wx !== 'undefined' && wx.cloud && wx.cloud.callFunction) {
    // const { result } = await wx.cloud.callFunction({
    //   name: 'student.getRecords',
    //   data: { page, pageSize }
    // })
    // return result
    
    // Stub response
    return {
      records: [],
      total: 0,
      page,
      pageSize
    }
  }
  // #endif
  
  // #ifndef MP-WEIXIN
  if (typeof uniCloud !== 'undefined' && uniCloud.callFunction) {
    // const { result } = await uniCloud.callFunction({
    //   name: 'student.getRecords',
    //   data: { page, pageSize }
    // })
    // return result
    
    // Stub response
    return {
      records: [],
      total: 0,
      page,
      pageSize
    }
  }
  // #endif
  
  // Dev fallback
  console.warn('[studentRecordsApi] no cloud call method; returning stub response')
  return {
    records: [],
    total: 0,
    page,
    pageSize
  }
}
