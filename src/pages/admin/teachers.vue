<template>
  <view class="admin-teachers">
    <view class="tabs">
      <text 
        class="tab" 
        :class="{ active: activeTab === 'pending' }"
        @click="handleTabChange('pending')"
      >
        待审核
      </text>
      <text 
        class="tab" 
        :class="{ active: activeTab === 'approved' }"
        @click="handleTabChange('approved')"
      >
        已通过
      </text>
      <text 
        class="tab" 
        :class="{ active: activeTab === 'rejected' }"
        @click="handleTabChange('rejected')"
      >
        已拒绝
      </text>
    </view>
    
    <view class="teachers-list">
      <view 
        class="teacher-card" 
        v-for="teacher in filteredTeachers" 
        :key="teacher._id"
        @click="navigateTo(`/pages/admin/teachers/audit?id=${teacher._id}`)"
      >
        <view class="teacher-header">
          <text class="teacher-name">{{ teacher.name }}</text>
          <text class="status-badge" :class="teacher.status">{{ getStatusText(teacher.status) }}</text>
        </view>
        <view class="teacher-info">
          <text class="info-item">职称: {{ teacher.title }}</text>
          <text class="info-item">学历: {{ teacher.credentials.university }}</text>
          <text class="info-item">专业: {{ teacher.expertise.join(', ') }}</text>
          <text class="info-item">申请时间: {{ formatDate(teacher.createdAt) }}</text>
        </view>
      </view>
      
      <view class="empty-state" v-if="filteredTeachers.length === 0 && !loading">
        <text>暂无老师</text>
      </view>
      <view class="loading-state" v-if="loading">
        <text>加载中...</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getTeachers } from '../../utils/cloud/adminApi.js'

const activeTab = ref('pending')
const teachers = ref([])
const loading = ref(false)

const filteredTeachers = computed(() => {
  return teachers.value.filter(t => {
    if (activeTab.value === 'pending') return t.status === 'pending'
    if (activeTab.value === 'approved') return t.status === 'approved'
    if (activeTab.value === 'rejected') return t.status === 'rejected'
    return false
  })
})

function navigateTo(url) {
  uni.navigateTo({ url })
}

function getStatusText(status) {
  const statusMap = {
    pending: '待审核',
    approved: '已通过',
    rejected: '已拒绝',
    suspended: '已暂停'
  }
  return statusMap[status] || status
}

function formatDate(timestamp) {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

async function loadTeachers() {
  loading.value = true
  try {
    const result = await getTeachers({
      status: activeTab.value === 'pending' ? 'pending' : activeTab.value === 'approved' ? 'approved' : 'rejected',
      page: 1,
      pageSize: 50
    })
    teachers.value = result.teachers || []
  } catch (error) {
    console.error('Failed to load teachers:', error)
    uni.showToast({
      title: '加载失败',
      icon: 'none'
    })
  } finally {
    loading.value = false
  }
}

function handleTabChange(tab) {
  activeTab.value = tab
  loadTeachers()
}

onMounted(() => {
  loadTeachers()
})
</script>

<style scoped>
.admin-teachers {
  padding: 20rpx;
  min-height: 100vh;
  background-color: transparent; /* Inherit paper texture */
}

.tabs {
  display: flex;
  gap: 0;
  background: white;
  border-radius: 16rpx;
  padding: 10rpx;
  margin-bottom: 20rpx;
}

.tab {
  flex: 1;
  text-align: center;
  padding: 20rpx;
  font-size: 28rpx;
  color: #666;
  border-radius: 8rpx;
}

.tab.active {
  background: #4A90E2;
  color: white;
}

.teachers-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.teacher-card {
  background: white;
  border-radius: 16rpx;
  padding: 30rpx;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05);
}

.teacher-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.teacher-name {
  font-size: 32rpx;
  font-weight: bold;
}

.status-badge {
  font-size: 24rpx;
  padding: 6rpx 16rpx;
  border-radius: 12rpx;
}

.status-badge.pending {
  background: #fff3cd;
  color: #856404;
}

.status-badge.approved {
  background: #d4edda;
  color: #155724;
}

.status-badge.rejected {
  background: #f8d7da;
  color: #721c24;
}

.teacher-info {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

.info-item {
  font-size: 26rpx;
  color: #666;
}

.empty-state, .loading-state {
  text-align: center;
  padding: 100rpx 0;
  color: #999;
  font-size: 28rpx;
}
</style>
