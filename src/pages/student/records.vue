<template>
  <view class="student-records">
    <view class="records-list">
      <view 
        class="record-card" 
        v-for="record in records" 
        :key="record._id"
      >
        <view class="record-header">
          <text class="teacher-name">{{ record.teacherName }}</text>
          <text class="record-date">{{ formatDate(record.sessionDate) }}</text>
        </view>
        <view class="record-content" v-if="canViewFull(record.visibilityLevel)">
          <text class="content-label">咨询记录:</text>
          <text class="content-text">{{ record.logContent }}</text>
        </view>
        <view class="record-content" v-else-if="record.visibilityLevel === 'summary'">
          <text class="content-label">摘要:</text>
          <text class="content-text">{{ record.summary || '仅家长可见' }}</text>
        </view>
        <view class="record-content" v-else>
          <text class="content-label">提示:</text>
          <text class="content-text">根据您的隐私设置，详细记录仅家长可见</text>
        </view>
        <view class="record-footer" v-if="record.parentFeedback && record.parentFeedback.rating">
          <text class="feedback-label">家长评价:</text>
          <text class="feedback-rating">⭐ {{ record.parentFeedback.rating }}/5</text>
        </view>
      </view>
      
      <view class="empty-state" v-if="records.length === 0 && !loading">
        <text>暂无咨询记录</text>
      </view>
      <view class="loading-state" v-if="loading">
        <text>加载中...</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getStudentRecords } from '../../utils/cloud/studentRecordsApi.js'

// getApp is available globally in WeChat Mini Program runtime (no import needed)
// eslint-disable-next-line no-undef
const getAppInstance = () => (typeof getApp !== 'undefined' ? getApp() : { globalData: {} })

const records = ref([])
const loading = ref(false)
const user = computed(() => getAppInstance().globalData.user || {})

function canViewFull(visibilityLevel) {
  // Students with full authorization can view full records
  return visibilityLevel === 'full' || user.value.studentProfile?.authorizationLevel === 'full'
}

function formatDate(timestamp) {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

async function loadRecords() {
  loading.value = true
  try {
    const result = await getStudentRecords({ page: 1, pageSize: 50 })
    records.value = result.records || []
  } catch (error) {
    console.error('Failed to load student records:', error)
    uni.showToast({
      title: '加载失败',
      icon: 'none'
    })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadRecords()
})
</script>

<style scoped>
.student-records {
  padding: 20rpx;
  min-height: 100vh;
  background-color: transparent; /* Inherit paper texture */
}

.records-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.record-card {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 16rpx;
  padding: 30rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
}

.record-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
  padding-bottom: 20rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.teacher-name {
  font-size: 32rpx;
  font-weight: bold;
}

.record-date {
  font-size: 26rpx;
  color: #666;
}

.record-content {
  margin-bottom: 20rpx;
}

.content-label {
  font-size: 26rpx;
  color: #666;
  display: block;
  margin-bottom: 10rpx;
}

.content-text {
  font-size: 28rpx;
  color: #333;
  line-height: 1.6;
  display: block;
}

.record-footer {
  padding-top: 20rpx;
  border-top: 1rpx solid #f0f0f0;
  display: flex;
  align-items: center;
  gap: 15rpx;
}

.feedback-label {
  font-size: 26rpx;
  color: #666;
}

.feedback-rating {
  font-size: 28rpx;
  color: #ff6600;
  font-weight: bold;
}

.empty-state, .loading-state {
  text-align: center;
  padding: 100rpx 0;
  color: #999;
  font-size: 28rpx;
}
</style>
