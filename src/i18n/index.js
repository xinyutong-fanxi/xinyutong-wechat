import { createI18n } from 'vue-i18n'
import zh from './locales/zh.json'
import en from './locales/en.json'

// Detect system language or use stored preference
function getInitialLocale() {
  // Check localStorage for saved preference
  try {
    const saved = uni.getStorageSync('languagePreference')
    if (saved === 'zh' || saved === 'en') {
      return saved
    }
  } catch (e) {
    // Storage not available, continue with system detection
  }

  // Detect system language
  try {
    const systemInfo = uni.getSystemInfoSync()
    const lang = systemInfo.language || 'zh_CN'
    
    // Map system language to our locales
    if (lang.startsWith('en')) {
      return 'en'
    }
    // Default to Chinese for all other languages
    return 'zh'
  } catch (e) {
    // Fallback to Chinese
    return 'zh'
  }
}

const i18n = createI18n({
  locale: getInitialLocale(),
  fallbackLocale: 'zh', // Always fallback to Chinese
  messages: {
    zh,
    en
  },
  legacy: false, // Use Composition API mode for Vue 3
  globalInjection: true // Enable $t in templates
})

// Helper function to change language and persist preference
export function setLanguage(locale) {
  if (locale !== 'zh' && locale !== 'en') {
    console.warn('Invalid locale, defaulting to zh')
    locale = 'zh'
  }
  
  i18n.global.locale.value = locale
  
  // Persist preference
  try {
    uni.setStorageSync('languagePreference', locale)
  } catch (e) {
    console.warn('Failed to save language preference:', e)
  }
  
  return locale
}

// Get current language
export function getCurrentLanguage() {
  return i18n.global.locale.value
}

export default i18n
