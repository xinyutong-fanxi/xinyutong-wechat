<template>
  <view class="create-student">
    <form @submit="handleSubmit">
      <view class="form-item">
        <text class="label">学生姓名</text>
        <input 
          v-model="formData.name" 
          type="text" 
          placeholder="请输入学生姓名"
          class="input"
        />
      </view>
      
      <view class="form-item">
        <text class="label">年龄</text>
        <input 
          v-model.number="formData.age" 
          type="number" 
          placeholder="请输入年龄"
          class="input"
        />
      </view>
      
      <view class="form-item">
        <text class="label">年级</text>
        <picker 
          mode="selector" 
          :range="grades" 
          :value="gradeIndex"
          @change="onGradeChange"
        >
          <view class="picker-view">{{ formData.grade || '请选择年级' }}</view>
        </picker>
      </view>
      
      <view class="form-item">
        <text class="label">数据授权级别</text>
        <picker 
          mode="selector" 
          :range="authorizationLevels" 
          range-key="label"
          :value="authLevelIndex"
          @change="onAuthLevelChange"
        >
          <view class="picker-view">{{ formDataAuthorizationLevelText || '请选择授权级别' }}</view>
        </picker>
      </view>
      
      <button class="submit-button" formType="submit" :disabled="!isFormValid">
        创建学生档案
      </button>
    </form>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { createStudent } from '../../../utils/cloud/studentApi.js'

// getCurrentPages is available globally in WeChat Mini Program runtime (no import needed)
// eslint-disable-next-line no-undef
const getCurrentPagesInstance = () => (typeof getCurrentPages !== 'undefined' ? getCurrentPages() : [])

const formData = ref({
  name: '',
  age: null,
  grade: '',
  authorizationLevel: 'summary'
})

const grades = ref(['小学一年级', '小学二年级', '小学三年级', '小学四年级', '小学五年级', '小学六年级', '初中一年级', '初中二年级', '初中三年级', '高中一年级', '高中二年级', '高中三年级'])
const gradeIndex = ref(0)

const authorizationLevels = ref([
  { value: 'full', label: '完整访问' },
  { value: 'summary', label: '摘要访问' },
  { value: 'alerts_only', label: '仅警报' }
])
const authLevelIndex = ref(1)

const formDataAuthorizationLevelText = computed(() => {
  const level = authorizationLevels.value.find(l => l.value === formData.value.authorizationLevel)
  return level ? level.label : '摘要访问'
})

const isFormValid = computed(() => {
  return formData.value.name && formData.value.age && formData.value.grade
})

function onGradeChange(e) {
  gradeIndex.value = e.detail.value
  formData.value.grade = grades.value[e.detail.value]
}

function onAuthLevelChange(e) {
  authLevelIndex.value = e.detail.value
  formData.value.authorizationLevel = authorizationLevels.value[e.detail.value].value
}

async function handleSubmit(e) {
  if (!isFormValid.value) {
    uni.showToast({ title: '请填写完整信息', icon: 'none' })
    return
  }
  
  try {
    const result = await createStudent({
      name: formData.value.name,
      age: formData.value.age,
      grade: formData.value.grade,
      authorizationLevel: formData.value.authorizationLevel
    })
    
    uni.showToast({ title: '创建成功', icon: 'success' })
    setTimeout(() => {
      // Check if we should return to booking flow
      const pages = getCurrentPagesInstance()
      const prevPage = pages[pages.length - 2]
      if (prevPage && prevPage.route === 'pages/parent/bookings/create') {
        uni.navigateBack()
      } else {
        uni.redirectTo({ url: '/pages/parent/students' })
      }
    }, 1500)
  } catch (error) {
    console.error('Failed to create student:', error)
    uni.showToast({
      title: error.message || '创建失败',
      icon: 'none'
    })
  }
}
</script>

<style scoped>
.create-student {
  padding: 20rpx;
  min-height: 100vh;
  background-color: transparent; /* Inherit paper texture */
}

.form-item {
  background: white;
  padding: 30rpx;
  margin-bottom: 20rpx;
  border-radius: 16rpx;
}

.label {
  font-size: 28rpx;
  color: #333;
  display: block;
  margin-bottom: 20rpx;
}

.input {
  width: 100%;
  font-size: 32rpx;
  padding: 10rpx 0;
}

.picker-view {
  font-size: 32rpx;
  color: #333;
  padding: 10rpx 0;
}

.submit-button {
  width: 100%;
  background: #D60000;
  color: white;
  border-radius: 8rpx;
  padding: 30rpx;
  font-size: 32rpx;
  margin-top: 40rpx;
}

.submit-button[disabled] {
  background: #ccc;
}
</style>
