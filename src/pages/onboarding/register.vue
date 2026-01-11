<template>
  <view class="page">
    <view class="header">
      <view class="hero">
        <view class="hero-text">
          <text class="title">{{ $t('onboarding.title') }}</text>
          <text class="subtitle">{{ $t('onboarding.subtitle') }}</text>
          <view class="chips">
            <view class="chip">{{ $t('onboarding.chips.gentleChat') }}</view>
            <view class="chip">{{ $t('onboarding.chips.noTranscript') }}</view>
            <view class="chip">{{ $t('onboarding.chips.safe') }}</view>
          </view>
        </view>
        <image class="hero-img" src="/static/mascot-star.svg" mode="aspectFit" />
      </view>
    </view>

    <view class="card">
      <text class="card-title">{{ $t('onboarding.childInfo') }}</text>

      <view class="field">
        <text class="label">{{ $t('onboarding.nickname') }}</text>
        <input class="input" v-model="child.nickname" :placeholder="$t('onboarding.nicknamePlaceholder')" />
      </view>

      <view class="row">
        <view class="field half">
          <text class="label">{{ $t('onboarding.age') }}</text>
          <input class="input" type="number" v-model="child.age" :placeholder="$t('onboarding.agePlaceholder')" />
        </view>
        <view class="field half">
          <text class="label">{{ $t('onboarding.grade') }}</text>
          <input class="input" v-model="child.grade" :placeholder="$t('onboarding.gradePlaceholder')" />
        </view>
      </view>

      <view class="field">
        <text class="label">{{ $t('onboarding.language') }}</text>
        <picker mode="selector" :range="langOptions" range-key="label" @change="onLangChange">
          <view class="picker">{{ selectedLangLabel || $t('onboarding.selectLanguage') }}</view>
        </picker>
      </view>

      <view class="field">
        <text class="label">{{ $t('onboarding.interests') }}</text>
        <input class="input" v-model="child.interests" :placeholder="$t('onboarding.interestsPlaceholder')" />
      </view>

      <view class="field">
        <text class="label">{{ $t('onboarding.goals') }}</text>
        <input class="input" v-model="child.goals" :placeholder="$t('onboarding.goalsPlaceholder')" />
      </view>

      <view class="field">
        <text class="label">{{ $t('onboarding.sensitivities') }}</text>
        <input class="input" v-model="child.sensitivities" :placeholder="$t('onboarding.sensitivitiesPlaceholder')" />
      </view>
    </view>

    <view class="card">
      <text class="card-title">{{ $t('onboarding.guardianInfo') }}</text>

      <view class="field">
        <text class="label">{{ $t('onboarding.guardianPhone') }}</text>
        <input class="input" v-model="guardian.contact" :placeholder="$t('onboarding.guardianPhonePlaceholder')" />
      </view>

      <view class="field">
        <text class="label">{{ $t('onboarding.relationship') }}</text>
        <picker mode="selector" :range="relationshipOptions" range-key="label" @change="onRelChange">
          <view class="picker">{{ selectedRelLabel || $t('onboarding.selectRelationship') }}</view>
        </picker>
      </view>

      <view class="hint">
        <text class="muted">
          {{ $t('onboarding.consentHint') }}
        </text>
      </view>
    </view>

    <view class="footer">
      <button class="primary" :disabled="submitting" @click="submit">{{ $t('onboarding.generateCode') }}</button>
      <button class="ghost" @click="skipDev">{{ $t('onboarding.skipDev') }}</button>
    </view>
  </view>
</template>

<script>
import { registerChildStart } from '../../utils/cloud/onboardingApi'

export default {
  data() {
    return {
      submitting: false,
      child: {
        nickname: '',
        age: '',
        grade: '',
        language: 'zh',
        interests: '',
        goals: '',
        sensitivities: ''
      },
      guardian: {
        contact: '',
        relationship: 'guardian'
      }
    }
  },
  computed: {
    langOptions() {
      return [
        { value: 'zh', label: this.$t('language.chinese') },
        { value: 'en', label: this.$t('language.english') }
      ]
    },
    selectedLangLabel() {
      const option = this.langOptions.find(opt => opt.value === this.child.language)
      return option ? option.label : ''
    },
    relationshipOptions() {
      return [
        { value: 'mother', label: this.$t('onboarding.relationships.mother') },
        { value: 'father', label: this.$t('onboarding.relationships.father') },
        { value: 'guardian', label: this.$t('onboarding.relationships.guardian') },
        { value: 'other', label: this.$t('onboarding.relationships.other') }
      ]
    },
    selectedRelLabel() {
      const option = this.relationshipOptions.find(opt => opt.value === this.guardian.relationship)
      return option ? option.label : ''
    }
  },
  methods: {
    onLangChange(e) {
      const idx = Number(e.detail && e.detail.value)
      const selected = this.langOptions[idx]
      if (selected) {
        this.child.language = selected.value
      }
    },
    onRelChange(e) {
      const idx = Number(e.detail && e.detail.value)
      const selected = this.relationshipOptions[idx]
      if (selected) {
        this.guardian.relationship = selected.value
      }
    },
    async submit() {
      if (this.submitting) return
      const nickname = (this.child.nickname || '').trim()
      const age = Number(String(this.child.age || '').trim())
      if (!nickname) {
        uni.showToast({ title: this.$t('onboarding.validation.nicknameRequired'), icon: 'none' })
        return
      }
      if (!Number.isFinite(age) || age < 5 || age > 20) {
        uni.showToast({ title: this.$t('onboarding.validation.ageRequired'), icon: 'none' })
        return
      }

      this.submitting = true
      try {
        // Map language value to display name for backend
        const languageMap = { zh: '中文', en: 'English' }
        // Map relationship value to display name for backend
        const relMap = {
          mother: '妈妈',
          father: '爸爸',
          guardian: '监护人',
          other: '其他'
        }
        
        const res = await registerChildStart({
          childProfile: {
            nickname,
            age,
            grade: (this.child.grade || '').trim() || null,
            language: languageMap[this.child.language] || '中文',
            interests: (this.child.interests || '').trim() || null,
            goals: (this.child.goals || '').trim() || null,
            sensitivities: (this.child.sensitivities || '').trim() || null
          },
          guardianContact: {
            contact: (this.guardian.contact || '').trim() || null,
            relationship: relMap[this.guardian.relationship] || '监护人'
          }
        })

        if (!res || !res.pairingCode) {
          throw new Error('NO_PAIRING_CODE')
        }
        uni.navigateTo({
          url: `/pages/onboarding/waitConsent?code=${encodeURIComponent(res.pairingCode)}`
        })
      } catch (e) {
        uni.showToast({ title: this.$t('onboarding.validation.generateFailed'), icon: 'none' })
      } finally {
        this.submitting = false
      }
    },
    skipDev() {
      // Local dev convenience: allow entering chat without cloud.
      uni.setStorageSync('local_parent_consent', { consentedAt: Date.now(), relationship: 'dev' })
      uni.reLaunch({ url: '/pages/index/index' })
    }
  }
}
</script>

<style>
.page {
  min-height: 100vh;
  padding: 24rpx;
  box-sizing: border-box;
  background: #F2F2F2;
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
.chips {
  margin-top: 14rpx;
  display: flex;
  flex-wrap: wrap;
  gap: 10rpx;
}
.chip {
  padding: 10rpx 16rpx;
  border-radius: 999rpx;
  background: rgba(74, 144, 226, 0.1);
  border: 1.5px solid rgba(74, 144, 226, 0.4);
  color: #4A90E2;
  font-size: 22rpx;
  font-weight: 500;
  box-shadow: 0 2rpx 6rpx rgba(74, 144, 226, 0.1);
  transition: all 0.25s ease;
}
.chip:active {
  transform: scale(0.95);
  box-shadow: 0 1rpx 3rpx rgba(74, 144, 226, 0.15);
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
.card-title {
  font-size: 30rpx;
  font-weight: 700;
  color: #323232;
  letter-spacing: -0.3rpx;
  margin-bottom: 6rpx;
}
.field {
  margin-top: 16rpx;
}
.label {
  display: block;
  font-size: 24rpx;
  color: #666;
  margin-bottom: 10rpx;
  font-weight: 500;
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
  border-color: #4A90E2;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0 0 0 4rpx rgba(74, 144, 226, 0.1), 0 4rpx 12rpx rgba(74, 144, 226, 0.15);
  outline: none;
}
.picker {
  height: 76rpx;
  background: rgba(255, 255, 255, 0.98);
  border: 2px solid rgba(229, 231, 235, 0.8);
  border-radius: 24rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
  display: flex;
  align-items: center;
  color: #323232;
  transition: all 0.25s ease;
}
.picker:active {
  border-color: #4A90E2;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0 0 0 4rpx rgba(74, 144, 226, 0.1), 0 4rpx 12rpx rgba(74, 144, 226, 0.15);
}
.row {
  display: flex;
  gap: 14rpx;
}
.half {
  flex: 1;
}
.hint {
  margin-top: 14rpx;
}
.muted {
  color: #666;
  font-size: 24rpx;
  line-height: 1.6;
}
.footer {
  margin-top: 12rpx;
  display: flex;
  gap: 14rpx;
}
.primary {
  flex: 2;
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

