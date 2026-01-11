// Client wrapper for cloud function calls.
// In production, `chat.sendMessage` should run server-side and call the LLM with protected keys.

import { getDevAiConfig } from './devAiConfig'

function pickAssistantText(openAIResponseJson) {
  const choice = openAIResponseJson && openAIResponseJson.choices && openAIResponseJson.choices[0]
  const msg = choice && choice.message
  const content = msg && typeof msg.content === 'string' ? msg.content : ''
  return content.trim()
}

function requestJsonByUni(url, { method = 'GET', headers = {}, data, timeoutMs = 30000 }) {
  return new Promise((resolve, reject) => {
    if (typeof uni === 'undefined' || !uni.request) {
      reject(new Error('uni.request is unavailable in this runtime'))
      return
    }

    uni.request({
      url,
      method,
      header: headers,
      data,
      timeout: timeoutMs,
      success: (res) => resolve(res),
      fail: (err) => reject(err)
    })
  })
}

async function callOllamaDirect({ baseUrl, model, userContent }) {
  if (!baseUrl) throw new Error('Dev Ollama baseUrl is required')
  if (!model) throw new Error('Dev Ollama model is required')

  const url = String(baseUrl).replace(/\/+$/, '') + '/chat/completions'
  const payload = {
    model,
    messages: [{ role: 'user', content: String(userContent || '') }],
    temperature: 0.7,
    max_tokens: 800,
    stream: false
  }

  const res = await requestJsonByUni(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: payload,
    timeoutMs: 60000
  })

  const status = (res && (res.statusCode || res.status)) || 0
  if (status < 200 || status >= 300) {
    const detail = (res && res.data) || res
    throw new Error(`Ollama HTTP ${status}: ${typeof detail === 'string' ? detail : JSON.stringify(detail)}`)
  }

  const json = res && res.data
  const text = pickAssistantText(json)
  if (!text) throw new Error('Ollama returned empty assistant content')
  return text
}

export async function sendChatMessage({ sessionId, content, clientTriage, moodKey }) {
  const data = { sessionId, content, clientTriage, moodKey }

  const devCfg = getDevAiConfig()
  if (devCfg && devCfg.enableDirectOllama) {
    // eslint-disable-next-line no-console
    console.info('[chatApi] using DIRECT Ollama (dev mode)')
    const assistantText = await callOllamaDirect({
      baseUrl: devCfg.ollamaBaseUrl,
      model: devCfg.ollamaModel,
      userContent: content
    })
    return {
      assistantMessage: { content: assistantText, createdAt: Date.now() },
      risk: { highRiskFlag: false, category: 'dev', riskScore: 0.0 }
    }
  }

  // Prefer WeChat Cloud in MP-Weixin builds.
  // #ifdef MP-WEIXIN
  if (typeof wx !== 'undefined' && wx.cloud && wx.cloud.callFunction) {
    // eslint-disable-next-line no-console
    console.info('[chatApi] using wx.cloud.callFunction(chat.sendMessage)')
    const { result } = await wx.cloud.callFunction({
      name: 'chat.sendMessage',
      data
    })
    return result
  }
  // eslint-disable-next-line no-console
  console.warn('[chatApi] wx.cloud.callFunction unavailable; falling back')
  // #endif

  // uniCloud.callFunction is available in uni-app projects configured with uniCloud.
  // #ifndef MP-WEIXIN
  if (typeof uniCloud !== 'undefined' && uniCloud.callFunction) {
    // eslint-disable-next-line no-console
    console.info('[chatApi] using uniCloud.callFunction(chat.sendMessage)')
    const { result } = await uniCloud.callFunction({
      name: 'chat.sendMessage',
      data
    })
    return result
  }
  // #endif

  // Dev fallback: return a stub response.
  // eslint-disable-next-line no-console
  console.warn('[chatApi] no cloud call method; returning stub response')
  return {
    assistantMessage: {
      content:
        '（开发占位）当前未连接到云函数。请在微信开发者工具里启用云开发并部署 `chat.sendMessage`，或在运行时初始化 `wx.cloud`。'
    },
    risk: {
      highRiskFlag: false,
      category: 'none',
      riskScore: 0.1
    }
  }
}


