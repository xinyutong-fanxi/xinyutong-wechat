<template>
  <view class="poster-page">
    <view class="poster-preview">
      <image :src="posterImageUrl" class="poster-image" mode="aspectFit" v-if="posterImageUrl" />
      <view class="loading" v-if="generating">
        <text>生成中...</text>
      </view>
      <view class="empty-poster" v-if="!posterImageUrl && !generating">
        <text>点击下方按钮生成推广海报</text>
      </view>
    </view>
    
    <view class="referral-code-section" v-if="referralCode">
      <text class="code-label">我的推广码:</text>
      <text class="code-value">{{ referralCode }}</text>
      <button class="copy-button" @click="copyReferralCode">复制</button>
    </view>
    
    <view class="actions">
      <button class="action-button" @click="generatePosterImage" :disabled="generating" :loading="generating">
        {{ generating ? '生成中...' : '重新生成' }}
      </button>
      <button class="action-button primary" @click="savePoster" v-if="posterImageUrl" :disabled="generating">
        保存到相册
      </button>
      <button class="action-button primary" @click="sharePoster" v-if="posterImageUrl" :disabled="generating">
        分享海报
      </button>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { generatePoster } from '../../../utils/cloud/distributionApi.js'

const posterImageUrl = ref('')
const qrCodeUrl = ref('')
const referralCode = ref('')
const generating = ref(false)

async function generatePosterImage() {
  generating.value = true
  
  try {
    const result = await generatePoster('default')
    
    if (result.error) {
      throw new Error(result.message || '生成失败')
    }
    
    posterImageUrl.value = result.posterUrl || ''
    qrCodeUrl.value = result.qrCodeUrl || ''
    referralCode.value = result.referralCode || ''
    
    uni.showToast({ title: '生成成功', icon: 'success' })
  } catch (error) {
    console.error('Generate poster error:', error)
    uni.showToast({
      title: error.message || '生成失败',
      icon: 'none'
    })
  } finally {
    generating.value = false
  }
}

async function savePoster() {
  if (!posterImageUrl.value) {
    uni.showToast({ title: '请先生成海报', icon: 'none' })
    return
  }
  
  try {
    // #ifdef MP-WEIXIN
    // Download image and save to album
    uni.downloadFile({
      url: posterImageUrl.value,
      success: (res) => {
        if (res.statusCode === 200) {
          uni.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: () => {
              uni.showToast({ title: '已保存到相册', icon: 'success' })
            },
            fail: (err) => {
              console.error('Save image error:', err)
              uni.showToast({ title: '保存失败', icon: 'none' })
            }
          })
        }
      },
      fail: (err) => {
        console.error('Download image error:', err)
        uni.showToast({ title: '下载失败', icon: 'none' })
      }
    })
    // #endif
    
    // #ifndef MP-WEIXIN
    uni.showToast({ title: '保存功能仅在微信小程序中可用', icon: 'none' })
    // #endif
  } catch (error) {
    console.error('Save poster error:', error)
    uni.showToast({
      title: error.message || '保存失败',
      icon: 'none'
    })
  }
}

function sharePoster() {
  if (!posterImageUrl.value) {
    uni.showToast({ title: '请先生成海报', icon: 'none' })
    return
  }
  
  // #ifdef MP-WEIXIN
  // Use WeChat share to friends or moments
  uni.showShareMenu({
    withShareTicket: true,
    menus: ['shareAppMessage', 'shareTimeline']
  })
  
  uni.showToast({ title: '请使用右上角分享按钮', icon: 'none' })
  // #endif
  
  // #ifndef MP-WEIXIN
  uni.showToast({ title: '分享功能仅在微信小程序中可用', icon: 'none' })
  // #endif
}

function copyReferralCode() {
  if (!referralCode.value) {
    uni.showToast({ title: '推广码不存在', icon: 'none' })
    return
  }
  
  // #ifdef MP-WEIXIN
  uni.setClipboardData({
    data: referralCode.value,
    success: () => {
      uni.showToast({ title: '已复制到剪贴板', icon: 'success' })
    },
    fail: () => {
      uni.showToast({ title: '复制失败', icon: 'none' })
    }
  })
  // #endif
  
  // #ifndef MP-WEIXIN
  uni.showToast({ title: '复制功能仅在微信小程序中可用', icon: 'none' })
  // #endif
}

onMounted(() => {
  generatePosterImage()
})
</script>

<style scoped>
.poster-page {
  padding: 20rpx;
  min-height: 100vh;
  background-color: #F2F2F2;
}

.poster-preview {
  background: white;
  border-radius: 16rpx;
  padding: 40rpx;
  margin-bottom: 30rpx;
  min-height: 600rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.poster-image {
  width: 100%;
  max-width: 600rpx;
  border-radius: 12rpx;
}

.loading {
  color: #999;
  font-size: 28rpx;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.action-button {
  width: 100%;
  background: white;
  color: #4A90E2;
  border: 2rpx solid #4A90E2;
  border-radius: 8rpx;
  padding: 25rpx;
  font-size: 32rpx;
}

.action-button.primary {
  background: #4A90E2;
  color: white;
}

.action-button[disabled] {
  opacity: 0.6;
}

.referral-code-section {
  background: white;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  display: flex;
  align-items: center;
  gap: 20rpx;
  flex-wrap: wrap;
}

.code-label {
  font-size: 28rpx;
  color: #666;
}

.code-value {
  flex: 1;
  font-size: 32rpx;
  font-weight: bold;
  color: #4A90E2;
  text-align: center;
}

.copy-button {
  padding: 15rpx 30rpx;
  background: #4A90E2;
  color: white;
  border-radius: 8rpx;
  font-size: 26rpx;
}

.empty-poster {
  color: #999;
  font-size: 28rpx;
  text-align: center;
}
</style>
