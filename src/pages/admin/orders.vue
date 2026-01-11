<template>
  <view class="admin-orders">
    <view class="filters">
      <picker mode="selector" :range="statusOptions" range-key="label" :value="statusIndex" @change="onStatusChange">
        <view class="filter-picker">
          <text>{{ selectedStatus.label }}</text>
          <text class="arrow">▼</text>
        </view>
      </picker>
    </view>
    
    <view class="orders-list">
      <view 
        class="order-card" 
        v-for="order in filteredOrders" 
        :key="order._id"
      >
        <view class="order-header">
          <text class="order-no">订单号: {{ order.orderNo }}</text>
          <text class="status-badge" :class="order.status">{{ getStatusText(order.status) }}</text>
        </view>
        <view class="order-info">
          <text class="info-item">家长: {{ order.parentName }}</text>
          <text class="info-item">老师: {{ order.teacherName }}</text>
          <text class="info-item">时间: {{ formatDate(order.createdAt) }}</text>
        </view>
        <view class="order-footer">
          <MoneyDisplay :amount="order.amount" :size="'large'" />
          <text class="platform-fee">平台佣金: <MoneyDisplay :amount="order.platformFee || 0" :size="'small'" /></text>
        </view>
      </view>
      
      <view class="empty-state" v-if="filteredOrders.length === 0 && !loading">
        <text>暂无订单</text>
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
import { getOrders } from '../../utils/cloud/adminApi.js'

const statusOptions = ref([
  { value: 'all', label: '全部' },
  { value: 'pending', label: '待支付' },
  { value: 'paid', label: '已支付' },
  { value: 'completed', label: '已完成' },
  { value: 'refunded', label: '已退款' }
])
const statusIndex = ref(0)
const selectedStatus = ref(statusOptions.value[0])

const orders = ref([])
const loading = ref(false)

const filteredOrders = computed(() => {
  if (selectedStatus.value.value === 'all') {
    return orders.value
  }
  return orders.value.filter(o => o.status === selectedStatus.value.value)
})

function onStatusChange(e) {
  statusIndex.value = e.detail.value
  selectedStatus.value = statusOptions.value[e.detail.value]
  loadOrders()
}

function getStatusText(status) {
  const statusMap = {
    pending: '待支付',
    paid: '已支付',
    completed: '已完成',
    refunded: '已退款',
    cancelled: '已取消'
  }
  return statusMap[status] || status
}

function formatDate(timestamp) {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

async function loadOrders() {
  loading.value = true
  try {
    const result = await getOrders({
      status: selectedStatus.value.value === 'all' ? 'all' : selectedStatus.value.value,
      page: 1,
      pageSize: 50
    })
    orders.value = result.orders || []
  } catch (error) {
    console.error('Failed to load orders:', error)
    uni.showToast({
      title: '加载失败',
      icon: 'none'
    })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadOrders()
})
</script>

<style scoped>
.admin-orders {
  padding: 20rpx;
  min-height: 100vh;
  background-color: transparent; /* Inherit paper texture */
}

.filters {
  margin-bottom: 20rpx;
}

.filter-picker {
  background: white;
  border-radius: 16rpx;
  padding: 25rpx 30rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 28rpx;
}

.arrow {
  font-size: 24rpx;
  color: #999;
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.order-card {
  background: white;
  border-radius: 16rpx;
  padding: 30rpx;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
  padding-bottom: 20rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.order-no {
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

.status-badge.paid {
  background: #d1ecf1;
  color: #0c5460;
}

.status-badge.completed {
  background: #d4edda;
  color: #155724;
}

.status-badge.refunded {
  background: #f8d7da;
  color: #721c24;
}

.order-info {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
  margin-bottom: 20rpx;
}

.info-item {
  font-size: 26rpx;
  color: #666;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20rpx;
  border-top: 1rpx solid #f0f0f0;
}

.amount {
  font-size: 36rpx;
  font-weight: bold;
  color: #ff6600;
}

.platform-fee {
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
