<template>
  <view class="submit-log">
    <view class="booking-info">
      <text class="label">学生:</text>
      <text class="value">{{ booking.studentName }}</text>
    </view>
    <view class="booking-info">
      <text class="label">预约时间:</text>
      <text class="value">{{ formatDateTime(booking.scheduledAt) }}</text>
    </view>
    
    <view class="form-section">
      <text class="section-title">实际时长</text>
      <input 
        v-model.number="actualDuration" 
        type="number" 
        placeholder="实际咨询时长（分钟）"
        class="duration-input"
      />
    </view>
    
    <view class="form-section">
      <text class="section-title">咨询记录</text>
      <textarea 
        v-model="logContent" 
        placeholder="请详细记录本次咨询的主要内容、学生状态、建议等（建议至少50字）..."
        class="log-textarea"
        maxlength="2000"
      />
      <text class="char-count" :class="{ warning: logContent.length < 50 }">
        {{ logContent.length }}/2000
        <text v-if="logContent.length > 0 && logContent.length < 50"> (建议至少50字)</text>
      </text>
    </view>
    
    <button class="submit-button" @click="handleSubmit" :disabled="!logContent.trim() || submitting">
      {{ submitting ? '提交中...' : '提交记录' }}
    </button>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getTeacherBookingDetails } from '../../../utils/cloud/teacherBookingsApi.js'
import { submitCounselingLog } from '../../../utils/cloud/teacherApi.js'

const booking = ref({
  _id: '',
  studentName: '',
  scheduledAt: null,
  duration: 60
})

const logContent = ref('')
const submitting = ref(false)
const loading = ref(false)

const actualDuration = ref(60) // Actual session duration, can be edited

onLoad(async (options) => {
  if (options.bookingId) {
    booking.value._id = options.bookingId
    await loadBookingInfo()
  }
})

async function loadBookingInfo() {
  loading.value = true
  try {
    const bookingData = await getTeacherBookingDetails(booking.value._id)
    booking.value = {
      ...booking.value,
      ...bookingData
    }
    actualDuration.value = bookingData.duration || 60
  } catch (error) {
    console.error('Failed to load booking info:', error)
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

async function handleSubmit() {
  if (!logContent.value.trim()) {
    uni.showToast({ title: '请输入咨询记录', icon: 'none' })
    return
  }
  
  if (logContent.value.trim().length < 50) {
    uni.showModal({
      title: '提示',
      content: '咨询记录内容过短，建议至少50字。确定要提交吗？',
      success: async (res) => {
        if (res.confirm) {
          await submitLog()
        }
      }
    })
    return
  }
  
  await submitLog()
}

async function submitLog() {
  submitting.value = true
  
  try {
    const result = await submitCounselingLog({
      bookingId: booking.value._id,
      logContent: logContent.value.trim(),
      sessionDate: booking.value.scheduledAt || Date.now(),
      duration: actualDuration.value
    })
    
    if (result.error) {
      throw new Error(result.message || '提交失败')
    }
    
    uni.showToast({ title: '提交成功', icon: 'success' })
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  } catch (error) {
    console.error('Submit log error:', error)
    uni.showToast({
      title: error.message || '提交失败',
      icon: 'none'
    })
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.submit-log {
  padding: 20rpx;
  min-height: 100vh;
  background-color: #F2F2F2;
}

.booking-info {
  background: white;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  display: flex;
  gap: 20rpx;
}

.label {
  font-size: 28rpx;
  color: #666;
}

.value {
  font-size: 28rpx;
  color: #333;
  font-weight: bold;
}

.form-section {
  background: white;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  display: block;
  margin-bottom: 30rpx;
}

.log-textarea {
  width: 100%;
  min-height: 400rpx;
  font-size: 28rpx;
  padding: 20rpx;
  background: #F2F2F2;
  border-radius: 8rpx;
  line-height: 1.6;
}

.char-count {
  font-size: 24rpx;
  color: #999;
  text-align: right;
  display: block;
  margin-top: 15rpx;
}

.submit-button {
  width: 100%;
  background: #4A90E2;
  color: white;
  border-radius: 8rpx;
  padding: 30rpx;
  font-size: 32rpx;
}

.submit-button[disabled] {
  background: #ccc;
}

.duration-input {
  width: 100%;
  padding: 20rpx;
  font-size: 28rpx;
  background: #F2F2F2;
  border-radius: 8rpx;
  margin-bottom: 20rpx;
}

.char-count.warning {
  color: #ff6600;
}
</style>
