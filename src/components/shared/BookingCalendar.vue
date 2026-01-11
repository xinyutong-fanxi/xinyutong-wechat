<template>
  <view class="booking-calendar">
    <view class="calendar-header">
      <text class="month">{{ currentMonthText }}</text>
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
          selected: selectedDate === day.date,
          unavailable: !day.isAvailable && !day.isOtherMonth
        }"
        @click="selectDate(day)"
      >
        <text class="day-number">{{ day.day }}</text>
        <view class="time-slots" v-if="selectedDate === day.date && !day.isOtherMonth">
          <text class="slots-title">可选时间:</text>
          <view class="slots-grid">
            <text 
              class="time-slot" 
              v-for="slot in availableTimeSlots" 
              :key="slot"
              :class="{ selected: selectedTimeSlot === slot, booked: isSlotBooked(day.date, slot) }"
              @click.stop="selectTimeSlot(slot)"
            >
              {{ slot }}
            </text>
          </view>
          <text class="no-slots" v-if="availableTimeSlots.length === 0">该日期暂无可用时间</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'

const props = defineProps({
  availableSlots: {
    type: Array,
    default: () => [] // [{ date: '2024-01-15', time: '10:00' }, ...]
  },
  bookedSlots: {
    type: Array,
    default: () => [] // [{ date: '2024-01-15', time: '10:00' }, ...]
  },
  timeSlots: {
    type: Array,
    default: () => ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00', '18:00']
  },
  minDate: {
    type: Date,
    default: () => new Date()
  }
})

const emit = defineEmits(['select-date', 'select-time'])

const currentDate = ref(new Date())
const selectedDate = ref(null)
const selectedTimeSlot = ref(null)

const weekdays = ['日', '一', '二', '三', '四', '五', '六']

const currentMonthText = computed(() => {
  return `${currentDate.value.getFullYear()}年${currentDate.value.getMonth() + 1}月`
})

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
  const minDateOnly = new Date(props.minDate)
  minDateOnly.setHours(0, 0, 0, 0)
  
  // Previous month days
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    const date = new Date(year, month, -i)
    days.push(createDayObject(date, true, false))
  }
  
  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day)
    const dateOnly = new Date(date)
    dateOnly.setHours(0, 0, 0, 0)
    const isToday = dateOnly.getTime() === today.getTime()
    const isPast = dateOnly < minDateOnly
    const isAvailable = !isPast && checkDateAvailability(formatDate(date))
    
    days.push(createDayObject(date, false, isAvailable, isToday))
  }
  
  // Next month days to fill grid (42 = 6 rows * 7 days)
  const remainingDays = 42 - days.length
  for (let day = 1; day <= remainingDays; day++) {
    const date = new Date(year, month + 1, day)
    days.push(createDayObject(date, true, false))
  }
  
  return days
})

const availableTimeSlots = computed(() => {
  if (!selectedDate.value) return []
  
  // Filter time slots based on available slots for selected date
  const dateSlots = props.availableSlots.filter(s => s.date === selectedDate.value)
  const bookedDateSlots = props.bookedSlots.filter(s => s.date === selectedDate.value)
  
  return props.timeSlots.filter(time => {
    const isAvailable = dateSlots.some(s => s.time === time)
    const isBooked = bookedDateSlots.some(s => s.time === time)
    return isAvailable && !isBooked
  })
})

function createDayObject(date, isOtherMonth, isAvailable = false, isToday = false) {
  return {
    date: formatDate(date),
    day: date.getDate(),
    isOtherMonth,
    isAvailable,
    isToday
  }
}

function formatDate(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function checkDateAvailability(date) {
  // Check if date has any available slots
  return props.availableSlots.some(s => s.date === date)
}

function isSlotBooked(date, time) {
  return props.bookedSlots.some(s => s.date === date && s.time === time)
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

function selectDate(day) {
  if (day.isOtherMonth || !day.isAvailable) return
  
  selectedDate.value = selectedDate.value === day.date ? null : day.date
  selectedTimeSlot.value = null
  
  if (selectedDate.value) {
    emit('select-date', {
      date: selectedDate.value,
      timestamp: new Date(selectedDate.value).getTime()
    })
  }
}

function selectTimeSlot(time) {
  if (isSlotBooked(selectedDate.value, time)) return
  
  selectedTimeSlot.value = selectedTimeSlot.value === time ? null : time
  
  if (selectedTimeSlot.value && selectedDate.value) {
    emit('select-time', {
      date: selectedDate.value,
      time: selectedTimeSlot.value,
      timestamp: new Date(`${selectedDate.value} ${selectedTimeSlot.value}`).getTime()
    })
  }
}

watch(() => props.availableSlots, () => {
  // Reset selection when available slots change
  if (selectedDate.value && !checkDateAvailability(selectedDate.value)) {
    selectedDate.value = null
    selectedTimeSlot.value = null
  }
}, { deep: true })
</script>

<style scoped>
.booking-calendar {
  background: white;
  border-radius: 16rpx;
  padding: 30rpx;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
}

.month {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}

.nav-buttons {
  display: flex;
  gap: 20rpx;
}

.nav-btn {
  font-size: 40rpx;
  color: #4A90E2;
  font-weight: bold;
  width: 50rpx;
  height: 50rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: 20rpx;
}

.weekday {
  text-align: center;
  font-size: 26rpx;
  color: #666;
  font-weight: bold;
  padding: 10rpx;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2rpx;
  background: #f0f0f0;
}

.calendar-day {
  aspect-ratio: 1;
  background: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10rpx;
  position: relative;
  min-height: 80rpx;
}

.calendar-day.otherMonth {
  opacity: 0.3;
  background: #fafafa;
}

.calendar-day.today {
  background: #e6f3ff;
  border: 2rpx solid #4A90E2;
}

.calendar-day.available {
  cursor: pointer;
}

.calendar-day.selected {
  background: #4A90E2;
  color: white;
}

.calendar-day.selected .day-number {
  color: white;
  font-weight: bold;
}

.calendar-day.unavailable {
  background: #f5f5f5;
  opacity: 0.5;
}

.day-number {
  font-size: 28rpx;
  color: #333;
}

.time-slots {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 2rpx solid #4A90E2;
  border-radius: 12rpx;
  padding: 20rpx;
  z-index: 10;
  margin-top: 10rpx;
  box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.1);
}

.slots-title {
  font-size: 24rpx;
  color: #666;
  display: block;
  margin-bottom: 15rpx;
}

.slots-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10rpx;
}

.time-slot {
  padding: 12rpx 8rpx;
  background: #F2F2F2;
  border-radius: 8rpx;
  text-align: center;
  font-size: 22rpx;
  color: #333;
  border: 2rpx solid transparent;
}

.time-slot.selected {
  background: #4A90E2;
  color: white;
  border-color: #0051d5;
}

.time-slot.booked {
  background: #fff3cd;
  color: #856404;
  opacity: 0.6;
}

.no-slots {
  font-size: 24rpx;
  color: #999;
  text-align: center;
  padding: 20rpx;
  display: block;
}
</style>
