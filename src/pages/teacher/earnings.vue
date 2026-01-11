<template>
  <view class="earnings-page">
    <view class="summary-cards">
        <view class="summary-card">
          <text class="card-label">累计收益</text>
          <MoneyDisplay :amount="totalEarnings" :size="'large'" />
        </view>
        <view class="summary-card">
          <text class="card-label">可提现</text>
          <MoneyDisplay :amount="availableBalance" :size="'large'" />
        </view>
        <view class="summary-card">
          <text class="card-label">已提现</text>
          <MoneyDisplay :amount="withdrawnAmount" :size="'large'" />
        </view>
    </view>
    
    <view class="tabs">
      <text 
        class="tab" 
        :class="{ active: activeTab === 'today' }"
        @click="handleTabChange('today')"
      >
        今日
      </text>
      <text 
        class="tab" 
        :class="{ active: activeTab === 'week' }"
        @click="handleTabChange('week')"
      >
        本周
      </text>
      <text 
        class="tab" 
        :class="{ active: activeTab === 'month' }"
        @click="handleTabChange('month')"
      >
        本月
      </text>
      <text 
        class="tab" 
        :class="{ active: activeTab === 'all' }"
        @click="handleTabChange('all')"
      >
        全部
      </text>
    </view>
    
    <view class="earnings-list">
      <view 
        class="earnings-item" 
        v-for="earning in filteredEarnings" 
        :key="earning._id"
      >
        <view class="item-left">
          <text class="item-title">{{ earning.description }}</text>
          <text class="item-time">{{ formatDate(earning.createdAt) }}</text>
        </view>
        <MoneyDisplay :amount="earning.amount" :size="'normal'" />
      </view>
      
      <view class="empty-state" v-if="filteredEarnings.length === 0 && !loading">
        <text>暂无收益记录</text>
      </view>
      <view class="loading-state" v-if="loading">
        <text>加载中...</text>
      </view>
    </view>
    
    <button class="withdraw-button" @click="navigateTo('/pages/teacher/withdraw')" v-if="availableBalance > 0">
      申请提现
    </button>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import MoneyDisplay from '../../components/shared/MoneyDisplay.vue'
import { getTeacherEarnings } from '../../utils/cloud/teacherEarningsApi.js'

const activeTab = ref('today')
const totalEarnings = ref(0) // in cents
const availableBalance = ref(0) // in cents
const withdrawnAmount = ref(0) // in cents
const earnings = ref([])
const loading = ref(false)

const filteredEarnings = computed(() => {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const weekStart = new Date(today)
  weekStart.setDate(today.getDate() - today.getDay())
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  
  return earnings.value.filter(e => {
    const earningDate = new Date(e.createdAt)
    if (activeTab.value === 'today') return earningDate >= today
    if (activeTab.value === 'week') return earningDate >= weekStart
    if (activeTab.value === 'month') return earningDate >= monthStart
    return true // all
  })
})

function navigateTo(url) {
  uni.navigateTo({ url })
}

function formatDate(timestamp) {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

async function loadEarnings() {
  loading.value = true
  try {
    const result = await getTeacherEarnings({ period: activeTab.value })
    
    totalEarnings.value = result.totalEarnings || 0
    availableBalance.value = result.availableBalance || 0
    withdrawnAmount.value = result.withdrawnAmount || 0
    earnings.value = result.earnings || []
  } catch (error) {
    console.error('Failed to load earnings:', error)
    uni.showToast({
      title: '加载失败',
      icon: 'none'
    })
    // Fallback to stub data on error
    totalEarnings.value = 0
    availableBalance.value = 0
    withdrawnAmount.value = 0
    earnings.value = []
  } finally {
    loading.value = false
  }
}

function handleTabChange(tab) {
  activeTab.value = tab
  loadEarnings()
}

onMounted(() => {
  loadEarnings()
})
</script>

<style scoped>
.earnings-page {
  padding: 20rpx;
  padding-bottom: 100rpx;
  min-height: 100vh;
  background-color: #F2F2F2;
}

.summary-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15rpx;
  margin-bottom: 30rpx;
}

.summary-card {
  background: white;
  border-radius: 16rpx;
  padding: 30rpx 20rpx;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 15rpx;
}

.card-label {
  font-size: 24rpx;
  color: #666;
}

.card-value {
  font-size: 32rpx;
  font-weight: bold;
  color: #ff6600;
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
  padding: 20rpx 10rpx;
  font-size: 26rpx;
  color: #666;
  border-radius: 8rpx;
}

.tab.active {
  background: #4A90E2;
  color: white;
}

.earnings-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.earnings-item {
  background: white;
  border-radius: 16rpx;
  padding: 30rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-left {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
  flex: 1;
}

.item-title {
  font-size: 28rpx;
  color: #333;
}

.item-time {
  font-size: 24rpx;
  color: #999;
}

.item-amount {
  font-size: 32rpx;
  font-weight: bold;
  color: #ff6600;
}

.empty-state, .loading-state {
  text-align: center;
  padding: 100rpx 0;
  color: #999;
  font-size: 28rpx;
}

.withdraw-button {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  background: #4A90E2;
  color: white;
  border-radius: 0;
  padding: 30rpx;
  font-size: 32rpx;
  margin: 0;
}
</style>
