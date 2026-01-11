/**
 * WXCloud Function: booking.submitFeedback
 * Submit parent feedback (rating and comment) for a completed counseling session.
 * 
 * Input:
 * - bookingId: string
 * - rating: number (1-5)
 * - comment: string (optional)
 * 
 * Output:
 * - success: boolean
 * - bookingId: string
 * - message: string
 */

// const cloud = require('wx-server-sdk')
// cloud.init()
const db = null // TODO: Initialize with cloud.database() when WXCloud is set up

async function getBooking(bookingId) {
  // TODO: Query bookings collection
  // const bookingResult = await db.collection('bookings').doc(bookingId).get()
  // return bookingResult.data
  
  // Placeholder
  return {
    _id: bookingId,
    parentOpenId: 'parent_123',
    status: 'completed',
    counselingLogId: `log_${bookingId}`
  }
}

async function getCounselingLog(logId) {
  // TODO: Query counseling_logs collection
  // const logResult = await db.collection('counseling_logs').doc(logId).get()
  // return logResult.data
  
  // Placeholder
  return {
    _id: logId,
    bookingId: bookingId
  }
}

exports.main = async (event, context) => {
  const { bookingId, rating, comment = null } = event || {}
  const openid = (context && context.OPENID) || 'dev-openid'
  
  if (!bookingId || !rating) {
    return {
      error: 'INVALID_INPUT',
      message: 'Missing required fields: bookingId, rating'
    }
  }
  
  if (rating < 1 || rating > 5) {
    return {
      error: 'INVALID_INPUT',
      message: 'Rating must be between 1 and 5'
    }
  }
  
  try {
    // 1. Get booking details
    const booking = await getBooking(bookingId)
    
    if (!booking) {
      return {
        error: 'BOOKING_NOT_FOUND',
        message: 'Booking not found'
      }
    }
    
    // 2. Verify parent owns this booking
    if (booking.parentOpenId !== openid) {
      return {
        error: 'UNAUTHORIZED',
        message: 'You are not authorized to submit feedback for this booking'
      }
    }
    
    // 3. Verify booking is completed
    if (booking.status !== 'completed') {
      return {
        error: 'INVALID_BOOKING_STATUS',
        message: 'Feedback can only be submitted for completed bookings'
      }
    }
    
    // 4. Get counseling log
    const counselingLog = await getCounselingLog(booking.counselingLogId, bookingId)
    
    if (!counselingLog) {
      return {
        error: 'LOG_NOT_FOUND',
        message: 'Counseling log not found'
      }
    }
    
    // 5. Check if feedback already exists
    if (counselingLog.parentFeedback && counselingLog.parentFeedback.submittedAt) {
      return {
        error: 'FEEDBACK_ALREADY_SUBMITTED',
        message: 'Feedback has already been submitted for this booking'
      }
    }
    
    // 6. Content safety check for comment (if provided)
    if (comment && comment.trim()) {
      // TODO: Call msgSecCheckProxy
      // const safetyCheck = await msgSecCheckProxy({
      //   scene: 'input',
      //   content: comment
      // })
      // 
      // if (safetyCheck.result === 'reject') {
      //   return {
      //     error: 'CONTENT_SAFETY_REJECTED',
      //     message: 'Comment does not pass safety check'
      //   }
      // }
    }
    
    // 7. Update counseling log with feedback
    const feedbackData = {
      rating,
      comment: comment && comment.trim() ? comment.trim() : null,
      submittedAt: new Date()
    }
    
    // TODO: Update counseling_logs collection
    // await db.collection('counseling_logs').doc(counselingLog._id).update({
    //   data: {
    //     parentFeedback: feedbackData
    //   }
    // })
    
    // 8. Update teacher rating (calculate new average rating)
    // TODO: Query all counseling logs for this teacher to calculate average
    // const teacherLogs = await db.collection('counseling_logs')
    //   .where({
    //     teacherId: booking.teacherId,
    //     'parentFeedback.submittedAt': db.command.exists(true)
    //   })
    //   .get()
    // 
    // const ratings = teacherLogs.data.map(log => log.parentFeedback.rating).filter(r => r)
    // const averageRating = ratings.length > 0 
    //   ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length 
    //   : 0
    // 
    // await db.collection('teachers').doc(booking.teacherId).update({
    //   data: {
    //     rating: Math.round(averageRating * 10) / 10 // Round to 1 decimal
    //   }
    // })
    
    return {
      success: true,
      bookingId,
      message: 'Feedback submitted successfully'
    }
  } catch (error) {
    console.error('submitFeedback error:', error)
    return {
      error: 'INTERNAL_ERROR',
      message: error.message || 'Failed to submit feedback'
    }
  }
}
