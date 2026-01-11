<template>
  <view class="teacher-audit">
    <view class="teacher-info-section">
      <text class="section-title">基本信息</text>
      <view class="info-row">
        <text class="label">姓名</text>
        <text class="value">{{ teacher.name }}</text>
      </view>
      <view class="info-row">
        <text class="label">职称</text>
        <text class="value">{{ teacher.title }}</text>
      </view>
      <view class="info-row">
        <text class="label">学历</text>
        <text class="value">{{ teacher.credentials.university }}</text>
      </view>
      <view class="info-row">
        <text class="label">专业领域</text>
        <text class="value">{{ teacher.expertise.join(', ') }}</text>
      </view>
    </view>
    
    <view class="credentials-section">
      <text class="section-title">资质证明</text>
      <view class="credentials-list">
        <image 
          v-for="cert in teacher.credentials.certificates" 
          :key="cert"
          :src="cert" 
          class="cert-image"
          mode="aspectFit"
          @click="previewImage(cert)"
        />
      </view>
    </view>
    
    <view class="actions-section" v-if="!loading">
      <button class="action-button reject" @click="handleReject" :disabled="processing" :loading="processing">
        {{ processing ? '处理中...' : '拒绝申请' }}
      </button>
      <button class="action-button approve" @click="handleApprove" :disabled="processing" :loading="processing">
        {{ processing ? '处理中...' : '通过审核' }}
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
import { getTeacherDetails, auditTeacher } from '../../../utils/cloud/adminApi.js'

const teacher = ref({
  _id: '',
  name: '',
  title: '',
  credentials: {
    university: '',
    certificates: []
  },
  expertise: []
})

const loading = ref(false)
const processing = ref(false)

onLoad(async (options) => {
  if (options.id) {
    teacher.value._id = options.id
    await loadTeacherDetails()
  }
})

async function loadTeacherDetails() {
  loading.value = true
  try {
    const teacherData = await getTeacherDetails(teacher.value._id)
    teacher.value = {
      ...teacher.value,
      ...teacherData
    }
  } catch (error) {
    console.error('Failed to load teacher details:', error)
    uni.showToast({
      title: '加载失败',
      icon: 'none'
    })
  } finally {
    loading.value = false
  }
}

function previewImage(url) {
  uni.previewImage({
    urls: teacher.value.credentials.certificates,
    current: url
  })
}

async function handleReject() {
  uni.showModal({
    title: '确认拒绝',
    editable: true,
    placeholderText: '请输入拒绝原因（可选）',
    success: async (res) => {
      if (res.confirm) {
        processing.value = true
        
        try {
          const result = await auditTeacher({
            teacherId: teacher.value._id,
            action: 'reject',
            rejectionReason: res.content || null
          })
          
          if (result.error) {
            throw new Error(result.message || '拒绝失败')
          }
          
          uni.showToast({ title: '已拒绝', icon: 'success' })
          setTimeout(() => {
            uni.navigateBack()
          }, 1500)
        } catch (error) {
          console.error('Reject teacher error:', error)
          uni.showToast({
            title: error.message || '拒绝失败',
            icon: 'none'
          })
        } finally {
          processing.value = false
        }
      }
    }
  })
}

async function handleApprove() {
  uni.showModal({
    title: '确认通过',
    content: '确定要通过这个老师的审核吗？',
    success: async (res) => {
      if (res.confirm) {
        processing.value = true
        
        try {
          const result = await auditTeacher({
            teacherId: teacher.value._id,
            action: 'approve'
          })
          
          if (result.error) {
            throw new Error(result.message || '审批失败')
          }
          
          uni.showToast({ title: '已通过', icon: 'success' })
          setTimeout(() => {
            uni.navigateBack()
          }, 1500)
        } catch (error) {
          console.error('Approve teacher error:', error)
          uni.showToast({
            title: error.message || '审批失败',
            icon: 'none'
          })
        } finally {
          processing.value = false
        }
      }
    }
  })
}
</script>

<style scoped>
.teacher-audit {
  padding: 20rpx;
  min-height: 100vh;
  background-color: transparent; /* Inherit paper texture */
}

.teacher-info-section, .credentials-section {
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
  font-weight: bold;
}

.credentials-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
}

.cert-image {
  width: 100%;
  height: 300rpx;
  border-radius: 8rpx;
  background: transparent; /* Inherit paper texture */
}

.actions-section {
  display: flex;
  gap: 20rpx;
  margin-top: 40rpx;
}

.action-button {
  flex: 1;
  padding: 30rpx;
  border-radius: 8rpx;
  font-size: 32rpx;
}

.action-button.reject {
  background: white;
  color: #ff3b30;
  border: 2rpx solid #ff3b30;
}

.action-button.approve {
  background: #28a745;
  color: white;
}

.action-button[disabled] {
  opacity: 0.6;
}

.loading-state {
  text-align: center;
  padding: 100rpx 0;
  color: #999;
  font-size: 28rpx;
}
</style>
