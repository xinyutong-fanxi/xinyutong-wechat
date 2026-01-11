<template>
  <view class="admin-withdrawals">
    <view class="tabs">
      <text 
        class="tab" 
        :class="{ active: activeTab === 'pending' }"
        @click="handleTabChange('pending')"
      >
        待审核
      </text>
      <text 
        class="tab" 
        :class="{ active: activeTab === 'approved' }"
        @click="handleTabChange('approved')"
      >
        已通过
      </text>
      <text 
        class="tab" 
        :class="{ active: activeTab === 'rejected' }"
        @click="handleTabChange('rejected')"
      >
        已拒绝
      </text>
      <text 
        class="tab" 
        :class="{ active: activeTab === 'completed' }"
        @click="handleTabChange('completed')"
      >
        已完成
      </text>
    </view>
    
    <view class="withdrawals-list">
      <view 
        class="withdrawal-card" 
        v-for="withdrawal in filteredWithdrawals" 
        :key="withdrawal._id"
        @click="navigateTo(`/pages/admin/withdrawals/review?id=${withdrawal._id}`)"
      >
        <view class="withdrawal-header">
          <text class="withdrawal-no">提现单号: {{ withdrawal.withdrawalNo }}</text>
          <text class="status-badge" :class="withdrawal.status">{{ getStatusText(withdrawal.status) }}</text>
        </view>
        <view class="withdrawal-info">
          <text class="info-item">申请人: {{ withdrawal.applicantName }}</text>
          <text class="info-item">类型: {{ getApplicantType(withdrawal.applicantType) }}</text>
          <text class="info-item">申请时间: {{ formatDate(withdrawal.submittedAt) }}</text>
        </view>
        <view class="withdrawal-footer">
          <MoneyDisplay :amount="withdrawal.amount" :size="'large'" />
        </view>
      </view>
      
      <view class="empty-state" v-if="filteredWithdrawals.length === 0 && !loading">
        <text>暂无提现申请</text>
      </view>
      <view class="loading-state" v-if="loading">
        <text>加载中...</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import MoneyDisplay from '../../components/shared/MoneyDisplay.vue'
import { getWithdrawals } from '../../utils/cloud/adminApi.js'

const activeTab = ref('pending')
const withdrawals = ref([])
const loading = ref(false)

const filteredWithdrawals = computed(() => {
  if (activeTab.value === 'all') {
    return withdrawals.value
  }
  return withdrawals.value.filter(w => w.status === activeTab.value)
})

function navigateTo(url) {
  uni.navigateTo({ url })
}

function getStatusText(status) {
  const statusMap = {
    pending: '待审核',
    approved: '已通过',
    rejected: '已拒绝',
    completed: '已完成'
  }
  return statusMap[status] || status
}

function getApplicantType(type) {
  const typeMap = {
    teacher: '老师',
    distributor: '推广员'
  }
  return typeMap[type] || type
}

function formatDate(timestamp) {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

async function loadWithdrawals() {
  loading.value = true
  try {
    const result = await getWithdrawals({
      status: activeTab.value === 'all' ? 'all' : activeTab.value,
      page: 1,
      pageSize: 50
    })
    withdrawals.value = result.withdrawals || []
  } catch (error) {
    console.error('Failed to load withdrawals:', error)
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
  loadWithdrawals()
}

onMounted(() => {
  loadWithdrawals()
})
</script>

<style scoped>
.admin-withdrawals {
  padding: 20rpx;
  min-height: 100vh;
  background-color: #F2F2F2;
}

.tabs {
  display: flex;
  gap: 0;
  background: white;
  border-radius: 16rpx;
  padding: 10rpx;
  margin-bottom: 20rpx;
  overflow-x: auto;
}

.tab {
  flex: 1;
  text-align: center;
  padding: 20rpx 10rpx;
  font-size: 26rpx;
  color: #666;
  border-radius: 8rpx;
  white-space: nowrap;
}

.tab.active {
  background: #4A90E2;
  color: white;
}

.withdrawals-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.withdrawal-card {
  background: white;
  border-radius: 16rpx;
  padding: 30rpx;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05);
}

.withdrawal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
  padding-bottom: 20rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.withdrawal-no {
  font-size: 26rpx;
  color: #666;
}

.status-badge {
  font-size: 24rpx;
  padding: 6rpx 16rpx;
  border-radius: 12rpx;
}

.status-badge.pending {
  background: #fff3cd;
  color: #856404;
}

.status-badge.approved {
  background: #d1ecf1;
  color: #0c5460;
}

.status-badge.rejected {
  background: #f8d7da;
  color: #721c24;
}

.status-badge.completed {
  background: #d4edda;
  color: #155724;
}

.withdrawal-info {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
  margin-bottom: 20rpx;
}

.info-item {
  font-size: 26rpx;
  color: #666;
}

.withdrawal-footer {
  display: flex;
  justify-content: flex-end;
  padding-top: 20rpx;
  border-top: 1rpx solid #f0f0f0;
}

.amount {
  font-size: 40rpx;
  font-weight: bold;
  color: #ff6600;
}

.empty-state, .loading-state {
  text-align: center;
  padding: 100rpx 0;
  color: #999;
  font-size: 28rpx;
}
</style>
