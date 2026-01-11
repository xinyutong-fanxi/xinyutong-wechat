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
/* Minimalist Brush Stroke Aesthetic - Clean Background with Organic Ink */
page {
  /* Clean, slightly warm white base - inspired by minimalist calligraphy */
  background-color: #FAFAF8;
  /* Subtle texture pattern - very minimal */
  background-image: 
    /* Very subtle paper grain texture */
    repeating-linear-gradient(
      0deg,
      rgba(242, 242, 240, 0.015) 0px,
      transparent 2px,
      transparent 4px,
      rgba(242, 242, 240, 0.015) 5px
    ),
    repeating-linear-gradient(
      90deg,
      rgba(242, 242, 240, 0.015) 0px,
      transparent 2px,
      transparent 4px,
      rgba(242, 242, 240, 0.015) 5px
    ),
    /* Very subtle ink wash - minimal gradients */
    radial-gradient(circle at 15% 25%, rgba(50, 50, 50, 0.008) 0%, transparent 40%),
    radial-gradient(circle at 85% 75%, rgba(50, 50, 50, 0.006) 0%, transparent 35%);
  background-size:
    100% 100%,
    100% 100%,
    150% 150%,
    150% 150%;
  background-position:
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

/* Minimalist brush stroke overlay - organic ink stroke with seal */
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
    url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2MDAgODAwIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJ4TWlkWU1pZCBtZWV0Ij4KICA8IS0tIE9yZ2FuaWMgQnJ1c2ggU3Ryb2tlIC0gSW5zcGlyZWQgYnkgbWluaW1hbGlzdCBjYWxsaWdyYXBoeSAtLT4KICA8ZGVmcz4KICAgIDwhLS0gR3JhZGllbnQgZm9yIGJydXNoIHRleHR1cmUgLS0+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImJydXNoR3JhZGllbnQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMCUiIHkyPSIxMDAlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzMyMzIzMjtzdG9wLW9wYWNpdHk6MC4wOCIgLz4KICAgICAgPHN0b3Agb2Zmc2V0PSI1MCUiIHN0eWxlPSJzdG9wLWNvbG9yOiMzMjMyMzI7c3RvcC1vcGFjaXR5OjAuMTIiIC8+CiAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzMyMzIzMjtzdG9wLW9wYWNpdHk6MC4wNiIgLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8IS0tIFJlZCBhY2NlbnQgZ3JhZGllbnQgLS0+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9InJlZEJydXNoR3JhZGllbnQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMCUiIHkyPSIxMDAlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6I0Q2MDAwMDtzdG9wLW9wYWNpdHk6MC4wNCIgLz4KICAgICAgPHN0b3Agb2Zmc2V0PSI1MCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNENjAwMDA7c3RvcC1vcGFjaXR5OjAuMDYiIC8+CiAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I0Q2MDAwMDtzdG9wLW9wYWNpdHk6MC4wMyIgLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgPC9kZWZzPgogIAogIDxnIG9wYWNpdHk9IjAuMzUiPgogICAgPCEtLSBNYWluIG9yZ2FuaWMgYnJ1c2ggc3Ryb2tlIC0gZmxvd2luZywgY3VydmVkIHBhdGggLS0+CiAgICA8cGF0aCBkPSJNIDEwMCA1MCAKICAgICAgICAgICAgIFEgMTgwIDE1MCwgMjAwIDI4MAogICAgICAgICAgICAgUSAyMjAgNDIwLCAxODAgNTUwCiAgICAgICAgICAgICBRIDE2MCA2NTAsIDEyMCA3NTAiIAogICAgICAgICAgc3Ryb2tlPSJ1cmwoI2JydXNoR3JhZGllbnQpIiAKICAgICAgICAgIHN0cm9rZS13aWR0aD0iMTIwIiAKICAgICAgICAgIGZpbGw9Im5vbmUiIAogICAgICAgICAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogICAgICAgICAgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIKICAgICAgICAgIG9wYWNpdHk9IjAuOCIvPgogICAgCiAgICA8IS0tIFRleHR1cmVkIGJydXNoIGVkZ2VzIC0gb3ZlcmxheSBmb3Igb3JnYW5pYyBmZWVsIC0tPgogICAgPHBhdGggZD0iTSAxMDAgNTAgCiAgICAgICAgICAgICBRIDE4MCAxNTAsIDIwMCAyODAKICAgICAgICAgICAgIFEgMjIwIDQyMCwgMTgwIDU1MAogICAgICAgICAgICAgUSAxNjAgNjUwLCAxMjAgNzUwIiAKICAgICAgICAgIHN0cm9rZT0iIzMyMzIzMiIgCiAgICAgICAgICBzdHJva2Utd2lkdGg9IjExNSIgCiAgICAgICAgICBmaWxsPSJub25lIiAKICAgICAgICAgIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIKICAgICAgICAgIHN0cm9rZS1saW5lam9pbj0icm91bmQiCiAgICAgICAgICBvcGFjaXR5PSIwLjE1Ii8+CiAgICAKICAgIDwhLS0gUmVkIGFjY2VudCBzdHJva2UgKHN1YnRsZSkgLS0+CiAgICA8cGF0aCBkPSJNIDEyMCA4MCAKICAgICAgICAgICAgIFEgMTkwIDE4MCwgMjEwIDMwMAogICAgICAgICAgICAgUSAyMzAgNDQwLCAxOTAgNTcwCiAgICAgICAgICAgICBRIDE3MCA2NzAsIDEzMCA3NzAiIAogICAgICAgICAgc3Ryb2tlPSJ1cmwoI3JlZEJydXNoR3JhZGllbnQpIiAKICAgICAgICAgIHN0cm9rZS13aWR0aD0iOTAiIAogICAgICAgICAgZmlsbD0ibm9uZSIgCiAgICAgICAgICBzdHJva2UtbGluZWNhcD0icm91bmQiCiAgICAgICAgICBzdHJva2UtbGluZWpvaW49InJvdW5kIgogICAgICAgICAgb3BhY2l0eT0iMC42Ii8+CiAgPC9nPgogIAogIDwhLS0gU2VhbCAoQ2hvcCkgZWxlbWVudCB3aXRoIHdpc2RvbSBjaGFyYWN0ZXIgLS0+CiAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNDgwLCA2ODApIiBvcGFjaXR5PSIwLjA4Ij4KICAgIDwhLS0gUmVkIHNlYWwgYmFja2dyb3VuZCAtLT4KICAgIDxyZWN0IHg9Ii0zNSIgeT0iLTM1IiB3aWR0aD0iNzAiIGhlaWdodD0iNzAiIAogICAgICAgICAgZmlsbD0iI0Q2MDAwMCIgCiAgICAgICAgICBvcGFjaXR5PSIwLjQiCiAgICAgICAgICByeD0iMiIvPgogICAgPCEtLSBXaXNkb20gY2hhcmFjdGVyICLmmboiIHNpbXBsaWZpZWQgLS0+CiAgICA8ZyB0cmFuc2Zvcm09InNjYWxlKDAuOCkiPgogICAgICA8dGV4dCB4PSIwIiB5PSIxNSIgCiAgICAgICAgICAgIGZvbnQtZmFtaWx5PSJTVEthaXRpLCBLYWlUaSwgU2ltS2FpLCBzZXJpZiIgCiAgICAgICAgICAgIGZvbnQtc2l6ZT0iNTAiIAogICAgICAgICAgICBmaWxsPSIjMzIzMjMyIiAKICAgICAgICAgICAgdGV4dC1hbmNob3I9Im1pZGRsZSIKICAgICAgICAgICAgb3BhY2l0eT0iMC45IgogICAgICAgICAgICBmb250LXdlaWdodD0iYm9sZCI+5pm6PC90ZXh0PgogICAgPC9nPgogIDwvZz4KPC9zdmc+Cg=='),
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
  opacity: 0.4;
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
