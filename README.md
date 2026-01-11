# Xinyutong (心语通) - Heart-Edu Connect Platform

An integrated **Psychological Counseling + Educational Guidance** booking and affiliate distribution platform for teenage families. Connects students and parents with trusted teachers/counselors, providing both AI emotional support and professional human counseling services.

## 🎯 Project Overview

**Xinyutong** (Heart-Edu Connect) is a comprehensive platform that combines:
- 🤖 **AI-powered emotional support** for students (ages 8-18)
- 👨‍🏫 **Professional human counseling** booking system
- 💰 **Two-level affiliate distribution** model
- 💳 **Complete payment and finance** management
- 👥 **Multi-role user system** (Parents, Students, Teachers, Admins, Distributors)

### Core Value Proposition

**For Parents:**
- Trusted, verified counselors and teachers
- Intelligent teacher recommendations based on student needs
- Transparent pricing and booking process
- Earn commissions through affiliate program

**For Students:**
- AI companion for emotional support and pre-screening
- Easy access to professional counseling services
- Privacy-protected chat transcripts

**For Teachers/Counselors:**
- Profile management and credential verification
- Schedule and booking management
- Earnings tracking and withdrawal system
- Distribution tools for self-promotion

## 🏗️ Architecture

### Technology Stack

- **Frontend Framework**: uni-app (Vue 3)
- **Backend Platform**: WeChat Cloud Development (WXCloud)
- **Database**: WeChat Cloud Database (NoSQL)
- **Payment**: WeChat Pay API
- **AI**: DeepSeek / Zhipu AI API
- **Build Tool**: Vite
- **Package Manager**: npm

### Platform Components

```
┌─────────────────────────────────────────┐
│     WeChat Mini Program (Client)        │
│   (uni-app + Vue 3, Single Codebase)    │
├─────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐
│  │  Parent  │  │ Teacher  │  │ Student  │
│  │Interface │  │Interface │  │Interface │
│  └──────────┘  └──────────┘  └──────────┘
│  ┌──────────────────────────────────────┐
│  │    Admin Interface (WXCloud)         │
│  └──────────────────────────────────────┘
└─────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│       WXCloud Backend Services          │
├─────────────────────────────────────────┤
│  Cloud Functions:                       │
│  - chat.sendMessage                     │
│  - booking.*                            │
│  - payment.*                            │
│  - teacher.*                            │
│  - distribution.*                       │
│  - finance.*                            │
│  - admin.*                              │
├─────────────────────────────────────────┤
│  Cloud Database Collections:            │
│  - users, students, teachers            │
│  - bookings, orders, payments           │
│  - counseling_logs                      │
│  - distributors, referrals, commissions │
│  - withdrawals                          │
└─────────────────────────────────────────┘
```

## 📚 Documentation / 文档

**中文团队请查看：[README_zh.md](README_zh.md)**

### Getting Started / 快速开始

**New to the project?** Start here:
- **[Developer Guide (English)](docs/DEVELOPER_GUIDE.md)** - Complete developer onboarding guide
- **[开发者指南（中文）](docs/DEVELOPER_GUIDE_zh.md)** - 完整开发者入门指南

**Need functional specifications?** See:
- **[Functional Requirements (English)](docs/FUNCTIONAL_REQUIREMENTS.md)** - Detailed functional requirements
- **[功能需求（中文）](docs/FUNCTIONAL_REQUIREMENTS_zh.md)** - 详细功能需求

### Design & Architecture Docs / 设计与架构文档

- **[Architecture](docs/ARCHITECTURE.md)** - Technical architecture overview
- **[Data Model](docs/DATA_MODEL.md)** - Database schema and collections
- **[Cloud Functions](docs/CLOUD_FUNCTIONS.md)** - Cloud function API specifications
- **[UX Flows](docs/UX_FLOWS.md)** - User experience flows and page maps
- **[UI Style Guide](docs/UI_STYLEGUIDE.md)** - UI design guidelines
- **[Safety & Compliance](docs/SAFETY_COMPLIANCE.md)** - Safety and compliance guidelines
- **[AI Prompts](docs/PROMPTS.md)** - AI prompt engineering
- **[Roadmap](docs/ROADMAP.md)** - Implementation roadmap
- **[Product Brief](docs/PRODUCT_BRIEF.md)** - Product overview and mission

### Source of Truth / 需求来源

- **[requirements.md](requirements.md)** - High-level product requirements

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v16+ recommended)
- **npm** (v8+ recommended)
- **HBuilderX** (latest version) - [Download](https://www.dcloud.io/hbuilderx.html)
- **WeChat DevTools** - [Download](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd XinLing
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure WeChat Mini Program AppID**
   - Open `src/manifest.json`
   - Replace `mp-weixin.appid` with your WeChat Mini Program AppID

4. **Run the project**
   
   **Option A: Using HBuilderX (Recommended)**
   - Open HBuilderX
   - File → Import → From local directory
   - Select the `XinLing` folder
   - Run → Run to Mini Program → WeChat DevTools

   **Option B: Using CLI**
   ```bash
   npm run dev:mp-weixin
   ```

### Cloud Functions Setup

For end-to-end testing, see [RUNNING.md](docs/RUNNING.md) for detailed setup instructions.

## 🎨 Key Features

### Multi-Role System

The platform supports five user roles with different interfaces and permissions:

1. **Parents** - Primary account holders and payers
   - Student profile management
   - Teacher/counselor directory browsing
   - Booking and payment
   - View counseling records
   - Apply to become distributors

2. **Teachers/Counselors** - Service providers
   - Profile and credential management
   - Schedule management
   - Booking confirmation
   - Submit counseling session logs
   - Earnings tracking and withdrawals

3. **Students** - End users (ages 8-18)
   - AI chat companion
   - View own bookings (read-only)
   - View counseling records (based on authorization level)

4. **Administrators** - Platform managers
   - Teacher auditing and approval
   - Order and finance management
   - Distribution configuration
   - Withdrawal approval

5. **Distributors** - Affiliate promoters (multi-role)
   - Generate promotional posters
   - Track referrals and commissions
   - Withdrawal requests

### Core Modules

- **User & Role Management** - Multi-role support with role-based access control
- **Teacher/Counselor Management** - Profile, credential verification, and status management
- **Booking System** - Complete booking flow from selection to completion
- **Payment Integration** - WeChat Pay integration with order management
- **AI Companion** - Emotional support, issue detection, and intelligent recommendations
- **Distribution System** - Two-level affiliate system with commission tracking
- **Finance & Withdrawals** - Earnings tracking and withdrawal management

### Safety & Security

- **Content Moderation** - WeChat `msgSecCheck` for all user-generated content
- **Risk Detection** - Local keyword triage + AI sentiment analysis
- **Parent Alerts** - Immediate notifications for high-risk situations
- **Data Privacy** - Student transcripts never shared with parents
- **Role-Based Access** - Strict permission enforcement
- **Payment Security** - Server-side only payment operations

## 📁 Project Structure

```
XinLing/
├── src/                          # Client source code
│   ├── pages/                    # Page components (routes)
│   │   ├── index/                # Student interface (chat)
│   │   ├── parent/               # Parent interface
│   │   ├── teacher/              # Teacher interface
│   │   ├── student/              # Student interface (read-only)
│   │   ├── admin/                # Admin interface
│   │   └── onboarding/           # Onboarding flows
│   ├── components/               # Reusable components
│   ├── stores/                   # Vue 3 reactive stores
│   ├── utils/                    # Utility functions
│   └── i18n/                     # Internationalization (zh/en)
├── cloudfunctions/               # Cloud function code
│   ├── shared/                   # Shared utilities
│   ├── chat.sendMessage/         # Chat function
│   ├── booking/                  # Booking functions
│   ├── payment/                  # Payment functions
│   ├── teacher/                  # Teacher functions
│   ├── distribution/             # Distribution functions
│   ├── finance/                  # Finance functions
│   └── admin/                    # Admin functions
├── docs/                         # Documentation
└── dist/                         # Build output
```

## 🛠️ Development

### Development Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make changes and test**
   - Edit files in `src/`
   - Test in WeChat DevTools
   - Verify no console errors

3. **Commit changes**
   ```bash
   git add .
   git commit -m "feat: add feature description"
   ```

4. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

### Building for Production

```bash
npm run build:mp-weixin
```

This generates optimized code in the `dist/` directory.

## 📋 Development Guidelines

### Code Style

- Follow ESLint rules
- Use camelCase for variables/functions
- Use PascalCase for components
- Write self-documenting code

### Security

- Never expose API keys to client
- Always validate user input (client + server)
- Use `msgSecCheck` for user-generated content
- Verify user roles before sensitive operations

### Best Practices

- Keep functions small and focused
- Handle errors gracefully
- Use TypeScript types (JSDoc for now)
- Write unit tests for complex logic
- Update documentation when adding features

## 🧪 Testing

### Testing Strategy

- **Manual Testing** - Test flows in WeChat DevTools
- **Unit Tests** - Test utility functions (TODO: add test framework)
- **Integration Tests** - Test cloud functions end-to-end
- **E2E Tests** - Test complete user flows (TODO: add E2E framework)

See [DEVELOPER_GUIDE.md](docs/DEVELOPER_GUIDE.md) for detailed testing guidelines.

## 🚢 Deployment

1. **Build for production**
   ```bash
   npm run build:mp-weixin
   ```

2. **Upload to WeChat**
   - WeChat DevTools → Upload
   - Fill in version number and project notes
   - Submit for review

3. **Deploy cloud functions**
   - Cloud Functions panel → Select all functions
   - Right-click → Upload and deploy (Production)

See [DEVELOPER_GUIDE.md](docs/DEVELOPER_GUIDE.md#deployment) for detailed deployment instructions.

## 📖 Additional Resources

### External Links

- [uni-app Documentation](https://uniapp.dcloud.net.cn/)
- [WeChat Mini Program Documentation](https://developers.weixin.qq.com/miniprogram/dev/framework/)
- [WeChat Cloud Development Documentation](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)
- [Vue 3 Documentation](https://vuejs.org/)
- [Vite Documentation](https://vitejs.dev/)

### Troubleshooting

Common issues and solutions are documented in:
- [RUNNING.md](docs/RUNNING.md) - Setup and troubleshooting guide
- [DEVELOPER_GUIDE.md](docs/DEVELOPER_GUIDE.md#troubleshooting) - Troubleshooting section

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'feat: Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

See [DEVELOPER_GUIDE.md](docs/DEVELOPER_GUIDE.md#contributing) for detailed contributing guidelines.

## 📄 License

[Add license information here]

## 👥 Team

- **Technical Lead**: [Name]
- **Product Manager**: [Name]
- **Design Lead**: [Name]

## 📞 Contact

For questions or support, please:
- Create an issue on GitHub
- Contact the development team

---

**Status**: In Active Development | **Version**: 1.0.0 | **Last Updated**: 2024
