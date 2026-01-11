<template>
  <view class="teacher-withdraw">
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
          :class="{ selected: withdrawAmount && (amount === '全部' ? withdrawAmount * 100 === availableBalance : withdrawAmount === parseFloat(amount)) }"
          @click="selectAmount(amount)"
        >
          {{ amount }}{{ amount === '全部' ? '' : '元' }}
        </text>
      </view>
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
import MoneyDisplay from '../../components/shared/MoneyDisplay.vue'
import { requestWithdrawal } from '../../utils/cloud/financeApi.js'

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
    // TODO: Create teacher.getEarnings cloud function or use direct DB query
    // For now, use stub data
    // const { getTeacherEarnings } = await import('../../utils/cloud/teacherApi.js')
    // const earnings = await getTeacherEarnings({})
    // availableBalance.value = earnings.availableBalance || 0
    
    availableBalance.value = 0 // Stub: will be loaded from actual earnings
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
    
    const result = await requestWithdrawal({
      applicantType: 'teacher',
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
.teacher-withdraw {
  padding: 20rpx;
  min-height: 100vh;
  background-color: transparent; /* Inherit paper texture */
}

.balance-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16rpx;
  padding: 40rpx;
  margin-bottom: 30rpx;
  text-align: center;
}

.label {
  font-size: 28rpx;
  color: rgba(255,255,255,0.9);
  display: block;
  margin-bottom: 20rpx;
}

.amount {
  font-size: 60rpx;
  font-weight: bold;
  color: white;
  display: block;
}

.form-section {
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
  background: transparent; /* Inherit paper texture */
  border-radius: 8rpx;
  font-size: 28rpx;
  color: #666;
  border: 2rpx solid #ddd;
}

.quick-amount:active, .quick-amount.selected {
  background: #e6f3ff;
  border-color: #4A90E2;
  color: #4A90E2;
}

.loading-balance {
  margin-top: 20rpx;
  font-size: 24rpx;
  color: rgba(255,255,255,0.8);
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
