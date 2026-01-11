<template>
  <view class="withdrawal-review">
    <view class="withdrawal-info-section">
      <text class="section-title">提现信息</text>
      <view class="info-row">
        <text class="label">提现单号</text>
        <text class="value">{{ withdrawal.withdrawalNo }}</text>
      </view>
      <view class="info-row">
        <text class="label">申请人</text>
        <text class="value">{{ withdrawal.applicantName }}</text>
      </view>
      <view class="info-row">
        <text class="label">申请人类型</text>
        <text class="value">{{ getApplicantType(withdrawal.applicantType) }}</text>
      </view>
      <view class="info-row">
        <text class="label">提现金额</text>
        <MoneyDisplay :amount="withdrawal.amount" :size="'large'" />
      </view>
      <view class="info-row">
        <text class="label">申请时间</text>
        <text class="value">{{ formatDateTime(withdrawal.submittedAt) }}</text>
      </view>
      <view class="info-row" v-if="withdrawal.status === 'rejected'">
        <text class="label">拒绝原因</text>
        <text class="value">{{ withdrawal.rejectionReason || '无' }}</text>
      </view>
    </view>
    
    <view class="commissions-section" v-if="withdrawal.commissionIds && withdrawal.commissionIds.length > 0">
      <text class="section-title">关联佣金</text>
      <view 
        class="commission-item" 
        v-for="commission in commissions" 
        :key="commission._id"
      >
        <text class="commission-order">订单: {{ commission.orderNo }}</text>
        <text class="commission-amount">￥{{ (commission.amount / 100).toFixed(2) }}</text>
      </view>
    </view>
    
    <view class="actions-section" v-if="withdrawal.status === 'pending'">
      <button class="action-button reject" @click="handleReject" :disabled="processing || loading" :loading="processing">
        {{ processing ? '处理中...' : '拒绝申请' }}
      </button>
      <button class="action-button approve" @click="handleApprove" :disabled="processing || loading" :loading="processing">
        {{ processing ? '处理中...' : '通过并转账' }}
      </button>
    </view>
    <view class="loading-state" v-if="loading">
      <text>加载中...</text>
    </view>
    
    <view class="status-section" v-else>
      <text class="status-text">状态: {{ getStatusText(withdrawal.status) }}</text>
      <text class="status-time" v-if="withdrawal.reviewedAt">
        审核时间: {{ formatDateTime(withdrawal.reviewedAt) }}
      </text>
      <text class="status-time" v-if="withdrawal.completedAt">
        完成时间: {{ formatDateTime(withdrawal.completedAt) }}
      </text>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import MoneyDisplay from '../../../components/shared/MoneyDisplay.vue'
import { getWithdrawalDetails, approveWithdrawal } from '../../../utils/cloud/adminApi.js'

const withdrawal = ref({
  _id: '',
  withdrawalNo: '',
  applicantName: '',
  applicantType: 'teacher',
  amount: 0,
  submittedAt: null,
  status: 'pending',
  rejectionReason: null,
  commissionIds: [],
  reviewedAt: null,
  completedAt: null
})

const commissions = ref([])
const loading = ref(false)
const processing = ref(false)

onLoad(async (options) => {
  if (options.id) {
    withdrawal.value._id = options.id
    await loadWithdrawalDetails()
  }
})

async function loadWithdrawalDetails() {
  loading.value = true
  try {
    const withdrawalData = await getWithdrawalDetails(withdrawal.value._id)
    withdrawal.value = {
      ...withdrawal.value,
      ...withdrawalData
    }
    
    // TODO: Load associated commissions if commissionIds exist
    // if (withdrawal.value.commissionIds && withdrawal.value.commissionIds.length > 0) {
    //   const commissionsData = await getCommissionsByIds(withdrawal.value.commissionIds)
    //   commissions.value = commissionsData || []
    // }
    
    commissions.value = []
  } catch (error) {
    console.error('Failed to load withdrawal details:', error)
    uni.showToast({
      title: '加载失败',
      icon: 'none'
    })
  } finally {
    loading.value = false
  }
}

function getApplicantType(type) {
  const typeMap = {
    teacher: '老师',
    distributor: '推广员'
  }
  return typeMap[type] || type
}

function getStatusText(status) {
  const statusMap = {
    pending: '待审核',
    approved: '已通过',
    rejected: '已拒绝',
    completed: '已完成'
  }
  return statusMap[status] || status
}

function formatDateTime(timestamp) {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

async function handleReject() {
  uni.showModal({
    title: '拒绝提现',
    editable: true,
    placeholderText: '请输入拒绝原因',
    success: async (res) => {
      if (res.confirm) {
        const reason = res.content || '审核未通过'
        
        if (!reason.trim()) {
          uni.showToast({ title: '请输入拒绝原因', icon: 'none' })
          return
        }
        
        processing.value = true
        
        try {
          const result = await approveWithdrawal({
            withdrawalId: withdrawal.value._id,
            action: 'reject',
            rejectionReason: reason.trim()
          })
          
          if (result.error) {
            throw new Error(result.message || '拒绝失败')
          }
          
          uni.showToast({ title: '已拒绝', icon: 'success' })
          setTimeout(() => {
            uni.navigateBack()
          }, 1500)
        } catch (error) {
          console.error('Reject withdrawal error:', error)
          uni.showToast({
            title: error.message || '拒绝失败',
            icon: 'none'
          })
        } finally {
          processing.value = false
        }
      }
    }
  })
}

async function handleApprove() {
  uni.showModal({
    title: '确认通过',
    content: `确定要通过这个提现申请并转账 ￥${(withdrawal.value.amount / 100).toFixed(2)} 吗？`,
    success: async (res) => {
      if (res.confirm) {
        processing.value = true
        
        try {
          const result = await approveWithdrawal({
            withdrawalId: withdrawal.value._id,
            action: 'approve'
          })
          
          if (result.error) {
            throw new Error(result.message || '审批失败')
          }
          
          uni.showToast({ 
            title: result.message || '已通过，转账处理中', 
            icon: 'success' 
          })
          
          // Reload withdrawal details to reflect status change
          setTimeout(() => {
            loadWithdrawalDetails()
          }, 1500)
        } catch (error) {
          console.error('Approve withdrawal error:', error)
          uni.showToast({
            title: error.message || '审批失败',
            icon: 'none'
          })
        } finally {
          processing.value = false
        }
      }
    }
  })
}
</script>

<style scoped>
.withdrawal-review {
  padding: 20rpx;
  min-height: 100vh;
  background-color: #F2F2F2;
}

.withdrawal-info-section, .commissions-section {
  background: white;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  display: block;
  margin-bottom: 30rpx;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.label {
  font-size: 28rpx;
  color: #666;
}

.value {
  font-size: 28rpx;
  color: #333;
  font-weight: bold;
}

.value.price {
  font-size: 36rpx;
  color: #ff6600;
}

.commissions-section {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.commission-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx;
  background: #F2F2F2;
  border-radius: 8rpx;
}

.commission-order {
  font-size: 26rpx;
  color: #666;
}

.commission-amount {
  font-size: 28rpx;
  font-weight: bold;
  color: #ff6600;
}

.actions-section {
  display: flex;
  gap: 20rpx;
  margin-top: 40rpx;
}

.action-button {
  flex: 1;
  padding: 30rpx;
  border-radius: 8rpx;
  font-size: 32rpx;
}

.action-button.reject {
  background: white;
  color: #ff3b30;
  border: 2rpx solid #ff3b30;
}

.action-button.approve {
  background: #28a745;
  color: white;
}

.status-section {
  background: white;
  border-radius: 16rpx;
  padding: 30rpx;
  text-align: center;
  margin-top: 40rpx;
  display: flex;
  flex-direction: column;
  gap: 15rpx;
}

.status-text {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.status-time {
  font-size: 26rpx;
  color: #666;
}

.action-button[disabled] {
  opacity: 0.6;
}

.loading-state {
  text-align: center;
  padding: 100rpx 0;
  color: #999;
  font-size: 28rpx;
}
</style>
