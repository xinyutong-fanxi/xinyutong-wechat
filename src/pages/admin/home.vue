<template>
  <view class="admin-home">
    <view class="stats-grid">
      <view class="stat-card">
        <text class="stat-label">待审核老师</text>
        <text class="stat-value">{{ pendingTeachers }}</text>
      </view>
      <view class="stat-card">
        <text class="stat-label">待审核提现</text>
        <text class="stat-value">{{ pendingWithdrawals }}</text>
      </view>
      <view class="stat-card">
        <text class="stat-label">今日订单</text>
        <text class="stat-value">{{ todayOrders }}</text>
      </view>
      <view class="stat-card">
        <text class="stat-label">今日营收</text>
        <MoneyDisplay :amount="todayRevenue" :size="'large'" />
      </view>
    </view>
    
    <view class="quick-actions">
      <view class="action-card" @click="navigateTo('/pages/admin/teachers')">
        <text class="action-icon">👨‍🏫</text>
        <text class="action-text">老师管理</text>
      </view>
      <view class="action-card" @click="navigateTo('/pages/admin/orders')">
        <text class="action-icon">📦</text>
        <text class="action-text">订单管理</text>
      </view>
      <view class="action-card" @click="navigateTo('/pages/admin/withdrawals')">
        <text class="action-icon">💰</text>
        <text class="action-text">提现审核</text>
      </view>
      <view class="action-card" @click="navigateTo('/pages/admin/distribution')">
        <text class="action-icon">📊</text>
        <text class="action-text">推广配置</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import MoneyDisplay from '../../components/shared/MoneyDisplay.vue'
import { getDashboardStats } from '../../utils/cloud/adminApi.js'

const pendingTeachers = ref(0)
const pendingWithdrawals = ref(0)
const todayOrders = ref(0)
const todayRevenue = ref(0) // in cents
const loading = ref(false)

function navigateTo(url) {
  uni.navigateTo({ url })
}

async function loadDashboardStats() {
  loading.value = true
  try {
    const result = await getDashboardStats()
    if (result.error) {
      throw new Error(result.message || 'Failed to load stats')
    }
    
    const stats = result.stats || {}
    pendingTeachers.value = stats.pendingTeachers || 0
    pendingWithdrawals.value = stats.pendingWithdrawals || 0
    todayOrders.value = stats.todayOrders || 0
    todayRevenue.value = stats.todayRevenue || 0
  } catch (error) {
    console.error('Failed to load dashboard stats:', error)
    uni.showToast({
      title: '加载失败',
      icon: 'none'
    })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadDashboardStats()
})
</script>

<style scoped>
.admin-home {
  padding: 20rpx;
  min-height: 100vh;
  background-color: #F2F2F2;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
  margin-bottom: 30rpx;
}

.stat-card {
  background: white;
  border-radius: 16rpx;
  padding: 30rpx;
  display: flex;
  flex-direction: column;
  gap: 15rpx;
}

.stat-label {
  font-size: 26rpx;
  color: #666;
}

.stat-value {
  font-size: 36rpx;
  font-weight: bold;
  color: #4A90E2;
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
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
</style>
