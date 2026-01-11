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
/* Chinese Painting Aesthetic - Rice Paper Background with Ink Wash */
page {
  /* Rice paper base - warm, slightly yellowed */
  background-color: #F5F1E8;
  /* Rice paper texture pattern */
  background-image: 
    /* Subtle paper grain texture */
    repeating-linear-gradient(
      0deg,
      rgba(242, 238, 230, 0.03) 0px,
      transparent 1px,
      transparent 2px,
      rgba(242, 238, 230, 0.03) 3px
    ),
    repeating-linear-gradient(
      90deg,
      rgba(242, 238, 230, 0.03) 0px,
      transparent 1px,
      transparent 2px,
      rgba(242, 238, 230, 0.03) 3px
    ),
    /* Aged paper effect - subtle yellowing gradients */
    radial-gradient(circle at 20% 30%, rgba(250, 245, 235, 0.4) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(248, 242, 232, 0.3) 0%, transparent 50%),
    /* Ink wash effects - soft gradients */
    radial-gradient(circle at 10% 80%, rgba(50, 50, 50, 0.02) 0%, transparent 40%),
    radial-gradient(circle at 90% 20%, rgba(50, 50, 50, 0.015) 0%, transparent 35%);
  background-size:
    100% 100%,
    100% 100%,
    100% 100%,
    100% 100%,
    120% 120%,
    120% 120%;
  background-position:
    0 0,
    0 0,
    0 0,
    0 0,
    0 0,
    0 0;
  background-repeat: no-repeat;
  color: #323232;
  font-family: "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Noto Sans SC",
    -apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, Arial, sans-serif;
  transition: background 0.3s ease;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  position: relative;
}

/* Add subtle brush stroke texture overlay and wisdom silhouette */
page::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  background-image: 
    /* Wisdom character "智" (zhì) - Traditional calligraphy style (SVG data URI) */
    url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MDAgNjAwIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJ4TWlkWU1pZCBtZWV0Ij4KICA8IS0tIENoaW5lc2UgQ2hhcmFjdGVyICLmmboiIChXaXNkb20pIC0gVHJhZGl0aW9uYWwgQ2FsbGlncmFwaHkgU3R5bGUgLS0+CiAgPGcgb3BhY2l0eT0iMC4wNiI+CiAgICA8IS0tIFVzaW5nIHBhdGgtYmFzZWQgc3Ryb2tlcyBmb3IgYmV0dGVyIHJlbmRlcmluZyBjb250cm9sIC0tPgogICAgPCEtLSBTaW1wbGlmaWVkIGNhbGxpZ3JhcGh5IHN0cm9rZXMgZm9yIOaZuiAoemjDrCkgLS0+CiAgICAKICAgIDwhLS0gVG9wIHJhZGljYWwgKOefpSkgc3RydWN0dXJlIC0tPgogICAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjAwLCAxODApIj4KICAgICAgPCEtLSBIb3Jpem9udGFsIHRvcCBzdHJva2VzIC0tPgogICAgICA8cGF0aCBkPSJNLTkwIC0xMDAgTDkwIC0xMDAiIHN0cm9rZT0iIzMyMzIzMiIgc3Ryb2tlLXdpZHRoPSIxMCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBvcGFjaXR5PSIwLjciLz4KICAgICAgPHBhdGggZD0iTS04MCAtNzUgTDgwIC03NSIgc3Ryb2tlPSIjMzIzMjMyIiBzdHJva2Utd2lkdGg9IjciIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgb3BhY2l0eT0iMC42Ii8+CiAgICAgIAogICAgICA8IS0tIExlZnQgdmVydGljYWwgKOefoikgLS0+CiAgICAgIDxwYXRoIGQ9Ik0tNjAgLTEwMCBMLTYwIDYwIiBzdHJva2U9IiMzMjMyMzIiIHN0cm9rZS13aWR0aD0iOSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBvcGFjaXR5PSIwLjY1Ii8+CiAgICAgIAogICAgICA8IS0tIFJpZ2h0IHZlcnRpY2FsIHN0cnVjdHVyZSAtLT4KICAgICAgPHBhdGggZD0iTTcwIC0xMDAgTDcwIDYwIiBzdHJva2U9IiMzMjMyMzIiIHN0cm9rZS13aWR0aD0iOCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBvcGFjaXR5PSIwLjYiLz4KICAgICAgCiAgICAgIDwhLS0gTWlkZGxlIGhvcml6b250YWwgLS0+CiAgICAgIDxwYXRoIGQ9Ik0tNTAgLTQwIEw1MCAtNDAiIHN0cm9rZT0iIzMyMzIzMiIgc3Ryb2tlLXdpZHRoPSI2IiBzdHJva2UtbGluZWNhcD0icm91bmQiIG9wYWNpdHk9IjAuNTUiLz4KICAgICAgCiAgICAgIDwhLS0gRGlhZ29uYWwgc3Ryb2tlcyAobW91dGggcmFkaWNhbCkgLS0+CiAgICAgIDxwYXRoIGQ9Ik0tNDAgLTYwIEwtNDAgMzAiIHN0cm9rZT0iIzMyMzIzMiIgc3Ryb2tlLXdpZHRoPSI2IiBzdHJva2UtbGluZWNhcD0icm91bmQiIG9wYWNpdHk9IjAuNSIvPgogICAgICA8cGF0aCBkPSJNLTMwIC01MCBMLTMwIDIwIiBzdHJva2U9IiMzMjMyMzIiIHN0cm9rZS13aWR0aD0iNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBvcGFjaXR5PSIwLjQ1Ii8+CiAgICA8L2c+CiAgICAKICAgIDwhLS0gQm90dG9tIHJhZGljYWwgKOaXpSkgc3RydWN0dXJlIC0tPgogICAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjAwLCAzMjApIj4KICAgICAgPCEtLSBCb3ggc2hhcGUgLS0+CiAgICAgIDxwYXRoIGQ9Ik0tNzAgLTMwIEw3MCAtMzAgTDcwIDYwIEwtNzAgNjAgWiIgc3Ryb2tlPSIjMzIzMjMyIiBzdHJva2Utd2lkdGg9IjgiIGZpbGw9Im5vbmUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgb3BhY2l0eT0iMC42Ii8+CiAgICAgIDwhLS0gSW50ZXJuYWwgaG9yaXpvbnRhbCAtLT4KICAgICAgPHBhdGggZD0iTS02MCA1IEw2MCA1IiBzdHJva2U9IiMzMjMyMzIiIHN0cm9rZS13aWR0aD0iNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBvcGFjaXR5PSIwLjUiLz4KICAgICAgPCEtLSBJbnRlcm5hbCB2ZXJ0aWNhbCAtLT4KICAgICAgPHBhdGggZD0iTTAgLTMwIEwwIDYwIiBzdHJva2U9IiMzMjMyMzIiIHN0cm9rZS13aWR0aD0iNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBvcGFjaXR5PSIwLjQ1Ii8+CiAgICA8L2c+CiAgPC9nPgo8L3N2Zz4K'),
    /* Brush stroke patterns */
    repeating-linear-gradient(
      45deg,
      transparent 0px,
      transparent 98px,
      rgba(50, 50, 50, 0.008) 99px,
      rgba(50, 50, 50, 0.008) 100px,
      transparent 101px
    ),
    repeating-linear-gradient(
      -45deg,
      transparent 0px,
      transparent 98px,
      rgba(50, 50, 50, 0.006) 99px,
      rgba(50, 50, 50, 0.006) 100px,
      transparent 101px
    );
  background-size:
    500px 700px,
    100% 100%,
    100% 100%;
  background-position:
    right bottom,
    0 0,
    0 0;
  background-repeat: no-repeat;
  opacity: 0.35;
  z-index: 0;
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
