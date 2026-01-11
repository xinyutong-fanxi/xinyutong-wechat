<template>
  <view class="page">
    <view class="header">
      <view class="hero">
        <view class="hero-text">
          <text class="title">{{ $t('waitConsent.title') }}</text>
          <text class="subtitle">{{ $t('waitConsent.subtitle') }}</text>
        </view>
        <image class="hero-img" src="/static/mascot-star.svg" mode="aspectFit" />
      </view>
    </view>

    <view class="code-card">
      <text class="code-label">{{ $t('waitConsent.pairingCode') }}</text>
      <text class="code">{{ pairingCode }}</text>
      <button class="ghost" @click="copyCode">{{ $t('waitConsent.copyCode') }}</button>
    </view>

    <view class="card">
      <text class="muted">
        {{ $t('waitConsent.description') }}
      </text>
    </view>

    <view class="footer">
      <button class="primary" :disabled="checking" @click="checkStatus">{{ $t('waitConsent.iHaveConsented') }}</button>
      <button class="ghost" open-type="share">{{ $t('waitConsent.shareToGuardian') }}</button>
      <button class="ghost" @click="goParent">{{ $t('waitConsent.goToParent') }}</button>
    </view>
  </view>
</template>

<script>
import { getChildOnboardingStatus } from '../../utils/cloud/onboardingApi'

export default {
  data() {
    return {
      pairingCode: '',
      checking: false
    }
  },
  onLoad(query) {
    this.pairingCode = (query && query.code) || uni.getStorageSync('local_pairing_code') || ''
  },
  onShareAppMessage() {
    const code = String(this.pairingCode || '').trim()
    const safeCode = encodeURIComponent(code)
    const title = code 
      ? this.$t('waitConsent.shareTitle').replace('{code}', code)
      : this.$t('waitConsent.shareTitleNoCode')
    return {
      title,
      path: code ? `pages/parent/dashboard?code=${safeCode}` : 'pages/parent/dashboard'
    }
  },
  methods: {
    copyCode() {
      const code = String(this.pairingCode || '').trim()
      if (!code) return
      uni.setClipboardData({
        data: code,
        success: () => uni.showToast({ title: this.$t('waitConsent.copied'), icon: 'none' })
      })
    },
    goParent() {
      const code = String(this.pairingCode || '').trim()
      const q = code ? `?code=${encodeURIComponent(code)}` : ''
      uni.navigateTo({ url: `/pages/parent/dashboard${q}` })
    },
    async checkStatus() {
      if (this.checking) return
      this.checking = true
      try {
        const st = await getChildOnboardingStatus()
        if (st && st.hasProfile && st.hasParentConsent) {
          uni.reLaunch({ url: '/pages/index/index' })
          return
        }
        uni.showToast({ title: this.$t('waitConsent.notConsentedYet'), icon: 'none' })
      } catch (e) {
        uni.showToast({ title: this.$t('waitConsent.checkFailed'), icon: 'none' })
      } finally {
        this.checking = false
      }
    }
  }
}
</script>

<style>
.page {
  min-height: 100vh;
  padding: 24rpx;
  box-sizing: border-box;
  background: transparent; /* Inherit paper texture */
  transition: background 0.3s ease;
}
.header {
  padding: 8rpx 0 16rpx;
}
.hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16rpx;
  padding: 16rpx 18rpx;
  border-radius: 24rpx;
  background: rgba(255, 255, 255, 0.85);
  border: 1.5px solid rgba(147, 197, 253, 0.6);
  box-shadow: 0 8rpx 32rpx rgba(59, 130, 246, 0.15), 0 2rpx 8rpx rgba(59, 130, 246, 0.1);
  backdrop-filter: blur(12px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.hero:active {
  transform: scale(0.98);
  box-shadow: 0 4rpx 16rpx rgba(59, 130, 246, 0.12);
}
.hero-text {
  flex: 1;
}
.hero-img {
  width: 150rpx;
  height: 120rpx;
  flex-shrink: 0;
  border-radius: 20rpx;
  overflow: hidden;
  transition: transform 0.3s ease;
}
.hero-img:active {
  transform: scale(0.95);
}
.title {
  font-size: 38rpx;
  font-weight: 700;
  color: #323232;
  letter-spacing: -0.5rpx;
  transition: color 0.2s ease;
}
.subtitle {
  display: block;
  margin-top: 10rpx;
  font-size: 26rpx;
  color: #666;
  line-height: 1.6;
}
.code-card {
  background: rgba(255, 255, 255, 0.95);
  border: 1.5px solid rgba(199, 210, 254, 0.5);
  border-radius: 24rpx;
  padding: 24rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18rpx;
  box-shadow: 0 8rpx 32rpx rgba(17, 24, 39, 0.1), inset 0 1rpx 0 rgba(255, 255, 255, 0.8);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.code-card:active {
  transform: translateY(-2rpx);
  box-shadow: 0 12rpx 40rpx rgba(17, 24, 39, 0.12), inset 0 1rpx 0 rgba(255, 255, 255, 0.8);
}
.code-label {
  font-size: 26rpx;
  color: #666;
  font-weight: 500;
}
.code {
  font-size: 44rpx;
  font-weight: 700;
  color: #4A90E2;
  letter-spacing: 6rpx;
  transition: color 0.2s ease;
}
.card {
  background: rgba(255, 255, 255, 0.95);
  border: 1.5px solid rgba(199, 210, 254, 0.5);
  border-radius: 24rpx;
  padding: 22rpx;
  margin-bottom: 18rpx;
  box-shadow: 0 8rpx 32rpx rgba(17, 24, 39, 0.1), inset 0 1rpx 0 rgba(255, 255, 255, 0.8);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.card:active {
  transform: translateY(-2rpx);
  box-shadow: 0 12rpx 40rpx rgba(17, 24, 39, 0.12), inset 0 1rpx 0 rgba(255, 255, 255, 0.8);
}
.muted {
  color: #666;
  font-size: 26rpx;
  line-height: 1.6;
}
.footer {
  margin-top: 12rpx;
  display: flex;
  gap: 14rpx;
  flex-direction: column;
}
.primary {
  flex: 1;
  background: #4A90E2;
  color: #fff;
  border-radius: 24rpx;
  height: 88rpx;
  line-height: 88rpx;
  font-size: 28rpx;
  font-weight: 600;
  box-shadow: 0 8rpx 24rpx rgba(74, 144, 226, 0.3);
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  border: none;
}
.primary:active {
  transform: scale(0.96);
  box-shadow: 0 4rpx 12rpx rgba(74, 144, 226, 0.25);
}
.primary[disabled] {
  background: #ccc;
  color: rgba(255, 255, 255, 0.7);
  box-shadow: none;
  transform: none;
}
.ghost {
  flex: 1;
  background: rgba(255, 255, 255, 0.9);
  color: #4A90E2;
  border: 2px solid #4A90E2;
  border-radius: 24rpx;
  height: 88rpx;
  line-height: 88rpx;
  font-size: 26rpx;
  font-weight: 600;
  box-shadow: 0 4rpx 12rpx rgba(74, 144, 226, 0.1);
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
.ghost:active {
  transform: scale(0.96);
  background: rgba(74, 144, 226, 0.1);
  border-color: #4A90E2;
  box-shadow: 0 2rpx 6rpx rgba(74, 144, 226, 0.15);
}
</style>

