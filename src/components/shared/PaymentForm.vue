<template>
  <view class="payment-form">
    <view class="order-summary">
      <view class="summary-row">
        <text class="label">订单金额</text>
        <MoneyDisplay :amount="amount" :size="'large'" />
      </view>
      <view class="summary-row" v-if="description">
        <text class="label">服务内容</text>
        <text class="value">{{ description }}</text>
      </view>
    </view>
    
    <view class="payment-methods">
      <text class="section-title">支付方式</text>
      <view class="payment-option selected">
        <image src="/static/wechat-pay.png" class="payment-icon" mode="aspectFit" />
        <text class="payment-name">微信支付</text>
        <text class="check-icon">✓</text>
      </view>
    </view>
    
    <button 
      class="pay-button" 
      @click="handlePay" 
      :loading="paying"
      :disabled="paying || !orderId"
    >
      {{ paying ? '支付中...' : `确认支付 ${formattedAmount}` }}
    </button>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import MoneyDisplay from './MoneyDisplay.vue'
import { createPayment } from '../../utils/cloud/paymentApi.js'

const props = defineProps({
  orderId: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    default: 0
  },
  description: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['success', 'fail'])

const paying = ref(false)

const formattedAmount = computed(() => {
  return `￥${(props.amount / 100).toFixed(2)}`
})

async function handlePay() {
  if (paying.value || !props.orderId) return
  
  paying.value = true
  
  try {
    // Call cloud function to create payment
    const result = await createPayment({
      orderId: props.orderId,
      amount: props.amount,
      description: props.description || '心理咨询服务'
    })
    
    if (result.error) {
      throw new Error(result.message || '支付创建失败')
    }
    
    // Call WeChat Pay
    const paymentParams = {
      timeStamp: result.timeStamp,
      nonceStr: result.nonceStr,
      package: result.package,
      signType: result.signType || 'RSA',
      paySign: result.paySign
    }
    
    // #ifdef MP-WEIXIN
    await new Promise((resolve, reject) => {
      wx.requestPayment({
        ...paymentParams,
        success: (res) => {
          resolve(res)
        },
        fail: (err) => {
          reject(err)
        }
      })
    })
    // #endif
    
    // #ifndef MP-WEIXIN
    // For non-WeChat platforms, simulate payment
    await new Promise(resolve => setTimeout(resolve, 1500))
    // #endif
    
    emit('success', { orderId: props.orderId, paymentId: result.paymentId })
    
  } catch (error) {
    console.error('Payment error:', error)
    uni.showToast({
      title: error.message || '支付失败',
      icon: 'none'
    })
    emit('fail', error)
  } finally {
    paying.value = false
  }
}
</script>

<style scoped>
.payment-form {
  width: 100%;
}

.order-summary {
  background: white;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.summary-row:last-child {
  border-bottom: none;
}

.label {
  font-size: 28rpx;
  color: #666;
}

.value {
  font-size: 28rpx;
  color: #333;
}

.payment-methods {
  background: white;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  display: block;
  margin-bottom: 30rpx;
}

.payment-option {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 30rpx;
  border: 2rpx solid #ddd;
  border-radius: 16rpx;
}

.payment-option.selected {
  border-color: #4A90E2;
  background: #e6f3ff;
}

.payment-icon {
  width: 60rpx;
  height: 60rpx;
  border-radius: 8rpx;
}

.payment-name {
  flex: 1;
  font-size: 32rpx;
  color: #333;
}

.check-icon {
  font-size: 32rpx;
  color: #4A90E2;
  font-weight: bold;
}

.pay-button {
  width: 100%;
  background: #07c160;
  color: white;
  border-radius: 8rpx;
  padding: 30rpx;
  font-size: 32rpx;
  font-weight: bold;
}

.pay-button[disabled] {
  background: #ccc;
}
</style>
