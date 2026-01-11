<template>
  <view class="stats-page">
    <view class="stats-summary">
        <view class="stat-card">
          <MoneyDisplay :amount="totalCommission" :size="'large'" />
          <text class="stat-label">累计佣金</text>
        </view>
        <view class="stat-card">
          <MoneyDisplay :amount="availableBalance" :size="'large'" />
          <text class="stat-label">可提现</text>
        </view>
      <view class="stat-card">
        <text class="stat-value">{{ totalReferrals }}</text>
        <text class="stat-label">推广人数</text>
      </view>
      <view class="stat-card">
        <text class="stat-value">{{ totalOrders }}</text>
        <text class="stat-label">推广订单</text>
      </view>
    </view>
    
    <view class="tabs">
      <text 
        class="tab" 
        :class="{ active: activeTab === 'referrals' }"
        @click="handleTabChange('referrals')"
      >
        推广记录
      </text>
      <text 
        class="tab" 
        :class="{ active: activeTab === 'commissions' }"
        @click="handleTabChange('commissions')"
      >
        佣金明细
      </text>
    </view>
    
    <view class="list-content">
      <view 
        class="list-item" 
        v-for="item in currentList" 
        :key="item._id"
      >
        <view class="item-header">
          <text class="item-title">{{ item.title }}</text>
          <MoneyDisplay v-if="item.amount" :amount="item.amount" :size="'normal'" />
        </view>
        <text class="item-time">{{ formatDate(item.createdAt) }}</text>
      </view>
      
      <view class="empty-state" v-if="currentList.length === 0 && !loading">
        <text>暂无记录</text>
      </view>
      <view class="loading-state" v-if="loading">
        <text>加载中...</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import MoneyDisplay from '../../../components/shared/MoneyDisplay.vue'
import { getDistributionStats } from '../../../utils/cloud/distributionApi.js'

const activeTab = ref('referrals')
const totalCommission = ref(0) // in cents
const availableBalance = ref(0) // in cents
const totalReferrals = ref(0)
const totalOrders = ref(0)
const loading = ref(false)

const referrals = ref([])
const commissions = ref([])

const currentList = computed(() => {
  return activeTab.value === 'referrals' ? referrals.value : commissions.value
})

function formatDate(timestamp) {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

async function loadStats() {
  loading.value = true
  try {
    const stats = await getDistributionStats({ 
      tab: activeTab.value, 
      page: 1, 
      pageSize: 50 
    })
    
    // Always update summary stats
    totalCommission.value = stats.totalCommission || 0
    availableBalance.value = stats.availableBalance || 0
    totalReferrals.value = stats.totalReferrals || 0
    totalOrders.value = stats.totalOrders || 0
    
    // Load referrals and commissions based on current tab
    if (activeTab.value === 'referrals') {
      referrals.value = (stats.referrals || []).map(r => ({
        _id: r._id,
        title: `推广了 ${r.referredParentName || '新用户'}`,
        createdAt: r.createdAt,
        amount: null
      }))
      commissions.value = []
    } else if (activeTab.value === 'commissions') {
      commissions.value = (stats.commissions || []).map(c => ({
        _id: c._id,
        title: `订单 ${c.orderNo || c.orderId}`,
        createdAt: c.createdAt || c.settledAt,
        amount: c.commissionAmount || 0
      }))
      referrals.value = []
    } else {
      // Overview tab - show summaries only
      referrals.value = []
      commissions.value = []
    }
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

function handleTabChange(tab) {
  activeTab.value = tab
  // Reload data for selected tab
  loadStats()
}

onMounted(() => {
  loadStats()
})
</script>

<style scoped>
.stats-page {
  padding: 20rpx;
  min-height: 100vh;
  background-color: transparent; /* Inherit paper texture */
}

.stats-summary {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
  margin-bottom: 30rpx;
}

.stat-card {
  background: white;
  border-radius: 16rpx;
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

.tabs {
  display: flex;
  gap: 0;
  background: white;
  border-radius: 16rpx;
  padding: 10rpx;
  margin-bottom: 20rpx;
}

.tab {
  flex: 1;
  text-align: center;
  padding: 20rpx;
  font-size: 28rpx;
  color: #666;
  border-radius: 8rpx;
}

.tab.active {
  background: #D60000;
  color: white;
}

.list-content {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.list-item {
  background: white;
  border-radius: 16rpx;
  padding: 30rpx;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15rpx;
}

.item-title {
  font-size: 28rpx;
  color: #333;
}

.item-amount {
  font-size: 32rpx;
  color: #ff6600;
  font-weight: bold;
}

.item-time {
  font-size: 24rpx;
  color: #999;
}

.empty-state, .loading-state {
  text-align: center;
  padding: 100rpx 0;
  color: #999;
  font-size: 28rpx;
}
</style>
