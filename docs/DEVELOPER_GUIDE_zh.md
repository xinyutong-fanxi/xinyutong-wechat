# 开发者指南 - 心语通平台

欢迎加入心语通（Heart-Edu Connect）开发团队！本指南将帮助您快速上手代码库，并了解如何有效地贡献代码。

## 目录
1. [快速开始](#快速开始)
2. [项目概述](#项目概述)
3. [架构](#架构)
4. [开发工作流](#开发工作流)
5. [代码结构](#代码结构)
6. [云函数](#云函数)
7. [数据库](#数据库)
8. [测试](#测试)
9. [部署](#部署)
10. [故障排除](#故障排除)
11. [最佳实践](#最佳实践)
12. [贡献代码](#贡献代码)

---

## 快速开始

### 前置要求

在开始之前，请确保已安装以下软件：

- **Node.js**（推荐 v16+）
- **npm**（推荐 v8+）
- **HBuilderX**（最新版本） - [下载](https://www.dcloud.io/hbuilderx.html)
- **微信开发者工具** - [下载](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
- **Git**（用于版本控制）

### 快速启动

1. **克隆仓库**
   ```bash
   git clone <repository-url>
   cd XinLing
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **配置微信小程序 AppID**
   - 打开 `src/manifest.json`
   - 将 `mp-weixin.appid` 替换为您的微信小程序 AppID
   - （或保留占位符用于本地预览）

4. **运行项目**
   
   **选项 A：使用 HBuilderX（推荐）**
   - 打开 HBuilderX
   - 文件 → 导入 → 从本地目录导入
   - 选择 `XinLing` 文件夹
   - 运行 → 运行到小程序模拟器 → 微信开发者工具

   **选项 B：使用 CLI**
   ```bash
   npm run dev:mp-weixin
   ```

5. **配置云函数（用于端到端测试）**
   - 参见下面的[云函数设置](#云函数设置)

### 首次设置问题

如果在设置过程中遇到问题，请查看[故障排除](#故障排除)部分。

---

## 项目概述

### 什么是心语通？

心语通（Heart-Edu Connect）是一个综合性平台，连接家长、学生和专业咨询师/老师，提供心理咨询和教育指导服务。平台结合了：

- **AI情感支持**（面向 8-18 岁学生）
- **专业人工咨询**预约系统
- **两级分销**模式
- **完整的支付和财务**管理

### 技术栈

- **前端框架**：uni-app (Vue 3)
- **后端平台**：微信云开发 (WXCloud)
- **数据库**：微信云数据库
- **支付**：微信支付 API
- **AI**：DeepSeek / Zhipu AI API
- **构建工具**：Vite
- **包管理器**：npm

### 核心概念

- **多角色系统**：用户可以拥有多个角色（家长 + 分销商，老师 + 分销商）
- **基于角色的访问控制**：所有路由和函数都验证用户角色
- **单一代码库**：所有界面（家长、老师、学生、管理员）共享一个代码库
- **云优先**：业务逻辑在云函数中，不在客户端

---

## 架构

### 系统架构

```
┌─────────────────────────────────────────────┐
│        微信小程序（客户端）                  │
│  (uni-app + Vue 3, 单一代码库)              │
├─────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │  家长    │  │  老师    │  │  学生    │  │
│  │  界面    │  │  界面    │  │  界面    │  │
│  └──────────┘  └──────────┘  └──────────┘  │
│  ┌──────────────────────────────────────┐   │
│  │     管理员界面（WXCloud）              │   │
│  └──────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────┐
│        WXCloud 后端服务                       │
├─────────────────────────────────────────────┤
│  云函数：                                     │
│  - chat.sendMessage                         │
│  - booking.*                                │
│  - payment.*                                │
│  - teacher.*                                │
│  - distribution.*                           │
│  - finance.*                                │
│  - admin.*                                  │
├─────────────────────────────────────────────┤
│  云数据库集合：                               │
│  - users, students, teachers                │
│  - bookings, orders, payments               │
│  - counseling_logs                          │
│  - distributors, referrals, commissions     │
│  - withdrawals                              │
└─────────────────────────────────────────────┘
```

### 客户端架构

客户端采用**基于组件**的架构：

- **页面**：基于路由的页面，位于 `src/pages/`
- **组件**：可重用组件，位于 `src/components/`
- **状态管理**：Vue 3 响应式存储，位于 `src/stores/`
- **工具函数**：工具函数，位于 `src/utils/`
- **API 客户端**：云函数包装器，位于 `src/utils/cloud/`

### 后端架构

云函数采用**模块化**结构：

- **共享代码**：公共工具位于 `cloudfunctions/shared/`
- **函数模块**：每个函数是一个单独的模块
- **数据库访问**：通过 WXCloud SDK 直接访问
- **安全**：所有函数从上下文验证 `openid`

---

## 开发工作流

### 本地开发

1. **启动开发服务器**
   ```bash
   npm run dev:mp-weixin
   ```

2. **打开微信开发者工具**
   - 项目应该自动打开
   - 如果没有，手动打开开发者工具并选择项目目录

3. **进行更改**
   - 编辑 `src/` 中的文件
   - 更改会自动热重载
   - 云函数需要重新部署（参见[部署](#部署)）

### 云函数开发

1. **本地测试**（推荐用于快速迭代）
   - 使用 `ai.properties` 文件进行 AI 配置（参见[AI 配置](#ai配置)）
   - 首先使用存根响应进行测试
   - 部署到云端进行端到端测试

2. **云函数结构**
   ```
   cloudfunctions/
   ├── functionName/
   │   ├── index.js       # 主函数代码
   │   └── package.json   # 依赖（如果有）
   ```

3. **部署云函数**
   - 使用微信开发者工具云函数面板
   - 右键点击函数 → 上传并部署
   - 或使用 CLI：`wx-cloud deploy functionName`

### 代码组织

遵循以下约定：

- **命名**：变量/函数使用 camelCase，组件使用 PascalCase
- **文件结构**：页面镜像路由结构
- **组件**：按功能分组（shared, parent, teacher 等）
- **API 客户端**：每个域一个文件（bookingApi.js, paymentApi.js 等）

### Git 工作流

1. **创建功能分支**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **进行更改**
   - 编写代码
   - 编写/更新测试
   - 更新文档

3. **提交更改**
   ```bash
   git add .
   git commit -m "feat: 添加功能描述"
   ```

4. **推送并创建 PR**
   ```bash
   git push origin feature/your-feature-name
   ```
   然后在 GitHub 上创建 Pull Request。

**提交消息格式**：
- `feat: ` - 新功能
- `fix: ` - 修复
- `docs: ` - 文档更改
- `style: ` - 代码样式更改（格式化等）
- `refactor: ` - 代码重构
- `test: ` - 测试更改
- `chore: ` - 构建/工具更改

---

## 代码结构

### 目录结构

```
XinLing/
├── src/                          # 客户端源代码
│   ├── pages/                    # 页面组件（路由）
│   │   ├── index/                # 学生界面（聊天）
│   │   ├── parent/               # 家长界面
│   │   ├── teacher/              # 老师界面
│   │   ├── student/              # 学生界面（只读）
│   │   ├── admin/                # 管理员界面
│   │   └── onboarding/           # 注册流程
│   ├── components/               # 可重用组件
│   │   └── shared/               # 共享组件
│   │       ├── RoleGuard.vue     # 路由守卫包装器
│   │       ├── BookingCalendar.vue
│   │       ├── PaymentForm.vue
│   │       └── ...
│   ├── stores/                   # Vue 3 响应式存储
│   │   ├── user.js               # 用户状态
│   │   ├── booking.js            # 预约流程状态
│   │   └── distribution.js       # 分销统计
│   ├── utils/                    # 工具函数
│   │   ├── auth.js               # 身份验证/授权
│   │   ├── cloud/                # 云函数 API 客户端
│   │   │   ├── chatApi.js
│   │   │   ├── bookingApi.js
│   │   │   ├── paymentApi.js
│   │   │   └── ...
│   │   └── safety/               # 安全工具
│   │       └── safetyFilter.js
│   ├── i18n/                     # 国际化
│   │   ├── index.js
│   │   └── locales/
│   │       ├── zh.json           # 中文翻译
│   │       └── en.json           # 英文翻译
│   ├── App.vue                   # 根组件
│   ├── main.js                   # 入口点
│   ├── manifest.json             # uni-app 配置
│   ├── pages.json                # 路由配置
│   └── sitemap.json              # 站点地图（SEO）
├── cloudfunctions/               # 云函数代码
│   ├── shared/                   # 共享工具
│   │   ├── aiService.js          # AI 服务包装器
│   │   ├── aiConfig.js           # AI 配置
│   │   ├── prompts.js            # LLM 提示
│   │   └── risk.js               # 风险检测
│   ├── chat.sendMessage/         # 聊天函数
│   ├── booking/                  # 预约函数
│   ├── payment/                  # 支付函数
│   ├── teacher/                  # 老师函数
│   ├── distribution/             # 分销函数
│   ├── finance/                  # 财务函数
│   └── admin/                    # 管理员函数
├── docs/                         # 文档
│   ├── FUNCTIONAL_REQUIREMENTS.md
│   ├── FUNCTIONAL_REQUIREMENTS_zh.md
│   ├── DEVELOPER_GUIDE.md        # 本文档
│   ├── DEVELOPER_GUIDE_zh.md     # 本文档（中文版）
│   ├── ARCHITECTURE.md
│   ├── DATA_MODEL.md
│   ├── CLOUD_FUNCTIONS.md
│   └── ...
├── dist/                         # 构建输出（生成）
├── node_modules/                 # 依赖（生成）
├── package.json                  # 项目依赖
├── vite.config.js                # Vite 配置
└── README.md                     # 项目 README
```

### 关键文件说明

#### `src/pages.json`
uni-app 的路由配置。定义所有页面及其导航栏设置。

#### `src/manifest.json`
uni-app 清单配置。包含应用元数据、权限和平台特定设置。

#### `src/utils/auth.js`
身份验证和授权工具。包含在整个应用中使用的角色检查函数。

#### `src/utils/cloud/*.js`
云函数的 API 客户端包装器。这些文件抽象了 `wx.cloud.callFunction` 调用并提供类型化接口。

#### `cloudfunctions/shared/`
在多个云函数之间共享的工具。公共代码应该在这里，以避免重复。

---

## 云函数

### 云函数概述

云函数是在 WXCloud 上运行的服务器端代码。它们处理：

- 业务逻辑
- 数据库操作
- 外部 API 调用（微信支付、AI API）
- 安全敏感操作

### 从客户端调用云函数

所有云函数调用都通过 `src/utils/cloud/` 中的 API 客户端包装器。示例：

```javascript
// 在 Vue 组件中
import { createBookingOrder } from '@/utils/cloud/bookingApi.js'

// 调用云函数
const result = await createBookingOrder({
  teacherId: 'teacher_123',
  studentId: 'student_456',
  scheduledAt: Date.now() + 86400000, // 明天
  duration: 60,
  serviceType: 'counseling'
})
```

### 创建新的云函数

1. **创建函数目录**
   ```
   cloudfunctions/
   └── yourFunctionName/
       ├── index.js
       └── package.json (如果需要依赖)
   ```

2. **编写函数代码**
   ```javascript
   // cloudfunctions/yourFunctionName/index.js
   const cloud = require('wx-server-sdk')
   
   cloud.init({
     env: cloud.DYNAMIC_CURRENT_ENV
   })
   
   exports.main = async (event, context) => {
     // 从上下文获取用户 openid
     const { OPENID } = cloud.getWXContext()
     
     // 验证 openid 存在
     if (!OPENID) {
       return { error: 'Unauthorized', message: 'Missing openid' }
     }
     
     // 您的业务逻辑
     const { data } = event
     
     // 返回结果
     return {
       success: true,
       data: result
     }
   }
   ```

3. **创建 API 客户端包装器**（在 `src/utils/cloud/yourApi.js`）
   ```javascript
   export async function callYourFunction(params) {
     const data = { ...params }
     
     // #ifdef MP-WEIXIN
     if (typeof wx !== 'undefined' && wx.cloud && wx.cloud.callFunction) {
       const { result } = await wx.cloud.callFunction({
         name: 'yourFunctionName',
         data
       })
       return result
     }
     // #endif
     
     // 开发回退
     console.warn('[yourApi] 无云调用方法；返回存根')
     return { success: true, data: {} }
   }
   ```

4. **部署函数**
   - 使用微信开发者工具云函数面板
   - 右键点击函数 → 上传并部署

### 云函数最佳实践

1. **始终验证 `openid`**
   ```javascript
   const { OPENID } = cloud.getWXContext()
   if (!OPENID) {
     return { error: 'Unauthorized' }
   }
   ```

2. **使用环境变量存储机密**
   - 永远不要硬编码 API 密钥
   - 使用 WXCloud 环境变量
   - 或使用 `ai.properties` 文件（用于 AI 配置）

3. **优雅地处理错误**
   ```javascript
   try {
     // 您的代码
   } catch (error) {
     console.error('函数错误：', error)
     return {
       error: 'InternalError',
       message: error.message
     }
   }
   ```

4. **返回一致的响应格式**
   ```javascript
   // 成功
   return { success: true, data: result }
   
   // 错误
   return { error: 'ErrorCode', message: '错误消息' }
   ```

### 云函数设置

要端到端测试云函数：

1. **在微信开发者工具中启用云开发**
   - 云开发 → 创建云环境（或选择现有环境）
   - 记录您的环境 ID

2. **在小程序中初始化云**
   - 在 `src/App.vue` 或类似文件中，添加：
   ```javascript
   // #ifdef MP-WEIXIN
   if (typeof wx !== 'undefined') {
     wx.cloud.init({
       env: 'your-env-id', // 您的云环境 ID
       traceUser: true
     })
   }
   // #endif
   ```

3. **部署云函数**
   - 微信开发者工具 → 云函数面板
   - 右键点击每个函数 → 上传并部署
   - 或使用 CLI：`wx-cloud deploy --all`

4. **配置 AI 提供者**（用于聊天函数）
   - 参见下面的[AI 配置](#ai配置)

---

## 数据库

### 数据库概述

我们使用**微信云数据库**（NoSQL，基于文档）。集合定义在 `docs/DATA_MODEL.md` 中。

### 从云函数访问数据库

```javascript
const db = cloud.database()

// 获取集合
const usersCollection = db.collection('users')

// 查询
const result = await usersCollection.where({
  role: 'parent'
}).get()

// 插入
await usersCollection.add({
  data: {
    openid: OPENID,
    role: 'parent',
    createdAt: db.serverDate()
  }
})

// 更新
await usersCollection.doc(docId).update({
  data: {
    profile: newProfile
  }
})

// 删除
await usersCollection.doc(docId).remove()
```

### 数据库索引

为频繁查询的字段创建索引：

- `users`: `openid`（唯一）、`role`、`roles`
- `bookings`: `parentOpenId`、`teacherId`、`status`、`scheduledAt`
- `orders`: `parentOpenId`、`status`、`createdAt`
- `commissions`: `distributorId`、`status`

索引可以通过微信开发者工具云数据库面板创建。

### 数据库安全规则

在微信云控制台中设置安全规则：

- 用户只能读写自己的数据
- 管理员可以读写所有数据
- 老师可以读取自己的预约和资料

示例安全规则：
```javascript
{
  "read": "auth.openid == doc.parentOpenId",
  "write": "auth.openid == doc.parentOpenId"
}
```

---

## 测试

### 测试策略

我们使用以下组合：

1. **手动测试**：在微信开发者工具中测试流程
2. **单元测试**：测试工具函数（待办：添加测试框架）
3. **集成测试**：端到端测试云函数
4. **E2E 测试**：测试完整的用户流程（待办：添加 E2E 框架）

### 本地测试云函数

为了快速迭代，使用模拟数据测试云函数：

```javascript
// 在云函数中
const isLocal = process.env.NODE_ENV === 'development'

if (isLocal) {
  // 使用模拟数据
  return { success: true, data: mockData }
}
```

### 测试清单

在提交 PR 之前，确保：

- ✅ 代码运行无错误
- ✅ 云函数优雅地处理错误
- ✅ 基于角色的访问控制工作
- ✅ 支付流程工作（测试模式）
- ✅ 预约流程成功完成
- ✅ 开发者工具中无控制台错误
- ✅ UI 在不同屏幕尺寸下响应式

---

## 部署

### 构建生产版本

```bash
npm run build:mp-weixin
```

这会在 `dist/` 目录中生成优化代码。

### 部署到微信

1. **上传代码**
   - 微信开发者工具 → 上传
   - 填写版本号和项目备注
   - 提交审核

2. **部署云函数**
   - 云函数面板 → 选择所有函数
   - 右键点击 → 上传并部署（生产环境）

3. **配置云环境**
   - 确保代码中设置了生产环境 ID
   - 在生产环境中测试所有函数

### 环境配置

为开发/预发布/生产使用不同的云环境：

```javascript
// 在 App.vue 或 config 中
const envId = process.env.NODE_ENV === 'production' 
  ? 'prod-env-id' 
  : 'dev-env-id'

wx.cloud.init({ env: envId })
```

---

## 故障排除

### 常见问题

#### 1. "node_modules not found"

**解决方案**：
```bash
cd /Users/partha/XinLing
npm install
```

如果不行：
```bash
rm -rf node_modules package-lock.json
npm install
```

#### 2. "No matching version found for @dcloudio/..."

**解决方案**：检查 npm 注册表：
```bash
npm config set registry https://registry.npmjs.org/
npm install
```

#### 3. "Vue 2 vs Vue 3 冲突"

**解决方案**：清理安装：
```bash
rm -rf node_modules package-lock.json
npm install
```

#### 4. "Cannot read properties of undefined (reading 'vueOptions')"

**解决方案**：版本不匹配。进行清理重新安装：
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev:mp-weixin
```

#### 5. 云函数不工作

**检查**：
- 在 `App.vue` 中初始化了云环境吗？
- 环境 ID 正确吗？
- 函数已部署吗？
- 在微信控制台中设置了网络权限吗？

#### 6. 支付不工作

**检查**：
- 在微信控制台中配置了微信支付吗？
- 商户账户已验证吗？
- 支付回调配置正确吗？
- 测试模式 vs 生产模式？

#### 7. AI 聊天无响应

**检查**：
- 配置了 AI 提供者吗？（参见[AI 配置](#ai配置)）
- API 密钥有效吗？
- 未超过速率限制吗？
- 检查微信控制台中的云函数日志

### 获取帮助

如果您遇到此处未涵盖的问题：

1. 查看 `docs/` 中的现有文档
2. 在 GitHub 上搜索现有问题
3. 在团队聊天/Slack 中询问
4. 创建新问题，包含：
   - 错误消息
   - 重现步骤
   - 环境详情（操作系统、Node 版本等）
   - 如果适用，截图/日志

---

## 最佳实践

### 代码质量

1. **遵循 ESLint 规则**
   - 我们使用 ESLint 进行代码质量检查
   - 在提交前修复 linting 错误

2. **编写自文档化代码**
   - 使用描述性变量/函数名
   - 为复杂函数添加 JSDoc 注释
   - 保持函数小而专注

3. **优雅地处理错误**
   ```javascript
   try {
     const result = await someOperation()
   } catch (error) {
     console.error('操作失败：', error)
     uni.showToast({
       title: '操作失败，请重试',
       icon: 'none'
     })
   }
   ```

4. **使用 TypeScript（未来）**
   - 我们计划迁移到 TypeScript
   - 现在考虑使用 JSDoc 类型

### 安全

1. **永远不要暴露 API 密钥**
   - 所有 API 密钥必须在云函数中
   - 永远不要将机密提交到 Git
   - 使用环境变量或属性文件

2. **验证用户输入**
   - 始终在客户端和服务器上验证输入
   - 使用 `msgSecCheck` 检查用户生成的内容
   - 清理数据库查询

3. **检查用户角色**
   - 在执行敏感操作之前始终验证用户角色
   - 使用 `utils/auth.js` 中的 `requireRole()`
   - 在云函数中检查 `openid`

4. **保护敏感数据**
   - 学生转录从不发送给家长
   - 支付数据加密
   - 个人信息最小化

### 性能

1. **优化数据库查询**
   - 为频繁查询的字段使用索引
   - 限制查询结果（分页）
   - 避免 N+1 查询

2. **最小化云函数调用**
   - 尽可能批量操作
   - 缓存频繁访问的数据
   - 使用客户端状态管理

3. **优化图像**
   - 上传前压缩图像
   - 使用适当的图像格式（如果支持，使用 WebP）
   - 延迟加载图像

4. **代码拆分**
   - 对大型组件使用动态导入
   - 将路由拆分为单独的包
   - 最小化初始包大小

### 可访问性

1. **使用语义 HTML**
   - 使用适当的 HTML 标签（`<button>`、`<nav>` 等）
   - 在需要的地方添加 ARIA 标签

2. **键盘导航**
   - 确保所有交互元素可通过键盘访问
   - 提供焦点指示器

3. **屏幕阅读器**
   - 为图像添加描述性 alt 文本
   - 使用适当的标题层次结构

### 国际化（i18n）

我们支持中文（zh）和英文（en）。要添加新翻译：

1. 将键添加到 `src/i18n/locales/zh.json` 和 `src/i18n/locales/en.json`
2. 在组件中使用 `$t()` 函数：
   ```vue
   <template>
     <text>{{ $t('common.confirm') }}</text>
   </template>
   ```

---

## AI 配置

### 概述

所有 AI/LLM 调用都通过 `cloudfunctions/shared/aiService.js`。此服务支持多个提供者：

- **DeepSeek**：推荐用于生产
- **Zhipu**：替代的中文提供者
- **Ollama**：用于本地开发

### 配置方法

#### 选项 1：属性文件（推荐用于本地开发）

1. 复制 `cloudfunctions/shared/ai.properties.example` → `cloudfunctions/shared/ai.properties`
2. 编辑文件：
   ```properties
   AI_PROVIDER=deepseek
   AI_BASE_URL=https://api.deepseek.com
   AI_MODEL=deepseek-chat
   AI_API_KEY=your-api-key-here
   ```

3. **永远不要将 `ai.properties` 提交到 Git**（它在 `.gitignore` 中）

#### 选项 2：环境变量（用于生产）

在微信云控制台中设置环境变量：
- `AI_PROVIDER`：提供者名称
- `AI_BASE_URL`：API 基础 URL
- `AI_MODEL`：模型名称
- `AI_API_KEY`：API 密钥

#### 选项 3：直接 Ollama（仅开发）

为了在没有云函数的情况下快速本地迭代：

1. 本地启动 Ollama：
   ```bash
   ollama serve
   ollama pull llama3.1
   ```

2. 在 `src/utils/cloud/devAiConfig.js` 中启用：
   ```javascript
   export const devAiConfig = {
     enableDirectOllama: true,
     ollamaBaseUrl: 'http://127.0.0.1:11434/v1',
     ollamaModel: 'llama3.1'
   }
   ```

**警告**：永远不要在生产构建中启用 `enableDirectOllama`！

### 测试 AI 配置

测试您的 AI 配置：

1. 启动聊天界面
2. 发送测试消息
3. 检查控制台日志以查看正在使用的 AI 提供者
4. 验证收到 AI 响应

如果 AI 无响应：
- 检查 API 密钥是否有效
- 检查未超过速率限制
- 检查网络连接
- 检查微信控制台中的云函数日志

---

## 贡献代码

### 贡献流程

1. **Fork 仓库**
   - 在 GitHub 上 Fork
   - 本地克隆您的 Fork

2. **创建功能分支**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **进行更改**
   - 编写代码
   - 编写/更新测试
   - 更新文档

4. **测试更改**
   - 本地运行
   - 在微信开发者工具中测试
   - 验证无控制台错误

5. **提交更改**
   ```bash
   git add .
   git commit -m "feat: 添加功能描述"
   ```
   遵循上面的[提交消息格式](#git工作流)。

6. **推送到 Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **创建 Pull Request**
   - 转到 GitHub
   - 点击"New Pull Request"
   - 选择您的 Fork 和分支
   - 填写 PR 描述
   - 请求审核

### 代码审核指南

- 所有 PR 需要至少一个批准
- 及时处理审核评论
- 保持 PR 小而专注（一个 PR 一个功能）
- 如果适用，更新文档
- 如果适用，添加测试

### Pull Request 模板

创建 PR 时，包括：

- **描述**：此 PR 做什么？
- **更改**：所做更改列表
- **测试**：如何测试的？
- **截图**：如果有 UI 更改
- **相关问题**：链接到相关问题

---

## 其他资源

### 文档

- [功能需求](./FUNCTIONAL_REQUIREMENTS.md) - 详细功能规范
- [功能需求（中文）](./FUNCTIONAL_REQUIREMENTS_zh.md) - 详细功能规范（中文版）
- [架构](./ARCHITECTURE.md) - 技术架构概述
- [数据模型](./DATA_MODEL.md) - 数据库架构和集合
- [云函数](./CLOUD_FUNCTIONS.md) - 云函数 API 规范
- [UX 流程](./UX_FLOWS.md) - 用户体验流程
- [运行指南](./RUNNING.md) - 详细设置和故障排除

### 外部资源

- [uni-app 文档](https://uniapp.dcloud.net.cn/)
- [微信小程序文档](https://developers.weixin.qq.com/miniprogram/dev/framework/)
- [微信云开发文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)
- [Vue 3 文档](https://vuejs.org/)
- [Vite 文档](https://vitejs.dev/)

### 团队联系方式

- **技术负责人**：[联系方式]
- **产品经理**：[联系方式]
- **设计负责人**：[联系方式]

---

## 常见问题

### Q: 如何添加新页面？

A: 
1. 在 `src/pages/your-path/your-page.vue` 创建 Vue 组件
2. 在 `src/pages.json` 中添加路由
3. 如果需要，添加导航链接

### Q: 如何添加新云函数？

A: 参见上面的[创建新的云函数](#创建新的云函数)。

### Q: 如何从云函数访问数据库？

A: 参见上面的[从云函数访问数据库](#从云函数访问数据库)。

### Q: 如何测试支付功能？

A: 使用微信支付沙盒/测试模式。在微信控制台中配置测试商户账户。

### Q: 如何调试云函数？

A: 
1. 添加 `console.log()` 语句
2. 在微信开发者工具云函数面板中查看日志
3. 或在微信云控制台中查看日志

### Q: 如何在云函数中处理错误？

A: 始终将操作包装在 try-catch 中，并返回一致的错误格式：
```javascript
try {
  // 您的代码
} catch (error) {
  return { error: 'ErrorCode', message: error.message }
}
```

---

## 更新日志

### 版本 1.0（当前）
- 初始开发者指南
- 设置说明
- 架构概述
- 最佳实践
- 故障排除指南

---

**最后更新**：2024
**维护者**：心语通开发团队

如有问题或建议，请在 GitHub 上创建问题或联系团队。
