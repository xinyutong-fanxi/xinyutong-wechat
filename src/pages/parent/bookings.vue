<template>
  <view class="bookings-page">
    <view class="tabs">
      <text 
        class="tab" 
        :class="{ active: activeTab === 'upcoming' }"
        @click="handleTabChange('upcoming')"
      >
        即将到来
      </text>
      <text 
        class="tab" 
        :class="{ active: activeTab === 'past' }"
        @click="handleTabChange('past')"
      >
        历史记录
      </text>
    </view>
    
    <view class="bookings-list">
      <view 
        class="booking-card" 
        v-for="booking in filteredBookings" 
        :key="booking._id"
        @click="navigateTo(`/pages/parent/bookings/detail?id=${booking._id}`)"
      >
        <view class="booking-header">
          <text class="teacher-name">{{ booking.teacherName }}</text>
          <text class="booking-status" :class="booking.status">{{ getStatusText(booking.status) }}</text>
        </view>
        <view class="booking-info">
          <text class="info-item">学生: {{ booking.studentName }}</text>
          <text class="info-item">时间: {{ formatDate(booking.scheduledAt) }}</text>
          <text class="info-item">服务: {{ booking.serviceType }}</text>
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
import { getBookings } from '../../utils/cloud/bookingsApi.js'

const activeTab = ref('upcoming')
const bookings = ref([])
const loading = ref(false)

const filteredBookings = computed(() => {
  return bookings.value.filter(b => {
    if (activeTab.value === 'upcoming') {
      return b.status === 'pending' || b.status === 'confirmed'
    } else {
      return b.status === 'completed' || b.status === 'cancelled'
    }
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

function formatDate(timestamp) {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  return `${date.getMonth() + 1}月${date.getDate()}日 ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

async function loadBookings() {
  loading.value = true
  try {
    const result = await getBookings({
      status: activeTab.value === 'upcoming' ? 'upcoming' : 'past'
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
.bookings-page {
  padding: 20rpx;
  min-height: 100vh;
  background-color: #F2F2F2;
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

.teacher-name {
  font-size: 32rpx;
  font-weight: bold;
}

.booking-status {
  font-size: 24rpx;
  padding: 6rpx 16rpx;
  border-radius: 12rpx;
}

.booking-status.pending {
  background: #fff3cd;
  color: #856404;
}

.booking-status.confirmed {
  background: #d1ecf1;
  color: #0c5460;
}

.booking-status.completed {
  background: #d4edda;
  color: #155724;
}

.booking-status.cancelled {
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
