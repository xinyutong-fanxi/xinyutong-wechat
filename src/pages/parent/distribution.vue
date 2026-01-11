<template>
  <view class="distribution-page">
    <view class="status-card" v-if="distributorStatus === 'none'">
      <text class="title">成为推广员</text>
      <text class="desc">分享给朋友，获得推广佣金</text>
      <button class="apply-button" @click="navigateTo('/pages/parent/distribution/apply')">
        立即申请
      </button>
    </view>
    
    <view class="status-card pending" v-if="distributorStatus === 'pending'">
      <text class="title">申请审核中</text>
      <text class="desc">您的推广员申请正在审核中，请耐心等待</text>
    </view>
    
    <view class="status-card approved" v-if="distributorStatus === 'approved'">
      <view class="stats-header">
        <text class="title">推广数据</text>
        <text class="referral-code">推广码: {{ referralCode }}</text>
      </view>
      
      <view class="stats-grid">
        <view class="stat-item">
          <MoneyDisplay :amount="totalCommission" :size="'large'" />
          <text class="stat-label">累计佣金</text>
        </view>
        <view class="stat-item">
          <MoneyDisplay :amount="availableBalance" :size="'large'" />
          <text class="stat-label">可提现</text>
        </view>
        <view class="stat-item">
          <text class="stat-value">{{ totalReferrals }}</text>
          <text class="stat-label">推广人数</text>
        </view>
        <view class="stat-item">
          <text class="stat-value">{{ totalOrders }}</text>
          <text class="stat-label">推广订单</text>
        </view>
      </view>
      
      <view class="quick-actions">
        <button class="action-btn" @click="navigateTo('/pages/parent/distribution/poster')">
          生成海报
        </button>
        <button class="action-btn" @click="navigateTo('/pages/parent/distribution/stats')">
          详细数据
        </button>
        <button class="action-btn primary" @click="navigateTo('/pages/parent/distribution/withdraw')" v-if="availableBalance > 0">
          申请提现
        </button>
      </view>
    </view>
    
    <view class="status-card rejected" v-if="distributorStatus === 'rejected'">
      <text class="title">申请已拒绝</text>
      <text class="desc">很抱歉，您的推广员申请未通过审核</text>
      <button class="apply-button" @click="navigateTo('/pages/parent/distribution/apply')">
        重新申请
      </button>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import MoneyDisplay from '../../components/shared/MoneyDisplay.vue'
import { getDistributionStats } from '../../utils/cloud/distributionApi.js'

// getApp is available globally in WeChat Mini Program runtime (no import needed)
// eslint-disable-next-line no-undef
const getAppInstance = () => (typeof getApp !== 'undefined' ? getApp() : { globalData: {} })

const distributorStatus = ref('none') // 'none' | 'pending' | 'approved' | 'rejected'
const referralCode = ref('')
const totalCommission = ref(0) // in cents
const availableBalance = ref(0) // in cents
const totalReferrals = ref(0)
const totalOrders = ref(0)
const loading = ref(false)

const user = computed(() => getAppInstance().globalData.user || {})

function navigateTo(url) {
  uni.navigateTo({ url })
}

async function loadDistributorStatus() {
  loading.value = true
  try {
    const stats = await getDistributionStats()
    
    // Determine distributor status from user profile or stats
    if (user.value.parentProfile && user.value.parentProfile.distributorStatus) {
      distributorStatus.value = user.value.parentProfile.distributorStatus
      referralCode.value = user.value.parentProfile.distributorCode || ''
    } else if (stats.status) {
      distributorStatus.value = stats.status
      referralCode.value = stats.referralCode || ''
    }
    
    if (distributorStatus.value === 'approved') {
      totalCommission.value = stats.totalCommission || 0
      availableBalance.value = stats.availableBalance || 0
      totalReferrals.value = stats.totalReferrals || 0
      totalOrders.value = stats.totalOrders || 0
    }
  } catch (error) {
    console.error('Failed to load distributor status:', error)
    // Don't show error toast, just use default values
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadDistributorStatus()
})
</script>

<style scoped>
.distribution-page {
  padding: 20rpx;
  min-height: 100vh;
  background-color: transparent; /* Inherit paper texture */
}

.status-card {
  background: white;
  border-radius: 16rpx;
  padding: 40rpx;
  text-align: center;
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
  margin-bottom: 40rpx;
  line-height: 1.6;
}

.apply-button {
  width: 100%;
  background: #4A90E2;
  color: white;
  border-radius: 8rpx;
  padding: 25rpx;
  font-size: 32rpx;
}

.status-card.pending {
  background: #fff3cd;
}

.status-card.approved {
  text-align: left;
}

.status-card.rejected {
  background: #f8d7da;
}

.stats-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40rpx;
}

.referral-code {
  font-size: 24rpx;
  color: #4A90E2;
  background: #e6f3ff;
  padding: 8rpx 16rpx;
  border-radius: 8rpx;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
  margin-bottom: 40rpx;
}

.stat-item {
  background: transparent; /* Inherit paper texture */
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

.quick-actions {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.action-btn {
  width: 100%;
  background: white;
  color: #4A90E2;
  border: 2rpx solid #4A90E2;
  border-radius: 8rpx;
  padding: 25rpx;
  font-size: 32rpx;
}

.action-btn.primary {
  background: #4A90E2;
  color: white;
}
</style>
