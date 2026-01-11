<template>
  <view class="settings-page">
    <view class="user-section">
      <image :src="userProfile.avatarUrl" class="avatar" mode="aspectFill" />
      <text class="nickname">{{ userProfile.nickname || $t('common.notSet') }}</text>
      <text class="phone">{{ userProfile.phone || $t('common.notBound') }}</text>
    </view>
    
    <view class="menu-section">
      <view class="menu-item" @click="navigateTo('/pages/parent/students')">
        <text class="menu-label">{{ $t('parent.settings.studentManagement') }}</text>
        <text class="arrow">></text>
      </view>
      <view class="menu-item" @click="navigateTo('/pages/parent/distribution')">
        <text class="menu-label">{{ $t('parent.settings.distributionCenter') }}</text>
        <text class="arrow">></text>
      </view>
      <view class="menu-item" @click="navigateTo('/pages/parent/payments')">
        <text class="menu-label">{{ $t('parent.settings.paymentHistory') }}</text>
        <text class="arrow">></text>
      </view>
    </view>
    
    <view class="menu-section">
      <view class="menu-item">
        <text class="menu-label">{{ $t('language.title') }}</text>
        <LanguageSwitcher />
      </view>
      <view class="menu-item" @click="handleAbout">
        <text class="menu-label">{{ $t('parent.settings.aboutUs') }}</text>
        <text class="arrow">></text>
      </view>
      <view class="menu-item" @click="handleHelp">
        <text class="menu-label">{{ $t('parent.settings.helpCenter') }}</text>
        <text class="arrow">></text>
      </view>
    </view>
    
    <button class="logout-button" @click="handleLogout">
      {{ $t('parent.settings.logout') }}
    </button>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import LanguageSwitcher from '../../components/shared/LanguageSwitcher.vue'

const { t } = useI18n()

const userProfile = ref({
  avatarUrl: '',
  nickname: '',
  phone: ''
})

function navigateTo(url) {
  uni.navigateTo({ url })
}

function handleAbout() {
  uni.showModal({
    title: t('parent.settings.aboutTitle'),
    content: t('parent.settings.aboutContent'),
    showCancel: false
  })
}

function handleHelp() {
  uni.showToast({ title: t('parent.settings.helpDeveloping'), icon: 'none' })
}

function handleLogout() {
  uni.showModal({
    title: t('parent.settings.confirmLogout'),
    content: t('parent.settings.logoutMessage'),
    success: (res) => {
      if (res.confirm) {
        // TODO: Clear user data and logout
        uni.reLaunch({ url: '/pages/onboarding/register' })
      }
    }
  })
}

onMounted(() => {
  // TODO: Load user profile
})
</script>

<style scoped>
.settings-page {
  padding: 20rpx;
  min-height: 100vh;
  background-color: #F2F2F2;
}

.user-section {
  background: white;
  border-radius: 16rpx;
  padding: 40rpx;
  text-align: center;
  margin-bottom: 30rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20rpx;
}

.avatar {
  width: 150rpx;
  height: 150rpx;
  border-radius: 75rpx;
}

.nickname {
  font-size: 36rpx;
  font-weight: bold;
}

.phone {
  font-size: 28rpx;
  color: #666;
}

.menu-section {
  background: white;
  border-radius: 16rpx;
  margin-bottom: 20rpx;
  overflow: hidden;
}

.menu-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-label {
  font-size: 32rpx;
  color: #333;
}

.arrow {
  font-size: 32rpx;
  color: #ccc;
}

.logout-button {
  width: 100%;
  background: #ff3b30;
  color: white;
  border-radius: 8rpx;
  padding: 30rpx;
  font-size: 32rpx;
  margin-top: 40rpx;
}
</style>
