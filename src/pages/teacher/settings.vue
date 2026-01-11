<template>
  <view class="teacher-settings">
    <view class="menu-section">
      <view class="menu-item" @click="navigateTo('/pages/teacher/profile')">
        <text class="menu-label">{{ $t('teacher.settings.profile') }}</text>
        <text class="arrow">></text>
      </view>
      <view class="menu-item" @click="navigateTo('/pages/teacher/schedule')">
        <text class="menu-label">{{ $t('teacher.settings.schedule') }}</text>
        <text class="arrow">></text>
      </view>
      <view class="menu-item" @click="navigateTo('/pages/teacher/earnings')">
        <text class="menu-label">{{ $t('teacher.settings.earnings') }}</text>
        <text class="arrow">></text>
      </view>
      <view class="menu-item" @click="navigateTo('/pages/teacher/distribution')">
        <text class="menu-label">{{ $t('teacher.settings.distribution') }}</text>
        <text class="arrow">></text>
      </view>
    </view>
    
    <view class="menu-section">
      <view class="menu-item">
        <text class="menu-label">{{ $t('language.title') }}</text>
        <LanguageSwitcher />
      </view>
      <view class="menu-item" @click="handleAbout">
        <text class="menu-label">{{ $t('teacher.settings.aboutUs') }}</text>
        <text class="arrow">></text>
      </view>
      <view class="menu-item" @click="handleHelp">
        <text class="menu-label">{{ $t('teacher.settings.helpCenter') }}</text>
        <text class="arrow">></text>
      </view>
    </view>
    
    <button class="logout-button" @click="handleLogout">
      {{ $t('teacher.settings.logout') }}
    </button>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import LanguageSwitcher from '../../components/shared/LanguageSwitcher.vue'

const { t } = useI18n()

function navigateTo(url) {
  uni.navigateTo({ url })
}

function handleAbout() {
  uni.showModal({
    title: t('teacher.settings.aboutUs'),
    content: t('parent.settings.aboutContent'),
    showCancel: false
  })
}

function handleHelp() {
  uni.showToast({ title: t('parent.settings.helpDeveloping'), icon: 'none' })
}

function handleLogout() {
  uni.showModal({
    title: t('teacher.settings.confirmLogout'),
    content: t('teacher.settings.logoutMessage'),
    success: (res) => {
      if (res.confirm) {
        // TODO: Clear user data and logout
        uni.reLaunch({ url: '/pages/onboarding/register' })
      }
    }
  })
}
</script>

<style scoped>
.teacher-settings {
  padding: 20rpx;
  min-height: 100vh;
  background-color: transparent; /* Inherit paper texture */
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
