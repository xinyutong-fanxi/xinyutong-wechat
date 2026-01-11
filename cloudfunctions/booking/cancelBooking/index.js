/**
 * WXCloud Function: booking.cancelBooking
 * Cancels a booking (can be called by parent or teacher).
 * 
 * Input:
 * - bookingId: string
 * - openid: string (parent or teacher openid)
 * - role: 'parent' | 'teacher'
 * - cancellationReason: string
 * 
 * Output:
 * - success: boolean
 * - bookingId: string
 * - refundAmount: number (in cents, if applicable)
 */

// const cloud = require('wx-server-sdk')
// cloud.init()
const db = null // TODO: Initialize with cloud.database() when WXCloud is set up

exports.main = async (event, context) => {
  const { bookingId, openid, role, cancellationReason = 'User cancelled' } = event || {}
  const callerOpenid = (context && context.OPENID) || openid || 'dev-openid'
  
  if (!bookingId || !role) {
    return {
      error: 'INVALID_INPUT',
      message: 'Missing required fields: bookingId, role'
    }
  }
  
  if (role !== 'parent' && role !== 'teacher') {
    return {
      error: 'INVALID_ROLE',
      message: 'Role must be "parent" or "teacher"'
    }
  }
  
  try {
    // 1. Verify booking exists and caller has permission
    // TODO: Query bookings collection
    // const bookingResult = await db.collection('bookings').doc(bookingId).get()
    // const booking = bookingResult.data
    // 
    // if (!booking) {
    //   return { error: 'BOOKING_NOT_FOUND', message: 'Booking not found' }
    // }
    // 
    // if (role === 'parent' && booking.parentOpenId !== callerOpenid) {
    //   return { error: 'UNAUTHORIZED', message: 'Not authorized to cancel this booking' }
    // }
    // 
    // if (role === 'teacher') {
    //   const teacherResult = await db.collection('teachers').doc(booking.teacherId).get()
    //   const teacher = teacherResult.data
    //   if (teacher.teacherOpenId !== callerOpenid) {
    //     return { error: 'UNAUTHORIZED', message: 'Not authorized to cancel this booking' }
    //   }
    // }
    
    // Placeholder validation
    const booking = {
      _id: bookingId,
      status: 'confirmed',
      paymentStatus: 'paid',
      orderId: 'order_123'
    }
    
    if (booking.status === 'cancelled' || booking.status === 'completed') {
      return {
        error: 'INVALID_STATUS',
        message: 'Booking cannot be cancelled in current status'
      }
    }
    
    // 2. Calculate refund (if payment was made)
    let refundAmount = 0
    if (booking.paymentStatus === 'paid') {
      // TODO: Query order to get amount
      // const orderResult = await db.collection('orders').doc(booking.orderId).get()
      // const order = orderResult.data
      // 
      // Refund policy: Full refund if cancelled 24h before appointment, 50% if less than 24h
      // const scheduledTime = booking.scheduledAt.getTime()
      // const now = Date.now()
      // const hoursUntilAppointment = (scheduledTime - now) / (1000 * 60 * 60)
      // 
      // if (hoursUntilAppointment >= 24) {
      //   refundAmount = order.amount
      // } else {
      //   refundAmount = Math.round(order.amount * 0.5)
      // }
      
      // Placeholder: full refund
      refundAmount = 20000 // 200 yuan
    }
    
    // 3. Update booking status
    // TODO: Update booking in DB
    // await db.collection('bookings').doc(bookingId).update({
    //   data: {
    //     status: 'cancelled',
    //     cancellationReason,
    //     cancelledAt: new Date()
    //   }
    // })
    
    // 4. Update order status and initiate refund if applicable
    if (booking.paymentStatus === 'paid' && refundAmount > 0) {
      // TODO: Update order status
      // await db.collection('orders').doc(booking.orderId).update({
      //   data: {
      //     status: 'refunded',
      //     refundAmount,
      //     refundedAt: new Date()
      //   }
      // })
      // 
      // TODO: Call WeChat Pay refund API
      // await refundPayment(booking.orderId, refundAmount)
    }
    
    return {
      success: true,
      bookingId,
      refundAmount,
      message: refundAmount > 0 ? `Refund of ￥${(refundAmount / 100).toFixed(2)} will be processed within 3-5 business days` : 'Booking cancelled successfully'
    }
  } catch (error) {
    console.error('cancelBooking error:', error)
    return {
      error: 'INTERNAL_ERROR',
      message: error.message || 'Failed to cancel booking'
    }
  }
}
