/**
 * WXCloud Function: teacher.submitLog
 * Submits counseling session log after session completion.
 * 
 * Input:
 * - bookingId: string
 * - teacherOpenId: string (auto from context)
 * - logContent: string (session summary)
 * - sessionDate: number (timestamp)
 * - duration: number (minutes, actual duration)
 * 
 * Output:
 * - success: boolean
 * - logId: string
 */

// const cloud = require('wx-server-sdk')
// cloud.init()
const db = null // TODO: Initialize with cloud.database() when WXCloud is set up
const { msgSecCheckProxy } = require('../../safety/msgSecCheckProxy/index.js')

async function validateBooking(bookingId, teacherOpenId) {
  // TODO: Query bookings collection
  // const bookingResult = await db.collection('bookings').doc(bookingId).get()
  // const booking = bookingResult.data
  // 
  // if (!booking) {
  //   throw new Error('Booking not found')
  // }
  // 
  // if (booking.teacherId !== teacherOpenId) {
  //   throw new Error('Not authorized to submit log for this booking')
  // }
  // 
  // if (booking.status !== 'confirmed' && booking.status !== 'completed') {
  //   throw new Error('Booking is not in confirmed or completed status')
  // }
  // 
  // return booking
  
  // Placeholder validation
  return {
    _id: bookingId,
    teacherId: teacherOpenId,
    status: 'confirmed',
    studentId: 'student_123',
    parentOpenId: 'parent_123'
  }
}

async function checkExistingLog(bookingId) {
  // TODO: Check if log already exists
  // const logResult = await db.collection('counseling_logs')
  //   .where({ bookingId })
  //   .get()
  // 
  // if (logResult.data.length > 0) {
  //   throw new Error('Log already exists for this booking')
  // }
  
  return false
}

exports.main = async (event, context) => {
  const { bookingId, teacherOpenId, logContent, sessionDate, duration } = event || {}
  const openid = (context && context.OPENID) || teacherOpenId || 'dev-openid'
  
  if (!bookingId || !logContent) {
    return {
      error: 'INVALID_INPUT',
      message: 'Missing required fields: bookingId, logContent'
    }
  }
  
  if (!sessionDate) {
    return {
      error: 'INVALID_INPUT',
      message: 'Missing required field: sessionDate'
    }
  }
  
  try {
    // 1. Validate booking
    const booking = await validateBooking(bookingId, openid)
    
    // 2. Check if log already exists
    await checkExistingLog(bookingId)
    
    // 3. Content safety check
    const safetyCheck = await msgSecCheckProxy({
      scene: 'output',
      content: logContent
    })
    
    if (safetyCheck.result === 'reject') {
      return {
        error: 'CONTENT_SAFETY_REJECTED',
        message: 'Log content does not pass safety check'
      }
    }
    
    if (safetyCheck.result === 'review') {
      // Allow but flag for manual review
      // TODO: Add flag to log record
    }
    
    // 4. Create counseling log
    const logData = {
      bookingId,
      teacherId: booking.teacherId || openid,
      studentId: booking.studentId,
      parentOpenId: booking.parentOpenId,
      sessionDate: new Date(sessionDate),
      duration: duration || booking.duration || 60,
      logContent,
      visibilityLevel: 'summary', // Default, can be updated by parent/student settings
      createdAt: new Date()
    }
    
    // TODO: Save to counseling_logs collection
    // const logResult = await db.collection('counseling_logs').add({ data: logData })
    // const logId = logResult._id
    
    const logId = `log_${Date.now()}`
    
    // 5. Update booking status to completed
    // TODO: Update booking status
    // await db.collection('bookings').doc(bookingId).update({
    //   data: {
    //     status: 'completed',
    //     completedAt: new Date()
    //   }
    // })
    
    // 6. Update order status if applicable
    // TODO: If booking has orderId, update order status to completed
    // await db.collection('orders').doc(booking.orderId).update({
    //   data: {
    //     status: 'completed',
    //     completedAt: new Date()
    //   }
    // })
    
    // 7. Send notification to parent (TODO: implement notification)
    
    return {
      success: true,
      logId,
      message: 'Log submitted successfully'
    }
  } catch (error) {
    console.error('submitLog error:', error)
    return {
      error: 'INTERNAL_ERROR',
      message: error.message || 'Failed to submit log'
    }
  }
}
