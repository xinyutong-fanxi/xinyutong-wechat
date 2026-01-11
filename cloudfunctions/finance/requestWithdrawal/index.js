/**
 * WXCloud Function: finance.requestWithdrawal
 * Request withdrawal for teacher or distributor earnings.
 * 
 * Input:
 * - applicantOpenId: string (auto from context)
 * - applicantType: 'teacher' | 'distributor'
 * - amount: number (in cents, minimum 1000 = 10 yuan)
 * 
 * Output:
 * - success: boolean
 * - withdrawalId: string
 * - withdrawalNo: string (unique withdrawal number)
 * - status: 'pending'
 * - message: string
 */

// const cloud = require('wx-server-sdk')
// cloud.init()
const db = null // TODO: Initialize with cloud.database() when WXCloud is set up

const MIN_WITHDRAWAL_AMOUNT = 1000 // 10 yuan in cents

function generateWithdrawalNo() {
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  return `WD${timestamp}${random}`
}

async function getApplicantBalance(applicantOpenId, applicantType) {
  // TODO: Calculate available balance based on applicant type
  // For teacher: sum of teacherEarning from orders where status = 'completed'
  // For distributor: sum of available commissions (status = 'settled' and not withdrawn)
  
  // Example for teacher:
  // const ordersResult = await db.collection('orders')
  //   .where({
  //     teacherOpenId: applicantOpenId,
  //     status: 'completed'
  //   })
  //   .get()
  // 
  // const totalEarning = ordersResult.data.reduce((sum, order) => sum + (order.teacherEarning || 0), 0)
  // 
  // // Subtract already withdrawn amount
  // const withdrawalsResult = await db.collection('withdrawals')
  //   .where({
  //     applicantOpenId,
  //     applicantType: 'teacher',
  //     status: db.command.in(['completed', 'pending'])
  //   })
  //   .get()
  // 
  // const totalWithdrawn = withdrawalsResult.data.reduce((sum, w) => sum + (w.amount || 0), 0)
  // 
  // return totalEarning - totalWithdrawn
  
  // Example for distributor:
  // const commissionsResult = await db.collection('commissions')
  //   .where({
  //     distributorId: applicantOpenId,
  //     status: 'settled',
  //     withdrawalId: db.command.exists(false)
  //   })
  //   .get()
  // 
  // const availableCommission = commissionsResult.data.reduce((sum, c) => sum + (c.commissionAmount || 0), 0)
  // return availableCommission
  
  // Placeholder
  return 50000 // 500 yuan in cents
}

async function getAvailableCommissions(applicantOpenId, applicantType) {
  // Get list of commission IDs that can be withdrawn
  // TODO: Query commissions collection
  
  // For distributor:
  // const commissionsResult = await db.collection('commissions')
  //   .where({
  //     distributorId: applicantOpenId,
  //     status: 'settled',
  //     withdrawalId: db.command.exists(false)
  //   })
  //   .limit(100) // Limit to prevent too many commissions in one withdrawal
  //   .get()
  // 
  // return commissionsResult.data.map(c => c._id)
  
  // Placeholder
  return []
}

exports.main = async (event, context) => {
  const { applicantOpenId, applicantType, amount } = event || {}
  const openid = (context && context.OPENID) || applicantOpenId || 'dev-openid'
  
  if (!applicantType || !amount) {
    return {
      error: 'INVALID_INPUT',
      message: 'Missing required fields: applicantType, amount'
    }
  }
  
  if (applicantType !== 'teacher' && applicantType !== 'distributor') {
    return {
      error: 'INVALID_APPLICANT_TYPE',
      message: 'Applicant type must be "teacher" or "distributor"'
    }
  }
  
  if (amount < MIN_WITHDRAWAL_AMOUNT) {
    return {
      error: 'AMOUNT_TOO_SMALL',
      message: `Minimum withdrawal amount is ￥${MIN_WITHDRAWAL_AMOUNT / 100}`
    }
  }
  
  try {
    // 1. Get available balance
    const availableBalance = await getApplicantBalance(openid, applicantType)
    
    if (availableBalance < amount) {
      return {
        error: 'INSUFFICIENT_BALANCE',
        message: `Insufficient balance. Available: ￥${(availableBalance / 100).toFixed(2)}, Requested: ￥${(amount / 100).toFixed(2)}`
      }
    }
    
    // 2. Get available commission IDs (for linking)
    const commissionIds = await getAvailableCommissions(openid, applicantType)
    
    // Limit commission IDs to match requested amount (if amount is less than total available)
    // TODO: Select commission IDs that sum up to amount (FIFO or user choice)
    // For now, use all available commissions
    const selectedCommissionIds = commissionIds
    
    // 3. Generate withdrawal number
    const withdrawalNo = generateWithdrawalNo()
    
    // 4. Create withdrawal record
    const withdrawalData = {
      withdrawalNo,
      applicantOpenId: openid,
      applicantType,
      amount,
      commissionIds: selectedCommissionIds,
      status: 'pending',
      rejectionReason: null,
      wechatPayTransferId: null,
      submittedAt: new Date(),
      reviewedAt: null,
      reviewedBy: null,
      completedAt: null
    }
    
    // TODO: Save withdrawal to DB
    // const withdrawalResult = await db.collection('withdrawals').add({ data: withdrawalData })
    // const withdrawalId = withdrawalResult._id
    
    const withdrawalId = `withdrawal_${Date.now()}`
    
    // 5. Update commission status to 'pending' (will be marked as 'withdrawn' after approval)
    // TODO: Update commissions collection
    // await db.collection('commissions')
    //   .where({
    //     _id: db.command.in(selectedCommissionIds)
    //   })
    //   .update({
    //     data: {
    //       withdrawalId,
    //       status: 'pending' // Will be updated to 'withdrawn' after approval
    //     }
    //   })
    
    // 6. Send notification to admin (TODO: implement notification)
    
    return {
      success: true,
      withdrawalId,
      withdrawalNo,
      status: 'pending',
      message: '提现申请已提交，等待审核'
    }
  } catch (error) {
    console.error('requestWithdrawal error:', error)
    return {
      error: 'INTERNAL_ERROR',
      message: error.message || 'Failed to request withdrawal'
    }
  }
}
