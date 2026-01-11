<template>
  <view class="payments-page">
    <view class="payments-list">
      <view 
        class="payment-card" 
        v-for="payment in payments" 
        :key="payment._id"
        @click="navigateTo(`/pages/parent/bookings/detail?id=${payment.orderId}`)"
      >
        <view class="payment-header">
          <text class="order-no">订单号: {{ payment.orderNo }}</text>
          <text class="status" :class="payment.status">{{ getStatusText(payment.status) }}</text>
        </view>
        <view class="payment-info">
          <text class="info-item">{{ payment.description }}</text>
          <text class="info-item">时间: {{ formatDate(payment.createdAt) }}</text>
        </view>
        <view class="payment-footer">
          <MoneyDisplay :amount="payment.amount" :size="'large'" />
        </view>
      </view>
      
      <view class="empty-state" v-if="payments.length === 0 && !loading">
        <text>暂无支付记录</text>
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
import { getPayments } from '../../utils/cloud/paymentsApi.js'

const payments = ref([])
const loading = ref(false)

function navigateTo(url) {
  uni.navigateTo({ url })
}

function getStatusText(status) {
  const statusMap = {
    pending: '待支付',
    paid: '已支付',
    failed: '支付失败',
    refunded: '已退款'
  }
  return statusMap[status] || status
}

function formatDate(timestamp) {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

async function loadPayments() {
  loading.value = true
  try {
    const result = await getPayments({ status: 'all', page: 1, pageSize: 50 })
    payments.value = result.payments || []
  } catch (error) {
    console.error('Failed to load payments:', error)
    uni.showToast({
      title: '加载失败',
      icon: 'none'
    })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadPayments()
})
</script>

<style scoped>
.payments-page {
  padding: 20rpx;
  min-height: 100vh;
  background-color: #F2F2F2;
}

.payments-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.payment-card {
  background: white;
  border-radius: 16rpx;
  padding: 30rpx;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05);
}

.payment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.order-no {
  font-size: 26rpx;
  color: #666;
}

.status {
  font-size: 24rpx;
  padding: 6rpx 16rpx;
  border-radius: 12rpx;
}

.status.pending {
  background: #fff3cd;
  color: #856404;
}

.status.paid {
  background: #d4edda;
  color: #155724;
}

.status.failed {
  background: #f8d7da;
  color: #721c24;
}

.status.refunded {
  background: #d1ecf1;
  color: #0c5460;
}

.payment-info {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
  margin-bottom: 20rpx;
}

.info-item {
  font-size: 26rpx;
  color: #666;
}

.payment-footer {
  display: flex;
  justify-content: flex-end;
}

.amount {
  font-size: 36rpx;
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
