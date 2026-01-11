/**
 * Dev-only AI configuration.
 *
 * This exists to let you test the chat UI against local Ollama from WeChat DevTools.
 *
 * IMPORTANT:
 * - Keep this OFF by default.
 * - Do NOT ship a production build that calls localhost from the client.
 */

export function getDevAiConfig() {
  return {
    // Set to true to bypass cloud functions and call Ollama directly from the client.
    // Recommended ONLY for local DevTools testing.
    enableDirectOllama: true,

    // Ollama OpenAI-compatible endpoint:
    // - Ensure Ollama is running locally
    // - Ensure it exposes `/v1/chat/completions`
    ollamaBaseUrl: 'http://127.0.0.1:11434/v1',

    // Must match a model you have locally in Ollama (e.g. `llama3.1`, `qwen2.5`, `deepseek-r1`)
    ollamaModel: 'deepseek-v3.1:671b-cloud'
  }
}

