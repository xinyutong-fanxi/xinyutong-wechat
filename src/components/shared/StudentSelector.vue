<template>
  <view class="student-selector">
    <text class="selector-label" v-if="label">{{ label }}</text>
    <view class="students-grid">
      <view 
        class="student-option" 
        v-for="student in students" 
        :key="student._id"
        :class="{ selected: selectedStudentId === student._id }"
        @click="selectStudent(student)"
      >
        <view class="student-avatar-wrapper">
          <text class="student-initial">{{ getInitial(student.name) }}</text>
        </view>
        <text class="student-name">{{ student.name }}</text>
        <text class="student-info">{{ student.grade }} | {{ student.age }}岁</text>
        <text class="check-icon" v-if="selectedStudentId === student._id">✓</text>
      </view>
      <view class="student-option add-new" @click="handleAddNew" v-if="showAddNew">
        <text class="add-icon">+</text>
        <text class="add-text">添加学生</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  students: {
    type: Array,
    required: true,
    default: () => []
  },
  selectedStudentId: {
    type: String,
    default: null
  },
  label: {
    type: String,
    default: '选择学生'
  },
  showAddNew: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['select', 'add-new'])

function getInitial(name) {
  if (!name) return '?'
  return name.charAt(0).toUpperCase()
}

function selectStudent(student) {
  emit('select', student)
}

function handleAddNew() {
  emit('add-new')
}
</script>

<style scoped>
.student-selector {
  width: 100%;
}

.selector-label {
  font-size: 28rpx;
  color: #333;
  font-weight: bold;
  display: block;
  margin-bottom: 20rpx;
}

.students-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
}

.student-option {
  background: transparent; /* Inherit paper texture */
  border: 2rpx solid #ddd;
  border-radius: 16rpx;
  padding: 30rpx 20rpx;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10rpx;
  position: relative;
}

.student-option.selected {
  border-color: #D60000;
  background: #e6f3ff;
}

.student-avatar-wrapper {
  width: 80rpx;
  height: 80rpx;
  border-radius: 40rpx;
  background: #D60000;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10rpx;
}

.student-option.selected .student-avatar-wrapper {
  background: #0051d5;
}

.student-initial {
  font-size: 32rpx;
  font-weight: bold;
  color: white;
}

.student-name {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
}

.student-info {
  font-size: 22rpx;
  color: #666;
}

.check-icon {
  position: absolute;
  top: 10rpx;
  right: 10rpx;
  width: 40rpx;
  height: 40rpx;
  border-radius: 20rpx;
  background: #D60000;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
}

.student-option.add-new {
  border-style: dashed;
  border-color: #ccc;
  background: white;
}

.add-icon {
  font-size: 48rpx;
  color: #D60000;
  margin-bottom: 10rpx;
}

.add-text {
  font-size: 24rpx;
  color: #666;
}
</style>
