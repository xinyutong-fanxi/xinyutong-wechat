<template>
  <slot v-if="hasAccess" />
  <view v-else class="unauthorized-message">
    <text class="message">无权限访问</text>
    <button class="back-button" @click="goBack">返回</button>
  </view>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { hasRole, redirectToLogin } from '../../utils/auth'

// getApp is available globally in WeChat Mini Program runtime (no import needed)
// eslint-disable-next-line no-undef
const getAppInstance = () => (typeof getApp !== 'undefined' ? getApp() : { globalData: {} })

const props = defineProps({
  requiredRoles: {
    type: [String, Array],
    required: true
  },
  redirectOnUnauthorized: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['unauthorized'])

const user = computed(() => getAppInstance().globalData.user || {})

const hasAccess = computed(() => {
  const roles = Array.isArray(props.requiredRoles) ? props.requiredRoles : [props.requiredRoles]
  return hasRole(user.value, roles[0]) || roles.some(role => hasRole(user.value, role))
})

function goBack() {
  uni.navigateBack()
}

onMounted(() => {
  if (!hasAccess.value) {
    emit('unauthorized')
    if (props.redirectOnUnauthorized) {
      const roles = Array.isArray(props.requiredRoles) ? props.requiredRoles : [props.requiredRoles]
      redirectToLogin(roles[0] || 'parent')
    }
  }
})
</script>

<style scoped>
.unauthorized-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 40rpx;
  gap: 40rpx;
}

.message {
  font-size: 32rpx;
  color: #666;
}

.back-button {
  padding: 20rpx 40rpx;
  background: #D60000;
  color: white;
  border-radius: 8rpx;
  font-size: 28rpx;
}
</style>
