<script>
import { setLanguage } from './i18n'

export default {
  onLaunch() {
    // Initialize WeChat Cloud in MP-Weixin runtime.
    // Using DYNAMIC_CURRENT_ENV lets DevTools choose the currently selected env.
    // #ifdef MP-WEIXIN
    try {
      if (typeof wx !== 'undefined' && wx.cloud && wx.cloud.init) {
        wx.cloud.init({
          env: wx.cloud.DYNAMIC_CURRENT_ENV,
          traceUser: true
        })
      }
    } catch (e) {
      // Avoid crashing app startup; chat layer will surface errors.
      // eslint-disable-next-line no-console
      console.warn('[cloud] wx.cloud.init failed', e)
    }
    // #endif

    // Initialize language preference
    // Language detection is already handled in i18n/index.js
    // This ensures the preference is applied on app launch
    try {
      const saved = uni.getStorageSync('languagePreference')
      if (saved === 'zh' || saved === 'en') {
        setLanguage(saved)
      }
    } catch (e) {
      // Storage not available, use default
    }
  },
  onShow() {},
  onHide() {}
};
</script>

<style>
/* Chinese Cultural Color Scheme - Base styles */
page {
  background: #F2F2F2;
  color: #323232;
  font-family: "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Noto Sans SC",
    -apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, Arial, sans-serif;
  transition: background 0.3s ease;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Smooth transitions for all interactive elements */
button {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  -webkit-tap-highlight-color: transparent;
}

input, textarea {
  transition: all 0.25s ease;
  -webkit-tap-highlight-color: transparent;
}

/* Enhanced focus states */
button:focus,
input:focus,
textarea:focus {
  outline: none;
}
</style>
