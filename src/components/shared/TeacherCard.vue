<template>
  <view class="teacher-card" @click="handleClick">
    <image :src="teacher.avatarUrl || '/static/default-avatar.png'" class="teacher-avatar" mode="aspectFill" />
    <view class="teacher-info">
      <view class="teacher-header">
        <text class="teacher-name">{{ teacher.name }}</text>
        <view class="teacher-badges" v-if="teacher.credentials && teacher.credentials.certificates.length > 0">
          <text class="badge">认证</text>
        </view>
      </view>
      <text class="teacher-title">{{ teacher.title || '咨询师' }}</text>
      <view class="teacher-tags" v-if="teacher.expertise && teacher.expertise.length > 0">
        <text 
          class="tag" 
          v-for="(exp, index) in teacher.expertise.slice(0, 3)" 
          :key="index"
        >
          {{ exp }}
        </text>
      </view>
      <view class="teacher-stats">
        <view class="stat-item">
          <text class="stat-label">评分</text>
          <text class="stat-value">{{ teacher.rating || 0 }}</text>
        </view>
        <view class="stat-item">
          <text class="stat-label">已服务</text>
          <text class="stat-value">{{ teacher.totalSessions || 0 }}次</text>
        </view>
        <view class="stat-item price">
          <text class="stat-value">
            <MoneyDisplay :amount="teacher.pricePerHour || 0" :size="'small'" />
          </text>
          <text class="stat-label">/小时</text>
        </view>
      </view>
    </view>
    <text class="arrow">></text>
  </view>
</template>

<script setup>
import MoneyDisplay from './MoneyDisplay.vue'

const props = defineProps({
  teacher: {
    type: Object,
    required: true,
    default: () => ({})
  }
})

const emit = defineEmits(['click'])

function handleClick() {
  emit('click', props.teacher)
}
</script>

<style scoped>
.teacher-card {
  background: white;
  border-radius: 16rpx;
  padding: 30rpx;
  display: flex;
  gap: 20rpx;
  align-items: flex-start;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05);
  margin-bottom: 20rpx;
}

.teacher-avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 60rpx;
  flex-shrink: 0;
  background: transparent; /* Inherit paper texture */
}

.teacher-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

.teacher-header {
  display: flex;
  align-items: center;
  gap: 10rpx;
}

.teacher-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.teacher-badges {
  display: flex;
  gap: 8rpx;
}

.badge {
  font-size: 20rpx;
  color: #D60000;
  background: #e6f3ff;
  padding: 4rpx 10rpx;
  border-radius: 6rpx;
}

.teacher-title {
  font-size: 26rpx;
  color: #666;
}

.teacher-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10rpx;
}

.tag {
  font-size: 22rpx;
  color: #D60000;
  background: #e6f3ff;
  padding: 4rpx 12rpx;
  border-radius: 8rpx;
}

.teacher-stats {
  display: flex;
  gap: 20rpx;
  margin-top: 10rpx;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.stat-item.price {
  margin-left: auto;
  align-items: flex-end;
}

.stat-label {
  font-size: 22rpx;
  color: #999;
}

.stat-value {
  font-size: 26rpx;
  color: #333;
  font-weight: bold;
}

.stat-item.price .stat-value {
  color: #ff6600;
}

.arrow {
  font-size: 32rpx;
  color: #ccc;
  align-self: center;
}
</style>
