/**
 * Role-based authentication and authorization utilities
 */

/**
 * Check if user has a specific role
 * @param {Object} user - User object with role or roles
 * @param {string} role - Role to check
 * @returns {boolean}
 */
export function hasRole(user, role) {
  if (!user) return false
  // Support both single role (backward compatibility) and multi-role
  if (user.roles && Array.isArray(user.roles)) {
    return user.roles.includes(role)
  }
  return user.role === role
}

/**
 * Check if user has any of the specified roles
 * @param {Object} user - User object
 * @param {string[]} roles - Array of roles to check
 * @returns {boolean}
 */
export function hasAnyRole(user, roles) {
  if (!user || !Array.isArray(roles)) return false
  return roles.some(role => hasRole(user, role))
}

/**
 * Get user's primary role (for backward compatibility)
 * @param {Object} user - User object
 * @returns {string | null}
 */
export function getPrimaryRole(user) {
  if (!user) return null
  if (user.roles && Array.isArray(user.roles) && user.roles.length > 0) {
    return user.roles[0] // First role is primary
  }
  return user.role || null
}

/**
 * Check if user is authenticated
 * @param {Object} user - User object
 * @returns {boolean}
 */
export function isAuthenticated(user) {
  return !!user && !!user.openid
}

/**
 * Redirect user to appropriate login page based on role
 * @param {string} role - Desired role
 */
export function redirectToLogin(role) {
  const loginPages = {
    parent: '/pages/parent/login',
    teacher: '/pages/teacher/login',
    student: '/pages/index/index', // Student uses main chat interface
    admin: '/pages/admin/login'
  }
  
  const loginPage = loginPages[role] || '/pages/onboarding/register'
  uni.redirectTo({ url: loginPage })
}

/**
 * Guard route access based on user role
 * @param {Object} user - User object
 * @param {string | string[]} requiredRoles - Required role(s)
 * @param {Function} onUnauthorized - Callback when unauthorized
 */
export function requireRole(user, requiredRoles, onUnauthorized) {
  const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles]
  
  if (!isAuthenticated(user)) {
    if (onUnauthorized) {
      onUnauthorized()
    } else {
      redirectToLogin(roles[0])
    }
    return false
  }
  
  if (!hasAnyRole(user, roles)) {
    if (onUnauthorized) {
      onUnauthorized()
    } else {
      uni.showToast({
        title: '权限不足',
        icon: 'none'
      })
    }
    return false
  }
  
  return true
}

/**
 * Check if user can access student data
 * @param {Object} user - User object (parent or student)
 * @param {Object} student - Student object
 * @returns {boolean}
 */
export function canAccessStudent(user, student) {
  if (!user || !student) return false
  
  // Student can access their own data
  if (hasRole(user, 'student') && user.openid === student.studentOpenId) {
    return true
  }
  
  // Parent can access if student is linked
  if (hasRole(user, 'parent')) {
    return student.parentOpenId === user.openid
  }
  
  // Admin can access all
  if (hasRole(user, 'admin')) {
    return true
  }
  
  return false
}

/**
 * Get default route for user based on their role
 * @param {Object} user - User object
 * @returns {string}
 */
export function getDefaultRoute(user) {
  if (!user) return '/pages/onboarding/register'
  
  const role = getPrimaryRole(user)
  const defaultRoutes = {
    parent: '/pages/parent/home',
    teacher: '/pages/teacher/home',
    student: '/pages/index/index',
    admin: '/pages/admin/home',
    distributor: '/pages/parent/distribution/stats' // Distributors use parent distribution pages
  }
  
  // If user is both parent and distributor, go to parent home
  if (role === 'distributor' && hasRole(user, 'parent')) {
    return '/pages/parent/home'
  }
  
  return defaultRoutes[role] || '/pages/onboarding/register'
}
