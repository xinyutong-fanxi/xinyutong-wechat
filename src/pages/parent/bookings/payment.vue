<template>
  <view class="payment-page">
    <view class="order-summary">
      <text class="section-title">订单信息</text>
      <view class="summary-row">
        <text class="label">服务</text>
        <text class="value">{{ order.serviceType }}</text>
      </view>
      <view class="summary-row">
        <text class="label">老师</text>
        <text class="value">{{ order.teacherName }}</text>
      </view>
      <view class="summary-row">
        <text class="label">学生</text>
        <text class="value">{{ order.studentName }}</text>
      </view>
      <view class="summary-row">
        <text class="label">时间</text>
        <text class="value">{{ formatDateTime(order.scheduledAt) }}</text>
      </view>
      <view class="summary-row total">
        <text class="label">订单金额</text>
        <MoneyDisplay :amount="order.amount" :size="'large'" />
      </view>
    </view>
    
    <PaymentForm
      :orderId="order._id"
      :amount="order.amount"
      :description="paymentDescription"
      @success="handlePaymentSuccess"
      @fail="handlePaymentFail"
    />
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import PaymentForm from '../../../components/shared/PaymentForm.vue'
import MoneyDisplay from '../../../components/shared/MoneyDisplay.vue'

const order = ref({
  _id: '',
  orderNo: '',
  serviceType: '心理咨询',
  teacherName: '',
  studentName: '',
  scheduledAt: null,
  amount: 0
})

onLoad(async (options) => {
  if (options.orderId) {
    order.value._id = options.orderId
    order.value.orderNo = options.orderNo || ''
    order.value.amount = parseInt(options.amount) || 0
    order.value.serviceType = options.serviceType || '心理咨询'
    order.value.teacherName = options.teacherName || ''
    order.value.studentName = options.studentName || ''
    order.value.scheduledAt = options.scheduledAt ? parseInt(options.scheduledAt) : null
  } else if (options.bookingId) {
    // Load order details from booking
    try {
      const { getBookingDetails } = await import('../../../utils/cloud/bookingsApi.js')
      const bookingDetails = await getBookingDetails(options.bookingId)
      if (bookingDetails) {
        order.value = {
          ...order.value,
          _id: bookingDetails.orderId || bookingDetails._id || options.bookingId,
          orderNo: bookingDetails.orderNo || '',
          amount: bookingDetails.amount || 0,
          serviceType: bookingDetails.serviceType || '心理咨询',
          teacherName: bookingDetails.teacherName || '',
          studentName: bookingDetails.studentName || '',
          scheduledAt: bookingDetails.scheduledAt || null
        }
      }
    } catch (error) {
      console.error('Failed to load booking details:', error)
      uni.showToast({
        title: '加载失败',
        icon: 'none'
      })
    }
  }
})

const paymentDescription = computed(() => {
  return `心理咨询服务 - ${order.value.orderNo || order.value._id}`
})

function formatDateTime(timestamp) {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

function handlePaymentSuccess(data) {
  uni.showToast({ 
    title: '支付成功', 
    icon: 'success' 
  })
  
  setTimeout(() => {
    // Navigate to bookings list
    uni.redirectTo({ url: '/pages/parent/bookings' })
  }, 1500)
}

function handlePaymentFail(error) {
  console.error('Payment failed:', error)
  // Error toast is already shown in PaymentForm component
}
</script>

<style scoped>
.payment-page {
  padding: 20rpx;
  padding-bottom: 160rpx;
  min-height: 100vh;
  background-color: #F2F2F2;
}

.order-summary {
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

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.summary-row.total {
  border-top: 2rpx solid #333;
  border-bottom: none;
  margin-top: 20rpx;
  padding-top: 30rpx;
}

.label {
  font-size: 28rpx;
  color: #666;
}

.value {
  font-size: 28rpx;
  color: #333;
}

.value.price {
  font-size: 36rpx;
  color: #ff6600;
  font-weight: bold;
}

</style>
