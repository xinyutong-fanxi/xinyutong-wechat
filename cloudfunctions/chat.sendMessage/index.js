/**
 * WXCloud Function: chat.sendMessage
 * Orchestrates: msgSecCheck(input) -> persist user msg -> LLM call -> msgSecCheck(output) -> persist assistant msg
 *
 * NOTE: This is a stub. Wire to actual WXCloud runtime + DB once the cloud env is set up.
 */

// TODO: Replace these with your actual imports / SDK initialization in WXCloud.
// const cloud = require('wx-server-sdk')
// cloud.init()

const { buildChatPrompt, buildEmergencyPromptAddon } = require('../shared/prompts')
const { scoreRisk } = require('../shared/risk')
const { callLLM } = require('../shared/aiService')

exports.main = async (event, context) => {
  const { sessionId, content, clientTriage, moodKey } = event || {}
  const openid = (context && context.OPENID) || 'dev-openid'

  if (!content || typeof content !== 'string') {
    return {
      error: 'INVALID_INPUT',
      message: 'content is required'
    }
  }

  // 1) Risk scoring (authoritative on server)
  const risk = scoreRisk({ content, clientTriage })

  // 2) TODO: msgSecCheck(input) via `safety.msgSecCheckProxy`
  // 3) TODO: persist user message to DB

  // 4) Prompt assembly
  const prompt = buildChatPrompt({
    openid,
    sessionId,
    moodKey,
    content
  })

  const finalPrompt = risk.highRiskFlag
    ? `${prompt}\n\n${buildEmergencyPromptAddon()}`
    : prompt

  // 5) Call LLM
  const assistantText = await callLLM({
    prompt: finalPrompt,
    risk
  })

  // 6) TODO: msgSecCheck(output)
  // 7) TODO: persist assistant message

  // 8) TODO: if high risk, trigger parent alert via `alert.triggerParent`

  // 9) Detect if booking recommendation is appropriate
  let bookingRecommendation = null
  
  // Only suggest booking if not high risk and after a few messages (to build context)
  // For now, we'll suggest based on issue detection
  if (!risk.highRiskFlag) {
    const contentLower = content.toLowerCase()
    const issueKeywords = {
      learning_anxiety: ['学习', '作业', '考试', '成绩', '压力', '焦虑', '不想学', '学不进去', '厌学'],
      social_stress: ['同学', '朋友', '人际关系', '社交', '孤立', '欺负', '矛盾', '吵架'],
      family_conflict: ['父母', '家长', '家庭', '吵架', '矛盾', '不理解', '争执'],
      exam_anxiety: ['考试', '测验', '焦虑', '紧张', '害怕', '担心', '考前'],
      emotional_issues: ['情绪', '难过', '伤心', '愤怒', '烦躁', '低落', '不开心'],
      behavior_problems: ['行为', '习惯', '改正', '改变']
    }
    
    // Simple keyword-based issue detection
    let detectedIssue = null
    let maxMatches = 0
    
    for (const [issue, keywords] of Object.entries(issueKeywords)) {
      const matches = keywords.filter(keyword => contentLower.includes(keyword)).length
      if (matches > maxMatches && matches > 0) {
        maxMatches = matches
        detectedIssue = issue
      }
    }
    
    // If issue detected with sufficient confidence (at least 1 keyword match)
    if (detectedIssue && maxMatches > 0) {
      // TODO: In production, only suggest after some context is built (e.g., after 3-5 messages)
      // For now, suggest immediately when issue is detected
      bookingRecommendation = {
        suggested: true,
        issueType: detectedIssue,
        message: '根据您的情况，建议您可以预约专业心理咨询师进行深入交流。'
      }
    }
  }

  return {
    assistantMessage: {
      content: assistantText,
      createdAt: Date.now()
    },
    risk,
    bookingRecommendation
  }
}


