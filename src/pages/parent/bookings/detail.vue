<template>
  <view class="booking-detail">
    <view class="section">
      <text class="section-title">预约信息</text>
      <view class="info-row">
        <text class="label">老师</text>
        <text class="value">{{ booking.teacherName }}</text>
      </view>
      <view class="info-row">
        <text class="label">学生</text>
        <text class="value">{{ booking.studentName }}</text>
      </view>
      <view class="info-row">
        <text class="label">服务类型</text>
        <text class="value">{{ booking.serviceType }}</text>
      </view>
      <view class="info-row">
        <text class="label">预约时间</text>
        <text class="value">{{ formatDateTime(booking.scheduledAt) }}</text>
      </view>
      <view class="info-row">
        <text class="label">时长</text>
        <text class="value">{{ booking.duration }}分钟</text>
      </view>
      <view class="info-row">
        <text class="label">状态</text>
        <text class="status-badge" :class="booking.status">{{ getStatusText(booking.status) }}</text>
      </view>
    </view>
    
    <view class="section" v-if="booking.counselingLog">
      <text class="section-title">咨询记录</text>
      <text class="log-content">{{ booking.counselingLog.logContent }}</text>
      <view class="feedback-section" v-if="booking.counselingLog.parentFeedback">
        <text class="feedback-label">我的评价</text>
        <text class="feedback-rating">评分: {{ booking.counselingLog.parentFeedback.rating }}/5</text>
        <text class="feedback-comment">{{ booking.counselingLog.parentFeedback.comment || '暂无评价' }}</text>
      </view>
    </view>
    
    <view class="actions" v-if="booking.status === 'pending' || booking.status === 'confirmed' || (booking.status === 'completed' && !booking.counselingLog?.parentFeedback)">
      <button class="action-button cancel" @click="handleCancel" v-if="booking.status === 'pending' || booking.status === 'confirmed'" :loading="cancelling" :disabled="cancelling">
        {{ cancelling ? '取消中...' : '取消预约' }}
      </button>
      <button class="action-button primary" @click="navigateTo(`/pages/parent/bookings/log?bookingId=${booking._id}`)" v-if="booking.status === 'completed' && !booking.counselingLog?.parentFeedback">
        评价服务
      </button>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getBookingDetails } from '../../../utils/cloud/bookingsApi.js'
import { cancelBooking } from '../../../utils/cloud/bookingApi.js'

// getApp is available globally in WeChat Mini Program runtime (no import needed)
// eslint-disable-next-line no-undef
const getAppInstance = () => (typeof getApp !== 'undefined' ? getApp() : { globalData: {} })

const booking = ref({
  _id: '',
  teacherName: '',
  studentName: '',
  serviceType: '',
  scheduledAt: null,
  duration: 60,
  status: 'pending',
  counselingLog: null
})

const loading = ref(false)
const cancelling = ref(false)

const user = computed(() => getAppInstance().globalData.user || {})

onLoad(async (options) => {
  if (options.id) {
    booking.value._id = options.id
    await loadBookingDetails()
  }
})

async function loadBookingDetails() {
  loading.value = true
  try {
    const bookingData = await getBookingDetails(booking.value._id)
    booking.value = {
      ...booking.value,
      ...bookingData,
      counselingLog: bookingData.counselingLog || null
    }
  } catch (error) {
    console.error('Failed to load booking details:', error)
    uni.showToast({
      title: '加载失败',
      icon: 'none'
    })
  } finally {
    loading.value = false
  }
}

function formatDateTime(timestamp) {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
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

function navigateTo(url) {
  uni.navigateTo({ url })
}

async function handleCancel() {
  uni.showModal({
    title: '确认取消',
    content: '确定要取消这个预约吗？取消后可能产生退款费用。',
    success: async (res) => {
      if (res.confirm) {
        cancelling.value = true
        try {
          const result = await cancelBooking({
            bookingId: booking.value._id,
            role: 'parent',
            cancellationReason: '用户取消'
          })
          
          if (result.error) {
            throw new Error(result.message || '取消失败')
          }
          
          uni.showToast({ 
            title: result.message || '已取消', 
            icon: 'success' 
          })
          
          // Reload booking details to reflect status change
          setTimeout(() => {
            loadBookingDetails()
          }, 1500)
        } catch (error) {
          console.error('Cancel booking error:', error)
          uni.showToast({
            title: error.message || '取消失败',
            icon: 'none'
          })
        } finally {
          cancelling.value = false
        }
      }
    }
  })
}
</script>

<style scoped>
.booking-detail {
  padding: 20rpx;
  min-height: 100vh;
  background-color: transparent; /* Inherit paper texture */
}

.section {
  background: white;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  display: block;
  margin-bottom: 30rpx;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.label {
  font-size: 28rpx;
  color: #666;
}

.value {
  font-size: 28rpx;
  color: #333;
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

.log-content {
  font-size: 28rpx;
  color: #666;
  line-height: 1.6;
  margin-bottom: 30rpx;
  display: block;
}

.feedback-section {
  margin-top: 30rpx;
  padding-top: 30rpx;
  border-top: 1rpx solid #f0f0f0;
}

.feedback-label {
  font-size: 28rpx;
  font-weight: bold;
  display: block;
  margin-bottom: 15rpx;
}

.feedback-rating {
  font-size: 26rpx;
  color: #ff6600;
  display: block;
  margin-bottom: 15rpx;
}

.feedback-comment {
  font-size: 26rpx;
  color: #666;
  line-height: 1.6;
  display: block;
}

.actions {
  display: flex;
  gap: 20rpx;
  margin-top: 40rpx;
}

.action-button {
  flex: 1;
  padding: 25rpx;
  border-radius: 8rpx;
  font-size: 32rpx;
}

.action-button.primary {
  background: #4A90E2;
  color: white;
}

.action-button.cancel {
  background: #fff;
  color: #666;
  border: 1rpx solid #ddd;
}

.action-button[disabled] {
  opacity: 0.6;
}
</style>
