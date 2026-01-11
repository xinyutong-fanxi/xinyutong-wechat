# Running & Testing (HBuilderX + WeChat DevTools)

## What you need installed
- **HBuilderX**
- **WeChat DevTools**
- **Node.js + npm** (recommended, for installing `node_modules`)

## Run the UI (no cloud required)
This repo includes a dev fallback response in `src/utils/cloud/chatApi.js`, so the chat UI can be previewed before cloud is wired.

1. Open **HBuilderX**
2. **File → Import → From local directory** (or “Import Project”) and select the repo folder.
3. In the left project tree, ensure these exist:
   - `src/pages.json`
   - `src/manifest.json`
   - `src/pages/index/index.vue`
4. Set WeChat appid (recommended):
   - Open `src/manifest.json`
   - Replace `mp-weixin.appid` with your mini program AppID (or keep placeholder for local preview).
5. Run:
   - **Run → Run to Mini Program → WeChat DevTools**

You should see:
- Mood picker row
- Chat bubbles
- Sending a message appends an assistant reply (fallback) if cloud isn’t configured yet

## Troubleshooting: “node_modules not found”
If HBuilderX prompts that `node_modules` is missing, do this in a terminal at the repo root:

```bash
cd /Users/partha/XinLing
npm install
```

Then retry:
- **Run → Run to Mini Program → WeChat DevTools**

If you see `npm ERR! code ETARGET` / “No matching version found for @dcloudio/…”, run:

```bash
cd /Users/partha/XinLing
npm view @dcloudio/uni-app version
```

If that command fails or returns nothing, your npm registry/mirror can’t see the package versions. In that case, switch npm registry (pick one that works in your environment) and retry:

```bash
npm config set registry https://registry.npmjs.org/
npm install
```

## Troubleshooting: `npm ERR! ERESOLVE` (Vue 2 vs Vue 3 conflict)
If you see errors mentioning `vue@2.x` and `@vue/composition-api`, it means uni-app v2 was selected.
Fix by doing a clean install:

```bash
cd /Users/partha/XinLing
rm -rf node_modules package-lock.json
npm install
```

## Troubleshooting: `npm ERR! ERESOLVE` (Vite 5 vs Vite 2 peer conflict)
If you see errors mentioning `@vitejs/plugin-vue@1.x` requiring `vite@^2.5.10`, it means your `@dcloudio/vite-plugin-uni` version expects Vite 2.x.
This repo pins Vite 2.x for compatibility.

If you already tried installing with Vite 5, do a clean reinstall:

```bash
cd /Users/partha/XinLing
rm -rf node_modules package-lock.json
npm install
```

## Troubleshooting: `TypeError: Cannot read properties of undefined (reading 'vueOptions')`
If `npm run dev:mp-weixin` crashes inside `@dcloudio/uni-mp-vite`, it’s almost always a **version mismatch** between:
- `@dcloudio/uni-*` packages
- `@dcloudio/vite-plugin-uni`
- `vite` / `@vitejs/plugin-vue`

Fix with a clean reinstall after updating `package.json`:

```bash
cd /Users/partha/XinLing
rm -rf node_modules package-lock.json
npm install
npm run dev:mp-weixin
```

If you prefer running via CLI instead of HBuilderX:

```bash
cd /Users/partha/XinLing
npm install
npm run dev:mp-weixin
```


## Run with WXCloud functions (end-to-end)
To test `wx.cloud.callFunction('chat.sendMessage')`:

1. In WeChat DevTools, enable **Cloud Development** and select/create a cloud environment.
2. Deploy cloud functions:
   - Use DevTools “Cloud Functions” panel to upload the repo’s `cloudfunctions/` folder functions:
     - `chat.sendMessage`
     - `safety.msgSecCheckProxy`
     - `alert.triggerParent`
     - `insights.generateWeekly`
     - `guardian.verify`
3. Ensure the Mini Program is bound to the same cloud environment.

Notes:
- `safety.msgSecCheckProxy` is currently a stub and always passes.
- `chat.sendMessage` returns a stub response unless you configure an AI provider (see “LLM configuration” below).

## LLM configuration (dev cycles)
All server-side LLM calls go through `cloudfunctions/shared/aiService.js`.

You can switch providers by setting environment variables in your runtime (local emulator / devtools env / cloud env config).

### Option 0 (recommended): `ai.properties` file
For local development, you can keep configuration in a properties file:

- Copy `cloudfunctions/shared/ai.properties.example` → `cloudfunctions/shared/ai.properties`
- Edit `AI_PROVIDER`, `AI_MODEL`, etc.

Env vars still **override** the file (useful for CI / production).

If you want the config file somewhere else, set:
- **AI_CONFIG_PATH**: absolute path to your `.properties` file

### Option A: DeepSeek cloud (recommended for realism)
- **AI_PROVIDER**: `deepseek`
- **AI_BASE_URL** (optional): `https://api.deepseek.com`
- **AI_MODEL** (optional): `deepseek-chat`
- **AI_API_KEY**: your DeepSeek API key

### Option B: Local Ollama (recommended for fast iterations)
This is best for local function debugging. It will NOT work from the deployed cloud runtime (Tencent Cloud cannot reach your laptop’s `127.0.0.1`).

- Start Ollama locally.
- Ensure your Ollama build exposes an OpenAI-compatible endpoint (commonly `http://127.0.0.1:11434/v1`).
- **AI_PROVIDER**: `ollama`
- **AI_BASE_URL** (optional): `http://127.0.0.1:11434/v1`
- **AI_MODEL**: a model you have locally (example: `llama3.1`)
- **AI_API_KEY** (optional): not required for local

### Option C (fastest): Call local Ollama directly from the app (DevTools only)
If you just want to see real AI replies in the chat UI quickly (without setting up cloud functions),
you can enable a **dev-only** direct Ollama mode:

1. Start Ollama locally, and ensure the OpenAI-compatible endpoint works:
   - Base: `http://127.0.0.1:11434/v1`
   - Path used by the app: `/chat/completions`
2. Ensure you have a model pulled locally (example):
   - `ollama pull llama3.1`
3. Enable the flag in:
   - `src/utils/cloud/devAiConfig.js`
   - Set `enableDirectOllama: true`
   - Set `ollamaModel` to your local model name

Security note: do not ship production builds with direct-to-localhost enabled.

