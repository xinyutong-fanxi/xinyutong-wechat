<template>
  <view class="teacher-home">
    <view class="stats-cards">
      <view class="stat-card">
        <text class="stat-value">{{ todayBookings }}</text>
        <text class="stat-label">今日预约</text>
      </view>
        <view class="stat-card">
          <MoneyDisplay :amount="todayEarnings" :size="'normal'" />
          <text class="stat-label">今日收益</text>
        </view>
        <view class="stat-card">
          <MoneyDisplay :amount="totalEarnings" :size="'normal'" />
          <text class="stat-label">累计收益</text>
        </view>
    </view>
    
    <view class="upcoming-section">
      <view class="section-header">
        <text class="section-title">即将到来的预约</text>
        <text class="view-all" @click="navigateTo('/pages/teacher/bookings')">查看全部 ></text>
      </view>
      <view class="bookings-list">
        <view 
          class="booking-card" 
          v-for="booking in upcomingBookings" 
          :key="booking._id"
          @click="navigateTo(`/pages/teacher/bookings/detail?id=${booking._id}`)"
        >
          <view class="booking-info">
            <text class="student-name">{{ booking.studentName }}</text>
            <text class="booking-time">{{ formatTime(booking.scheduledAt) }}</text>
          </view>
          <text class="status-badge" :class="booking.status">{{ getStatusText(booking.status) }}</text>
        </view>
        <view class="empty-state" v-if="upcomingBookings.length === 0 && !loading">
          <text>暂无预约</text>
        </view>
        <view class="loading-state" v-if="loading">
          <text>加载中...</text>
        </view>
      </view>
    </view>
    
    <view class="quick-actions">
      <view class="action-card" @click="navigateTo('/pages/teacher/schedule')">
        <text class="action-icon">📅</text>
        <text class="action-text">时间管理</text>
      </view>
      <view class="action-card" @click="navigateTo('/pages/teacher/earnings')">
        <text class="action-icon">💰</text>
        <text class="action-text">收益统计</text>
      </view>
      <view class="action-card" @click="navigateTo('/pages/teacher/profile')">
        <text class="action-icon">👤</text>
        <text class="action-text">个人资料</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import MoneyDisplay from '../../components/shared/MoneyDisplay.vue'
import { getTeacherBookings } from '../../utils/cloud/teacherBookingsApi.js'
import { getTeacherEarnings } from '../../utils/cloud/teacherEarningsApi.js'

// getApp is available globally in WeChat Mini Program runtime (no import needed)
// eslint-disable-next-line no-undef
const getAppInstance = () => (typeof getApp !== 'undefined' ? getApp() : { globalData: {} })

const todayBookings = ref(0)
const todayEarnings = ref(0) // in cents
const totalEarnings = ref(0) // in cents
const upcomingBookings = ref([])
const loading = ref(false)

const user = computed(() => getAppInstance().globalData.user || {})

function navigateTo(url) {
  uni.navigateTo({ url })
}

function formatTime(timestamp) {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

function getStatusText(status) {
  const statusMap = {
    pending: '待确认',
    confirmed: '已确认'
  }
  return statusMap[status] || status
}

async function loadDashboardData() {
  loading.value = true
  try {
    // Load upcoming bookings and earnings in parallel
    const [bookingsResult, earningsResult] = await Promise.all([
      getTeacherBookings({
        status: 'all',
        page: 1,
        pageSize: 5
      }),
      getTeacherEarnings({ period: 'today' })
    ])
    
    const now = Date.now()
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)
    const todayEnd = new Date()
    todayEnd.setHours(23, 59, 59, 999)
    
    // Filter upcoming bookings (scheduled in future)
    upcomingBookings.value = (bookingsResult.bookings || [])
      .filter(b => {
        const scheduledAt = new Date(b.scheduledAt).getTime()
        return scheduledAt > now && (b.status === 'pending' || b.status === 'confirmed')
      })
      .slice(0, 5)
    
    // Calculate today's bookings
    const todayBookingsList = (bookingsResult.bookings || []).filter(b => {
      const scheduledAt = new Date(b.scheduledAt).getTime()
      return scheduledAt >= todayStart.getTime() && scheduledAt <= todayEnd.getTime()
    })
    
    todayBookings.value = todayBookingsList.length
    
    // Get today's earnings from earnings API
    todayEarnings.value = earningsResult.totalEarnings || 0
    
    // Get total earnings (use 'all' period for total)
    const totalEarningsResult = await getTeacherEarnings({ period: 'all' })
    totalEarnings.value = totalEarningsResult.totalEarnings || 0
  } catch (error) {
    console.error('Failed to load dashboard data:', error)
    uni.showToast({
      title: '加载失败',
      icon: 'none'
    })
    // Fallback to stub data on error
    todayEarnings.value = 0
    totalEarnings.value = 0
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadDashboardData()
})
</script>

<style scoped>
.teacher-home {
  padding: 20rpx;
  min-height: 100vh;
  background-color: transparent; /* Inherit paper texture */
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15rpx;
  margin-bottom: 30rpx;
}

.stat-card {
  background: white;
  border-radius: 16rpx;
  padding: 30rpx 20rpx;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

.stat-value {
  font-size: 32rpx;
  font-weight: bold;
  color: #4A90E2;
}

.stat-label {
  font-size: 22rpx;
  color: #666;
}

.upcoming-section {
  background: white;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
}

.view-all {
  font-size: 26rpx;
  color: #4A90E2;
}

.bookings-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.booking-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 25rpx;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 12rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
}

.booking-info {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

.student-name {
  font-size: 28rpx;
  font-weight: bold;
}

.booking-time {
  font-size: 24rpx;
  color: #666;
}

.status-badge {
  font-size: 22rpx;
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

.empty-state, .loading-state {
  text-align: center;
  padding: 60rpx 0;
  color: #999;
  font-size: 26rpx;
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15rpx;
}

.action-card {
  background: white;
  border-radius: 16rpx;
  padding: 30rpx 20rpx;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

.action-icon {
  font-size: 48rpx;
}

.action-text {
  font-size: 24rpx;
  color: #666;
}
</style>
