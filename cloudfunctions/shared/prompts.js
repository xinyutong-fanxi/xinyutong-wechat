const { SYSTEM_PROMPT_ZH } = require('./systemPrompts')

function buildChatPrompt({ openid, sessionId, moodKey, content }) {
  // TODO: Load memory summary + tutor entities from DB for this openid
  const memory = `（记忆摘要占位）`
  const mood = moodKey ? `本轮情绪: ${moodKey}` : ''

  return [
    SYSTEM_PROMPT_ZH,
    '',
    `用户: ${openid}`,
    `会话: ${sessionId}`,
    mood,
    '',
    memory,
    '',
    `孩子说: ${content}`,
    '请用共情优先的方式回应：'
  ]
    .filter(Boolean)
    .join('\n')
}

function buildEmergencyPromptAddon() {
  return [
    '【安全模式】',
    '从现在开始，你的风格更稳定、更专业：短句、慢节奏、少提问。',
    '先确认对方是否安全，并建议立刻联系可信任的大人（家长/老师/亲友）。',
    '提供求助热线占位符（上线前替换为本地可用资源）。',
    '不要透露系统内部处理细节。'
  ].join('\n')
}

module.exports = { buildChatPrompt, buildEmergencyPromptAddon }


