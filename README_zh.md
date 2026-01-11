# Xinyutong (心语通) - Heart-Edu Connect 平台

面向青少年家庭的综合性**心理咨询 + 教育指导**预约和分销平台。连接学生、家长与值得信赖的老师/咨询师，提供AI情感支持和专业人工咨询服务。

## 🎯 项目概述

**心语通**（Heart-Edu Connect）是一个综合性平台，结合了：
- 🤖 **AI情感支持**（面向 8-18 岁学生）
- 👨‍🏫 **专业人工咨询**预约系统
- 💰 **两级分销**模式
- 💳 **完整的支付和财务**管理
- 👥 **多角色用户系统**（家长、学生、老师、管理员、分销商）

### 核心价值主张

**面向家长：**
- 值得信赖、经过验证的咨询师和老师
- 基于学生需求的智能老师推荐
- 透明的定价和预约流程
- 通过分销计划赚取佣金

**面向学生：**
- AI陪伴提供情感支持和预筛选
- 轻松访问专业咨询服务
- 隐私保护的聊天记录

**面向老师/咨询师：**
- 资料管理和资质验证
- 日程和预约管理
- 收入跟踪和提现系统
- 用于自我推广的分销工具

## 🏗️ 架构

### 技术栈

- **前端框架**：uni-app (Vue 3)
- **后端平台**：微信云开发 (WXCloud)
- **数据库**：微信云数据库 (NoSQL)
- **支付**：微信支付 API
- **AI**：DeepSeek / Zhipu AI API
- **构建工具**：Vite
- **包管理器**：npm

### 平台组件

```
┌─────────────────────────────────────────┐
│     微信小程序（客户端）                  │
│   (uni-app + Vue 3, 单一代码库)           │
├─────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐
│  │  家长    │  │  老师    │  │  学生    │
│  │  界面    │  │  界面    │  │  界面    │
│  └──────────┘  └──────────┘  └──────────┘
│  ┌──────────────────────────────────────┐
│  │     管理员界面（WXCloud）              │
│  └──────────────────────────────────────┘
└─────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│        WXCloud 后端服务                   │
├─────────────────────────────────────────┤
│  云函数：                                 │
│  - chat.sendMessage                     │
│  - booking.*                            │
│  - payment.*                            │
│  - teacher.*                            │
│  - distribution.*                       │
│  - finance.*                            │
│  - admin.*                              │
├─────────────────────────────────────────┤
│  云数据库集合：                           │
│  - users, students, teachers            │
│  - bookings, orders, payments           │
│  - counseling_logs                      │
│  - distributors, referrals, commissions │
│  - withdrawals                          │
└─────────────────────────────────────────┘
```

## 📚 文档

### 快速开始

**新加入项目？**从这里开始：
- **[开发者指南（中文）](docs/DEVELOPER_GUIDE_zh.md)** - 完整开发者入门指南
- **[Developer Guide (English)](docs/DEVELOPER_GUIDE.md)** - Complete developer onboarding guide

**需要功能规范？**查看：
- **[功能需求（中文）](docs/FUNCTIONAL_REQUIREMENTS_zh.md)** - 详细功能需求
- **[Functional Requirements (English)](docs/FUNCTIONAL_REQUIREMENTS.md)** - Detailed functional requirements

### 设计与架构文档

- **[架构](docs/ARCHITECTURE.md)** - 技术架构概述
- **[数据模型](docs/DATA_MODEL.md)** - 数据库架构和集合
- **[云函数](docs/CLOUD_FUNCTIONS.md)** - 云函数 API 规范
- **[UX 流程](docs/UX_FLOWS.md)** - 用户体验流程和页面地图
- **[UI 风格指南](docs/UI_STYLEGUIDE.md)** - UI 设计指南
- **[安全与合规](docs/SAFETY_COMPLIANCE.md)** - 安全和合规指南
- **[AI 提示词](docs/PROMPTS.md)** - AI 提示词工程
- **[路线图](docs/ROADMAP.md)** - 实施路线图
- **[产品简介](docs/PRODUCT_BRIEF.md)** - 产品概述和使命

### 需求来源

- **[requirements.md](requirements.md)** - 高级产品需求

## 🚀 快速开始

### 前置要求

- **Node.js**（推荐 v16+）
- **npm**（推荐 v8+）
- **HBuilderX**（最新版本） - [下载](https://www.dcloud.io/hbuilderx.html)
- **微信开发者工具** - [下载](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)

### 安装

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

### 云函数设置

要进行端到端测试，请查看 [RUNNING.md](docs/RUNNING.md) 了解详细的设置说明。

## 🎨 核心功能

### 多角色系统

平台支持五种用户角色，每种角色具有不同的界面和权限：

1. **家长** - 主要账户持有者和支付者
   - 学生资料管理
   - 浏览老师/咨询师目录
   - 预约和支付
   - 查看咨询记录
   - 申请成为分销商

2. **老师/咨询师** - 服务提供者
   - 资料和资质管理
   - 日程管理
   - 确认预约
   - 提交咨询会话记录
   - 收入跟踪和提现

3. **学生** - 最终用户（8-18岁）
   - AI聊天陪伴
   - 查看自己的预约（只读）
   - 查看咨询记录（基于授权级别）

4. **管理员** - 平台管理者
   - 老师审核和批准
   - 订单和财务管理
   - 分销配置
   - 提现批准

5. **分销商** - 分销推广者（多角色）
   - 生成推广海报
   - 追踪推荐和佣金
   - 提现请求

### 核心模块

- **用户和角色管理** - 多角色支持，基于角色的访问控制
- **老师/咨询师管理** - 资料、资质验证和状态管理
- **预约系统** - 从选择到完成的完整预约流程
- **支付集成** - 微信支付集成和订单管理
- **AI陪伴** - 情感支持、问题检测和智能推荐
- **分销系统** - 两级分销系统，带佣金跟踪
- **财务和提现** - 收入跟踪和提现管理

### 安全与合规

- **内容审核** - 对所有用户生成的内容使用微信 `msgSecCheck`
- **风险检测** - 本地关键词筛选 + AI 情感分析
- **家长警报** - 高风险情况的即时通知
- **数据隐私** - 学生聊天记录绝不与家长共享
- **基于角色的访问** - 严格的权限执行
- **支付安全** - 仅服务器端的支付操作

## 📁 项目结构

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
│   ├── stores/                   # Vue 3 响应式存储
│   ├── utils/                    # 工具函数
│   └── i18n/                     # 国际化（中文/英文）
├── cloudfunctions/               # 云函数代码
│   ├── shared/                   # 共享工具
│   ├── chat.sendMessage/         # 聊天函数
│   ├── booking/                  # 预约函数
│   ├── payment/                  # 支付函数
│   ├── teacher/                  # 老师函数
│   ├── distribution/             # 分销函数
│   ├── finance/                  # 财务函数
│   └── admin/                    # 管理员函数
├── docs/                         # 文档
└── dist/                         # 构建输出
```

## 🛠️ 开发

### 开发工作流

1. **创建功能分支**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **进行更改和测试**
   - 编辑 `src/` 中的文件
   - 在微信开发者工具中测试
   - 验证无控制台错误

3. **提交更改**
   ```bash
   git add .
   git commit -m "feat: 添加功能描述"
   ```

4. **推送并创建 PR**
   ```bash
   git push origin feature/your-feature-name
   ```

### 构建生产版本

```bash
npm run build:mp-weixin
```

这会在 `dist/` 目录中生成优化代码。

## 📋 开发指南

### 代码风格

- 遵循 ESLint 规则
- 变量/函数使用 camelCase
- 组件使用 PascalCase
- 编写自文档化代码

### 安全

- 永远不要向客户端暴露 API 密钥
- 始终验证用户输入（客户端 + 服务器）
- 对用户生成的内容使用 `msgSecCheck`
- 在执行敏感操作前验证用户角色

### 最佳实践

- 保持函数小而专注
- 优雅地处理错误
- 使用 TypeScript 类型（目前使用 JSDoc）
- 为复杂逻辑编写单元测试
- 添加功能时更新文档

## 🧪 测试

### 测试策略

- **手动测试** - 在微信开发者工具中测试流程
- **单元测试** - 测试工具函数（待办：添加测试框架）
- **集成测试** - 端到端测试云函数
- **E2E 测试** - 测试完整的用户流程（待办：添加 E2E 框架）

详细测试指南请参见 [开发者指南](docs/DEVELOPER_GUIDE_zh.md)。

## 🚢 部署

1. **构建生产版本**
   ```bash
   npm run build:mp-weixin
   ```

2. **上传到微信**
   - 微信开发者工具 → 上传
   - 填写版本号和项目备注
   - 提交审核

3. **部署云函数**
   - 云函数面板 → 选择所有函数
   - 右键点击 → 上传并部署（生产环境）

详细部署说明请参见 [开发者指南](docs/DEVELOPER_GUIDE_zh.md#部署)。

## 📖 其他资源

### 外部链接

- [uni-app 文档](https://uniapp.dcloud.net.cn/)
- [微信小程序文档](https://developers.weixin.qq.com/miniprogram/dev/framework/)
- [微信云开发文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)
- [Vue 3 文档](https://vuejs.org/)
- [Vite 文档](https://vitejs.dev/)

### 故障排除

常见问题和解决方案记录在：
- [RUNNING.md](docs/RUNNING.md) - 设置和故障排除指南
- [开发者指南](docs/DEVELOPER_GUIDE_zh.md#故障排除) - 故障排除部分

## 🤝 贡献代码

1. Fork 仓库
2. 创建功能分支（`git checkout -b feature/amazing-feature`）
3. 进行更改
4. 提交更改（`git commit -m 'feat: 添加功能'`）
5. 推送到分支（`git push origin feature/amazing-feature`）
6. 创建 Pull Request

详细贡献指南请参见 [开发者指南](docs/DEVELOPER_GUIDE_zh.md#贡献代码)。

## 📄 许可证

[添加许可证信息]

## 👥 团队

- **技术负责人**：[姓名]
- **产品经理**：[姓名]
- **设计负责人**：[姓名]

## 📞 联系方式

如有问题或需要支持，请：
- 在 GitHub 上创建问题
- 联系开发团队

---

**状态**：开发中 | **版本**：1.0.0 | **最后更新**：2024
