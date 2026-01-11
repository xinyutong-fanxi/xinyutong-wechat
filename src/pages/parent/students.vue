<template>
  <view class="students-page">
    <view class="header-actions">
      <button class="add-button" @click="navigateTo('/pages/parent/students/create')">
        + 添加学生
      </button>
    </view>
    
    <view class="students-list">
      <view 
        class="student-card" 
        v-for="student in students" 
        :key="student._id"
        @click="navigateTo(`/pages/parent/students/edit?id=${student._id}`)"
      >
        <view class="student-info">
          <text class="student-name">{{ student.name }}</text>
          <text class="student-grade">{{ student.grade }} | {{ student.age }}岁</text>
        </view>
        <text class="arrow">></text>
      </view>
      
      <view class="empty-state" v-if="students.length === 0 && !loading">
        <text>暂无学生，点击添加</text>
      </view>
      <view class="loading-state" v-if="loading">
        <text>加载中...</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getStudents } from '../../utils/cloud/studentApi.js'

const students = ref([])
const loading = ref(false)

function navigateTo(url) {
  uni.navigateTo({ url })
}

async function loadStudents() {
  loading.value = true
  try {
    students.value = await getStudents()
  } catch (error) {
    console.error('Failed to load students:', error)
    uni.showToast({
      title: '加载失败',
      icon: 'none'
    })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadStudents()
})
</script>

<style scoped>
.students-page {
  padding: 20rpx;
  min-height: 100vh;
  background-color: transparent; /* Inherit paper texture */
}

.header-actions {
  margin-bottom: 20rpx;
}

.add-button {
  width: 100%;
  background: #D60000;
  color: white;
  border-radius: 8rpx;
  padding: 20rpx;
  font-size: 32rpx;
}

.students-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.student-card {
  background: white;
  border-radius: 16rpx;
  padding: 30rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05);
}

.student-info {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

.student-name {
  font-size: 32rpx;
  font-weight: bold;
}

.student-grade {
  font-size: 28rpx;
  color: #666;
}

.arrow {
  font-size: 32rpx;
  color: #ccc;
}

.empty-state, .loading-state {
  text-align: center;
  padding: 100rpx 0;
  color: #999;
  font-size: 28rpx;
}
</style>
