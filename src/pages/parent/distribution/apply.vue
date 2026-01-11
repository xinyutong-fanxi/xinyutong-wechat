<template>
  <view class="apply-distributor">
    <view class="info-section">
      <text class="section-title">推广员权益</text>
      <view class="benefit-list">
        <view class="benefit-item">
          <text class="benefit-icon">💰</text>
          <view class="benefit-content">
            <text class="benefit-title">推广佣金</text>
            <text class="benefit-desc">推荐用户下单可获得推广佣金</text>
          </view>
        </view>
        <view class="benefit-item">
          <text class="benefit-icon">📊</text>
          <view class="benefit-content">
            <text class="benefit-title">二级推广</text>
            <text class="benefit-desc">支持二级推广，获得更多收益</text>
          </view>
        </view>
        <view class="benefit-item">
          <text class="benefit-icon">📱</text>
          <view class="benefit-content">
            <text class="benefit-title">推广工具</text>
            <text class="benefit-desc">提供推广海报和二维码</text>
          </view>
        </view>
        <view class="benefit-item">
          <text class="benefit-icon">💸</text>
          <view class="benefit-content">
            <text class="benefit-title">随时提现</text>
            <text class="benefit-desc">佣金随时可申请提现</text>
          </view>
        </view>
      </view>
    </view>
    
    <view class="rules-section">
      <text class="section-title">推广规则</text>
      <view class="rules-list">
        <text class="rule-item">1. 推广员需完成实名认证</text>
        <text class="rule-item">2. 推广订单需为用户首次下单</text>
        <text class="rule-item">3. 佣金在订单完成后结算</text>
        <text class="rule-item">4. 提现需审核，审核通过后3-5个工作日到账</text>
      </view>
    </view>
    
    <button class="submit-button" @click="handleSubmit" :disabled="submitting">
      {{ submitting ? '申请中...' : '立即申请' }}
    </button>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { applyToBecomeDistributor } from '../../../utils/cloud/distributionApi.js'

// getApp is available globally in WeChat Mini Program runtime (no import needed)
// eslint-disable-next-line no-undef
const getAppInstance = () => (typeof getApp !== 'undefined' ? getApp() : { globalData: {} })

const submitting = ref(false)

const user = computed(() => getAppInstance().globalData.user || {})

async function handleSubmit() {
  if (submitting.value) return
  
  submitting.value = true
  
  try {
    // Determine distributor type based on user role
    let distributorType = 'parent'
    if (user.value.role === 'teacher' || user.value.roles?.includes('teacher')) {
      distributorType = 'teacher'
    }
    
    const result = await applyToBecomeDistributor({
      distributorType,
      description: `申请成为${distributorType === 'teacher' ? '教师' : '家长'}推广员`
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
    console.error('Apply distributor error:', error)
    uni.showToast({
      title: error.message || '申请失败',
      icon: 'none'
    })
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.apply-distributor {
  padding: 20rpx;
  min-height: 100vh;
  background-color: transparent; /* Inherit paper texture */
}

.info-section, .rules-section {
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

.benefit-list {
  display: flex;
  flex-direction: column;
  gap: 30rpx;
}

.benefit-item {
  display: flex;
  gap: 20rpx;
  align-items: flex-start;
}

.benefit-icon {
  font-size: 48rpx;
  flex-shrink: 0;
}

.benefit-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

.benefit-title {
  font-size: 28rpx;
  font-weight: bold;
}

.benefit-desc {
  font-size: 26rpx;
  color: #666;
  line-height: 1.5;
}

.rules-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.rule-item {
  font-size: 26rpx;
  color: #666;
  line-height: 1.6;
  padding-left: 20rpx;
}

.submit-button {
  width: 100%;
  background: #4A90E2;
  color: white;
  border-radius: 8rpx;
  padding: 30rpx;
  font-size: 32rpx;
  margin-top: 40rpx;
}

.submit-button[disabled] {
  background: #ccc;
}
</style>
