const fs = require('fs')
const path = require('path')

function parseProperties(text) {
  const out = {}
  const lines = String(text || '').split(/\r?\n/)

  for (const rawLine of lines) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#') || line.startsWith(';')) continue

    const idx = line.indexOf('=')
    if (idx === -1) continue

    const key = line.slice(0, idx).trim()
    const value = line.slice(idx + 1).trim()
    if (!key) continue

    out[key] = value
  }

  return out
}

function readPropertiesFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8')
    return parseProperties(content)
  } catch (_) {
    return null
  }
}

function loadAIProperties({ explicitPath } = {}) {
  // 1) Explicit path (env or caller)
  if (explicitPath) {
    const parsed = readPropertiesFile(explicitPath)
    if (parsed) return { parsed, source: explicitPath }
  }

  // 2) Default: sibling file `ai.properties` next to this module
  const defaultPath = path.join(__dirname, 'ai.properties')
  const parsed = readPropertiesFile(defaultPath)
  if (parsed) return { parsed, source: defaultPath }

  return { parsed: {}, source: null }
}

module.exports = { loadAIProperties }

