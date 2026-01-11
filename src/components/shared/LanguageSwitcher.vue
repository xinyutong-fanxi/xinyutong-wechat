<template>
  <view class="language-switcher">
    <view class="language-option" :class="{ active: currentLang === 'zh' }" @click="switchLanguage('zh')">
      <text class="language-name">中文</text>
      <text class="checkmark" v-if="currentLang === 'zh'">✓</text>
    </view>
    <view class="language-option" :class="{ active: currentLang === 'en' }" @click="switchLanguage('en')">
      <text class="language-name">English</text>
      <text class="checkmark" v-if="currentLang === 'en'">✓</text>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { setLanguage, getCurrentLanguage } from '../../i18n'

const { locale, t } = useI18n()
const currentLang = ref('zh')

onMounted(() => {
  currentLang.value = getCurrentLanguage()
})

function switchLanguage(lang) {
  if (lang !== 'zh' && lang !== 'en') return
  
  setLanguage(lang)
  currentLang.value = lang
  locale.value = lang
  
  // Use i18n for toast message - note: message will show in new language
  uni.showToast({
    title: t('language.languageChanged'),
    icon: 'success',
    duration: 2000
  })
}
</script>

<style scoped>
.language-switcher {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
  padding: 20rpx;
}

.language-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx 30rpx;
  background: rgba(255, 255, 255, 0.98);
  border: 2px solid rgba(229, 231, 235, 0.8);
  border-radius: 16rpx;
  transition: all 0.25s ease;
}

.language-option:active {
  transform: scale(0.98);
}

.language-option.active {
  background: rgba(239, 246, 255, 0.98);
  border-color: rgba(59, 130, 246, 0.8);
  box-shadow: 0 4rpx 12rpx rgba(59, 130, 246, 0.15);
}

.language-name {
  font-size: 28rpx;
  color: #1e293b;
  font-weight: 500;
}

.language-option.active .language-name {
  color: #1e40af;
  font-weight: 600;
}

.checkmark {
  font-size: 32rpx;
  color: #1e40af;
  font-weight: bold;
}
</style>
