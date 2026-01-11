<template>
  <text :class="classNames">{{ formattedAmount }}</text>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  amount: {
    type: Number,
    required: true,
    default: 0
  },
  size: {
    type: String,
    default: 'normal' // 'small' | 'normal' | 'large'
  },
  color: {
    type: String,
    default: 'default' // 'default' | 'primary' | 'warning'
  },
  showSymbol: {
    type: Boolean,
    default: true
  }
})

const formattedAmount = computed(() => {
  const yuan = (props.amount / 100).toFixed(2)
  return props.showSymbol ? `￥${yuan}` : yuan
})

const classNames = computed(() => {
  const classes = ['money-display']
  if (props.size === 'small') classes.push('size-small')
  if (props.size === 'large') classes.push('size-large')
  if (props.color === 'primary') classes.push('color-primary')
  if (props.color === 'warning') classes.push('color-warning')
  return classes.join(' ')
})
</script>

<style scoped>
.money-display {
  font-weight: bold;
  color: #ff6600;
}

.size-small {
  font-size: 24rpx;
}

.size-normal {
  font-size: 28rpx;
}

.size-large {
  font-size: 36rpx;
}

.color-primary {
  color: #4A90E2;
}

.color-warning {
  color: #ff6600;
}
</style>
