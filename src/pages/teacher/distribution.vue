<template>
  <view class="teacher-distribution">
    <view class="info-card">
      <text class="title">推广工具</text>
      <text class="desc">分享给朋友，获得推广佣金</text>
    </view>
    
    <view class="quick-actions">
      <view class="action-card" @click="navigateTo('/pages/parent/distribution/poster')">
        <text class="action-icon">📱</text>
        <text class="action-text">生成推广海报</text>
      </view>
      <view class="action-card" @click="copyReferralCode">
        <text class="action-icon">📋</text>
        <text class="action-text">复制推广码</text>
      </view>
    </view>
    
    <view class="stats-section">
      <text class="section-title">推广数据</text>
      <view class="stats-grid">
        <view class="stat-item">
          <text class="stat-value">{{ totalReferrals }}</text>
          <text class="stat-label">推广人数</text>
        </view>
        <view class="stat-item">
          <MoneyDisplay :amount="totalCommission" :size="'large'" />
          <text class="stat-label">推广佣金</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import MoneyDisplay from '../../components/shared/MoneyDisplay.vue'
import { getDistributionStats } from '../../utils/cloud/distributionApi.js'

const referralCode = ref('')
const totalReferrals = ref(0)
const totalCommission = ref(0) // in cents
const loading = ref(false)

function navigateTo(url) {
  uni.navigateTo({ url })
}

async function loadDistributionStats() {
  loading.value = true
  try {
    const stats = await getDistributionStats({ tab: 'all' })
    referralCode.value = stats.referralCode || ''
    totalReferrals.value = stats.totalReferrals || 0
    totalCommission.value = stats.totalCommission || 0
  } catch (error) {
    console.error('Failed to load distribution stats:', error)
    uni.showToast({
      title: '加载失败',
      icon: 'none'
    })
  } finally {
    loading.value = false
  }
}

function copyReferralCode() {
  if (!referralCode.value) {
    uni.showToast({ title: '推广码未生成', icon: 'none' })
    return
  }
  
  uni.setClipboardData({
    data: referralCode.value,
    success: () => {
      uni.showToast({ title: '推广码已复制', icon: 'success' })
    },
    fail: () => {
      uni.showToast({ title: '复制失败', icon: 'none' })
    }
  })
}

onMounted(() => {
  loadDistributionStats()
})
</script>

<style scoped>
.teacher-distribution {
  padding: 20rpx;
  min-height: 100vh;
  background-color: #F2F2F2;
}

.info-card {
  background: white;
  border-radius: 16rpx;
  padding: 40rpx;
  text-align: center;
  margin-bottom: 30rpx;
}

.title {
  font-size: 36rpx;
  font-weight: bold;
  display: block;
  margin-bottom: 15rpx;
}

.desc {
  font-size: 28rpx;
  color: #666;
  display: block;
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
  margin-bottom: 30rpx;
}

.action-card {
  background: white;
  border-radius: 16rpx;
  padding: 40rpx;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 15rpx;
}

.action-icon {
  font-size: 60rpx;
}

.action-text {
  font-size: 28rpx;
  color: #333;
}

.stats-section {
  background: white;
  border-radius: 16rpx;
  padding: 30rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  display: block;
  margin-bottom: 30rpx;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
}

.stat-item {
  background: #F2F2F2;
  border-radius: 12rpx;
  padding: 30rpx;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

.stat-value {
  font-size: 36rpx;
  font-weight: bold;
  color: #ff6600;
}

.stat-label {
  font-size: 24rpx;
  color: #666;
}
</style>
