<template>
  <view class="parent-home">
    <view class="header">
      <text class="title">{{ $t('parent.home.title') }}</text>
      <text class="subtitle">{{ $t('parent.home.subtitle') }}</text>
    </view>
    
    <view class="quick-actions">
      <view class="action-card" @click="navigateTo('/pages/parent/teachers')">
        <text class="action-icon">👨‍🏫</text>
        <text class="action-text">{{ $t('parent.home.findTeacher') }}</text>
      </view>
      <view class="action-card" @click="navigateTo('/pages/parent/bookings')">
        <text class="action-icon">📅</text>
        <text class="action-text">{{ $t('parent.home.myBookings') }}</text>
      </view>
      <view class="action-card" @click="navigateTo('/pages/parent/students')">
        <text class="action-icon">👦</text>
        <text class="action-text">{{ $t('parent.home.studentManagement') }}</text>
      </view>
      <view class="action-card" @click="navigateTo('/pages/parent/distribution')">
        <text class="action-icon">💰</text>
        <text class="action-text">{{ $t('parent.home.distributionCenter') }}</text>
      </view>
    </view>
    
    <view class="upcoming-section">
      <text class="section-title">{{ $t('parent.home.upcomingBookings') }}</text>
      <view class="empty-state" v-if="upcomingBookings.length === 0 && !loading">
        <text>{{ $t('parent.home.noBookings') }}</text>
      </view>
      <view class="booking-list" v-else>
        <view 
          class="booking-card" 
          v-for="booking in upcomingBookings" 
          :key="booking._id"
          @click="navigateTo(`/pages/parent/bookings/detail?id=${booking._id}`)"
        >
          <view class="booking-info">
            <text class="teacher-name">{{ booking.teacherName }}</text>
            <text class="booking-time">{{ formatDateTime(booking.scheduledAt) }}</text>
          </view>
          <text class="status-badge" :class="booking.status">{{ getStatusText(booking.status) }}</text>
        </view>
      </view>
      <view class="loading-state" v-if="loading">
        <text>{{ $t('common.loading') }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useI18n } from 'vue-i18n'
import { hasRole } from '../../utils/auth'
import { formatDateTime as formatDateTimeUtil } from '../../utils/i18n'
import { getCurrentLanguage } from '../../i18n'
import { getBookings } from '../../utils/cloud/bookingsApi.js'

const { t } = useI18n()

// getApp is available globally in WeChat Mini Program runtime (no import needed)
// eslint-disable-next-line no-undef
const getAppInstance = () => (typeof getApp !== 'undefined' ? getApp() : { globalData: {} })

const upcomingBookings = ref([])
const loading = ref(false)

const user = computed(() => getAppInstance().globalData.user || {})

function navigateTo(url) {
  uni.navigateTo({ url })
}

function formatDateTime(timestamp) {
  if (!timestamp) return ''
  const currentLang = getCurrentLanguage()
  return formatDateTimeUtil(timestamp, currentLang)
}

function getStatusText(status) {
  const statusMap = {
    pending: t('parent.bookings.status.pending'),
    confirmed: t('parent.bookings.status.confirmed'),
    completed: t('parent.bookings.status.completed'),
    cancelled: t('parent.bookings.status.cancelled')
  }
  return statusMap[status] || status
}

async function handleReferralCode(referralCode) {
  if (!referralCode) return
  
  try {
    // Store referral code in app global data for later use (in booking flow)
    const app = getAppInstance()
    app.globalData.referralCode = referralCode
    
    // Try to track referral on register (if parent just registered)
    // This is safe to call even if referral already exists
    const { trackReferralOnRegister } = await import('../../utils/cloud/distributionApi.js')
    await trackReferralOnRegister(referralCode)
  } catch (error) {
    // If referral already exists or error, continue - don't show error to user
    console.warn('Referral tracking warning:', error.message)
  }
}

async function loadUpcomingBookings() {
  loading.value = true
  try {
    const result = await getBookings({
      status: 'upcoming',
      page: 1,
      pageSize: 5
    })
    
    const now = Date.now()
    // Filter upcoming bookings (scheduled in future)
    upcomingBookings.value = (result.bookings || [])
      .filter(b => {
        const scheduledAt = new Date(b.scheduledAt).getTime()
        return scheduledAt > now && (b.status === 'pending' || b.status === 'confirmed')
      })
      .slice(0, 5)
  } catch (error) {
    console.error('Failed to load bookings:', error)
    // Don't show error toast on home page
  } finally {
    loading.value = false
  }
}

onLoad((options) => {
  // Check for referral code in URL params (when parent accesses via QR code or link)
  if (options.referralCode) {
    handleReferralCode(options.referralCode)
  }
})

onMounted(() => {
  loadUpcomingBookings()
})
</script>

<style scoped>
.parent-home {
  padding: 20rpx;
  min-height: 100vh;
  background-color: #F2F2F2;
}

.header {
  text-align: center;
  padding: 40rpx 0;
}

.title {
  font-size: 48rpx;
  font-weight: bold;
  display: block;
  margin-bottom: 10rpx;
}

.subtitle {
  font-size: 28rpx;
  color: #666;
  display: block;
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
  margin: 30rpx 0;
}

.action-card {
  background: white;
  border-radius: 16rpx;
  padding: 40rpx;
  text-align: center;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05);
}

.action-icon {
  font-size: 60rpx;
  display: block;
  margin-bottom: 10rpx;
}

.action-text {
  font-size: 28rpx;
  color: #333;
}

.upcoming-section {
  margin-top: 40rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 20rpx;
  display: block;
}

.empty-state, .loading-state {
  text-align: center;
  padding: 60rpx;
  color: #999;
  font-size: 28rpx;
}

.booking-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.booking-card {
  background: white;
  border-radius: 16rpx;
  padding: 30rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05);
}

.booking-info {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
  flex: 1;
}

.teacher-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.booking-time {
  font-size: 26rpx;
  color: #666;
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
</style>
