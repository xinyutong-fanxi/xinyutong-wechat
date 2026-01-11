/**
 * WXCloud Function: ai.getRecommendations
 * Get intelligent teacher recommendations based on issue type, age, and other factors.
 * 
 * Input:
 * - issueType: string (e.g., 'learning_anxiety', 'social_stress', 'family_conflict', 'exam_anxiety')
 * - age: number (student age)
 * - studentId: string (optional, student _id for personalized recommendations)
 * - parentOpenId: string (auto from context, optional)
 * 
 * Output:
 * - success: boolean
 * - recommendations: Array<{
 *     teacherId: string,
 *     teacherName: string,
 *     expertise: string[],
 *     pricePerHour: number,
 *     rating: number,
 *     matchScore: number, // 0-100, how well this teacher matches the issue
 *     matchReason: string // explanation of why this teacher is recommended
 *   }>
 * - message: string
 */

// const cloud = require('wx-server-sdk')
// cloud.init()
const db = null // TODO: Initialize with cloud.database() when WXCloud is set up

// Issue type to expertise mapping
const ISSUE_TO_EXPERTISE = {
  learning_anxiety: ['学习焦虑', '学习动力', '学习方法'],
  social_stress: ['人际关系', '社交焦虑', '校园适应'],
  family_conflict: ['家庭关系', '亲子沟通', '家庭矛盾'],
  exam_anxiety: ['考试焦虑', '压力管理', '学习压力'],
  emotional_issues: ['情绪管理', '情感支持', '心理疏导'],
  behavior_problems: ['行为问题', '行为矫正', '习惯养成']
}

// Age-based expertise preferences
function getAgePreferences(age) {
  if (age >= 8 && age <= 12) {
    return ['小学生心理', '儿童心理', '低龄学生']
  } else if (age >= 13 && age <= 15) {
    return ['初中生心理', '青少年心理', '青春期心理']
  } else if (age >= 16 && age <= 18) {
    return ['高中生心理', '青少年心理', '升学压力']
  }
  return []
}

function calculateMatchScore(teacher, issueType, age) {
  let score = 0
  
  // Base score from rating (0-40 points)
  score += (teacher.rating || 0) * 8 // Assuming rating is 0-5
  
  // Issue type match (0-40 points)
  const requiredExpertise = ISSUE_TO_EXPERTISE[issueType] || []
  const teacherExpertise = teacher.expertise || []
  const matchingExpertise = requiredExpertise.filter(exp => 
    teacherExpertise.some(te => te.includes(exp) || exp.includes(te))
  )
  if (matchingExpertise.length > 0) {
    score += (matchingExpertise.length / requiredExpertise.length) * 40
  } else {
    // Partial match based on general categories
    score += 20
  }
  
  // Age preference match (0-20 points)
  const agePreferences = getAgePreferences(age)
  const ageMatch = agePreferences.filter(ap =>
    teacherExpertise.some(te => te.includes(ap) || ap.includes(te))
  )
  if (ageMatch.length > 0) {
    score += (ageMatch.length / agePreferences.length) * 20
  }
  
  // Normalize to 0-100
  return Math.min(100, Math.round(score))
}

exports.main = async (event, context) => {
  const { issueType, age, studentId = null, parentOpenId = null } = event || {}
  const openid = (context && context.OPENID) || parentOpenId || 'dev-openid'
  
  if (!issueType || !age) {
    return {
      error: 'INVALID_INPUT',
      message: 'Missing required fields: issueType, age'
    }
  }
  
  if (age < 8 || age > 18) {
    return {
      error: 'INVALID_AGE',
      message: 'Age must be between 8 and 18'
    }
  }
  
  try {
    // 1. Get approved teachers with matching expertise
    // TODO: Query teachers collection
    // const teachersResult = await db.collection('teachers')
    //   .where({
    //     status: 'approved',
    //     expertise: db.command.in(ISSUE_TO_EXPERTISE[issueType] || [])
    //   })
    //   .get()
    // 
    // let teachers = teachersResult.data || []
    // 
    // // If no exact match, get teachers with general matching categories
    // if (teachers.length === 0) {
    //   const generalTeachersResult = await db.collection('teachers')
    //     .where({ status: 'approved' })
    //     .get()
    //   teachers = generalTeachersResult.data || []
    // }
    
    // Placeholder: stub teachers data
    const teachers = [
      {
        _id: 'teacher_1',
        teacherOpenId: 'teacher_openid_1',
        name: '张老师',
        expertise: ['学习焦虑', '学习动力', '小学生心理'],
        pricePerHour: 20000, // 200 yuan in cents
        rating: 4.8,
        serviceModes: ['online', 'offline']
      },
      {
        _id: 'teacher_2',
        teacherOpenId: 'teacher_openid_2',
        name: '李老师',
        expertise: ['社交焦虑', '人际关系', '青少年心理'],
        pricePerHour: 25000, // 250 yuan in cents
        rating: 4.9,
        serviceModes: ['online']
      }
    ]
    
    // 2. Calculate match scores for each teacher
    const teachersWithScores = teachers.map(teacher => ({
      ...teacher,
      matchScore: calculateMatchScore(teacher, issueType, age),
      matchReason: `专业匹配度: ${((teacher.matchScore || 0) / 100 * 100).toFixed(0)}%`
    }))
    
    // 3. Sort by match score (descending) and limit to top 5
    teachersWithScores.sort((a, b) => b.matchScore - a.matchScore)
    const topRecommendations = teachersWithScores.slice(0, 5)
    
    // 4. Format recommendations
    const recommendations = topRecommendations.map(t => ({
      teacherId: t._id,
      teacherName: t.name,
      expertise: t.expertise || [],
      pricePerHour: t.pricePerHour || 0,
      rating: t.rating || 0,
      matchScore: t.matchScore,
      matchReason: `擅长${(t.expertise || []).slice(0, 2).join('、')}，评分${(t.rating || 0).toFixed(1)}分`
    }))
    
    return {
      success: true,
      recommendations,
      message: `为您推荐了 ${recommendations.length} 位合适的老师`
    }
  } catch (error) {
    console.error('getRecommendations error:', error)
    return {
      error: 'INTERNAL_ERROR',
      message: error.message || 'Failed to get teacher recommendations'
    }
  }
}
