/**
 * WXCloud Function: admin.configureDistribution
 * Update commission rates and distribution rules.
 * 
 * Input:
 * - adminOpenId: string (auto from context)
 * - config: {
 *     level1Rate: number (percentage, e.g., 10 for 10%),
 *     level2Rate: number (percentage, e.g., 5 for 5%),
 *     platformRate: number (percentage, e.g., 30 for 30%)
 *   }
 * 
 * Output:
 * - success: boolean
 * - config: object (updated configuration)
 * - message: string
 */

// const cloud = require('wx-server-sdk')
// cloud.init()
const db = null // TODO: Initialize with cloud.database() when WXCloud is set up

async function verifyAdmin(adminOpenId) {
  // TODO: Verify user has admin role
  // const userResult = await db.collection('users')
  //   .where({ openid: adminOpenId })
  //   .get()
  // 
  // const user = userResult.data[0]
  // if (!user || !user.roles?.includes('admin')) {
  //   throw new Error('Not authorized as admin')
  // }
  
  // Placeholder: assume authorized
  return true
}

exports.main = async (event, context) => {
  const { adminOpenId, config } = event || {}
  const openid = (context && context.OPENID) || adminOpenId || 'dev-openid'
  
  if (!config) {
    return {
      error: 'INVALID_INPUT',
      message: 'Missing required field: config'
    }
  }
  
  const { level1Rate, level2Rate, platformRate } = config
  
  // Validate rates
  if (level1Rate !== undefined && (level1Rate < 0 || level1Rate > 100)) {
    return {
      error: 'INVALID_RATE',
      message: 'Level 1 rate must be between 0 and 100'
    }
  }
  
  if (level2Rate !== undefined && (level2Rate < 0 || level2Rate > 100)) {
    return {
      error: 'INVALID_RATE',
      message: 'Level 2 rate must be between 0 and 100'
    }
  }
  
  if (platformRate !== undefined && (platformRate < 0 || platformRate > 100)) {
    return {
      error: 'INVALID_RATE',
      message: 'Platform rate must be between 0 and 100'
    }
  }
  
  // Validate rate sum (if all provided)
  if (level1Rate !== undefined && level2Rate !== undefined && platformRate !== undefined) {
    // Level 2 should be <= Level 1
    if (level2Rate > level1Rate) {
      return {
        error: 'INVALID_RATE',
        message: 'Level 2 rate cannot be greater than Level 1 rate'
      }
    }
  }
  
  try {
    // 1. Verify admin
    await verifyAdmin(openid)
    
    // 2. Get or create distribution config document
    // TODO: Query or create system_config collection
    // const configResult = await db.collection('system_config')
    //   .where({ type: 'distribution' })
    //   .get()
    // 
    // let configId
    // if (configResult.data && configResult.data.length > 0) {
    //   // Update existing config
    //   configId = configResult.data[0]._id
    //   await db.collection('system_config').doc(configId).update({
    //     data: {
    //       config: {
    //         level1Rate: level1Rate !== undefined ? level1Rate : configResult.data[0].config.level1Rate,
    //         level2Rate: level2Rate !== undefined ? level2Rate : configResult.data[0].config.level2Rate,
    //         platformRate: platformRate !== undefined ? platformRate : configResult.data[0].config.platformRate
    //       },
    //       updatedAt: new Date(),
    //       updatedBy: openid
    //     }
    //   })
    // } else {
    //   // Create new config
    //   const createResult = await db.collection('system_config').add({
    //     data: {
    //       type: 'distribution',
    //       config: {
    //         level1Rate: level1Rate || 10,
    //         level2Rate: level2Rate || 5,
    //         platformRate: platformRate || 30
    //       },
    //       createdAt: new Date(),
    //       updatedAt: new Date(),
    //       createdBy: openid,
    //       updatedBy: openid
    //     }
    //   })
    //   configId = createResult._id
    // }
    
    // 3. Get updated config (for return)
    // const updatedConfigResult = await db.collection('system_config').doc(configId).get()
    // const updatedConfig = updatedConfigResult.data.config
    
    const updatedConfig = {
      level1Rate: level1Rate !== undefined ? level1Rate : 10,
      level2Rate: level2Rate !== undefined ? level2Rate : 5,
      platformRate: platformRate !== undefined ? platformRate : 30
    }
    
    // 4. Log configuration change (TODO: implement audit log)
    
    return {
      success: true,
      config: updatedConfig,
      message: 'Distribution configuration updated successfully'
    }
  } catch (error) {
    console.error('configureDistribution error:', error)
    return {
      error: 'INTERNAL_ERROR',
      message: error.message || 'Failed to update distribution configuration'
    }
  }
}
