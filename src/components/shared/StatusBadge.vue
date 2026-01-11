<template>
  <text :class="badgeClasses">{{ displayText }}</text>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: {
    type: String,
    required: true
  },
  size: {
    type: String,
    default: 'normal' // 'small' | 'normal' | 'large'
  },
  text: {
    type: String,
    default: null // If provided, use this text instead of default mapping
  }
})

// Status text mapping
const statusTextMap = {
  // Booking statuses
  pending: '待确认',
  confirmed: '已确认',
  completed: '已完成',
  cancelled: '已取消',
  
  // Payment statuses
  unpaid: '待支付',
  paid: '已支付',
  failed: '支付失败',
  refunded: '已退款',
  
  // Teacher statuses
  approved: '已通过',
  rejected: '已拒绝',
  suspended: '已暂停',
  
  // Distributor statuses
  none: '未申请',
  
  // Withdrawal statuses
  approved: '已批准',
  rejected: '已拒绝',
  completed: '已完成'
}

const displayText = computed(() => {
  return props.text || statusTextMap[props.status] || props.status
})

const badgeClasses = computed(() => {
  const classes = ['status-badge', `status-${props.status}`]
  if (props.size === 'small') classes.push('size-small')
  if (props.size === 'large') classes.push('size-large')
  return classes.join(' ')
})
</script>

<style scoped>
.status-badge {
  font-size: 24rpx;
  padding: 6rpx 16rpx;
  border-radius: 12rpx;
  display: inline-block;
}

.size-small {
  font-size: 20rpx;
  padding: 4rpx 12rpx;
}

.size-large {
  font-size: 28rpx;
  padding: 8rpx 20rpx;
}

/* Booking statuses - Minimalist grayscale with red for errors */
.status-badge.status-pending {
  background: rgba(229, 231, 235, 0.8);
  color: #323232;
}

.status-badge.status-confirmed {
  background: rgba(229, 231, 235, 0.8);
  color: #323232;
}

.status-badge.status-completed {
  background: rgba(229, 231, 235, 0.8);
  color: #323232;
}

.status-badge.status-cancelled {
  background: rgba(214, 0, 0, 0.1);
  color: #D60000;
}

/* Payment statuses */
.status-badge.status-unpaid {
  background: rgba(229, 231, 235, 0.8);
  color: #323232;
}

.status-badge.status-paid {
  background: rgba(229, 231, 235, 0.8);
  color: #323232;
}

.status-badge.status-failed {
  background: rgba(214, 0, 0, 0.1);
  color: #D60000;
}

.status-badge.status-refunded {
  background: rgba(229, 231, 235, 0.8);
  color: #323232;
}

/* Teacher statuses */
.status-badge.status-approved {
  background: rgba(229, 231, 235, 0.8);
  color: #323232;
}

.status-badge.status-rejected {
  background: rgba(214, 0, 0, 0.1);
  color: #D60000;
}

.status-badge.status-suspended {
  background: rgba(214, 0, 0, 0.1);
  color: #D60000;
}

/* Distributor statuses */
.status-badge.status-none {
  background: rgba(229, 231, 235, 0.8);
  color: #323232;
}
</style>
