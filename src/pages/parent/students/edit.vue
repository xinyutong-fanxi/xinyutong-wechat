<template>
  <view class="edit-student">
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
      
      <button class="submit-button" formType="submit" :disabled="!isFormValid">
        保存修改
      </button>
    </form>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { updateStudent } from '../../../utils/cloud/studentApi.js'

const formData = ref({
  _id: '',
  name: '',
  age: null,
  grade: ''
})

const grades = ref(['小学一年级', '小学二年级', '小学三年级', '小学四年级', '小学五年级', '小学六年级', '初中一年级', '初中二年级', '初中三年级', '高中一年级', '高中二年级', '高中三年级'])
const gradeIndex = ref(0)

const isFormValid = computed(() => {
  return formData.value.name && formData.value.age && formData.value.grade
})

onLoad(async (options) => {
  if (options.id) {
    formData.value._id = options.id
    await loadStudentData()
  }
})

async function loadStudentData() {
  try {
    const { getStudentDetails } = await import('../../../utils/cloud/studentApi.js')
    const studentData = await getStudentDetails(formData.value._id)
    if (studentData) {
      formData.value.name = studentData.name || ''
      formData.value.age = studentData.age || 0
      formData.value.grade = studentData.grade || '一年级'
      formData.value.authorizationLevel = studentData.authorizationLevel || 'summary'
      
      // Set grade index
      const foundIndex = grades.value.indexOf(formData.value.grade)
      if (foundIndex >= 0) {
        gradeIndex.value = foundIndex
      }
    }
  } catch (error) {
    console.error('Failed to load student data:', error)
    uni.showToast({
      title: '加载失败',
      icon: 'none'
    })
  }
}

function onGradeChange(e) {
  gradeIndex.value = e.detail.value
  formData.value.grade = grades.value[e.detail.value]
}

async function handleSubmit(e) {
  if (!isFormValid.value) {
    uni.showToast({ title: '请填写完整信息', icon: 'none' })
    return
  }
  
  try {
    const result = await updateStudent(formData.value._id, {
      name: formData.value.name,
      age: formData.value.age,
      grade: formData.value.grade
    })
    
    uni.showToast({ title: '保存成功', icon: 'success' })
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  } catch (error) {
    console.error('Failed to update student:', error)
    uni.showToast({
      title: error.message || '保存失败',
      icon: 'none'
    })
  }
}
</script>

<style scoped>
.edit-student {
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
