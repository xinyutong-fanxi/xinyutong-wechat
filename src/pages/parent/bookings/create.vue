<template>
  <view class="create-booking">
    <view class="step-indicator">
      <view class="step" :class="{ active: currentStep >= 1, completed: currentStep > 1 }">
        <text class="step-number">1</text>
        <text class="step-label">选择学生</text>
      </view>
      <view class="step-line" :class="{ active: currentStep > 1 }"></view>
      <view class="step" :class="{ active: currentStep >= 2, completed: currentStep > 2 }">
        <text class="step-number">2</text>
        <text class="step-label">选择时间</text>
      </view>
      <view class="step-line" :class="{ active: currentStep > 2 }"></view>
      <view class="step" :class="{ active: currentStep >= 3 }">
        <text class="step-number">3</text>
        <text class="step-label">确认信息</text>
      </view>
    </view>
    
    <!-- Step 1: Select Student -->
    <view class="step-content" v-if="currentStep === 1">
      <text class="step-title">选择学生</text>
      <StudentSelector
        :students="students"
        :selectedStudentId="selectedStudent"
        :showAddNew="true"
        @select="handleStudentSelect"
        @add-new="handleAddNewStudent"
      />
      <button class="next-button" @click="nextStep" :disabled="!selectedStudent">
        下一步
      </button>
    </view>
    
    <!-- Step 2: Select Time -->
    <view class="step-content" v-if="currentStep === 2">
      <text class="step-title">选择时间</text>
      <BookingCalendar
        :availableSlots="availableSlots"
        :bookedSlots="bookedSlots"
        :timeSlots="timeSlots"
        @select-date="handleDateSelect"
        @select-time="handleTimeSelect"
      />
      <button class="next-button" @click="nextStep" :disabled="!selectedTime">
        下一步
      </button>
    </view>
    
    <!-- Step 3: Confirm -->
    <view class="step-content" v-if="currentStep === 3">
      <text class="step-title">确认信息</text>
      <view class="confirm-section">
        <view class="confirm-row">
          <text class="label">老师</text>
          <text class="value">{{ teacherName }}</text>
        </view>
        <view class="confirm-row">
          <text class="label">学生</text>
          <text class="value">{{ getStudentName(selectedStudent) }}</text>
        </view>
        <view class="confirm-row">
          <text class="label">时间</text>
          <text class="value">{{ formatDateTime(selectedTime) || '未选择' }}</text>
        </view>
        <view class="confirm-row">
          <text class="label">时长</text>
          <text class="value">{{ bookingDuration }}分钟</text>
        </view>
        <view class="confirm-row total">
          <text class="label">费用</text>
          <MoneyDisplay :amount="totalPriceAmount" :size="'large'" />
        </view>
      </view>
      <button class="submit-button" @click="handleSubmit" :disabled="loading || !selectedStudent || !selectedTime">
        {{ loading ? '创建中...' : '确认预约并支付' }}
      </button>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import StudentSelector from '../../../components/shared/StudentSelector.vue'
import BookingCalendar from '../../../components/shared/BookingCalendar.vue'
import MoneyDisplay from '../../../components/shared/MoneyDisplay.vue'
import { getTeacherDetails, getTeacherSchedule } from '../../../utils/cloud/teacherApi.js'
import { getStudents } from '../../../utils/cloud/studentApi.js'
import { createBookingOrder } from '../../../utils/cloud/bookingApi.js'

// getApp is available globally in WeChat Mini Program runtime (no import needed)
// eslint-disable-next-line no-undef
const getAppInstance = () => (typeof getApp !== 'undefined' ? getApp() : { globalData: {} })

const currentStep = ref(1)
const teacherId = ref('')
const teacherName = ref('')
const teacherPricePerHour = ref(20000) // 200 yuan in cents
const students = ref([])
const selectedStudent = ref(null)
const selectedDate = ref(null)
const selectedTimeSlot = ref(null)
const bookingDuration = ref(60)
const loading = ref(false)

const timeSlots = ref(['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00', '18:00'])
const availableSlots = ref([])
const bookedSlots = ref([])

const user = computed(() => getAppInstance().globalData.user || {})
const parentOpenId = computed(() => user.value.openid || '')
const referralCode = ref(null) // Store referral code from URL or storage

const selectedTime = computed(() => {
  if (!selectedDate.value || !selectedTimeSlot.value) return null
  // Combine date and time to create timestamp
  const [year, month, day] = selectedDate.value.split('-').map(Number)
  const [hour, minute] = selectedTimeSlot.value.split(':').map(Number)
  return new Date(year, month - 1, day, hour, minute).getTime()
})

const totalPriceAmount = computed(() => {
  // Calculate based on teacher price and duration (in cents)
  return Math.round((teacherPricePerHour.value * bookingDuration.value) / 60)
})

onLoad(async (options) => {
  if (options.teacherId) {
    teacherId.value = options.teacherId
    await loadTeacherDetails()
    await loadStudents()
    await loadTeacherSchedule()
    
    // Check for referral code in URL params
    if (options.referralCode) {
      referralCode.value = options.referralCode
      // Track referral on register (if parent just registered)
      try {
        const { trackReferralOnRegister } = await import('../../../utils/cloud/distributionApi.js')
        await trackReferralOnRegister(options.referralCode)
      } catch (error) {
        // If referral already exists or error, continue with booking
        console.warn('Referral tracking warning:', error.message)
      }
    } else {
      // Check if referral code stored in app data
      const app = getAppInstance()
      if (app.globalData.referralCode) {
        referralCode.value = app.globalData.referralCode
      }
    }
  }
})

async function loadTeacherDetails() {
  try {
    const teacher = await getTeacherDetails(teacherId.value)
    teacherName.value = teacher.name || ''
    teacherPricePerHour.value = teacher.pricePerHour || 20000
  } catch (error) {
    console.error('Failed to load teacher details:', error)
    uni.showToast({ title: '加载老师信息失败', icon: 'none' })
  }
}

async function loadStudents() {
  try {
    students.value = await getStudents()
  } catch (error) {
    console.error('Failed to load students:', error)
    uni.showToast({ title: '加载学生列表失败', icon: 'none' })
  }
}

async function loadTeacherSchedule() {
  try {
    const today = new Date()
    const endDate = new Date(today)
    endDate.setDate(today.getDate() + 30) // Next 30 days
    
    const schedule = await getTeacherSchedule(
      teacherId.value,
      formatDate(today),
      formatDate(endDate)
    )
    
    // Convert schedule to availableSlots format: [{ date: 'YYYY-MM-DD', time: 'HH:MM' }, ...]
    availableSlots.value = schedule || []
  } catch (error) {
    console.error('Failed to load teacher schedule:', error)
    // Don't show error toast, just use empty array
    availableSlots.value = []
  }
}

function formatDate(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function handleStudentSelect(student) {
  selectedStudent.value = student._id
}

function handleAddNewStudent() {
  uni.navigateTo({ url: '/pages/parent/students/create?returnTo=booking' })
}

function handleDateSelect(data) {
  selectedDate.value = data.date
}

function handleTimeSelect(data) {
  selectedTimeSlot.value = data.time
}

function getStudentName(studentId) {
  const student = students.value.find(s => s._id === studentId)
  return student ? student.name : ''
}

function formatDateTime(timestamp) {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

function nextStep() {
  if (currentStep.value === 1 && !selectedStudent.value) {
    uni.showToast({ title: '请选择学生', icon: 'none' })
    return
  }
  if (currentStep.value === 2 && !selectedTime.value) {
    uni.showToast({ title: '请选择时间', icon: 'none' })
    return
  }
  if (currentStep.value < 3) {
    currentStep.value++
  }
}

async function handleSubmit() {
  if (!selectedStudent.value || !selectedTime.value || !teacherId.value) {
    uni.showToast({ title: '请完善预约信息', icon: 'none' })
    return
  }
  
  loading.value = true
  
  try {
    // Create booking order
    const result = await createBookingOrder({
      teacherId: teacherId.value,
      studentId: selectedStudent.value,
      parentOpenId: parentOpenId.value,
      scheduledAt: selectedTime.value,
      duration: bookingDuration.value,
      serviceType: 'counseling',
      referralCode: referralCode.value
    })
    
    if (result.error) {
      throw new Error(result.message || '创建预约失败')
    }
    
    // Navigate to payment page
    uni.navigateTo({
      url: `/pages/parent/bookings/payment?orderId=${result.orderId}&amount=${result.amount}&orderNo=${result.orderNo}`
    })
  } catch (error) {
    console.error('Create booking error:', error)
    uni.showToast({
      title: error.message || '创建预约失败',
      icon: 'none'
    })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.create-booking {
  padding: 20rpx;
  min-height: 100vh;
  background-color: #F2F2F2;
}

.step-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 40rpx;
  background: white;
  padding: 30rpx;
  border-radius: 16rpx;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10rpx;
}

.step-number {
  width: 50rpx;
  height: 50rpx;
  border-radius: 25rpx;
  background: #ddd;
  color: #999;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
}

.step.active .step-number {
  background: #4A90E2;
  color: white;
}

.step.completed .step-number {
  background: #28a745;
  color: white;
}

.step-label {
  font-size: 22rpx;
  color: #666;
}

.step.active .step-label {
  color: #4A90E2;
  font-weight: bold;
}

.step-line {
  width: 60rpx;
  height: 2rpx;
  background: #ddd;
  margin: 0 10rpx;
}

.step-line.active {
  background: #4A90E2;
}

.step-content {
  background: white;
  border-radius: 16rpx;
  padding: 30rpx;
}

.step-title {
  font-size: 32rpx;
  font-weight: bold;
  display: block;
  margin-bottom: 30rpx;
}

.students-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  margin-bottom: 40rpx;
}

.student-option {
  padding: 30rpx;
  border: 2rpx solid #ddd;
  border-radius: 16rpx;
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

.student-option.selected {
  border-color: #4A90E2;
  background: #e6f3ff;
}

.student-name {
  font-size: 32rpx;
  font-weight: bold;
}

.student-info {
  font-size: 26rpx;
  color: #666;
}

.next-button, .submit-button {
  width: 100%;
  background: #4A90E2;
  color: white;
  border-radius: 8rpx;
  padding: 25rpx;
  font-size: 32rpx;
  margin-top: 40rpx;
}

.next-button[disabled], .submit-button[disabled] {
  background: #ccc;
}

.confirm-section {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  margin-bottom: 40rpx;
}

.confirm-row {
  display: flex;
  justify-content: space-between;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.confirm-row.total {
  border-top: 2rpx solid #333;
  border-bottom: none;
  margin-top: 20rpx;
  padding-top: 30rpx;
  font-weight: bold;
}

.confirm-row .label {
  font-size: 28rpx;
  color: #666;
}

.confirm-row.total .label {
  font-size: 32rpx;
  color: #333;
}

.confirm-row .value {
  font-size: 28rpx;
  color: #333;
}

.confirm-row .value.price {
  font-size: 36rpx;
  color: #ff6600;
  font-weight: bold;
}
</style>
