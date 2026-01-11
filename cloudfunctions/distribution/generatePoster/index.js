/**
 * WXCloud Function: distribution.generatePoster
 * Generates promotional poster with referral code QR code.
 * 
 * Input:
 * - distributorOpenId: string (auto from context)
 * - template: string (optional, poster template ID)
 * 
 * Output:
 * - success: boolean
 * - posterUrl: string (cloud storage URL)
 * - qrCodeUrl: string (cloud storage URL for QR code only)
 */

// const cloud = require('wx-server-sdk')
// cloud.init()
const db = null // TODO: Initialize with cloud.database() when WXCloud is set up
// const cloudStorage = cloud.storage() // TODO: Initialize when WXCloud is set up

async function getDistributorInfo(distributorOpenId) {
  // TODO: Query distributors collection
  // const distributorResult = await db.collection('distributors')
  //   .where({ distributorOpenId, status: 'approved' })
  //   .get()
  // 
  // if (distributorResult.data.length === 0) {
  //   throw new Error('Distributor not found or not approved')
  // }
  // 
  // return distributorResult.data[0]
  
  // Placeholder
  return {
    _id: 'distributor_123',
    referralCode: 'XYTABC123',
    distributorType: 'parent'
  }
}

async function generateQRCode(referralCode) {
  // Generate QR code image for referral code using WeChat Mini Program QR code API
  // QR code contains: mini-program path with referral code parameter
  // e.g., pages/parent/home?referralCode=XYTABC123
  
  // Use WeChat getUnlimited QR code API (recommended for WXCloud)
  // This generates a QR code that can be scanned to open the mini-program with referral code
  try {
    // TODO: Use WXCloud openapi.wxacode.getUnlimited
    // const qrCodeResult = await cloud.openapi.wxacode.getUnlimited({
    //   scene: referralCode,
    //   page: 'pages/parent/home', // Landing page when QR code is scanned
    //   width: 280,
    //   autoColor: true,
    //   isHyaline: false
    // })
    // 
    // // qrCodeResult.buffer contains the QR code image buffer
    // return qrCodeResult.buffer
    
    // Placeholder: return stub QR code data
    // In production, this should use WeChat's wxacode.getUnlimited API
    const qrCodeBuffer = Buffer.from('QR_CODE_PLACEHOLDER')
    return qrCodeBuffer
  } catch (error) {
    console.error('QR code generation error:', error)
    throw new Error('Failed to generate QR code')
  }
}

async function generatePosterImage(distributor, qrCodeBuffer) {
  // Generate promotional poster image
  // This requires image manipulation library (e.g., canvas, sharp, or use cloud service)
  
  // Poster design:
  // - App logo/branding at top
  // - Incentive text in middle (e.g., "邀请好友注册，双方获得优惠券")
  // - QR code at bottom
  // - Distributor's referral code text below QR code
  
  // TODO: Use image manipulation library or cloud service
  // For WXCloud, we can use cloud function with canvas-like libraries
  // Or use external image generation service
  
  // Placeholder: return stub poster buffer
  const posterBuffer = Buffer.from('POSTER_PLACEHOLDER')
  
  return posterBuffer
}

async function uploadToCloudStorage(fileBuffer, fileName, fileType = 'image/png') {
  // TODO: Upload file to WXCloud Storage
  // const uploadResult = await cloudStorage.upload({
  //   cloudPath: `posters/${fileName}`,
  //   fileContent: fileBuffer,
  //   fileType
  // })
  // 
  // return uploadResult.fileID
  
  // Placeholder: return stub URL
  return `cloud://your-env-id.xxx-yyy-posters/${fileName}`
}

exports.main = async (event, context) => {
  const { distributorOpenId, template = 'default' } = event || {}
  const openid = (context && context.OPENID) || distributorOpenId || 'dev-openid'
  
  try {
    // 1. Get distributor info
    const distributor = await getDistributorInfo(openid)
    
    if (!distributor || distributor.status !== 'approved') {
      return {
        error: 'DISTRIBUTOR_NOT_APPROVED',
        message: 'Distributor not found or not approved'
      }
    }
    
    // 2. Generate QR code
    const qrCodeBuffer = await generateQRCode(distributor.referralCode)
    
    // 3. Generate poster image
    const posterBuffer = await generatePosterImage(distributor, qrCodeBuffer)
    
    // 4. Upload QR code to cloud storage
    const qrCodeFileName = `qr_${distributor.referralCode}_${Date.now()}.png`
    const qrCodeUrl = await uploadToCloudStorage(qrCodeBuffer, qrCodeFileName)
    
    // 5. Upload poster to cloud storage
    const posterFileName = `poster_${distributor.referralCode}_${Date.now()}.png`
    const posterUrl = await uploadToCloudStorage(posterBuffer, posterFileName)
    
    // 6. Optionally, save poster URL to distributor record
    // TODO: Update distributors collection
    // await db.collection('distributors').doc(distributor._id).update({
    //   data: {
    //     lastPosterUrl: posterUrl,
    //     lastPosterGeneratedAt: new Date()
    //   }
    // })
    
    return {
      success: true,
      posterUrl,
      qrCodeUrl,
      referralCode: distributor.referralCode,
      message: 'Poster generated successfully'
    }
  } catch (error) {
    console.error('generatePoster error:', error)
    return {
      error: 'INTERNAL_ERROR',
      message: error.message || 'Failed to generate poster'
    }
  }
}
