<template>
  <view class="admin-settings">
    <view class="menu-section">
      <view class="menu-item" @click="handleSystemConfig">
        <text class="menu-label">{{ $t('admin.settings.systemConfig') }}</text>
        <text class="arrow">></text>
      </view>
      <view class="menu-item" @click="handlePlatformRates">
        <text class="menu-label">{{ $t('admin.settings.platformRates') }}</text>
        <text class="arrow">></text>
      </view>
      <view class="menu-item" @click="handleDataExport">
        <text class="menu-label">{{ $t('admin.settings.dataExport') }}</text>
        <text class="arrow">></text>
      </view>
    </view>
    
    <view class="menu-section">
      <view class="menu-item">
        <text class="menu-label">{{ $t('language.title') }}</text>
        <LanguageSwitcher />
      </view>
      <view class="menu-item" @click="handleAbout">
        <text class="menu-label">{{ $t('admin.settings.aboutSystem') }}</text>
        <text class="arrow">></text>
      </view>
    </view>
    
    <button class="logout-button" @click="handleLogout">
      {{ $t('admin.settings.logout') }}
    </button>
  </view>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import LanguageSwitcher from '../../components/shared/LanguageSwitcher.vue'

const { t } = useI18n()

function handleSystemConfig() {
  uni.showToast({ title: t('admin.settings.systemConfigDeveloping'), icon: 'none' })
}

function handlePlatformRates() {
  uni.showToast({ title: t('admin.settings.ratesDeveloping'), icon: 'none' })
}

function handleDataExport() {
  uni.showToast({ title: t('admin.settings.exportDeveloping'), icon: 'none' })
}

function handleAbout() {
  uni.showModal({
    title: t('admin.settings.aboutSystem'),
    content: t('admin.settings.aboutContent'),
    showCancel: false
  })
}

function handleLogout() {
  uni.showModal({
    title: t('admin.settings.confirmLogout'),
    content: t('admin.settings.logoutMessage'),
    success: (res) => {
      if (res.confirm) {
        // TODO: Clear admin session and logout
        uni.reLaunch({ url: '/pages/onboarding/register' })
      }
    }
  })
}
</script>

<style scoped>
.admin-settings {
  padding: 20rpx;
  min-height: 100vh;
  background-color: #F2F2F2;
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
