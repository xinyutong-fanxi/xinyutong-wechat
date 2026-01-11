<template>
  <view class="booking-detail">
    <view class="section">
      <text class="section-title">预约信息</text>
      <view class="info-row">
        <text class="label">学生</text>
        <text class="value">{{ booking.studentName }}</text>
      </view>
      <view class="info-row">
        <text class="label">家长</text>
        <text class="value">{{ booking.parentName }}</text>
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
        <text class="label">服务类型</text>
        <text class="value">{{ booking.serviceType }}</text>
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
        <text class="feedback-label">家长评价</text>
        <text class="feedback-rating">评分: {{ booking.counselingLog.parentFeedback.rating }}/5</text>
        <text class="feedback-comment">{{ booking.counselingLog.parentFeedback.comment || '暂无评价' }}</text>
      </view>
    </view>
    
    <view class="actions" v-if="booking.status === 'confirmed' && !booking.counselingLog">
      <button class="action-button" @click="navigateTo(`/pages/teacher/bookings/log?bookingId=${booking._id}`)">
        提交咨询记录
      </button>
    </view>
    <view class="loading-state" v-if="loading">
      <text>加载中...</text>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getTeacherBookingDetails } from '../../../utils/cloud/teacherBookingsApi.js'

const booking = ref({
  _id: '',
  studentName: '',
  parentName: '',
  scheduledAt: null,
  duration: 60,
  serviceType: '',
  status: 'pending',
  counselingLog: null
})

const loading = ref(false)

onLoad(async (options) => {
  if (options.id) {
    booking.value._id = options.id
    await loadBookingDetails()
  }
})

async function loadBookingDetails() {
  loading.value = true
  try {
    const bookingData = await getTeacherBookingDetails(booking.value._id)
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
</script>

<style scoped>
.booking-detail {
  padding: 20rpx;
  min-height: 100vh;
  background-color: #F2F2F2;
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
  margin-top: 40rpx;
}

.action-button {
  width: 100%;
  background: #4A90E2;
  color: white;
  border-radius: 8rpx;
  padding: 30rpx;
  font-size: 32rpx;
}

.loading-state {
  text-align: center;
  padding: 100rpx 0;
  color: #999;
  font-size: 28rpx;
}
</style>
