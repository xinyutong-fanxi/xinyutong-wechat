<template>
  <view class="schedule-page">
    <view class="calendar-header">
      <text class="month">{{ currentMonth }}</text>
      <view class="nav-buttons">
        <text class="nav-btn" @click="previousMonth">‹</text>
        <text class="nav-btn" @click="nextMonth">›</text>
      </view>
    </view>
    
    <view class="weekdays">
      <text class="weekday" v-for="day in weekdays" :key="day">{{ day }}</text>
    </view>
    
    <view class="calendar-grid">
      <view 
        class="calendar-day" 
        v-for="day in calendarDays" 
        :key="day.date"
        :class="{ 
          today: day.isToday, 
          otherMonth: day.isOtherMonth,
          available: day.isAvailable,
          booked: day.hasBooking
        }"
        @click="selectDay(day)"
      >
        <text class="day-number">{{ day.day }}</text>
        <view class="time-slots" v-if="!day.isOtherMonth && selectedDay === day.date">
          <text class="slot-label">时间档位:</text>
          <view class="slots">
            <text 
              class="time-slot" 
              v-for="slot in timeSlots" 
              :key="slot"
              :class="{ 
                booked: isSlotBooked(day.date, slot),
                available: isSlotAvailable(day.date, slot) && !isSlotBooked(day.date, slot)
              }"
              @click.stop="toggleSlot(day.date, slot)"
            >
              {{ slot }}
            </text>
          </view>
        </view>
      </view>
    </view>
    
    <view class="legend">
      <view class="legend-item">
        <view class="legend-color available"></view>
        <text>可预约</text>
      </view>
      <view class="legend-item">
        <view class="legend-color booked"></view>
        <text>已预约</text>
      </view>
      <view class="legend-item">
        <view class="legend-color unavailable"></view>
        <text>不可用</text>
      </view>
    </view>
    
    <button class="save-button" @click="saveSchedule" :disabled="saving || loading">
      {{ saving ? '保存中...' : '保存时间设置' }}
    </button>
    <view class="loading-state" v-if="loading">
      <text>加载中...</text>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getTeacherSchedule, setTeacherSchedule } from '../../utils/cloud/teacherApi.js'

const currentDate = ref(new Date())
const selectedDay = ref(null)
const timeSlots = ref(['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00', '18:00'])
const bookedSlots = ref([]) // [{ date: '2024-01-15', time: '10:00' }, ...] - slots with existing bookings
const availableSlots = ref([]) // [{ date: '2024-01-15', time: '10:00', available: true/false }, ...] - teacher's availability settings

const currentMonth = computed(() => {
  return `${currentDate.value.getFullYear()}年${currentDate.value.getMonth() + 1}月`
})

const weekdays = ref(['日', '一', '二', '三', '四', '五', '六'])

const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()
  const startingDayOfWeek = firstDay.getDay()
  
  const days = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  // Previous month days
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    const date = new Date(year, month, -i)
    days.push({
      date: formatDate(date),
      day: date.getDate(),
      isOtherMonth: true,
      isToday: false,
      isAvailable: false,
      hasBooking: false
    })
  }
  
  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day)
    const dateStr = formatDate(date)
    days.push({
      date: dateStr,
      day: day,
      isOtherMonth: false,
      isToday: date.getTime() === today.getTime(),
      isAvailable: checkAvailability(dateStr),
      hasBooking: bookedSlots.value.some(bs => bs.date === dateStr)
    })
  }
  
  // Next month days to fill grid
  const remainingDays = 42 - days.length // 6 rows * 7 days
  for (let day = 1; day <= remainingDays; day++) {
    const date = new Date(year, month + 1, day)
    days.push({
      date: formatDate(date),
      day: day,
      isOtherMonth: true,
      isToday: false,
      isAvailable: false,
      hasBooking: false
    })
  }
  
  return days
})

function formatDate(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function previousMonth() {
  const newDate = new Date(currentDate.value)
  newDate.setMonth(newDate.getMonth() - 1)
  currentDate.value = newDate
}

function nextMonth() {
  const newDate = new Date(currentDate.value)
  newDate.setMonth(newDate.getMonth() + 1)
  currentDate.value = newDate
}

function selectDay(day) {
  if (day.isOtherMonth) return
  selectedDay.value = selectedDay.value === day.date ? null : day.date
}

function checkAvailability(date) {
  // Check if date has any available slots set
  return availableSlots.value.some(slot => slot.date === date && slot.available === true)
}

function isSlotBooked(date, time) {
  // Check if slot has an existing booking (cannot be toggled)
  return bookedSlots.value.some(bs => bs.date === date && bs.time === time)
}

function isSlotAvailable(date, time) {
  // Check if slot is marked as available in teacher's schedule
  const slot = availableSlots.value.find(s => s.date === date && s.time === time)
  return slot ? slot.available : false
}

function toggleSlot(date, time) {
  // Don't allow toggling booked slots
  if (isSlotBooked(date, time)) {
    uni.showToast({ title: '该时间段已有预约，无法修改', icon: 'none' })
    return
  }
  
  // Toggle slot availability
  const index = availableSlots.value.findIndex(s => s.date === date && s.time === time)
  if (index > -1) {
    // Toggle existing slot
    availableSlots.value[index].available = !availableSlots.value[index].available
  } else {
    // Add new available slot
    availableSlots.value.push({ date, time, available: true })
  }
}

async function saveSchedule() {
  saving.value = true
  
  try {
    // Convert available slots to format expected by API
    const timeSlots = []
    for (const slot of availableSlots.value) {
      timeSlots.push({
        date: slot.date,
        time: slot.time,
        available: slot.available !== false // Default to available if not set
      })
    }
    
    const result = await setTeacherSchedule(timeSlots)
    
    if (result.error) {
      if (result.error === 'BOOKING_CONFLICT') {
        uni.showModal({
          title: '保存失败',
          content: '部分时间段与现有预约冲突，请调整后重试。',
          showCancel: false
        })
      } else {
        throw new Error(result.message || '保存失败')
      }
      return
    }
    
    uni.showToast({ title: '保存成功', icon: 'success' })
  } catch (error) {
    console.error('Save schedule error:', error)
    uni.showToast({
      title: error.message || '保存失败',
      icon: 'none'
    })
  } finally {
    saving.value = false
  }
}

async function loadSchedule() {
  loading.value = true
  try {
    // Get schedule for next 30 days
    const today = new Date()
    const endDate = new Date(today)
    endDate.setDate(today.getDate() + 30)
    
    const schedule = await getTeacherSchedule(
      '', // teacherId - will be auto from context
      formatDate(today),
      formatDate(endDate)
    )
    
    // Convert schedule to availableSlots format: [{date: 'YYYY-MM-DD', time: 'HH:MM', available: boolean}, ...]
    availableSlots.value = schedule || []
    
    // TODO: Also load booked slots (existing bookings) separately
    // bookedSlots.value = await getTeacherBookedSlots(formatDate(today), formatDate(endDate))
  } catch (error) {
    console.error('Failed to load schedule:', error)
    uni.showToast({
      title: '加载失败',
      icon: 'none'
    })
  } finally {
    loading.value = false
  }
}

const saving = ref(false)
const loading = ref(false)

onMounted(() => {
  loadSchedule()
})
</script>

<style scoped>
.schedule-page {
  padding: 20rpx;
  min-height: 100vh;
  background-color: #F2F2F2;
}

.calendar-header {
  background: white;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.month {
  font-size: 36rpx;
  font-weight: bold;
}

.nav-buttons {
  display: flex;
  gap: 30rpx;
}

.nav-btn {
  font-size: 48rpx;
  color: #4A90E2;
  font-weight: bold;
}

.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background: white;
  border-radius: 16rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
}

.weekday {
  text-align: center;
  font-size: 26rpx;
  color: #666;
  font-weight: bold;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2rpx;
  background: white;
  border-radius: 16rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
}

.calendar-day {
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10rpx;
  background: #F2F2F2;
  border-radius: 8rpx;
  position: relative;
}

.calendar-day.otherMonth {
  opacity: 0.3;
}

.calendar-day.today {
  background: #e6f3ff;
  border: 2rpx solid #4A90E2;
}

.calendar-day.available {
  background: #d4edda;
}

.calendar-day.booked {
  background: #fff3cd;
}

.day-number {
  font-size: 28rpx;
  font-weight: bold;
}

.time-slots {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 2rpx solid #4A90E2;
  border-radius: 8rpx;
  padding: 20rpx;
  z-index: 10;
  margin-top: 10rpx;
}

.slot-label {
  font-size: 24rpx;
  color: #666;
  display: block;
  margin-bottom: 15rpx;
}

.slots {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10rpx;
}

.time-slot {
  padding: 10rpx;
  background: #F2F2F2;
  border-radius: 6rpx;
  text-align: center;
  font-size: 22rpx;
  color: #333;
  border: 2rpx solid transparent;
}

.time-slot.booked {
  background: #fff3cd;
  border-color: #ffc107;
}

.time-slot:active {
  background: #e6f3ff;
  border-color: #4A90E2;
}

.time-slot.available {
  background: #d4edda;
  color: #155724;
  border-color: #28a745;
}

.legend {
  background: white;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  display: flex;
  justify-content: space-around;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 10rpx;
  font-size: 24rpx;
  color: #666;
}

.legend-color {
  width: 30rpx;
  height: 30rpx;
  border-radius: 6rpx;
}

.legend-color.available {
  background: #d4edda;
}

.legend-color.booked {
  background: #fff3cd;
}

.legend-color.unavailable {
  background: #F2F2F2;
}

.save-button {
  width: 100%;
  background: #4A90E2;
  color: white;
  border-radius: 8rpx;
  padding: 30rpx;
  font-size: 32rpx;
}

.save-button[disabled] {
  background: #ccc;
}

.loading-state {
  text-align: center;
  padding: 60rpx 0;
  color: #999;
  font-size: 28rpx;
}
</style>
