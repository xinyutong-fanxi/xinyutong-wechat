<template>
  <view class="empty-state" :class="{ 'compact': compact }">
    <view class="empty-icon" v-if="showIcon">{{ icon || '📭' }}</view>
    <text class="empty-title" v-if="title">{{ title }}</text>
    <text class="empty-text" v-if="text">{{ text }}</text>
    <view class="empty-action" v-if="$slots.action">
      <slot name="action"></slot>
    </view>
  </view>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: '暂无数据'
  },
  text: {
    type: String,
    default: null
  },
  icon: {
    type: String,
    default: null
  },
  showIcon: {
    type: Boolean,
    default: true
  },
  compact: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100rpx 40rpx;
  text-align: center;
}

.empty-state.compact {
  padding: 60rpx 40rpx;
}

.empty-icon {
  font-size: 120rpx;
  margin-bottom: 30rpx;
  opacity: 0.6;
}

.empty-state.compact .empty-icon {
  font-size: 80rpx;
  margin-bottom: 20rpx;
}

.empty-title {
  font-size: 32rpx;
  color: #333;
  font-weight: bold;
  margin-bottom: 15rpx;
  display: block;
}

.empty-state.compact .empty-title {
  font-size: 28rpx;
  margin-bottom: 10rpx;
}

.empty-text {
  font-size: 26rpx;
  color: #999;
  line-height: 1.6;
  display: block;
  margin-bottom: 30rpx;
}

.empty-state.compact .empty-text {
  font-size: 24rpx;
  margin-bottom: 20rpx;
}

.empty-action {
  margin-top: 20rpx;
}
</style>
