<template>
  <view class="page">
    <view class="header">
      <view class="hero">
        <view class="hero-text">
          <text class="title">{{ $t('index.title') }}</text>
          <text class="subtitle">{{ $t('index.subtitle') }}</text>
        </view>
        <image class="hero-img" src="/static/mascot-star.svg" mode="aspectFit" />
      </view>
    </view>

    <view class="mood-row">
      <button
        v-for="m in moods"
        :key="m.key"
        :class="['mood-btn', m.key, { active: moodKey === m.key }]"
        @click="selectMood(m.key)"
      >
        <text class="mood-emoji">{{ m.emoji }}</text>
        <text class="mood-label">{{ m.label }}</text>
      </button>
    </view>

    <scroll-view class="chat" scroll-y :scroll-top="scrollTop">
      <view v-for="msg in messages" :key="msg.id" class="msg" :class="msg.role">
        <view class="bubble">
          <text class="content">{{ msg.content }}</text>
        </view>
        <view v-if="msg.bookingRecommendation && msg.bookingRecommendation.suggested" class="booking-recommendation">
          <view class="recommendation-card">
            <text class="recommendation-title">💡 建议预约专业咨询师</text>
            <text class="recommendation-text">{{ msg.bookingRecommendation.message }}</text>
            <button class="book-button" @click="navigateToBooking(msg.bookingRecommendation.issueType)">
              {{ $t('index.bookCounselor') }}
            </button>
          </view>
        </view>
      </view>
    </scroll-view>

    <view class="composer">
      <button class="vent-btn" @click="onVenting">{{ $t('index.ventButton') }}</button>
      <input
        class="input"
        v-model="draft"
        :placeholder="$t('index.inputPlaceholder')"
        confirm-type="send"
        @confirm="send"
      />
      <button class="send-btn" :disabled="sending || !draft.trim()" @click="send">{{ $t('index.sendButton') }}</button>
    </view>
  </view>
</template>

<script>
import { safetyTriage } from '../../utils/safety/safetyFilter'
import { sendChatMessage } from '../../utils/cloud/chatApi'
import { getChildOnboardingStatus } from '../../utils/cloud/onboardingApi'
import { useI18n } from 'vue-i18n'

export default {
  data() {
    // Note: Cannot use this.$t in data() - must use computed or methods
    return {
      moodKey: 'ok',
      sessionId: '',
      messages: [],
      draft: '',
      sending: false,
      scrollTop: 0
    }
  },
  computed: {
    moods() {
      return [
        { key: 'happy', emoji: '😊', label: this.$t('moods.happy') },
        { key: 'ok', emoji: '🙂', label: this.$t('moods.ok') },
        { key: 'nervous', emoji: '😣', label: this.$t('moods.nervous') },
        { key: 'sad', emoji: '😢', label: this.$t('moods.sad') },
        { key: 'angry', emoji: '😠', label: this.$t('moods.angry') },
        { key: 'tired', emoji: '😪', label: this.$t('moods.tired') }
      ]
    }
  },
  async onLoad() {
    // Gate chat access until onboarding + guardian consent are complete.
    try {
      const st = await getChildOnboardingStatus()
      if (st && (!st.hasProfile || !st.hasParentConsent)) {
        uni.reLaunch({ url: '/pages/onboarding/register' })
        return
      }
    } catch (_) {
      // If status check fails, keep chat usable in dev; cloud will be authoritative.
    }

    // TODO: create/reuse a session in DB via cloud function.
    this.sessionId = `local-${Date.now()}`
    
    // Initialize greeting message
    this.messages = [
      {
        id: 'seed-1',
        role: 'assistant',
        content: this.$t('index.greeting')
      }
    ]
  },
  methods: {
    selectMood(key) {
      this.moodKey = key
      // TODO: persist mood for session
    },
    onVenting() {
      // TODO: integrate WeChat/uni-app voice-to-text.
      uni.showToast({ title: this.$t('index.voiceInputDeveloping'), icon: 'none' })
    },
    async send() {
      const content = (this.draft || '').trim()
      if (!content || this.sending) return

      const userMsg = { id: `u-${Date.now()}`, role: 'user', content }
      this.messages.push(userMsg)
      this.draft = ''
      this.bumpScroll()

      const triage = safetyTriage(content)
      this.sending = true
      try {
        const res = await sendChatMessage({
          sessionId: this.sessionId,
          content,
          clientTriage: triage,
          moodKey: this.moodKey
        })
        this.messages.push({
          id: `a-${Date.now()}`,
          role: 'assistant',
          content: res?.assistantMessage?.content || this.$t('index.defaultMessage'),
          bookingRecommendation: res?.bookingRecommendation || null
        })
        
        // If booking recommendation exists, also show recommendation teachers
        if (res?.bookingRecommendation?.suggested && res?.bookingRecommendation?.issueType) {
          // Optionally load and display teacher recommendations
          // This can be done async without blocking the message display
        }
      } catch (e) {
        this.messages.push({
          id: `a-err-${Date.now()}`,
          role: 'assistant',
          content: this.$t('index.errorMessage')
        })
      } finally {
        this.sending = false
        this.bumpScroll()
      }
    },
    bumpScroll() {
      // Simple approach; can be replaced with `scroll-into-view`.
      this.scrollTop = this.scrollTop + 9999
    },
    navigateToBooking(issueType) {
      // Navigate to parent booking flow with issue type pre-selected
      // For student interface, redirect to parent interface or show info
      uni.showModal({
        title: this.$t('index.bookingRedirectTitle'),
        content: this.$t('index.bookingRedirectMessage'),
        confirmText: this.$t('index.bookingRedirectConfirm'),
        cancelText: this.$t('common.cancel'),
        success: (res) => {
          if (res.confirm) {
            // Navigate to parent teachers page with issue type filter
            // Note: In production, this should check if user has parent role
            uni.switchTab({ url: '/pages/parent/teachers?issueType=' + (issueType || '') })
          }
        }
      })
    }
  }
}
</script>

<style>
.page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 24rpx;
  box-sizing: border-box;
  /* Inherit paper texture from page, but allow page-level background to show through */
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
.mood-row {
  display: flex;
  gap: 14rpx;
  padding: 8rpx 0 20rpx;
  overflow-x: scroll;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
}
.mood-row::-webkit-scrollbar {
  display: none;
}
.mood-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16rpx 20rpx;
  border-radius: 24rpx;
  background: rgba(255, 255, 255, 0.98);
  border: 2px solid rgba(229, 231, 235, 0.8);
  box-shadow: 0 4rpx 16rpx rgba(17, 24, 39, 0.08);
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  min-width: 100rpx;
}
.mood-btn:active {
  transform: scale(0.95);
}
.mood-btn.active {
  border-color: #4A90E2;
  background: rgba(74, 144, 226, 0.1);
  transform: translateY(-4rpx) scale(1.05);
  box-shadow: 0 8rpx 24rpx rgba(74, 144, 226, 0.25), 0 0 0 4rpx rgba(74, 144, 226, 0.1);
}
.mood-btn.happy {
  background: linear-gradient(135deg, rgba(254, 249, 195, 0.98) 0%, rgba(253, 230, 138, 0.98) 100%);
  border-color: rgba(251, 191, 36, 0.5);
}
.mood-btn.happy.active {
  border-color: rgba(251, 191, 36, 0.8);
  box-shadow: 0 8rpx 24rpx rgba(251, 191, 36, 0.3), 0 0 0 4rpx rgba(251, 191, 36, 0.15);
}
.mood-btn.ok {
  background: rgba(74, 144, 226, 0.1);
  border-color: rgba(74, 144, 226, 0.4);
}
.mood-btn.ok.active {
  border-color: #4A90E2;
  box-shadow: 0 8rpx 24rpx rgba(74, 144, 226, 0.3), 0 0 0 4rpx rgba(74, 144, 226, 0.15);
}
.mood-btn.nervous {
  background: linear-gradient(135deg, rgba(233, 213, 255, 0.98) 0%, rgba(221, 214, 254, 0.98) 100%);
  border-color: rgba(124, 58, 237, 0.4);
}
.mood-btn.nervous.active {
  border-color: rgba(124, 58, 237, 0.8);
  box-shadow: 0 8rpx 24rpx rgba(124, 58, 237, 0.3), 0 0 0 4rpx rgba(124, 58, 237, 0.15);
}
.mood-btn.sad {
  background: linear-gradient(135deg, rgba(224, 231, 255, 0.98) 0%, rgba(199, 210, 254, 0.98) 100%);
  border-color: rgba(99, 102, 241, 0.4);
}
.mood-btn.sad.active {
  border-color: rgba(99, 102, 241, 0.8);
  box-shadow: 0 8rpx 24rpx rgba(99, 102, 241, 0.3), 0 0 0 4rpx rgba(99, 102, 241, 0.15);
}
.mood-btn.angry {
  background: linear-gradient(135deg, rgba(254, 226, 226, 0.98) 0%, rgba(252, 165, 165, 0.98) 100%);
  border-color: rgba(248, 113, 113, 0.4);
}
.mood-btn.angry.active {
  border-color: rgba(248, 113, 113, 0.8);
  box-shadow: 0 8rpx 24rpx rgba(248, 113, 113, 0.3), 0 0 0 4rpx rgba(248, 113, 113, 0.15);
}
.mood-btn.tired {
  background: linear-gradient(135deg, rgba(240, 253, 250, 0.98) 0%, rgba(153, 246, 228, 0.98) 100%);
  border-color: rgba(45, 212, 191, 0.4);
}
.mood-btn.tired.active {
  border-color: rgba(45, 212, 191, 0.8);
  box-shadow: 0 8rpx 24rpx rgba(45, 212, 191, 0.3), 0 0 0 4rpx rgba(45, 212, 191, 0.15);
}
.mood-emoji {
  font-size: 38rpx;
  transition: transform 0.2s ease;
}
.mood-btn.active .mood-emoji {
  transform: scale(1.15);
}
.mood-label {
  font-size: 22rpx;
  color: #666;
  margin-top: 8rpx;
  font-weight: 500;
  transition: color 0.2s ease;
}
.mood-btn.active .mood-label {
  color: #4A90E2;
  font-weight: 600;
}
.chat {
  flex: 1;
  border-radius: 24rpx;
  background: rgba(255, 255, 255, 0.9);
  border: 1.5px solid rgba(199, 210, 254, 0.6);
  padding: 20rpx;
  box-shadow: 0 12rpx 48rpx rgba(17, 24, 39, 0.1), inset 0 1rpx 0 rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;
}
.msg {
  display: flex;
  margin-bottom: 18rpx;
  animation: fadeInUp 0.3s ease-out;
}
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.msg.user {
  justify-content: flex-end;
}
.msg.assistant {
  justify-content: flex-start;
}
.bubble {
  max-width: 78%;
  padding: 16rpx 20rpx;
  border-radius: 20rpx;
  background: rgba(255, 255, 255, 0.98);
  border: 1.5px solid rgba(229, 231, 235, 0.8);
  box-shadow: 0 2rpx 8rpx rgba(17, 24, 39, 0.06);
  transition: all 0.2s ease;
}
.bubble:active {
  transform: scale(0.98);
}
.msg.assistant .bubble {
  background: rgba(74, 144, 226, 0.1);
  border-color: rgba(74, 144, 226, 0.3);
  box-shadow: 0 4rpx 12rpx rgba(74, 144, 226, 0.15);
}
.msg.user .bubble {
  background: rgba(255, 255, 255, 0.98);
  border-color: rgba(229, 231, 235, 0.8);
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
}
.content {
  color: #323232;
  font-size: 28rpx;
  line-height: 1.6;
  letter-spacing: 0.3rpx;
}
.composer {
  display: flex;
  align-items: center;
  gap: 14rpx;
  padding-top: 20rpx;
}
.vent-btn {
  background: rgba(255, 255, 255, 0.98);
  color: #4A90E2;
  border-radius: 24rpx;
  font-size: 26rpx;
  font-weight: 600;
  padding: 0 20rpx;
  height: 76rpx;
  line-height: 76rpx;
  border: 2px solid #4A90E2;
  box-shadow: 0 4rpx 12rpx rgba(74, 144, 226, 0.15);
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
.vent-btn:active {
  transform: scale(0.95);
  box-shadow: 0 2rpx 6rpx rgba(74, 144, 226, 0.2);
}
.input {
  flex: 1;
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
.send-btn {
  background: #4A90E2;
  color: #ffffff;
  border-radius: 24rpx;
  font-size: 26rpx;
  font-weight: 600;
  padding: 0 24rpx;
  height: 76rpx;
  line-height: 76rpx;
  box-shadow: 0 8rpx 24rpx rgba(74, 144, 226, 0.3);
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  border: none;
}
.send-btn:active {
  transform: scale(0.95);
  box-shadow: 0 4rpx 12rpx rgba(74, 144, 226, 0.25);
}
.send-btn[disabled] {
  background: #ccc;
  color: rgba(255, 255, 255, 0.7);
  box-shadow: none;
  transform: none;
}

.booking-recommendation {
  width: 100%;
  margin-top: 20rpx;
  display: flex;
  justify-content: flex-start;
}

.recommendation-card {
  max-width: 85%;
  background: linear-gradient(135deg, rgba(254, 249, 195, 0.98) 0%, rgba(253, 230, 138, 0.98) 100%);
  border: 2px solid rgba(251, 191, 36, 0.6);
  border-radius: 20rpx;
  padding: 24rpx;
  box-shadow: 0 4rpx 16rpx rgba(251, 191, 36, 0.2);
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.recommendation-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #92400e;
  display: block;
}

.recommendation-text {
  font-size: 26rpx;
  color: #78350f;
  line-height: 1.6;
  display: block;
}

.book-button {
  background: #4A90E2;
  color: white;
  border-radius: 24rpx;
  padding: 20rpx 30rpx;
  font-size: 26rpx;
  font-weight: 600;
  border: none;
  box-shadow: 0 4rpx 12rpx rgba(74, 144, 226, 0.3);
  transition: all 0.25s ease;
  margin-top: 8rpx;
}

.book-button:active {
  transform: scale(0.98);
  box-shadow: 0 2rpx 6rpx rgba(74, 144, 226, 0.25);
}
</style>


