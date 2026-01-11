<template>
  <view class="teacher-bookings">
    <view class="tabs">
      <text 
        class="tab" 
        :class="{ active: activeTab === 'pending' }"
        @click="handleTabChange('pending')"
      >
        待确认
      </text>
      <text 
        class="tab" 
        :class="{ active: activeTab === 'confirmed' }"
        @click="handleTabChange('confirmed')"
      >
        已确认
      </text>
      <text 
        class="tab" 
        :class="{ active: activeTab === 'completed' }"
        @click="handleTabChange('completed')"
      >
        已完成
      </text>
    </view>
    
    <view class="bookings-list">
      <view 
        class="booking-card" 
        v-for="booking in filteredBookings" 
        :key="booking._id"
        @click="navigateTo(`/pages/teacher/bookings/detail?id=${booking._id}`)"
      >
        <view class="booking-header">
          <text class="student-name">{{ booking.studentName }}</text>
          <text class="status-badge" :class="booking.status">{{ getStatusText(booking.status) }}</text>
        </view>
        <view class="booking-info">
          <text class="info-item">时间: {{ formatDateTime(booking.scheduledAt) }}</text>
          <text class="info-item">时长: {{ booking.duration }}分钟</text>
          <text class="info-item">服务类型: {{ booking.serviceType }}</text>
        </view>
        <view class="booking-actions" v-if="booking.status === 'pending'">
          <button class="action-btn confirm" @click.stop="confirmBooking(booking._id)">
            确认预约
          </button>
          <button class="action-btn cancel" @click.stop="rejectBooking(booking._id)">
            拒绝
          </button>
        </view>
      </view>
      
      <view class="empty-state" v-if="filteredBookings.length === 0 && !loading">
        <text>暂无预约</text>
      </view>
      <view class="loading-state" v-if="loading">
        <text>加载中...</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getTeacherBookings } from '../../utils/cloud/teacherBookingsApi.js'

const activeTab = ref('pending')
const bookings = ref([])
const loading = ref(false)

const filteredBookings = computed(() => {
  return bookings.value.filter(b => {
    if (activeTab.value === 'pending') return b.status === 'pending'
    if (activeTab.value === 'confirmed') return b.status === 'confirmed'
    if (activeTab.value === 'completed') return b.status === 'completed'
    return false
  })
})

function navigateTo(url) {
  uni.navigateTo({ url })
}

function getStatusText(status) {
  const statusMap = {
    pending: '待确认',
    confirmed: '已确认',
    completed: '已完成',
    cancelled: '已取消'
  }
  return statusMap[status] || status
}

function formatDateTime(timestamp) {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  return `${date.getMonth() + 1}月${date.getDate()}日 ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

async function confirmBooking(bookingId) {
  uni.showModal({
    title: '确认预约',
    content: '确定要确认这个预约吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          const { confirmAppointment } = await import('../../utils/cloud/bookingApi.js')
          const result = await confirmAppointment({
            bookingId,
            action: 'confirm'
          })
          
          if (result.error) {
            throw new Error(result.message || '确认失败')
          }
          
          uni.showToast({ title: '已确认', icon: 'success' })
          // Reload bookings
          setTimeout(() => {
            loadBookings()
          }, 1500)
        } catch (error) {
          console.error('Confirm booking error:', error)
          uni.showToast({
            title: error.message || '确认失败',
            icon: 'none'
          })
        }
      }
    }
  })
}

async function rejectBooking(bookingId) {
  uni.showModal({
    title: '拒绝预约',
    content: '确定要拒绝这个预约吗？拒绝后订单将被取消并退款。',
    success: async (res) => {
      if (res.confirm) {
        try {
          const { confirmAppointment } = await import('../../utils/cloud/bookingApi.js')
          const rejectResult = await confirmAppointment({
            bookingId,
            action: 'reject',
            rejectionReason: '教师拒绝'
          })
          
          if (rejectResult.error) {
            throw new Error(rejectResult.message || '拒绝失败')
          }
          
          uni.showToast({ title: '已拒绝', icon: 'success' })
          // Reload bookings
          setTimeout(() => {
            loadBookings()
          }, 1500)
        } catch (error) {
          console.error('Reject booking error:', error)
          uni.showToast({
            title: error.message || '拒绝失败',
            icon: 'none'
          })
        }
      }
    }
  })
}

async function loadBookings() {
  loading.value = true
  try {
    const result = await getTeacherBookings({
      status: activeTab.value === 'all' ? 'all' : activeTab.value,
      page: 1,
      pageSize: 50
    })
    bookings.value = result.bookings || []
  } catch (error) {
    console.error('Failed to load bookings:', error)
    uni.showToast({
      title: '加载失败',
      icon: 'none'
    })
  } finally {
    loading.value = false
  }
}

function handleTabChange(tab) {
  activeTab.value = tab
  loadBookings()
}

onMounted(() => {
  loadBookings()
})
</script>

<style scoped>
.teacher-bookings {
  padding: 20rpx;
  min-height: 100vh;
  background-color: transparent; /* Inherit paper texture */
}

.tabs {
  display: flex;
  gap: 0;
  background: white;
  border-radius: 16rpx;
  padding: 10rpx;
  margin-bottom: 20rpx;
}

.tab {
  flex: 1;
  text-align: center;
  padding: 20rpx;
  font-size: 28rpx;
  color: #666;
  border-radius: 8rpx;
}

.tab.active {
  background: #4A90E2;
  color: white;
}

.bookings-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.booking-card {
  background: white;
  border-radius: 16rpx;
  padding: 30rpx;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05);
}

.booking-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.student-name {
  font-size: 32rpx;
  font-weight: bold;
}

.status-badge {
  font-size: 24rpx;
  padding: 6rpx 16rpx;
  border-radius: 12rpx;
}

.status-badge.pending {
  background: #fff3cd;
  color: #856404;
}

.status-badge.confirmed {
  background: #d1ecf1;
  color: #0c5460;
}

.status-badge.completed {
  background: #d4edda;
  color: #155724;
}

.booking-info {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
  margin-bottom: 20rpx;
}

.info-item {
  font-size: 26rpx;
  color: #666;
}

.booking-actions {
  display: flex;
  gap: 20rpx;
  padding-top: 20rpx;
  border-top: 1rpx solid #f0f0f0;
}

.action-btn {
  flex: 1;
  padding: 20rpx;
  border-radius: 8rpx;
  font-size: 28rpx;
}

.action-btn.confirm {
  background: #4A90E2;
  color: white;
}

.action-btn.cancel {
  background: white;
  color: #666;
  border: 2rpx solid #ddd;
}

.empty-state, .loading-state {
  text-align: center;
  padding: 100rpx 0;
  color: #999;
  font-size: 28rpx;
}
</style>
