/**
 * WXCloud Function: teacher.manageSchedule
 * Manages teacher's availability schedule.
 * 
 * Input:
 * - action: 'get' | 'set' | 'clear'
 * - teacherOpenId: string (auto from context)
 * - date: string (YYYY-MM-DD, for get/clear)
 * - timeSlots: Array<{date: string, time: string, available: boolean}> (for set)
 * 
 * Output:
 * - success: boolean
 * - schedule: Array<{date: string, time: string, available: boolean}> (for get)
 */

// const cloud = require('wx-server-sdk')
// cloud.init()
const db = null // TODO: Initialize with cloud.database() when WXCloud is set up

async function getTeacherSchedule(teacherOpenId, startDate, endDate) {
  // TODO: Query teacher_schedule or bookings collection
  // For now, return empty array
  
  // Example query:
  // const scheduleResult = await db.collection('teacher_schedule')
  //   .where({
  //     teacherOpenId,
  //     date: db.command.gte(startDate).and(db.command.lte(endDate))
  //   })
  //   .get()
  // 
  // return scheduleResult.data.map(s => ({
  //   date: s.date,
  //   time: s.time,
  //   available: s.available
  // }))
  
  return []
}

async function setTeacherSchedule(teacherOpenId, timeSlots) {
  // TODO: Update teacher_schedule collection
  // For each slot, upsert (update if exists, insert if not)
  
  // Example:
  // for (const slot of timeSlots) {
  //   await db.collection('teacher_schedule').where({
  //     teacherOpenId,
  //     date: slot.date,
  //     time: slot.time
  //   }).update({
  //     data: {
  //       available: slot.available,
  //       updatedAt: new Date()
  //     }
  //   }).then(() => {
  //     // Update successful
  //   }).catch(() => {
  //     // Not found, insert new
  //     return db.collection('teacher_schedule').add({
  //       data: {
  //         teacherOpenId,
  //         date: slot.date,
  //         time: slot.time,
  //         available: slot.available,
  //         createdAt: new Date(),
  //         updatedAt: new Date()
  //       }
  //     })
  //   })
  // }
}

async function clearTeacherSchedule(teacherOpenId, date) {
  // TODO: Clear all slots for a specific date
  // await db.collection('teacher_schedule').where({
  //   teacherOpenId,
  //   date
  // }).remove()
}

async function checkBookingConflicts(teacherOpenId, timeSlots) {
  // TODO: Check for existing bookings that conflict with the schedule
  // Query bookings collection for overlapping times
  // Return array of conflicting slots
  
  // Example:
  // const conflicts = []
  // for (const slot of timeSlots) {
  //   if (slot.available === false) continue
  //   
  //   const bookingResult = await db.collection('bookings').where({
  //     teacherId: teacherOpenId,
  //     scheduledAt: db.command.gte(new Date(`${slot.date} ${slot.time}`)),
  //     status: db.command.in(['pending', 'confirmed'])
  //   }).get()
  //   
  //   if (bookingResult.data.length > 0) {
  //     conflicts.push(slot)
  //   }
  // }
  // 
  // return conflicts
  
  return []
}

exports.main = async (event, context) => {
  const { action, teacherOpenId, date, timeSlots, startDate, endDate } = event || {}
  const openid = (context && context.OPENID) || teacherOpenId || 'dev-openid'
  
  if (!action) {
    return {
      error: 'INVALID_INPUT',
      message: 'Missing required field: action'
    }
  }
  
  if (action !== 'get' && action !== 'set' && action !== 'clear') {
    return {
      error: 'INVALID_ACTION',
      message: 'Action must be "get", "set", or "clear"'
    }
  }
  
  try {
    // 1. Verify teacher exists and is approved
    // TODO: Query teachers collection
    // const teacherResult = await db.collection('teachers').where({ teacherOpenId: openid }).get()
    // const teacher = teacherResult.data[0]
    // 
    // if (!teacher || teacher.status !== 'approved') {
    //   return {
    //     error: 'TEACHER_NOT_APPROVED',
    //     message: 'Teacher is not approved'
    //   }
    // }
    
    if (action === 'get') {
      // Get schedule for date range
      const schedule = await getTeacherSchedule(openid, startDate || date, endDate || date)
      
      return {
        success: true,
        schedule
      }
    }
    
    if (action === 'set') {
      if (!timeSlots || !Array.isArray(timeSlots)) {
        return {
          error: 'INVALID_INPUT',
          message: 'Missing required field: timeSlots (array)'
        }
      }
      
      // Check for booking conflicts
      const conflicts = await checkBookingConflicts(openid, timeSlots)
      
      if (conflicts.length > 0) {
        return {
          error: 'BOOKING_CONFLICT',
          message: 'Some time slots conflict with existing bookings',
          conflicts
        }
      }
      
      // Set schedule
      await setTeacherSchedule(openid, timeSlots)
      
      return {
        success: true,
        message: 'Schedule updated successfully'
      }
    }
    
    if (action === 'clear') {
      if (!date) {
        return {
          error: 'INVALID_INPUT',
          message: 'Missing required field: date'
        }
      }
      
      await clearTeacherSchedule(openid, date)
      
      return {
        success: true,
        message: 'Schedule cleared successfully'
      }
    }
  } catch (error) {
    console.error('manageSchedule error:', error)
    return {
      error: 'INTERNAL_ERROR',
      message: error.message || 'Failed to manage schedule'
    }
  }
}
