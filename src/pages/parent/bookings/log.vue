<template>
  <view class="feedback-page">
    <view class="booking-info">
      <text class="info-label">老师:</text>
      <text class="info-value">{{ booking.teacherName }}</text>
    </view>
    <view class="booking-info">
      <text class="info-label">学生:</text>
      <text class="info-value">{{ booking.studentName }}</text>
    </view>
    <view class="booking-info">
      <text class="info-label">咨询时间:</text>
      <text class="info-value">{{ formatDate(booking.scheduledAt) }}</text>
    </view>
    
    <view class="section">
      <text class="section-title">咨询记录</text>
      <view class="log-content-box">
        <text class="log-content">{{ booking.counselingLog?.logContent || '暂无记录' }}</text>
      </view>
    </view>
    
    <view class="section">
      <text class="section-title">评价服务</text>
      <view class="rating-section">
        <text class="rating-label">评分 (1-5分):</text>
        <view class="rating-stars">
          <text 
            v-for="star in 5" 
            :key="star"
            class="star"
            :class="{ active: star <= rating }"
            @click="rating = star"
          >
            ⭐
          </text>
        </view>
      </view>
      
      <view class="comment-section">
        <text class="comment-label">评价内容 (可选):</text>
        <textarea
          v-model="comment"
          class="comment-textarea"
          placeholder="请输入您的评价..."
          maxlength="500"
        />
        <text class="char-count" :class="{ warning: comment.length > 450 }">
          {{ comment.length }}/500
        </text>
      </view>
    </view>
    
    <button 
      class="submit-button" 
      @click="handleSubmit" 
      :disabled="!rating || submitting"
      :loading="submitting"
    >
      {{ submitting ? '提交中...' : '提交评价' }}
    </button>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getBookingDetails } from '../../../utils/cloud/bookingsApi.js'
import { submitFeedback } from '../../../utils/cloud/bookingsApi.js'

const booking = ref({
  _id: '',
  teacherName: '',
  studentName: '',
  scheduledAt: null,
  counselingLog: null
})

const rating = ref(0)
const comment = ref('')
const loading = ref(false)
const submitting = ref(false)

onLoad(async (options) => {
  if (options.bookingId) {
    booking.value._id = options.bookingId
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
    
    // If feedback already exists, load it
    if (booking.value.counselingLog?.parentFeedback) {
      rating.value = booking.value.counselingLog.parentFeedback.rating || 0
      comment.value = booking.value.counselingLog.parentFeedback.comment || ''
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

async function handleSubmit() {
  if (!rating.value || rating.value < 1 || rating.value > 5) {
    uni.showToast({
      title: '请选择评分',
      icon: 'none'
    })
    return
  }
  
  submitting.value = true
  try {
    const result = await submitFeedback({
      bookingId: booking.value._id,
      rating: rating.value,
      comment: comment.value.trim() || null
    })
    
    if (result.error) {
      throw new Error(result.message || '提交失败')
    }
    
    uni.showToast({
      title: '评价成功',
      icon: 'success'
    })
    
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  } catch (error) {
    console.error('Submit feedback error:', error)
    uni.showToast({
      title: error.message || '提交失败',
      icon: 'none'
    })
  } finally {
    submitting.value = false
  }
}

function formatDate(timestamp) {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}
</script>

<style scoped>
.feedback-page {
  padding: 20rpx;
  padding-bottom: 120rpx;
  min-height: 100vh;
  background-color: transparent; /* Inherit paper texture */
}

.booking-info {
  background: white;
  border-radius: 16rpx;
  padding: 20rpx 30rpx;
  margin-bottom: 15rpx;
  display: flex;
  gap: 20rpx;
  align-items: center;
}

.info-label {
  font-size: 28rpx;
  color: #666;
}

.info-value {
  font-size: 28rpx;
  color: #333;
  font-weight: bold;
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

.log-content-box {
  background: transparent; /* Inherit paper texture */
  border-radius: 8rpx;
  padding: 30rpx;
  min-height: 200rpx;
}

.log-content {
  font-size: 28rpx;
  color: #333;
  line-height: 1.8;
  display: block;
}

.rating-section {
  margin-bottom: 40rpx;
}

.rating-label {
  font-size: 28rpx;
  color: #333;
  display: block;
  margin-bottom: 20rpx;
}

.rating-stars {
  display: flex;
  gap: 15rpx;
  align-items: center;
}

.star {
  font-size: 48rpx;
  opacity: 0.3;
  transition: all 0.2s;
}

.star.active {
  opacity: 1;
  transform: scale(1.1);
}

.comment-section {
  display: flex;
  flex-direction: column;
  gap: 15rpx;
}

.comment-label {
  font-size: 28rpx;
  color: #333;
}

.comment-textarea {
  width: 100%;
  min-height: 200rpx;
  font-size: 28rpx;
  padding: 20rpx;
  background: transparent; /* Inherit paper texture */
  border-radius: 8rpx;
  line-height: 1.6;
}

.char-count {
  font-size: 24rpx;
  color: #999;
  text-align: right;
}

.char-count.warning {
  color: #ff6600;
}

.submit-button {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  background: #D60000;
  color: white;
  border-radius: 0;
  padding: 30rpx;
  font-size: 32rpx;
}

.submit-button[disabled] {
  background: #ccc;
}
</style>
