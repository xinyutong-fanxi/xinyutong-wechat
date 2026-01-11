<template>
  <view class="student-bookings">
    <view class="bookings-list">
      <view 
        class="booking-card" 
        v-for="booking in bookings" 
        :key="booking._id"
      >
        <view class="booking-header">
          <text class="teacher-name">{{ booking.teacherName }}</text>
          <text class="status-badge" :class="booking.status">{{ getStatusText(booking.status) }}</text>
        </view>
        <view class="booking-info">
          <text class="info-item">时间: {{ formatDateTime(booking.scheduledAt) }}</text>
          <text class="info-item">时长: {{ booking.duration }}分钟</text>
          <text class="info-item">服务类型: {{ booking.serviceType }}</text>
        </view>
      </view>
      
      <view class="empty-state" v-if="bookings.length === 0 && !loading">
        <text>暂无预约记录</text>
      </view>
      <view class="loading-state" v-if="loading">
        <text>加载中...</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getStudentBookings } from '../../utils/cloud/studentBookingsApi.js'

const bookings = ref([])
const loading = ref(false)

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
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

async function loadBookings() {
  loading.value = true
  try {
    const result = await getStudentBookings({ status: 'all' })
    bookings.value = result.bookings || []
  } catch (error) {
    console.error('Failed to load student bookings:', error)
    uni.showToast({
      title: '加载失败',
      icon: 'none'
    })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadBookings()
})
</script>

<style scoped>
.student-bookings {
  padding: 20rpx;
  min-height: 100vh;
  background-color: transparent; /* Inherit paper texture */
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

.teacher-name {
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

.status-badge.cancelled {
  background: #f8d7da;
  color: #721c24;
}

.booking-info {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

.info-item {
  font-size: 26rpx;
  color: #666;
}

.empty-state, .loading-state {
  text-align: center;
  padding: 100rpx 0;
  color: #999;
  font-size: 28rpx;
}
</style>
