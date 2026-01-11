<template>
  <view class="withdraw-page">
    <view class="balance-card">
      <text class="label">可提现金额</text>
      <MoneyDisplay :amount="availableBalance" :size="'large'" />
      <view class="loading-balance" v-if="loading">
        <text>加载中...</text>
      </view>
    </view>
    
    <view class="form-section">
      <text class="section-title">提现金额</text>
      <view class="input-wrapper">
        <text class="currency">￥</text>
        <input 
          v-model.number="withdrawAmount" 
          type="digit" 
          placeholder="请输入提现金额"
          class="amount-input"
          @input="handleAmountInput"
        />
      </view>
      <text class="hint">最低提现金额: ￥10.00</text>
      
      <view class="quick-amounts">
        <text 
          class="quick-amount" 
          v-for="amount in quickAmounts" 
          :key="amount"
          @click="selectAmount(amount)"
        >
          {{ amount }}
        </text>
      </view>
    </view>
    
    <view class="form-section">
      <text class="section-title">提现方式</text>
      <view class="payment-option selected">
        <image src="/static/wechat-pay.png" class="payment-icon" mode="aspectFit" />
        <text class="payment-name">微信零钱</text>
        <text class="check-icon">✓</text>
      </view>
    </view>
    
    <view class="rules-section">
      <text class="rules-title">提现说明</text>
      <text class="rule-item">1. 提现金额将转入您的微信零钱</text>
      <text class="rule-item">2. 提现需审核，审核通过后3-5个工作日到账</text>
      <text class="rule-item">3. 单次最低提现金额为10元</text>
    </view>
    
    <button 
      class="submit-button" 
      @click="handleSubmit" 
      :disabled="!canSubmit || submitting"
    >
      {{ submitting ? '提交中...' : '提交提现申请' }}
    </button>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import MoneyDisplay from '../../../components/shared/MoneyDisplay.vue'
import { requestWithdrawal } from '../../../utils/cloud/financeApi.js'
import { getDistributionStats } from '../../../utils/cloud/distributionApi.js'

// getApp is available globally in WeChat Mini Program runtime (no import needed)
// eslint-disable-next-line no-undef
const getAppInstance = () => (typeof getApp !== 'undefined' ? getApp() : { globalData: {} })

const availableBalance = ref(0) // in cents
const withdrawAmount = ref(null)
const submitting = ref(false)
const loading = ref(false)

const user = computed(() => getAppInstance().globalData.user || {})

const quickAmounts = computed(() => {
  const balance = availableBalance.value / 100
  const amounts = []
  if (balance >= 50) amounts.push('50')
  if (balance >= 100) amounts.push('100')
  if (balance >= 200) amounts.push('200')
  if (balance >= 500) amounts.push('500')
  // Add "全部" option
  if (balance > 0) amounts.push('全部')
  return amounts
})

const canSubmit = computed(() => {
  if (!withdrawAmount.value || withdrawAmount.value < 10) return false
  const amountInCents = Math.round(withdrawAmount.value * 100)
  return amountInCents <= availableBalance.value && amountInCents >= 1000 // 10 yuan minimum
})

async function loadAvailableBalance() {
  loading.value = true
  try {
    const stats = await getDistributionStats()
    availableBalance.value = stats.availableBalance || 0
  } catch (error) {
    console.error('Failed to load available balance:', error)
    uni.showToast({
      title: '加载失败',
      icon: 'none'
    })
  } finally {
    loading.value = false
  }
}

function selectAmount(amount) {
  if (amount === '全部') {
    withdrawAmount.value = availableBalance.value / 100
  } else {
    withdrawAmount.value = parseFloat(amount)
  }
}

function handleAmountInput(e) {
  const value = parseFloat(e.detail.value)
  if (isNaN(value)) {
    withdrawAmount.value = null
    return
  }
  
  const maxAmount = availableBalance.value / 100
  if (value > maxAmount) {
    uni.showToast({ title: '超出可提现金额', icon: 'none' })
    withdrawAmount.value = maxAmount
  } else {
    withdrawAmount.value = value
  }
}

async function handleSubmit() {
  if (!canSubmit.value) {
    if (!withdrawAmount.value || withdrawAmount.value < 10) {
      uni.showToast({ title: '最低提现金额为10元', icon: 'none' })
    } else {
      uni.showToast({ title: '请输入有效的提现金额', icon: 'none' })
    }
    return
  }
  
  submitting.value = true
  
  try {
    const amountInCents = Math.round(withdrawAmount.value * 100)
    
    // Determine applicant type
    let applicantType = 'distributor'
    if (user.value.role === 'teacher' || user.value.roles?.includes('teacher')) {
      applicantType = 'teacher'
    }
    
    const result = await requestWithdrawal({
      applicantType,
      amount: amountInCents
    })
    
    if (result.error) {
      throw new Error(result.message || '申请失败')
    }
    
    uni.showToast({ 
      title: result.message || '申请已提交', 
      icon: 'success' 
    })
    
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  } catch (error) {
    console.error('Request withdrawal error:', error)
    uni.showToast({
      title: error.message || '申请失败',
      icon: 'none'
    })
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  loadAvailableBalance()
})
</script>

<style scoped>
.withdraw-page {
  padding: 20rpx;
  min-height: 100vh;
  background-color: #F2F2F2;
}

.balance-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16rpx;
  padding: 40rpx;
  margin-bottom: 30rpx;
  text-align: center;
}

.balance-card .label {
  font-size: 28rpx;
  color: rgba(255,255,255,0.9);
  display: block;
  margin-bottom: 20rpx;
}

.balance-card .amount, .balance-card .money-display {
  font-size: 60rpx;
  font-weight: bold;
  color: white;
  display: block;
}

.loading-balance {
  margin-top: 20rpx;
  font-size: 24rpx;
  color: rgba(255,255,255,0.8);
}

.form-section {
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

.input-wrapper {
  display: flex;
  align-items: center;
  border-bottom: 2rpx solid #f0f0f0;
  padding-bottom: 20rpx;
  margin-bottom: 20rpx;
}

.currency {
  font-size: 36rpx;
  color: #333;
  font-weight: bold;
  margin-right: 10rpx;
}

.amount-input {
  flex: 1;
  font-size: 48rpx;
  font-weight: bold;
  color: #333;
}

.hint {
  font-size: 24rpx;
  color: #999;
  display: block;
  margin-bottom: 30rpx;
}

.quick-amounts {
  display: flex;
  gap: 20rpx;
  flex-wrap: wrap;
}

.quick-amount {
  padding: 15rpx 30rpx;
  background: #F2F2F2;
  border-radius: 8rpx;
  font-size: 28rpx;
  color: #666;
  border: 2rpx solid #ddd;
}

.quick-amount:active {
  background: #e6f3ff;
  border-color: #4A90E2;
  color: #4A90E2;
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
}

.payment-name {
  flex: 1;
  font-size: 32rpx;
}

.check-icon {
  font-size: 32rpx;
  color: #4A90E2;
}

.rules-section {
  background: #fff9e6;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
}

.rules-title {
  font-size: 28rpx;
  font-weight: bold;
  display: block;
  margin-bottom: 20rpx;
}

.rule-item {
  font-size: 24rpx;
  color: #666;
  line-height: 1.8;
  display: block;
  margin-bottom: 10rpx;
}

.submit-button {
  width: 100%;
  background: #4A90E2;
  color: white;
  border-radius: 8rpx;
  padding: 30rpx;
  font-size: 32rpx;
}

.submit-button[disabled] {
  background: #ccc;
}
</style>
