/**
 * WXCloud Function: admin.auditTeacher
 * Approve or reject teacher application.
 * 
 * Input:
 * - teacherId: string (teacher's _id or openid)
 * - action: 'approve' | 'reject'
 * - adminOpenId: string (auto from context)
 * - rejectionReason: string (optional, for reject action)
 * 
 * Output:
 * - success: boolean
 * - teacherId: string
 * - status: 'approved' | 'rejected'
 * - message: string
 */

// const cloud = require('wx-server-sdk')
// cloud.init()
const db = null // TODO: Initialize with cloud.database() when WXCloud is set up

async function getTeacher(teacherId) {
  // TODO: Query teachers collection
  // const teacherResult = await db.collection('teachers').doc(teacherId).get()
  // if (!teacherResult.data) {
  //   // Try by openid
  //   const teacherByOpenidResult = await db.collection('teachers')
  //     .where({ teacherOpenId: teacherId })
  //     .get()
  //   if (teacherByOpenidResult.data && teacherByOpenidResult.data.length > 0) {
  //     return teacherByOpenidResult.data[0]
  //   }
  // }
  // return teacherResult.data
  
  // Placeholder
  return {
    _id: teacherId,
    teacherOpenId: 'teacher_123',
    status: 'pending',
    name: '示例老师',
    credentials: {}
  }
}

async function verifyAdmin(adminOpenId) {
  // TODO: Verify user has admin role
  // const userResult = await db.collection('users')
  //   .where({ openid: adminOpenId })
  //   .get()
  // 
  // const user = userResult.data[0]
  // if (!user || !user.roles?.includes('admin')) {
  //   throw new Error('Not authorized as admin')
  // }
  
  // Placeholder: assume authorized
  return true
}

exports.main = async (event, context) => {
  const { teacherId, action, adminOpenId, rejectionReason = null } = event || {}
  const openid = (context && context.OPENID) || adminOpenId || 'dev-openid'
  
  if (!teacherId || !action) {
    return {
      error: 'INVALID_INPUT',
      message: 'Missing required fields: teacherId, action'
    }
  }
  
  if (action !== 'approve' && action !== 'reject') {
    return {
      error: 'INVALID_ACTION',
      message: 'Action must be "approve" or "reject"'
    }
  }
  
  try {
    // 1. Verify admin
    await verifyAdmin(openid)
    
    // 2. Get teacher details
    const teacher = await getTeacher(teacherId)
    
    if (!teacher) {
      return {
        error: 'TEACHER_NOT_FOUND',
        message: 'Teacher not found'
      }
    }
    
    if (teacher.status !== 'pending') {
      return {
        error: 'INVALID_STATUS',
        message: `Teacher is not in pending status. Current status: ${teacher.status}`
      }
    }
    
    if (action === 'approve') {
      // 3. Update teacher status to 'approved'
      // TODO: Update teachers collection
      // await db.collection('teachers').doc(teacher._id).update({
      //   data: {
      //     status: 'approved',
      //     approvedAt: new Date(),
      //     approvedBy: openid
      //   }
      // })
      
      // 4. Update user's teacherProfile status
      // TODO: Update users collection
      // await db.collection('users')
      //   .where({ openid: teacher.teacherOpenId })
      //   .update({
      //     data: {
      //       'teacherProfile.status': 'approved',
      //       'teacherProfile.approvedAt': new Date(),
      //       'teacherProfile.approvedBy': openid
      //     }
      //   })
      
      // 5. Generate referral code if user is also a distributor
      // TODO: Check if user has distributor role, generate referral code if needed
      
      // 6. Send notification to teacher (TODO: implement notification)
      
      return {
        success: true,
        teacherId: teacher._id,
        status: 'approved',
        message: '老师审核已通过'
      }
    }
    
    if (action === 'reject') {
      // 3. Update teacher status to 'rejected'
      // TODO: Update teachers collection
      // await db.collection('teachers').doc(teacher._id).update({
      //   data: {
      //     status: 'rejected',
      //     rejectionReason: rejectionReason || '审核未通过',
      //     reviewedAt: new Date(),
      //     reviewedBy: openid
      //   }
      // })
      
      // 4. Update user's teacherProfile status
      // TODO: Update users collection
      // await db.collection('users')
      //   .where({ openid: teacher.teacherOpenId })
      //   .update({
      //     data: {
      //       'teacherProfile.status': 'rejected',
      //       'teacherProfile.rejectionReason': rejectionReason || '审核未通过',
      //       'teacherProfile.reviewedAt': new Date(),
      //       'teacherProfile.reviewedBy': openid
      //     }
      //   })
      
      // 5. Send notification to teacher (TODO: implement notification)
      
      return {
        success: true,
        teacherId: teacher._id,
        status: 'rejected',
        message: '老师审核已拒绝',
        rejectionReason: rejectionReason || '审核未通过'
      }
    }
  } catch (error) {
    console.error('auditTeacher error:', error)
    return {
      error: 'INTERNAL_ERROR',
      message: error.message || 'Failed to process teacher audit'
    }
  }
}
