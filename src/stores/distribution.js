/**
 * Distribution store for managing distribution stats and state
 * Uses Vue 3 Composition API reactive utilities
 */

import { ref, computed } from 'vue'

// Distribution state
const distributorInfo = ref(null)
const totalCommission = ref(0) // in cents
const availableBalance = ref(0) // in cents
const withdrawnAmount = ref(0) // in cents
const totalReferrals = ref(0)
const totalOrders = ref(0)
const referralCode = ref('')
const distributorStatus = ref('none') // 'none' | 'pending' | 'approved' | 'rejected'

/**
 * Update distributor info
 * @param {Object} info - Distributor information
 */
function setDistributorInfo(info) {
  distributorInfo.value = info
  if (info) {
    referralCode.value = info.referralCode || ''
    distributorStatus.value = info.status || 'none'
    totalCommission.value = info.totalCommissionEarned || 0
    availableBalance.value = (info.totalCommissionEarned || 0) - (info.totalWithdrawn || 0)
    withdrawnAmount.value = info.totalWithdrawn || 0
    totalReferrals.value = info.totalReferrals || 0
  }
}

/**
 * Update distribution stats
 * @param {Object} stats - Distribution statistics
 */
function updateStats(stats) {
  if (stats) {
    totalCommission.value = stats.totalCommission || totalCommission.value
    availableBalance.value = stats.availableBalance || availableBalance.value
    withdrawnAmount.value = stats.withdrawnAmount || withdrawnAmount.value
    totalReferrals.value = stats.totalReferrals || totalReferrals.value
    totalOrders.value = stats.totalOrders || totalOrders.value
  }
}

/**
 * Clear distribution state
 */
function clearDistribution() {
  distributorInfo.value = null
  totalCommission.value = 0
  availableBalance.value = 0
  withdrawnAmount.value = 0
  totalReferrals.value = 0
  totalOrders.value = 0
  referralCode.value = ''
  distributorStatus.value = 'none'
}

// Computed properties
const isDistributor = computed(() => {
  return distributorStatus.value === 'approved'
})

const isPending = computed(() => {
  return distributorStatus.value === 'pending'
})

const isRejected = computed(() => {
  return distributorStatus.value === 'rejected'
})

const hasReferralCode = computed(() => {
  return !!referralCode.value
})

const canWithdraw = computed(() => {
  return isDistributor.value && availableBalance.value > 0
})

export function useDistributionStore() {
  return {
    // State
    distributorInfo: computed(() => distributorInfo.value),
    totalCommission: computed(() => totalCommission.value),
    availableBalance: computed(() => availableBalance.value),
    withdrawnAmount: computed(() => withdrawnAmount.value),
    totalReferrals: computed(() => totalReferrals.value),
    totalOrders: computed(() => totalOrders.value),
    referralCode: computed(() => referralCode.value),
    distributorStatus: computed(() => distributorStatus.value),
    
    // Computed
    isDistributor,
    isPending,
    isRejected,
    hasReferralCode,
    canWithdraw,
    
    // Methods
    setDistributorInfo,
    updateStats,
    clearDistribution
  }
}
