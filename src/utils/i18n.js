/**
 * i18n helper utilities
 * Provides convenience functions for internationalization
 */

/**
 * Format date/time in locale-aware format
 * @param {number|Date} timestamp - Unix timestamp or Date object
 * @param {string} locale - Locale code ('zh' or 'en')
 * @returns {string} Formatted date string
 */
export function formatDateTime(timestamp, locale = 'zh') {
  if (!timestamp) return ''
  
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp)
  
  if (locale === 'en') {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  
  // Chinese format: X月X日 HH:MM
  return `${date.getMonth() + 1}月${date.getDate()}日 ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

/**
 * Format currency in locale-aware format
 * @param {number} amount - Amount in cents (fen)
 * @param {string} locale - Locale code ('zh' or 'en')
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount, locale = 'zh') {
  const yuan = amount / 100 // Convert fen to yuan
  
  if (locale === 'en') {
    // For English, you might want to support USD conversion
    // For now, show as RMB equivalent
    return `¥${yuan.toFixed(2)}`
  }
  
  return `¥${yuan.toFixed(2)}`
}

/**
 * Get language preference from storage
 * @returns {string} 'zh' or 'en'
 */
export function getLanguagePreference() {
  try {
    const saved = uni.getStorageSync('languagePreference')
    if (saved === 'zh' || saved === 'en') {
      return saved
    }
  } catch (e) {
    // Storage not available
  }
  return 'zh' // Default to Chinese
}

/**
 * Set language preference in storage
 * @param {string} locale - 'zh' or 'en'
 */
export function setLanguagePreference(locale) {
  if (locale !== 'zh' && locale !== 'en') {
    console.warn('Invalid locale, defaulting to zh')
    locale = 'zh'
  }
  
  try {
    uni.setStorageSync('languagePreference', locale)
  } catch (e) {
    console.warn('Failed to save language preference:', e)
  }
}
