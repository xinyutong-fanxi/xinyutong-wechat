<template>
  <view class="teacher-profile">
    <view class="profile-header">
      <image :src="profile.avatarUrl" class="avatar" mode="aspectFill" @click="changeAvatar" />
      <text class="name">{{ profile.name || '未设置' }}</text>
      <text class="status-badge" :class="profile.status">{{ getStatusText(profile.status) }}</text>
    </view>
    
    <view class="form-section">
      <text class="section-title">基本信息</text>
      <view class="form-item">
        <text class="label">姓名</text>
        <input v-model="profile.name" type="text" placeholder="请输入姓名" class="input" />
      </view>
      <view class="form-item">
        <text class="label">职称/头衔</text>
        <input v-model="profile.title" type="text" placeholder="请输入职称" class="input" />
      </view>
      <view class="form-item">
        <text class="label">个人简介</text>
        <textarea v-model="profile.bio" placeholder="请输入个人简介" class="textarea" maxlength="500" />
      </view>
    </view>
    
    <view class="form-section">
      <text class="section-title">专业领域</text>
      <view class="expertise-tags">
        <text 
          class="tag" 
          v-for="exp in expertiseOptions" 
          :key="exp"
          :class="{ selected: profile.expertise.includes(exp) }"
          @click="toggleExpertise(exp)"
        >
          {{ exp }}
        </text>
      </view>
    </view>
    
    <view class="form-section">
      <text class="section-title">服务设置</text>
      <view class="form-item">
        <text class="label">服务模式</text>
        <view class="checkbox-group">
          <label class="checkbox-label">
            <checkbox value="online" :checked="profile.serviceModes.includes('online')" @change="toggleServiceMode('online', $event)" />
            <text>线上咨询</text>
          </label>
          <label class="checkbox-label">
            <checkbox value="offline" :checked="profile.serviceModes.includes('offline')" @change="toggleServiceMode('offline', $event)" />
            <text>线下咨询</text>
          </label>
        </view>
      </view>
      <view class="form-item">
        <text class="label">收费标准 (元/小时)</text>
        <input v-model.number="profile.pricePerHour" type="digit" placeholder="请输入价格" class="input" />
      </view>
    </view>
    
    <button class="submit-button" @click="handleSubmit" :disabled="submitting">
      {{ submitting ? '保存中...' : '保存修改' }}
    </button>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// getApp is available globally in WeChat Mini Program runtime (no import needed)
// eslint-disable-next-line no-undef
const getAppInstance = () => (typeof getApp !== 'undefined' ? getApp() : { globalData: {} })

const loading = ref(false)

const submitting = ref(false)
const profile = ref({
  name: '',
  title: '',
  bio: '',
  avatarUrl: '',
  status: 'pending',
  expertise: [],
  serviceModes: ['online'],
  pricePerHour: 200
})

const expertiseOptions = ref(['心理辅导', '学习指导', '情绪管理', '行为矫正', '亲子关系', '学业规划'])

function getStatusText(status) {
  const statusMap = {
    pending: '审核中',
    approved: '已通过',
    rejected: '已拒绝',
    suspended: '已暂停'
  }
  return statusMap[status] || status
}

function toggleExpertise(exp) {
  const index = profile.value.expertise.indexOf(exp)
  if (index > -1) {
    profile.value.expertise.splice(index, 1)
  } else {
    profile.value.expertise.push(exp)
  }
}

function toggleServiceMode(mode, event) {
  if (event.detail.value.length > 0) {
    if (!profile.value.serviceModes.includes(mode)) {
      profile.value.serviceModes.push(mode)
    }
  } else {
    const index = profile.value.serviceModes.indexOf(mode)
    if (index > -1) {
      profile.value.serviceModes.splice(index, 1)
    }
  }
}

function changeAvatar() {
  uni.chooseImage({
    count: 1,
    success: (res) => {
      // TODO: Upload image and update avatar
      profile.value.avatarUrl = res.tempFilePaths[0]
    }
  })
}

async function handleSubmit() {
  if (!profile.value.name || !profile.value.title) {
    uni.showToast({ title: '请填写姓名和职称', icon: 'none' })
    return
  }
  
  submitting.value = true
  
  try {
    const { updateTeacherProfile } = await import('../../utils/cloud/teacherApi.js')
    const updateResult = await updateTeacherProfile({
      name: profile.value.name,
      title: profile.value.title,
      bio: profile.value.bio,
      expertise: profile.value.expertise,
      serviceModes: profile.value.serviceModes,
      pricePerHour: profile.value.pricePerHour,
      credentials: profile.value.credentials
    })
    
    if (updateResult.error) {
      throw new Error(updateResult.message || '保存失败')
    }
    
    uni.showToast({ 
      title: updateResult.message || '保存成功', 
      icon: 'success' 
    })
    
    // If status changed to pending, show notice
    if (updateResult.statusChanged) {
      setTimeout(() => {
        uni.showModal({
          title: '提示',
          content: '由于更新了资质信息，您的资料将重新提交审核。审核期间您的账号状态为"待审核"。',
          showCancel: false
        })
      }, 2000)
    }
  } catch (error) {
    console.error('Update profile error:', error)
    uni.showToast({
      title: error.message || '保存失败',
      icon: 'none'
    })
  } finally {
    submitting.value = false
  }
}

async function loadTeacherProfile() {
  loading.value = true
  try {
    // TODO: Load teacher profile from API or DB
    // For now, use stub data or get from user globalData
    const { getTeacherDetails } = await import('../../utils/cloud/teacherApi.js')
    const app = getAppInstance()
    const user = app.globalData.user || {}
    
    // If user has teacherProfile, use it
    if (user.teacherProfile) {
      profile.value = {
        ...profile.value,
        ...user.teacherProfile,
        credentials: user.teacherProfile.credentials || {
          idCard: '',
          qualifications: [],
          university: '',
          certificates: []
        },
        expertise: user.teacherProfile.expertise || [],
        serviceModes: user.teacherProfile.serviceModes || []
      }
    }
  } catch (error) {
    console.error('Failed to load teacher profile:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadTeacherProfile()
})
</script>

<style scoped>
.teacher-profile {
  padding: 20rpx;
  min-height: 100vh;
  background-color: transparent; /* Inherit paper texture */
}

.profile-header {
  background: white;
  border-radius: 16rpx;
  padding: 40rpx;
  text-align: center;
  margin-bottom: 20rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20rpx;
}

.avatar {
  width: 150rpx;
  height: 150rpx;
  border-radius: 75rpx;
}

.name {
  font-size: 36rpx;
  font-weight: bold;
}

.status-badge {
  font-size: 24rpx;
  padding: 8rpx 20rpx;
  border-radius: 20rpx;
}

.status-badge.pending {
  background: #fff3cd;
  color: #856404;
}

.status-badge.approved {
  background: #d4edda;
  color: #155724;
}

.form-section {
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

.form-item {
  margin-bottom: 30rpx;
}

.label {
  font-size: 28rpx;
  color: #333;
  display: block;
  margin-bottom: 15rpx;
}

.input {
  width: 100%;
  font-size: 32rpx;
  padding: 20rpx;
  background: transparent; /* Inherit paper texture */
  border-radius: 8rpx;
}

.textarea {
  width: 100%;
  min-height: 200rpx;
  font-size: 28rpx;
  padding: 20rpx;
  background: transparent; /* Inherit paper texture */
  border-radius: 8rpx;
}

.expertise-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 15rpx;
}

.tag {
  padding: 15rpx 25rpx;
  background: transparent; /* Inherit paper texture */
  border: 2rpx solid #ddd;
  border-radius: 8rpx;
  font-size: 26rpx;
  color: #666;
}

.tag.selected {
  background: #e6f3ff;
  border-color: #4A90E2;
  color: #4A90E2;
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 15rpx;
  font-size: 28rpx;
}

.submit-button {
  width: 100%;
  background: #4A90E2;
  color: white;
  border-radius: 8rpx;
  padding: 30rpx;
  font-size: 32rpx;
  margin-top: 20rpx;
}

.submit-button[disabled] {
  background: #ccc;
}
</style>
