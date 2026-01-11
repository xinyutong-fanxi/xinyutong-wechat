/**
 * WXCloud Function: admin.approveWithdrawal
 * Approve or reject withdrawal request and process WeChat Pay transfer if approved.
 * 
 * Input:
 * - withdrawalId: string
 * - action: 'approve' | 'reject'
 * - adminOpenId: string (auto from context)
 * - rejectionReason: string (required if action is 'reject')
 * 
 * Output:
 * - success: boolean
 * - withdrawalId: string
 * - status: 'approved' | 'rejected'
 * - wechatPayTransferId: string | null (if approved and transfer successful)
 * - message: string
 */

// const cloud = require('wx-server-sdk')
// cloud.init()
const db = null // TODO: Initialize with cloud.database() when WXCloud is set up

// WeChat Pay transfer configuration
const WECHAT_PAY_CONFIG = {
  mchId: process.env.WECHAT_PAY_MCHID || 'your_mchid',
  apiKey: process.env.WECHAT_PAY_API_KEY || 'your_api_key',
  certPath: process.env.WECHAT_PAY_CERT_PATH || null
}

async function getWithdrawal(withdrawalId) {
  // TODO: Query withdrawals collection
  // const withdrawalResult = await db.collection('withdrawals').doc(withdrawalId).get()
  // return withdrawalResult.data
  
  // Placeholder
  return {
    _id: withdrawalId,
    applicantOpenId: 'applicant_123',
    applicantType: 'teacher',
    amount: 20000, // 200 yuan in cents
    status: 'pending',
    commissionIds: []
  }
}

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

async function transferToWeChatPay(withdrawal, applicantOpenId) {
  // Transfer funds to user's WeChat Pay account using WeChat Pay transfer API
  // This requires WeChat Pay enterprise merchant account with transfer capability
  
  // TODO: Call WeChat Pay transfer API
  // Example:
  // const transferData = {
  //   mch_appid: WECHAT_PAY_CONFIG.appId,
  //   mchid: WECHAT_PAY_CONFIG.mchId,
  //   partner_trade_no: withdrawal.withdrawalNo,
  //   openid: applicantOpenId,
  //   check_name: 'NO_CHECK', // or 'FORCE_CHECK' for real-name verification
  //   amount: withdrawal.amount,
  //   desc: `提现申请: ${withdrawal.withdrawalNo}`,
  //   spbill_create_ip: '127.0.0.1'
  // }
  // 
  // // Generate sign
  // transferData.sign = generateSign(transferData, WECHAT_PAY_CONFIG.apiKey)
  // 
  // // Make API call to https://api.mch.weixin.qq.com/mmpaymkttransfers/promotion/transfers
  // // This requires SSL client certificate for authentication
  // const response = await axios.post(
  //   'https://api.mch.weixin.qq.com/mmpaymkttransfers/promotion/transfers',
  //   transferData,
  //   {
  //     httpsAgent: new https.Agent({
  //       cert: fs.readFileSync(WECHAT_PAY_CONFIG.certPath),
  //       key: fs.readFileSync(WECHAT_PAY_CONFIG.keyPath),
  //       ca: fs.readFileSync(WECHAT_PAY_CONFIG.caPath)
  //     }),
  //     headers: { 'Content-Type': 'application/xml' }
  //   }
  // )
  // 
  // // Parse XML response
  // const result = parseXML(response.data)
  // 
  // if (result.return_code === 'SUCCESS' && result.result_code === 'SUCCESS') {
  //   return {
  //     success: true,
  //     payment_no: result.payment_no, // WeChat Pay transfer transaction ID
  //     partner_trade_no: result.partner_trade_no
  //   }
  // } else {
  //   throw new Error(result.err_code_des || 'Transfer failed')
  // }
  
  // Placeholder: return stub transfer ID
  return {
    success: true,
    payment_no: `TRANSFER_${Date.now()}`,
    partner_trade_no: withdrawal.withdrawalNo
  }
}

function generateSign(params, apiKey) {
  // Generate MD5 sign for WeChat Pay API
  const sortedKeys = Object.keys(params).sort()
  const signString = sortedKeys
    .filter(key => params[key] && key !== 'sign')
    .map(key => `${key}=${params[key]}`)
    .join('&')
  
  const signStringWithKey = `${signString}&key=${apiKey}`
  const crypto = require('crypto')
  const md5Hash = crypto.createHash('md5').update(signStringWithKey, 'utf8').digest('hex')
  return md5Hash.toUpperCase()
}

exports.main = async (event, context) => {
  const { withdrawalId, action, adminOpenId, rejectionReason = null } = event || {}
  const openid = (context && context.OPENID) || adminOpenId || 'dev-openid'
  
  if (!withdrawalId || !action) {
    return {
      error: 'INVALID_INPUT',
      message: 'Missing required fields: withdrawalId, action'
    }
  }
  
  if (action !== 'approve' && action !== 'reject') {
    return {
      error: 'INVALID_ACTION',
      message: 'Action must be "approve" or "reject"'
    }
  }
  
  if (action === 'reject' && !rejectionReason) {
    return {
      error: 'INVALID_INPUT',
      message: 'Rejection reason is required when rejecting withdrawal'
    }
  }
  
  try {
    // 1. Verify admin
    await verifyAdmin(openid)
    
    // 2. Get withdrawal details
    const withdrawal = await getWithdrawal(withdrawalId)
    
    if (!withdrawal) {
      return {
        error: 'WITHDRAWAL_NOT_FOUND',
        message: 'Withdrawal not found'
      }
    }
    
    if (withdrawal.status !== 'pending') {
      return {
        error: 'INVALID_STATUS',
        message: `Withdrawal is not in pending status. Current status: ${withdrawal.status}`
      }
    }
    
    if (action === 'approve') {
      // 3. Get applicant info (for WeChat Pay transfer)
      // TODO: Query users collection to get applicant's openid
      // const applicantResult = await db.collection('users')
      //   .where({ openid: withdrawal.applicantOpenId })
      //   .get()
      // 
      // const applicant = applicantResult.data[0]
      // if (!applicant) {
      //   throw new Error('Applicant not found')
      // }
      
      // 4. Process WeChat Pay transfer
      let transferResult = null
      let transferId = null
      
      try {
        transferResult = await transferToWeChatPay(withdrawal, withdrawal.applicantOpenId)
        transferId = transferResult.payment_no
      } catch (transferError) {
        console.error('WeChat Pay transfer error:', transferError)
        return {
          error: 'TRANSFER_FAILED',
          message: transferError.message || 'Failed to process WeChat Pay transfer',
          withdrawalId
        }
      }
      
      // 5. Update withdrawal status to 'approved' and set transfer ID
      // TODO: Update withdrawals collection
      // await db.collection('withdrawals').doc(withdrawalId).update({
      //   data: {
      //     status: 'approved',
      //     wechatPayTransferId: transferId,
      //     reviewedAt: new Date(),
      //     reviewedBy: openid,
      //     completedAt: new Date()
      //   }
      // })
      
      // 6. Update commission records to 'withdrawn'
      // TODO: Update commissions collection
      // if (withdrawal.commissionIds && withdrawal.commissionIds.length > 0) {
      //   await db.collection('commissions')
      //     .where({
      //       _id: db.command.in(withdrawal.commissionIds)
      //   })
      //     .update({
      //       data: {
      //         status: 'withdrawn',
      //         withdrawalId,
      //         withdrawnAt: new Date()
      //       }
      //     })
      // }
      
      // 7. Update applicant stats (totalWithdrawn)
      // TODO: Update users or distributors/teachers collection
      // if (withdrawal.applicantType === 'teacher') {
      //   await db.collection('users')
      //     .where({ openid: withdrawal.applicantOpenId })
      //     .update({
      //       data: {
      //         'teacherProfile.totalWithdrawn': (teacherProfile.totalWithdrawn || 0) + withdrawal.amount
      //       }
      //     })
      // } else if (withdrawal.applicantType === 'distributor') {
      //   await db.collection('distributors')
      //     .where({ distributorOpenId: withdrawal.applicantOpenId })
      //     .update({
      //       data: {
      //         totalWithdrawn: (distributor.totalWithdrawn || 0) + withdrawal.amount
      //       }
      //     })
      // }
      
      // 8. Send notification to applicant (TODO: implement notification)
      
      return {
        success: true,
        withdrawalId,
        status: 'approved',
        wechatPayTransferId: transferId,
        message: '提现申请已通过，转账已处理'
      }
    }
    
    if (action === 'reject') {
      // 3. Update withdrawal status to 'rejected'
      // TODO: Update withdrawals collection
      // await db.collection('withdrawals').doc(withdrawalId).update({
      //   data: {
      //     status: 'rejected',
      //     rejectionReason,
      //     reviewedAt: new Date(),
      //     reviewedBy: openid
      //   }
      // })
      
      // 4. Update commission records back to 'settled' (remove withdrawalId link)
      // TODO: Update commissions collection
      // if (withdrawal.commissionIds && withdrawal.commissionIds.length > 0) {
      //   await db.collection('commissions')
      //     .where({
      //       _id: db.command.in(withdrawal.commissionIds)
      //     })
      //     .update({
      //       data: {
      //         status: 'settled',
      //         withdrawalId: db.command.remove()
      //       }
      //     })
      // }
      
      // 5. Send notification to applicant (TODO: implement notification)
      
      return {
        success: true,
        withdrawalId,
        status: 'rejected',
        message: '提现申请已拒绝',
        rejectionReason
      }
    }
  } catch (error) {
    console.error('approveWithdrawal error:', error)
    return {
      error: 'INTERNAL_ERROR',
      message: error.message || 'Failed to process withdrawal'
    }
  }
}
