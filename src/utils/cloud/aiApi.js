/**
 * Client wrapper for AI-related cloud function calls.
 */

/**
 * Get intelligent teacher recommendations
 * @param {Object} params
 * @param {string} params.issueType - Issue type (e.g., 'learning_anxiety', 'social_stress')
 * @param {number} params.age - Student age
 * @param {string} params.studentId - Optional, student _id
 * @returns {Promise<Object>} Recommendations result
 */
export async function getRecommendations(params) {
  const { issueType, age, studentId = null } = params
  
  if (!issueType || !age) {
    throw new Error('Missing required fields: issueType, age')
  }
  
  const data = {
    issueType,
    age,
    studentId
  }
  
  // #ifdef MP-WEIXIN
  if (typeof wx !== 'undefined' && wx.cloud && wx.cloud.callFunction) {
    const { result } = await wx.cloud.callFunction({
      name: 'ai.getRecommendations',
      data
    })
    
    if (result.error) {
      throw new Error(result.message || 'Failed to get recommendations')
    }
    
    return result
  }
  // #endif
  
  // #ifndef MP-WEIXIN
  if (typeof uniCloud !== 'undefined' && uniCloud.callFunction) {
    const { result } = await uniCloud.callFunction({
      name: 'ai.getRecommendations',
      data
    })
    
    if (result.error) {
      throw new Error(result.message || 'Failed to get recommendations')
    }
    
    return result
  }
  // #endif
  
  // Dev fallback
  console.warn('[aiApi] no cloud call method; returning stub response')
  return {
    success: true,
    recommendations: [],
    message: '暂无推荐老师'
  }
}
