/**
 * WXCloud Function: teacher.updateProfile
 * Updates teacher profile information.
 * 
 * Input:
 * - teacherOpenId: string (auto from context)
 * - profile: object (partial profile update)
 *   - name: string
 *   - title: string
 *   - bio: string
 *   - expertise: string[]
 *   - serviceModes: string[]
 *   - pricePerHour: number (in cents)
 *   - credentials: {
 *       idCard: string
 *       qualifications: string[]
 *       university: string
 *       certificates: string[] (cloud storage URLs)
 *     }
 * 
 * Output:
 * - success: boolean
 * - teacherId: string
 * - status: string (if status changed, e.g., pending -> approved)
 */

// const cloud = require('wx-server-sdk')
// cloud.init()
const db = null // TODO: Initialize with cloud.database() when WXCloud is set up
const { msgSecCheckProxy } = require('../../safety/msgSecCheckProxy/index.js')

async function validateProfileUpdate(profile) {
  // Validate pricePerHour
  if (profile.pricePerHour !== undefined) {
    if (typeof profile.pricePerHour !== 'number' || profile.pricePerHour <= 0) {
      throw new Error('pricePerHour must be a positive number')
    }
  }
  
  // Validate serviceModes
  if (profile.serviceModes !== undefined) {
    if (!Array.isArray(profile.serviceModes)) {
      throw new Error('serviceModes must be an array')
    }
    const validModes = ['online', 'offline']
    const invalidModes = profile.serviceModes.filter(m => !validModes.includes(m))
    if (invalidModes.length > 0) {
      throw new Error(`Invalid serviceModes: ${invalidModes.join(', ')}`)
    }
  }
  
  // Validate expertise
  if (profile.expertise !== undefined) {
    if (!Array.isArray(profile.expertise)) {
      throw new Error('expertise must be an array')
    }
  }
}

async function checkContentSafety(profile) {
  // Check bio content safety if provided
  if (profile.bio) {
    const safetyCheck = await msgSecCheckProxy({
      scene: 'input',
      content: profile.bio
    })
    
    if (safetyCheck.result === 'reject') {
      throw new Error('Bio content does not pass safety check')
    }
  }
}

exports.main = async (event, context) => {
  const { teacherOpenId, profile } = event || {}
  const openid = (context && context.OPENID) || teacherOpenId || 'dev-openid'
  
  if (!profile || typeof profile !== 'object') {
    return {
      error: 'INVALID_INPUT',
      message: 'Missing required field: profile (object)'
    }
  }
  
  try {
    // 1. Verify teacher exists
    // TODO: Query teachers collection
    // const teacherResult = await db.collection('teachers').where({ teacherOpenId: openid }).get()
    // const teacher = teacherResult.data[0]
    // 
    // if (!teacher) {
    //   return {
    //     error: 'TEACHER_NOT_FOUND',
    //     message: 'Teacher profile not found'
    //   }
    // }
    
    // Placeholder teacher
    const teacher = {
      _id: 'teacher_123',
      teacherOpenId: openid,
      status: 'approved'
    }
    
    // 2. Validate profile update
    await validateProfileUpdate(profile)
    
    // 3. Content safety check
    await checkContentSafety(profile)
    
    // 4. If credentials are updated, set status to pending (requires admin review)
    let statusChanged = false
    let newStatus = teacher.status
    
    if (profile.credentials && Object.keys(profile.credentials).length > 0) {
      if (teacher.status === 'approved') {
        // If updating credentials while approved, set to pending for re-review
        newStatus = 'pending'
        statusChanged = true
      }
    }
    
    // 5. Prepare update data
    const updateData = {
      ...profile,
      updatedAt: new Date()
    }
    
    if (statusChanged) {
      updateData.status = newStatus
      updateData.statusChangedAt = new Date()
    }
    
    // TODO: Update teacher profile in teachers collection
    // await db.collection('teachers').doc(teacher._id).update({
    //   data: updateData
    // })
    
    // 6. Also update user's teacherProfile if it exists
    // TODO: Update users collection
    // await db.collection('users').where({ openid }).update({
    //   data: {
    //     teacherProfile: {
    //       ...updateData
    //     }
    //   }
    // })
    
    return {
      success: true,
      teacherId: teacher._id,
      status: newStatus,
      statusChanged,
      message: statusChanged ? 'Profile updated. Status changed to pending for admin review.' : 'Profile updated successfully'
    }
  } catch (error) {
    console.error('updateProfile error:', error)
    return {
      error: 'INTERNAL_ERROR',
      message: error.message || 'Failed to update profile'
    }
  }
}
