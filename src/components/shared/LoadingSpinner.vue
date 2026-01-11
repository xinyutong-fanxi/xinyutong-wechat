<template>
  <view class="loading-spinner" :class="{ 'inline': inline, 'fullscreen': fullscreen }">
    <view class="spinner" :class="sizeClass">
      <view class="spinner-circle"></view>
      <view class="spinner-circle"></view>
      <view class="spinner-circle"></view>
    </view>
    <text v-if="text" class="loading-text">{{ text }}</text>
  </view>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  size: {
    type: String,
    default: 'normal' // 'small' | 'normal' | 'large'
  },
  inline: {
    type: Boolean,
    default: false
  },
  fullscreen: {
    type: Boolean,
    default: false
  },
  text: {
    type: String,
    default: '加载中...'
  }
})

const sizeClass = computed(() => {
  return `size-${props.size}`
})
</script>

<style scoped>
.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20rpx;
  padding: 40rpx;
}

.loading-spinner.inline {
  padding: 20rpx;
}

.loading-spinner.fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  z-index: 9999;
}

.spinner {
  display: flex;
  gap: 8rpx;
  align-items: center;
  justify-content: center;
}

.spinner-circle {
  width: 12rpx;
  height: 12rpx;
  border-radius: 50%;
  background: #D60000;
  animation: bounce 1.4s infinite ease-in-out both;
}

.spinner-circle:nth-child(1) {
  animation-delay: -0.32s;
}

.spinner-circle:nth-child(2) {
  animation-delay: -0.16s;
}

.spinner-circle:nth-child(3) {
  animation-delay: 0s;
}

.size-small .spinner-circle {
  width: 8rpx;
  height: 8rpx;
}

.size-large .spinner-circle {
  width: 16rpx;
  height: 16rpx;
}

.loading-text {
  font-size: 26rpx;
  color: #666;
}

@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  40% {
    transform: scale(1.2);
    opacity: 1;
  }
}
</style>
