<template>
  <view class="teacher-detail">
    <view class="teacher-header">
      <image :src="teacher.avatarUrl" class="teacher-avatar-large" mode="aspectFill" />
      <view class="teacher-basic">
        <text class="teacher-name">{{ teacher.name }}</text>
        <text class="teacher-title">{{ teacher.title }}</text>
        <view class="teacher-rating">
          <text>评分: {{ teacher.rating }}</text>
          <text>已服务: {{ teacher.totalSessions }}次</text>
        </view>
      </view>
    </view>
    
    <view class="section">
      <text class="section-title">专业领域</text>
      <view class="expertise-tags">
        <text class="tag" v-for="exp in teacher.expertise" :key="exp">{{ exp }}</text>
      </view>
    </view>
    
    <view class="section">
      <text class="section-title">服务模式</text>
      <text class="service-modes">{{ teacher.serviceModes.join(' | ') }}</text>
    </view>
    
    <view class="section">
      <text class="section-title">收费标准</text>
      <view class="price-section">
        <MoneyDisplay :amount="teacher.pricePerHour || 0" :size="'large'" />
        <text class="price-unit">/小时</text>
      </view>
    </view>
    
    <view class="section">
      <text class="section-title">个人简介</text>
      <text class="bio">{{ teacher.bio || '暂无简介' }}</text>
    </view>
    
    <view class="section">
      <text class="section-title">资质认证</text>
      <view class="certifications" v-if="teacher.credentials.certificates.length > 0">
        <image 
          v-for="cert in teacher.credentials.certificates" 
          :key="cert"
          :src="cert" 
          class="cert-image"
          mode="aspectFit"
        />
      </view>
      <text v-else>暂无认证</text>
    </view>
    
    <view class="fixed-bottom">
      <button class="book-button" @click="navigateTo(`/pages/parent/bookings/create?teacherId=${teacher._id}`)">
        立即预约
      </button>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import MoneyDisplay from '../../../components/shared/MoneyDisplay.vue'
import { getTeacherDetails } from '../../../utils/cloud/teacherApi.js'

const teacher = ref({
  _id: '',
  name: '',
  title: '',
  avatarUrl: '',
  rating: 0,
  totalSessions: 0,
  expertise: [],
  serviceModes: [],
  pricePerHour: 0,
  bio: '',
  credentials: {
    certificates: []
  }
})

const loading = ref(false)

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
      ...teacherData,
      credentials: teacherData.credentials || { certificates: [] },
      expertise: teacherData.expertise || [],
      serviceModes: teacherData.serviceModes || []
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

function navigateTo(url) {
  uni.navigateTo({ url })
}
</script>

<style scoped>
.teacher-detail {
  padding: 20rpx;
  padding-bottom: 120rpx;
  min-height: 100vh;
  background-color: transparent; /* Inherit paper texture */
}

.teacher-header {
  background: white;
  border-radius: 16rpx;
  padding: 40rpx;
  display: flex;
  gap: 30rpx;
  margin-bottom: 20rpx;
}

.teacher-avatar-large {
  width: 150rpx;
  height: 150rpx;
  border-radius: 75rpx;
  flex-shrink: 0;
}

.teacher-basic {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 15rpx;
}

.teacher-name {
  font-size: 36rpx;
  font-weight: bold;
}

.teacher-title {
  font-size: 28rpx;
  color: #666;
}

.teacher-rating {
  display: flex;
  gap: 20rpx;
  font-size: 26rpx;
  color: #ff6600;
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
  margin-bottom: 20rpx;
}

.expertise-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 15rpx;
}

.tag {
  font-size: 26rpx;
  color: #D60000;
  background: #e6f3ff;
  padding: 8rpx 16rpx;
  border-radius: 8rpx;
}

.service-modes {
  font-size: 28rpx;
  color: #333;
}

.price-section {
  display: flex;
  align-items: baseline;
  gap: 10rpx;
}

.price-unit {
  font-size: 28rpx;
  color: #666;
}

.bio {
  font-size: 28rpx;
  color: #666;
  line-height: 1.6;
}

.certifications {
  display: flex;
  gap: 20rpx;
  flex-wrap: wrap;
}

.cert-image {
  width: 200rpx;
  height: 200rpx;
  border-radius: 8rpx;
}

.fixed-bottom {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  padding: 20rpx;
  box-shadow: 0 -2rpx 10rpx rgba(0,0,0,0.1);
}

.book-button {
  width: 100%;
  background: #D60000;
  color: white;
  border-radius: 8rpx;
  padding: 25rpx;
  font-size: 32rpx;
}
</style>
