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

    <!-- Step Indicator -->
    <view class="step-indicator">
      <view class="step" :class="{ active: currentStep >= 1, completed: currentStep > 1 }">
        <view class="step-number">1</view>
        <text class="step-label">{{ $t('onboarding.steps.basic') }}</text>
      </view>
      <view class="step-line" :class="{ active: currentStep > 1 }"></view>
      <view class="step" :class="{ active: currentStep >= 2, completed: currentStep > 2 }">
        <view class="step-number">2</view>
        <text class="step-label">{{ $t('onboarding.steps.preferences') }}</text>
      </view>
      <view class="step-line" :class="{ active: currentStep > 2 }"></view>
      <view class="step" :class="{ active: currentStep >= 3, completed: currentStep > 3 }">
        <view class="step-number">3</view>
        <text class="step-label">{{ $t('onboarding.steps.support') }}</text>
      </view>
      <view class="step-line" :class="{ active: currentStep > 3 }"></view>
      <view class="step" :class="{ active: currentStep >= 4 }">
        <view class="step-number">4</view>
        <text class="step-label">{{ $t('onboarding.steps.guardian') }}</text>
      </view>
    </view>

    <!-- Step 1: Basic Info (nickname, age, grade) -->
    <view class="card step-content" v-if="currentStep === 1">
      <text class="card-title">{{ $t('onboarding.steps.basic') }}</text>
      
      <view class="field">
        <text class="label">{{ $t('onboarding.nickname') }}</text>
        <input class="input" v-model="child.nickname" :placeholder="$t('onboarding.nicknamePlaceholder')" />
      </view>

      <view class="field">
        <text class="label">{{ $t('onboarding.age') }}</text>
        <input class="input" type="number" v-model="child.age" :placeholder="$t('onboarding.agePlaceholder')" />
      </view>

      <view class="field">
        <text class="label">{{ $t('onboarding.grade') }}</text>
        <input class="input" v-model="child.grade" :placeholder="$t('onboarding.gradePlaceholder')" />
      </view>
    </view>

    <!-- Step 2: Preferences (language, interests) -->
    <view class="card step-content" v-if="currentStep === 2">
      <text class="card-title">{{ $t('onboarding.steps.preferences') }}</text>

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
    </view>

    <!-- Step 3: Support (goals, sensitivities) -->
    <view class="card step-content" v-if="currentStep === 3">
      <text class="card-title">{{ $t('onboarding.steps.support') }}</text>

      <view class="field">
        <text class="label">{{ $t('onboarding.goals') }}</text>
        <input class="input" v-model="child.goals" :placeholder="$t('onboarding.goalsPlaceholder')" />
      </view>

      <view class="field">
        <text class="label">{{ $t('onboarding.sensitivities') }}</text>
        <input class="input" v-model="child.sensitivities" :placeholder="$t('onboarding.sensitivitiesPlaceholder')" />
      </view>
    </view>

    <!-- Step 4: Guardian Info (contact, relationship) -->
    <view class="card step-content" v-if="currentStep === 4">
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

    <!-- Navigation Buttons -->
    <view class="footer">
      <button v-if="currentStep > 1" class="ghost" @click="prevStep">{{ $t('onboarding.prev') }}</button>
      <button v-if="currentStep < 4" class="primary" @click="nextStep">{{ $t('onboarding.next') }}</button>
      <button v-if="currentStep === 4" class="primary" :disabled="submitting" @click="submit">{{ $t('onboarding.generateCode') }}</button>
      <button class="ghost" @click="skipDev" v-if="currentStep === 1">{{ $t('onboarding.skipDev') }}</button>
    </view>
  </view>
</template>

<script>
import { registerChildStart } from '../../utils/cloud/onboardingApi'

export default {
  data() {
    return {
      currentStep: 1,
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
    validateStep(step) {
      if (step === 1) {
        const nickname = (this.child.nickname || '').trim()
        const age = Number(String(this.child.age || '').trim())
        if (!nickname) {
          uni.showToast({ title: this.$t('onboarding.validation.nicknameRequired'), icon: 'none' })
          return false
        }
        if (!Number.isFinite(age) || age < 5 || age > 20) {
          uni.showToast({ title: this.$t('onboarding.validation.ageRequired'), icon: 'none' })
          return false
        }
      }
      // Steps 2, 3, 4 are all optional fields, so no validation needed
      return true
    },
    nextStep() {
      if (this.validateStep(this.currentStep)) {
        if (this.currentStep < 4) {
          this.currentStep++
        }
      }
    },
    prevStep() {
      if (this.currentStep > 1) {
        this.currentStep--
      }
    },
    async submit() {
      if (this.submitting) return
      if (!this.validateStep(4)) return

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
            nickname: (this.child.nickname || '').trim(),
            age: Number(String(this.child.age || '').trim()),
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
  border: 1.5px solid rgba(229, 231, 235, 0.6);
  box-shadow: 0 8rpx 32rpx rgba(17, 24, 39, 0.1), inset 0 1rpx 0 rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.hero:active {
  transform: scale(0.98);
  box-shadow: 0 4rpx 16rpx rgba(17, 24, 39, 0.08);
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
  background: rgba(214, 0, 0, 0.1);
  border: 1.5px solid rgba(214, 0, 0, 0.4);
  color: #D60000;
  font-size: 22rpx;
  font-weight: 500;
  box-shadow: 0 2rpx 6rpx rgba(214, 0, 0, 0.1);
  transition: all 0.25s ease;
}
.chip:active {
  transform: scale(0.95);
  box-shadow: 0 1rpx 3rpx rgba(214, 0, 0, 0.15);
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

/* Step Indicator */
.step-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 30rpx;
  padding: 24rpx;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 24rpx;
  border: 1.5px solid rgba(229, 231, 235, 0.6);
}
.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
  flex: 0 0 auto;
}
.step-number {
  width: 56rpx;
  height: 56rpx;
  border-radius: 28rpx;
  background: rgba(229, 231, 235, 0.8);
  color: #999;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26rpx;
  font-weight: 600;
  transition: all 0.3s ease;
}
.step.active .step-number {
  background: #D60000;
  color: white;
  box-shadow: 0 4rpx 12rpx rgba(214, 0, 0, 0.3);
}
.step.completed .step-number {
  background: #323232;
  color: white;
}
.step-label {
  font-size: 20rpx;
  color: #999;
  transition: color 0.3s ease;
}
.step.active .step-label {
  color: #323232;
  font-weight: 600;
}
.step.completed .step-label {
  color: #666;
}
.step-line {
  width: 60rpx;
  height: 3rpx;
  background: rgba(229, 231, 235, 0.8);
  margin: 0 8rpx;
  transition: background 0.3s ease;
}
.step-line.active {
  background: #323232;
}

.card {
  background: rgba(255, 255, 255, 0.95);
  border: 1.5px solid rgba(229, 231, 235, 0.6);
  border-radius: 24rpx;
  padding: 32rpx;
  margin-bottom: 18rpx;
  box-shadow: 0 8rpx 32rpx rgba(17, 24, 39, 0.08), inset 0 1rpx 0 rgba(255, 255, 255, 0.8);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: slideIn 0.3s ease-out;
}
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.step-content {
  min-height: 400rpx;
}
.card-title {
  font-size: 32rpx;
  font-weight: 700;
  color: #323232;
  letter-spacing: -0.3rpx;
  margin-bottom: 24rpx;
  display: block;
}
.field {
  margin-top: 24rpx;
}
.field:first-child {
  margin-top: 0;
}
.label {
  display: block;
  font-size: 26rpx;
  color: #323232;
  margin-bottom: 12rpx;
  font-weight: 500;
}
.input {
  height: 88rpx;
  background: rgba(255, 255, 255, 0.98);
  border: 2px solid rgba(229, 231, 235, 0.8);
  border-radius: 24rpx;
  padding: 0 24rpx;
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
.picker {
  height: 88rpx;
  background: rgba(255, 255, 255, 0.98);
  border: 2px solid rgba(229, 231, 235, 0.8);
  border-radius: 24rpx;
  padding: 0 24rpx;
  font-size: 28rpx;
  display: flex;
  align-items: center;
  color: #323232;
  transition: all 0.25s ease;
}
.picker:active {
  border-color: #D60000;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0 0 0 4rpx rgba(214, 0, 0, 0.1), 0 4rpx 12rpx rgba(214, 0, 0, 0.15);
}
.hint {
  margin-top: 24rpx;
  padding-top: 20rpx;
  border-top: 1px solid rgba(229, 231, 235, 0.6);
}
.muted {
  color: #666;
  font-size: 24rpx;
  line-height: 1.6;
}
.footer {
  margin-top: 20rpx;
  display: flex;
  gap: 14rpx;
  align-items: center;
}
.footer button {
  flex: 1;
}
.primary {
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
  background: #999;
  color: rgba(255, 255, 255, 0.7);
  box-shadow: none;
  transform: none;
}
.ghost {
  background: rgba(255, 255, 255, 0.9);
  color: #D60000;
  border: 2px solid #D60000;
  border-radius: 24rpx;
  height: 88rpx;
  line-height: 88rpx;
  font-size: 26rpx;
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
