<template>
  <view class="page">
    <view class="header">
      <view class="hero">
        <view class="hero-text">
          <text class="title">{{ $t('dashboard.title') }}</text>
          <text class="subtitle">{{ $t('dashboard.subtitle') }}</text>
        </view>
        <image class="hero-img" src="/static/mascot-star.svg" mode="aspectFit" />
      </view>
    </view>

    <view class="card">
      <text class="card-title">{{ $t('dashboard.guardianConsent') }}</text>
      <view class="field">
        <text class="muted">{{ $t('dashboard.pairingCodeLabel') }}</text>
        <input class="input" v-model="pairingCode" :placeholder="$t('dashboard.pairingCodePlaceholder')" />
      </view>
      <view class="field">
        <text class="muted">{{ $t('dashboard.relationshipLabel') }}</text>
        <input class="input" v-model="relationship" :placeholder="$t('dashboard.relationshipPlaceholder')" />
      </view>
      <view class="field row">
        <checkbox-group @change="onConsentChange">
          <label class="checkbox-label">
            <checkbox :checked="consentChecked" />
            <text class="muted">{{ $t('dashboard.consentCheckbox') }}</text>
          </label>
        </checkbox-group>
      </view>
      <button class="primary" :disabled="submitting" @click="submitConsent">{{ $t('dashboard.confirmConsent') }}</button>
    </view>

    <view class="card">
      <text class="card-title">{{ $t('dashboard.stressTrend') }}</text>
      <view class="chart-placeholder">
        <text class="muted">{{ $t('dashboard.chartPlaceholder') }}</text>
      </view>
    </view>

    <view class="card">
      <text class="card-title">{{ $t('dashboard.teacherMatch') }}</text>
      <view class="row">
        <text class="pill">{{ $t('dashboard.fastSpeech') }}</text>
        <text class="pill">{{ $t('dashboard.loudVoice') }}</text>
        <text class="pill">{{ $t('dashboard.homeworkPressure') }}</text>
      </view>
      <text class="muted" style="margin-top: 12rpx">
        {{ $t('dashboard.matchSuggestion') }}
      </text>
    </view>

    <view class="card">
      <text class="card-title">{{ $t('dashboard.riskAlerts') }}</text>
      <text class="muted">{{ $t('dashboard.riskAlertsDesc') }}</text>
    </view>

    <view class="footer">
      <button class="primary" @click="onEnableNotifications">{{ $t('dashboard.enableNotifications') }}</button>
      <button class="ghost" @click="onVerify">{{ $t('dashboard.verifyIdentity') }}</button>
    </view>
  </view>
</template>

<script>
import { parentConsentComplete } from '../../utils/cloud/onboardingApi'

export default {
  data() {
    return {
      pairingCode: '',
      relationship: '',
      consentChecked: false,
      submitting: false
    }
  },
  onLoad(query) {
    const code = (query && query.code) || ''
    if (code) this.pairingCode = String(code).trim()
  },
  methods: {
    onConsentChange(e) {
      const v = e && e.detail && e.detail.value
      this.consentChecked = Array.isArray(v) ? v.length > 0 : !this.consentChecked
    },
    async submitConsent() {
      if (this.submitting) return
      const code = (this.pairingCode || '').trim()
      if (!code) {
        uni.showToast({ title: this.$t('dashboard.fillPairingCode'), icon: 'none' })
        return
      }
      if (!this.consentChecked) {
        uni.showToast({ title: this.$t('dashboard.checkConsent'), icon: 'none' })
        return
      }

      this.submitting = true
      try {
        // Default to 'guardian' if not set, will be mapped on backend
        const relationshipMap = {
          '妈妈': 'mother',
          '爸爸': 'father',
          '监护人': 'guardian',
          '其他': 'other'
        }
        const rel = (this.relationship || '').trim() || '监护人'
        
        const res = await parentConsentComplete({
          pairingCode: code,
          relationship: rel,
          consentChecked: this.consentChecked
        })
        if (res && res.ok) {
          uni.showToast({ title: this.$t('dashboard.consentSuccess'), icon: 'none' })
          return
        }
        uni.showToast({ title: this.$t('dashboard.consentFailed'), icon: 'none' })
      } catch (e) {
        uni.showToast({ title: this.$t('dashboard.consentFailed'), icon: 'none' })
      } finally {
        this.submitting = false
      }
    },
    onEnableNotifications() {
      // TODO: Implement WeChat subscribe-message consent flow.
      uni.showToast({ title: this.$t('dashboard.notificationsDeveloping'), icon: 'none' })
    },
    onVerify() {
      // TODO: Implement guardian verification flow.
      uni.showToast({ title: this.$t('dashboard.verifyDeveloping'), icon: 'none' })
    }
  }
}
</script>

<style>
.page {
  min-height: 100vh;
  padding: 24rpx;
  box-sizing: border-box;
  /* Inherit paper texture from page */
  background: transparent;
  transition: background 0.3s ease;
  position: relative;
  z-index: 1;
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
.field {
  margin-top: 16rpx;
}
.input {
  height: 76rpx;
  background: rgba(255, 255, 255, 0.98);
  border: 2px solid rgba(229, 231, 235, 0.8);
  border-radius: 24rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
  color: #323232;
  transition: all 0.25s ease;
}
.input:focus {
  border-color: #D60000;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0 0 0 4rpx rgba(214, 0, 0, 0.1), 0 4rpx 12rpx rgba(214, 0, 0, 0.15);
  outline: none;
}
.row {
  display: flex;
  align-items: center;
}
.checkbox-label {
  display: flex;
  align-items: center;
  gap: 10rpx;
  transition: opacity 0.2s ease;
}
.checkbox-label:active {
  opacity: 0.7;
}
.card-title {
  font-size: 30rpx;
  font-weight: 700;
  color: #323232;
  letter-spacing: -0.3rpx;
  margin-bottom: 4rpx;
}
.muted {
  color: #666;
  font-size: 26rpx;
  line-height: 1.6;
}
.chart-placeholder {
  height: 220rpx;
  margin-top: 16rpx;
  border-radius: 16rpx;
  border: 2px dashed rgba(147, 197, 253, 0.6);
  background: rgba(239, 246, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}
.chart-placeholder:active {
  border-color: rgba(59, 130, 246, 0.8);
  background: rgba(239, 246, 255, 0.5);
}
.row {
  display: flex;
  flex-wrap: wrap;
  gap: 14rpx;
  margin-top: 16rpx;
}
.pill {
  padding: 12rpx 18rpx;
  border-radius: 999rpx;
  background: rgba(255, 255, 255, 0.98);
  color: #666;
  font-size: 24rpx;
  font-weight: 500;
  border: 1.5px solid rgba(229, 231, 235, 0.8);
  box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.05);
  transition: all 0.25s ease;
}
.pill:active {
  transform: scale(0.95);
  box-shadow: 0 1rpx 3rpx rgba(0, 0, 0, 0.08);
}
.footer {
  margin-top: 12rpx;
  display: flex;
  gap: 14rpx;
}
.primary {
  flex: 1;
  background: #D60000;
  color: #fff;
  border-radius: 24rpx;
  height: 88rpx;
  line-height: 88rpx;
  font-size: 28rpx;
  font-weight: 600;
  box-shadow: 0 8rpx 24rpx rgba(214, 0, 0, 0.3);
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  border: none;
}
.primary:active {
  transform: scale(0.96);
  box-shadow: 0 4rpx 12rpx rgba(214, 0, 0, 0.25);
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
  color: #D60000;
  border: 2px solid #D60000;
  border-radius: 24rpx;
  height: 88rpx;
  line-height: 88rpx;
  font-size: 28rpx;
  font-weight: 600;
  box-shadow: 0 4rpx 12rpx rgba(214, 0, 0, 0.1);
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
.ghost:active {
  transform: scale(0.96);
  background: rgba(214, 0, 0, 0.1);
  border-color: #D60000;
  box-shadow: 0 2rpx 6rpx rgba(214, 0, 0, 0.15);
}
</style>


