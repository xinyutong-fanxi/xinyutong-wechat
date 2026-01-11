/**
 * Server-side AI service wrapper.
 *
 * Supports a development-friendly provider switch:
 * - DeepSeek cloud via OpenAI-compatible API
 * - Local Ollama via OpenAI-compatible endpoint
 *
 * Environment variables:
 * - AI_PROVIDER: "deepseek" | "ollama" | "openai_compat" (optional; if unset, returns stub fallback)
 * - AI_BASE_URL: override the OpenAI-compatible base URL (optional)
 * - AI_MODEL: override model name (optional)
 * - AI_API_KEY: API key for cloud providers (optional for local)
 *
 * DeepSeek defaults:
 * - base URL: https://api.deepseek.com
 * - model: deepseek-chat
 *
 * Ollama defaults (local dev):
 * - base URL: http://127.0.0.1:11434/v1
 * - model: (must be set to a locally available model, e.g. "llama3.1" or similar)
 *
 * DO NOT put API keys in the mini program client.
 */

const http = require('http')
const https = require('https')
const { loadAIProperties } = require('./aiConfig')

function normalizeBaseUrl(baseUrl) {
  return String(baseUrl || '').replace(/\/+$/, '')
}

function getAIConfig() {
  // Load defaults from properties file (local dev-friendly), then allow env vars to override.
  const { parsed: props } = loadAIProperties({
    explicitPath: (process.env.AI_CONFIG_PATH || '').trim() || undefined
  })

  const fromEnvOrProps = (key) => {
    const envVal = process.env[key]
    if (typeof envVal === 'string' && envVal.trim()) return envVal.trim()
    const propVal = props && typeof props[key] === 'string' && props[key].trim() ? props[key].trim() : ''
    return propVal
  }

  const provider = (fromEnvOrProps('AI_PROVIDER') || '').trim().toLowerCase()

  // Backwards-compatible stub default: if nothing is configured, keep returning placeholder.
  if (!provider) return { provider: 'stub' }

  if (provider === 'deepseek') {
    return {
      provider,
      baseUrl: normalizeBaseUrl(fromEnvOrProps('AI_BASE_URL') || 'https://api.deepseek.com'),
      model: (fromEnvOrProps('AI_MODEL') || 'deepseek-chat').trim(),
      apiKey: (fromEnvOrProps('AI_API_KEY') || '').trim()
    }
  }

  if (provider === 'ollama') {
    return {
      provider,
      baseUrl: normalizeBaseUrl(fromEnvOrProps('AI_BASE_URL') || 'http://127.0.0.1:11434/v1'),
      model: (fromEnvOrProps('AI_MODEL') || '').trim(),
      apiKey: (fromEnvOrProps('AI_API_KEY') || '').trim()
    }
  }

  // Generic OpenAI-compatible mode (useful for LiteLLM or other providers)
  if (provider === 'openai_compat') {
    return {
      provider,
      baseUrl: normalizeBaseUrl(fromEnvOrProps('AI_BASE_URL') || ''),
      model: (fromEnvOrProps('AI_MODEL') || '').trim(),
      apiKey: (fromEnvOrProps('AI_API_KEY') || '').trim()
    }
  }

  // Unknown provider -> treat as stub to avoid breaking dev UI.
  return { provider: 'stub' }
}

function requestJson(urlString, { method, headers, body, timeoutMs = 30000 }) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlString)
    const lib = url.protocol === 'http:' ? http : https

    const req = lib.request(
      {
        protocol: url.protocol,
        hostname: url.hostname,
        port: url.port,
        path: `${url.pathname}${url.search}`,
        method,
        headers
      },
      (res) => {
        const chunks = []
        res.on('data', (c) => chunks.push(c))
        res.on('end', () => {
          const text = Buffer.concat(chunks).toString('utf8')
          let json = null
          try {
            json = JSON.parse(text)
          } catch (_) {
            // ignore
          }
          resolve({ status: res.statusCode || 0, text, json })
        })
      }
    )

    req.on('error', reject)
    req.setTimeout(timeoutMs, () => {
      req.destroy(new Error(`AI request timed out after ${timeoutMs}ms`))
    })

    if (body) req.write(body)
    req.end()
  })
}

function pickAssistantText(openAIResponseJson) {
  const choice = openAIResponseJson && openAIResponseJson.choices && openAIResponseJson.choices[0]
  const msg = choice && choice.message
  const content = msg && typeof msg.content === 'string' ? msg.content : ''
  return content.trim()
}

function safeParseJsonFromText(text) {
  const t = String(text || '').trim()
  if (!t) return null

  // Raw JSON
  try {
    return JSON.parse(t)
  } catch (_) {
    // ignore
  }

  // ```json ... ```
  const fenceMatch = t.match(/```json\s*([\s\S]*?)\s*```/i)
  if (fenceMatch && fenceMatch[1]) {
    try {
      return JSON.parse(fenceMatch[1])
    } catch (_) {
      // ignore
    }
  }

  // First {...} block
  const objMatch = t.match(/\{[\s\S]*\}/)
  if (objMatch) {
    try {
      return JSON.parse(objMatch[0])
    } catch (_) {
      // ignore
    }
  }

  return null
}

async function callOpenAICompatChat({ baseUrl, apiKey, model, userContent, temperature = 0.7, maxTokens = 800 }) {
  if (!baseUrl) throw new Error('AI_BASE_URL is required for OpenAI-compatible mode')
  if (!model) throw new Error('AI_MODEL is required (set it to a provider model id)')

  const url = `${normalizeBaseUrl(baseUrl)}/chat/completions`
  const payload = {
    model,
    messages: [{ role: 'user', content: String(userContent || '') }],
    temperature,
    max_tokens: maxTokens,
    stream: false
  }

  const headers = {
    'Content-Type': 'application/json'
  }
  if (apiKey) headers.Authorization = `Bearer ${apiKey}`

  const res = await requestJson(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload)
  })

  if (res.status < 200 || res.status >= 300) {
    const detail = (res.json && (res.json.error || res.json)) || res.text
    throw new Error(`AI HTTP ${res.status}: ${typeof detail === 'string' ? detail : JSON.stringify(detail)}`)
  }

  const json = res.json
  if (!json) throw new Error('AI response was not valid JSON')
  return json
}

async function callLLM({ prompt, risk }) {
  // Always short-circuit in high-risk mode with a controlled response (don’t rely on the model).
  if (risk && risk.highRiskFlag) {
    return [
      '我听到你现在真的很难受。',
      '我们先确认一件事：你现在是安全的吗？身边有没有可以马上找到的可信任大人（家长/老师/亲友）？',
      '如果可以，请你现在就联系他们，或者让他们陪着你。',
      '【求助热线占位符：上线前替换】',
      '你愿意告诉我，刚才让你有“想离开/放弃”的感觉的事情是什么吗？'
    ].join('\n')
  }

  const cfg = getAIConfig()
  if (cfg.provider === 'stub') {
    return '我理解…听起来这段时间你扛了很多。你愿意从“最让你喘不过气的一件事”开始讲讲吗？'
  }

  if (cfg.provider === 'ollama' && !cfg.model) {
    // Keep this explicit: Ollama requires a local model name.
    throw new Error('AI_MODEL is required for AI_PROVIDER=ollama (set it to a locally available model)')
  }

  if ((cfg.provider === 'deepseek' || cfg.provider === 'openai_compat') && !cfg.model) {
    throw new Error('AI_MODEL is required for cloud/OpenAI-compatible providers')
  }

  if (cfg.provider === 'deepseek' && !cfg.apiKey) {
    throw new Error('AI_API_KEY is required for AI_PROVIDER=deepseek')
  }

  const responseJson = await callOpenAICompatChat({
    baseUrl: cfg.baseUrl,
    apiKey: cfg.apiKey,
    model: cfg.model,
    userContent: prompt
  })

  const text = pickAssistantText(responseJson)
  return text || '（AI返回为空）我在。你愿意多说一点点发生了什么吗？'
}

async function summarizeWeekly({ weeklySignals }) {
  const cfg = getAIConfig()
  const derivedFrom = {
    weekStart: weeklySignals && weeklySignals.weekStart,
    sessionCount: weeklySignals && weeklySignals.sessionCount,
    messageCount: weeklySignals && weeklySignals.messageCount
  }

  // Stub fallback remains useful before cloud is wired.
  if (cfg.provider === 'stub') {
    return {
      highlights: ['（占位）本周压力波动较明显，周中上升。'],
      watchouts: ['（占位）注意睡眠与情绪低谷时段。'],
      suggestions: ['（占位）每天 10 分钟散步或拉伸，先从最小步开始。'],
      derivedFrom
    }
  }

  if (cfg.provider === 'deepseek' && !cfg.apiKey) {
    throw new Error('AI_API_KEY is required for AI_PROVIDER=deepseek')
  }
  if (cfg.provider === 'ollama' && !cfg.model) {
    throw new Error('AI_MODEL is required for AI_PROVIDER=ollama')
  }

  const userContent = [
    '你是家长安全看板的周报总结助手。',
    '输入是“衍生信号”（不是聊天原文）。你必须避免还原任何聊天原句或细节，只能给趋势与建议。',
    '请严格只输出 JSON（不要输出多余文字），格式为：',
    '{ "highlights": string[], "watchouts": string[], "suggestions": string[] }',
    '',
    '衍生信号如下：',
    JSON.stringify(weeklySignals || {})
  ].join('\n')

  const responseJson = await callOpenAICompatChat({
    baseUrl: cfg.baseUrl,
    apiKey: cfg.apiKey,
    model: cfg.model,
    userContent,
    temperature: 0.4,
    maxTokens: 600
  })

  const text = pickAssistantText(responseJson)
  const parsed = safeParseJsonFromText(text)

  const highlights = parsed && Array.isArray(parsed.highlights) ? parsed.highlights : []
  const watchouts = parsed && Array.isArray(parsed.watchouts) ? parsed.watchouts : []
  const suggestions = parsed && Array.isArray(parsed.suggestions) ? parsed.suggestions : []

  return {
    highlights: highlights.length ? highlights : ['（生成失败）本周总体趋势需要再观察。'],
    watchouts: watchouts.length ? watchouts : ['（生成失败）如出现明显情绪低谷，请及时线下关心。'],
    suggestions: suggestions.length ? suggestions : ['（生成失败）从一个最小可执行动作开始（如 5 分钟散步）。'],
    derivedFrom
  }
}

module.exports = { callLLM, summarizeWeekly }


