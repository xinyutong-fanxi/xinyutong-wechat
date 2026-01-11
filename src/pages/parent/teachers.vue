<template>
  <view class="teachers-page">
    <view class="search-bar">
      <input 
        v-model="searchKeyword" 
        type="text" 
        placeholder="搜索老师/咨询师"
        class="search-input"
        @input="handleSearch"
      />
      <text class="search-icon">🔍</text>
    </view>
    
    <view class="filter-tabs">
      <text 
        class="filter-tab" 
        :class="{ active: selectedExpertise === 'all' }"
        @click="selectExpertise('all')"
      >
        全部
      </text>
      <text 
        class="filter-tab" 
        v-for="exp in expertiseList" 
        :key="exp"
        :class="{ active: selectedExpertise === exp }"
        @click="selectExpertise(exp)"
      >
        {{ exp }}
      </text>
    </view>
    
    <view class="teachers-list">
      <TeacherCard 
        v-for="teacher in filteredTeachers" 
        :key="teacher._id"
        :teacher="teacher"
        @click="handleTeacherClick(teacher)"
      />
      
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
import { ref, computed, onMounted, watch } from 'vue'
import TeacherCard from '../../components/shared/TeacherCard.vue'
import { getTeachers } from '../../utils/cloud/teacherApi.js'

const searchKeyword = ref('')
const selectedExpertise = ref('all')
const teachers = ref([])
const loading = ref(false)
const expertiseList = ref(['心理辅导', '学习指导', '情绪管理', '行为矫正'])

const filteredTeachers = computed(() => {
  let filtered = teachers.value
  
  // Filter by expertise
  if (selectedExpertise.value !== 'all') {
    filtered = filtered.filter(t => t.expertise && t.expertise.includes(selectedExpertise.value))
  }
  
  // Filter by search keyword
  if (searchKeyword.value.trim()) {
    const keyword = searchKeyword.value.trim().toLowerCase()
    filtered = filtered.filter(t => {
      const name = (t.name || '').toLowerCase()
      const title = (t.title || '').toLowerCase()
      const bio = (t.bio || '').toLowerCase()
      return name.includes(keyword) || title.includes(keyword) || bio.includes(keyword)
    })
  }
  
  return filtered
})

function navigateTo(url) {
  uni.navigateTo({ url })
}

function handleTeacherClick(teacher) {
  navigateTo(`/pages/parent/teachers/detail?id=${teacher._id}`)
}

function handleSearch() {
  // Search happens automatically via computed filter
}

function selectExpertise(exp) {
  selectedExpertise.value = exp
}

async function loadTeachers() {
  loading.value = true
  try {
    const result = await getTeachers({
      expertise: selectedExpertise.value === 'all' ? null : selectedExpertise.value,
      searchKeyword: searchKeyword.value.trim() || null
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

watch([selectedExpertise, searchKeyword], () => {
  // Debounce search
  clearTimeout(searchDebounceTimer.value)
  searchDebounceTimer.value = setTimeout(() => {
    loadTeachers()
  }, 500)
}, { deep: true })

const searchDebounceTimer = ref(null)

onMounted(() => {
  loadTeachers()
})
</script>

<style scoped>
.teachers-page {
  padding: 20rpx;
  min-height: 100vh;
  background-color: #F2F2F2;
}

.search-bar {
  position: relative;
  margin-bottom: 20rpx;
}

.search-input {
  width: 100%;
  background: white;
  border-radius: 40rpx;
  padding: 20rpx 60rpx 20rpx 30rpx;
  font-size: 28rpx;
}

.search-icon {
  position: absolute;
  right: 30rpx;
  top: 50%;
  transform: translateY(-50%);
  font-size: 32rpx;
}

.filter-tabs {
  display: flex;
  gap: 20rpx;
  margin-bottom: 20rpx;
  overflow-x: auto;
  white-space: nowrap;
}

.filter-tab {
  padding: 10rpx 20rpx;
  background: white;
  border-radius: 20rpx;
  font-size: 26rpx;
  color: #666;
}

.filter-tab.active {
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
  display: flex;
  gap: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05);
}

.teacher-avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 60rpx;
  flex-shrink: 0;
}

.teacher-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

.teacher-name {
  font-size: 32rpx;
  font-weight: bold;
}

.teacher-title {
  font-size: 26rpx;
  color: #666;
}

.teacher-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10rpx;
}

.tag {
  font-size: 22rpx;
  color: #4A90E2;
  background: #e6f3ff;
  padding: 4rpx 12rpx;
  border-radius: 8rpx;
}

.teacher-stats {
  display: flex;
  gap: 20rpx;
  margin-top: 10rpx;
}

.stat {
  font-size: 26rpx;
  color: #ff6600;
  font-weight: bold;
}

.empty-state, .loading-state {
  text-align: center;
  padding: 100rpx 0;
  color: #999;
  font-size: 28rpx;
}
</style>
