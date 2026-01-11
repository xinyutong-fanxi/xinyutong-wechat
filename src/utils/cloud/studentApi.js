/**
 * Client wrapper for student-related cloud function calls.
 */

/**
 * Get students list for current parent
 * @returns {Promise<Array>} Students list
 */
export async function getStudents() {
  // TODO: Create student.list cloud function or use direct DB query
  // For now, return stub data
  
  // #ifdef MP-WEIXIN
  if (typeof wx !== 'undefined' && wx.cloud && wx.cloud.callFunction) {
    // const { result } = await wx.cloud.callFunction({
    //   name: 'student.list',
    //   data: {}
    // })
    // return result
    
    // Stub response
    return []
  }
  // #endif
  
  // Dev fallback
  console.warn('[studentApi] no cloud call method; returning stub response')
  return []
}

/**
 * Create a new student profile
 * @param {Object} studentData - Student data
 * @returns {Promise<Object>} Created student
 */
export async function createStudent(studentData) {
  const { name, age, grade, authorizationLevel = 'summary' } = studentData
  
  if (!name || !age || !grade) {
    throw new Error('Missing required fields: name, age, grade')
  }
  
  const data = {
    name,
    age,
    grade,
    authorizationLevel
  }
  
  // TODO: Create student.create cloud function
  // #ifdef MP-WEIXIN
  if (typeof wx !== 'undefined' && wx.cloud && wx.cloud.callFunction) {
    // const { result } = await wx.cloud.callFunction({
    //   name: 'student.create',
    //   data
    // })
    // return result
    
    // Stub response
    return {
      _id: `student_${Date.now()}`,
      ...data,
      createdAt: Date.now()
    }
  }
  // #endif
  
  // Dev fallback
  console.warn('[studentApi] no cloud call method; returning stub response')
  return {
    _id: `student_${Date.now()}`,
    ...data,
    createdAt: Date.now()
  }
}

/**
 * Update student profile
 * @param {string} studentId - Student ID
 * @param {Object} studentData - Updated student data
 * @returns {Promise<Object>} Updated student
 */
export async function updateStudent(studentId, studentData) {
  if (!studentId) {
    throw new Error('Missing required field: studentId')
  }
  
  const data = {
    studentId,
    ...studentData
  }
  
  // TODO: Create student.update cloud function
  // #ifdef MP-WEIXIN
  if (typeof wx !== 'undefined' && wx.cloud && wx.cloud.callFunction) {
    // const { result } = await wx.cloud.callFunction({
    //   name: 'student.update',
    //   data
    // })
    // return result
    
    // Stub response
    return {
      _id: studentId,
      ...studentData,
      updatedAt: Date.now()
    }
  }
  // #endif
  
  // Dev fallback
  console.warn('[studentApi] no cloud call method; returning stub response')
  return {
    _id: studentId,
    ...studentData,
    updatedAt: Date.now()
  }
}

/**
 * Get student details by ID
 * @param {string} studentId - Student ID
 * @returns {Promise<Object>} Student details
 */
export async function getStudentDetails(studentId) {
  if (!studentId) {
    throw new Error('Missing required field: studentId')
  }
  
  // TODO: Create student.getDetails cloud function or use direct DB query
  // #ifdef MP-WEIXIN
  if (typeof wx !== 'undefined' && wx.cloud && wx.cloud.callFunction) {
    // const { result } = await wx.cloud.callFunction({
    //   name: 'student.getDetails',
    //   data: { studentId }
    // })
    // return result
    
    // Stub response
    return {
      _id: studentId,
      name: '示例学生',
      age: 10,
      grade: '四年级',
      authorizationLevel: 'summary',
      createdAt: Date.now()
    }
  }
  // #endif
  
  // #ifndef MP-WEIXIN
  if (typeof uniCloud !== 'undefined' && uniCloud.callFunction) {
    // const { result } = await uniCloud.callFunction({
    //   name: 'student.getDetails',
    //   data: { studentId }
    // })
    // return result
    
    // Stub response
    return {
      _id: studentId,
      name: '示例学生',
      age: 10,
      grade: '四年级',
      authorizationLevel: 'summary',
      createdAt: Date.now()
    }
  }
  // #endif
  
  // Dev fallback
  console.warn('[studentApi] no cloud call method; returning stub response')
  return {
    _id: studentId,
    name: '示例学生',
    age: 10,
    grade: '四年级',
    authorizationLevel: 'summary',
    createdAt: Date.now()
  }
}
