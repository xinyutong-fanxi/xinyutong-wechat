/**
 * Booking store for managing booking flow state
 * Uses Vue 3 Composition API reactive utilities
 */

import { ref, computed } from 'vue'

// Booking flow state
const currentBooking = ref(null)
const selectedTeacher = ref(null)
const selectedStudent = ref(null)
const selectedTimeSlot = ref(null)
const selectedDate = ref(null)
const bookingDuration = ref(60) // minutes, default 60
const serviceType = ref('counseling') // 'counseling' | 'guidance' | 'ai_chat'

/**
 * Reset booking flow state
 */
function resetBooking() {
  currentBooking.value = null
  selectedTeacher.value = null
  selectedStudent.value = null
  selectedTimeSlot.value = null
  selectedDate.value = null
  bookingDuration.value = 60
  serviceType.value = 'counseling'
}

/**
 * Set current booking data
 * @param {Object} bookingData - Booking data
 */
function setCurrentBooking(bookingData) {
  currentBooking.value = bookingData
}

/**
 * Set selected teacher
 * @param {Object} teacher - Teacher object
 */
function setSelectedTeacher(teacher) {
  selectedTeacher.value = teacher
}

/**
 * Set selected student
 * @param {Object} student - Student object
 */
function setSelectedStudent(student) {
  selectedStudent.value = student
}

/**
 * Set selected time slot
 * @param {string} timeSlot - Time slot (e.g., "09:00")
 * @param {number|Date} date - Selected date (timestamp or Date object)
 */
function setSelectedTimeSlot(timeSlot, date = null) {
  selectedTimeSlot.value = timeSlot
  if (date) {
    selectedDate.value = date instanceof Date ? date.getTime() : date
  }
}

/**
 * Set booking duration
 * @param {number} duration - Duration in minutes
 */
function setBookingDuration(duration) {
  bookingDuration.value = duration
}

/**
 * Set service type
 * @param {string} type - Service type
 */
function setServiceType(type) {
  serviceType.value = type
}

// Computed properties
const isBookingReady = computed(() => {
  return !!selectedTeacher.value && 
         !!selectedStudent.value && 
         !!selectedTimeSlot.value && 
         !!selectedDate.value
})

const bookingSummary = computed(() => {
  return {
    teacher: selectedTeacher.value,
    student: selectedStudent.value,
    timeSlot: selectedTimeSlot.value,
    date: selectedDate.value,
    duration: bookingDuration.value,
    serviceType: serviceType.value
  }
})

export function useBookingStore() {
  return {
    // State
    currentBooking: computed(() => currentBooking.value),
    selectedTeacher: computed(() => selectedTeacher.value),
    selectedStudent: computed(() => selectedStudent.value),
    selectedTimeSlot: computed(() => selectedTimeSlot.value),
    selectedDate: computed(() => selectedDate.value),
    bookingDuration: computed(() => bookingDuration.value),
    serviceType: computed(() => serviceType.value),
    
    // Computed
    isBookingReady,
    bookingSummary,
    
    // Methods
    resetBooking,
    setCurrentBooking,
    setSelectedTeacher,
    setSelectedStudent,
    setSelectedTimeSlot,
    setBookingDuration,
    setServiceType
  }
}
