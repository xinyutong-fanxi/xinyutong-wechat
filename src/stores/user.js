/**
 * User store for managing current user and role state
 * Uses Vue 3 Composition API reactive utilities
 */

import { ref, computed } from 'vue'
import { hasRole, getPrimaryRole } from '../utils/auth.js'

// getApp is available globally in WeChat Mini Program runtime (no import needed)
// eslint-disable-next-line no-undef
const getAppInstance = () => (typeof getApp !== 'undefined' ? getApp() : { globalData: {} })

// Reactive user state
const user = ref(null)

/**
 * Get current user from app globalData
 * @returns {Object|null}
 */
function getCurrentUser() {
  const app = getAppInstance()
  return app.globalData?.user || null
}

/**
 * Update user state from globalData
 */
function updateUser() {
  user.value = getCurrentUser()
}

/**
 * Set user in globalData and update local state
 * @param {Object} userData - User data to set
 */
function setUser(userData) {
  const app = getAppInstance()
  if (app.globalData) {
    app.globalData.user = userData
  }
  user.value = userData
}

/**
 * Clear user state
 */
function clearUser() {
  const app = getAppInstance()
  if (app.globalData) {
    app.globalData.user = null
  }
  user.value = null
}

// Computed properties
const isAuthenticated = computed(() => {
  return !!user.value && !!user.value.openid
})

const primaryRole = computed(() => {
  return getPrimaryRole(user.value)
})

const isParent = computed(() => {
  return hasRole(user.value, 'parent')
})

const isTeacher = computed(() => {
  return hasRole(user.value, 'teacher')
})

const isStudent = computed(() => {
  return hasRole(user.value, 'student')
})

const isAdmin = computed(() => {
  return hasRole(user.value, 'admin')
})

const isDistributor = computed(() => {
  return hasRole(user.value, 'distributor')
})

// Initialize user from globalData
updateUser()

export function useUserStore() {
  return {
    // State
    user: computed(() => user.value),
    
    // Computed
    isAuthenticated,
    primaryRole,
    isParent,
    isTeacher,
    isStudent,
    isAdmin,
    isDistributor,
    
    // Methods
    getCurrentUser,
    updateUser,
    setUser,
    clearUser,
    hasRole: (role) => hasRole(user.value, role)
  }
}
