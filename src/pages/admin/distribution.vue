<template>
  <view class="admin-distribution">
    <view class="config-section">
      <text class="section-title">佣金配置</text>
      <view class="config-item">
        <text class="config-label">一级推广佣金率 (%)</text>
        <input 
          v-model.number="config.level1Rate" 
          type="digit" 
          placeholder="例如: 10"
          class="config-input"
        />
      </view>
      <view class="config-item">
        <text class="config-label">二级推广佣金率 (%)</text>
        <input 
          v-model.number="config.level2Rate" 
          type="digit" 
          placeholder="例如: 5"
          class="config-input"
        />
      </view>
      <view class="config-item">
        <text class="config-label">平台佣金率 (%)</text>
        <input 
          v-model.number="config.platformRate" 
          type="digit" 
          placeholder="例如: 30"
          class="config-input"
        />
      </view>
      <button class="save-button" @click="saveConfig" :disabled="saving">
        {{ saving ? '保存中...' : '保存配置' }}
      </button>
    </view>
    
    <view class="stats-section">
      <text class="section-title">推广统计</text>
      <view class="stats-grid">
        <view class="stat-card">
          <text class="stat-value">{{ totalDistributors }}</text>
          <text class="stat-label">推广员总数</text>
        </view>
        <view class="stat-card">
          <text class="stat-value">{{ totalReferrals }}</text>
          <text class="stat-label">推广人数</text>
        </view>
        <view class="stat-card">
          <MoneyDisplay :amount="totalCommissions" :size="'normal'" />
          <text class="stat-label">总佣金</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import MoneyDisplay from '../../components/shared/MoneyDisplay.vue'
import { configureDistribution, getDistributionConfig, getDistributionStats } from '../../utils/cloud/adminApi.js'

const saving = ref(false)
const loading = ref(false)
const config = ref({
  level1Rate: 10,
  level2Rate: 5,
  platformRate: 30
})

const totalDistributors = ref(0)
const totalReferrals = ref(0)
const totalCommissions = ref(0) // in cents

async function loadConfig() {
  loading.value = true
  try {
    const configResult = await getDistributionConfig()
    if (configResult.config) {
      config.value = {
        level1Rate: configResult.config.level1Rate || 10,
        level2Rate: configResult.config.level2Rate || 5,
        platformRate: configResult.config.platformRate || 30
      }
    }
    
    const statsResult = await getDistributionStats()
    if (statsResult) {
      totalDistributors.value = statsResult.totalDistributors || 0
      totalReferrals.value = statsResult.totalReferrals || 0
      totalCommissions.value = statsResult.totalCommissions || 0
    }
  } catch (error) {
    console.error('Failed to load distribution config:', error)
    uni.showToast({
      title: '加载失败',
      icon: 'none'
    })
  } finally {
    loading.value = false
  }
}

async function saveConfig() {
  // Validate input
  if (config.value.level1Rate < 0 || config.value.level1Rate > 100) {
    uni.showToast({ title: '一级佣金率必须在0-100之间', icon: 'none' })
    return
  }
  
  if (config.value.level2Rate < 0 || config.value.level2Rate > 100) {
    uni.showToast({ title: '二级佣金率必须在0-100之间', icon: 'none' })
    return
  }
  
  if (config.value.platformRate < 0 || config.value.platformRate > 100) {
    uni.showToast({ title: '平台佣金率必须在0-100之间', icon: 'none' })
    return
  }
  
  if (config.value.level2Rate > config.value.level1Rate) {
    uni.showToast({ title: '二级佣金率不能大于一级佣金率', icon: 'none' })
    return
  }
  
  saving.value = true
  
  try {
    const result = await configureDistribution({
      level1Rate: config.value.level1Rate,
      level2Rate: config.value.level2Rate,
      platformRate: config.value.platformRate
    })
    
    if (result.error) {
      throw new Error(result.message || '保存失败')
    }
    
    uni.showToast({ title: '保存成功', icon: 'success' })
  } catch (error) {
    console.error('Failed to save distribution config:', error)
    uni.showToast({
      title: error.message || '保存失败',
      icon: 'none'
    })
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  loadConfig()
})
</script>

<style scoped>
.admin-distribution {
  padding: 20rpx;
  min-height: 100vh;
  background-color: #F2F2F2;
}

.config-section, .stats-section {
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

.config-item {
  margin-bottom: 30rpx;
}

.config-label {
  font-size: 28rpx;
  color: #333;
  display: block;
  margin-bottom: 15rpx;
}

.config-input {
  width: 100%;
  font-size: 32rpx;
  padding: 20rpx;
  background: #F2F2F2;
  border-radius: 8rpx;
}

.save-button {
  width: 100%;
  background: #4A90E2;
  color: white;
  border-radius: 8rpx;
  padding: 30rpx;
  font-size: 32rpx;
  margin-top: 20rpx;
}

.save-button[disabled] {
  background: #ccc;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20rpx;
}

.stat-card {
  background: #F2F2F2;
  border-radius: 12rpx;
  padding: 30rpx;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

.stat-value {
  font-size: 32rpx;
  font-weight: bold;
  color: #4A90E2;
}

.stat-label {
  font-size: 24rpx;
  color: #666;
}
</style>
