# Developer Guide - Xinyutong Platform

Welcome to the Xinyutong (Heart-Edu Connect) development team! This guide will help you get started with the codebase and understand how to contribute effectively.

## Table of Contents
1. [Getting Started](#getting-started)
2. [Project Overview](#project-overview)
3. [Architecture](#architecture)
4. [Development Workflow](#development-workflow)
5. [Code Structure](#code-structure)
6. [Cloud Functions](#cloud-functions)
7. [Database](#database)
8. [Testing](#testing)
9. [Deployment](#deployment)
10. [Troubleshooting](#troubleshooting)
11. [Best Practices](#best-practices)
12. [Contributing](#contributing)

---

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16+ recommended)
- **npm** (v8+ recommended)
- **HBuilderX** (latest version) - [Download](https://www.dcloud.io/hbuilderx.html)
- **WeChat DevTools** - [Download](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
- **Git** (for version control)

### Quick Start

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
   - (Or keep placeholder for local preview)

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

5. **Configure Cloud Functions (for end-to-end testing)**
   - See [Cloud Functions Setup](#cloud-functions-setup) below

### First Time Setup Issues

If you encounter issues during setup, see the [Troubleshooting](#troubleshooting) section.

---

## Project Overview

### What is Xinyutong?

Xinyutong (Heart-Edu Connect) is an integrated platform that connects parents, students, and professional counselors/teachers for psychological counseling and educational guidance services. The platform combines:

- **AI-powered emotional support** for students (ages 8-18)
- **Professional human counseling** booking system
- **Two-level affiliate distribution** model
- **Comprehensive payment and finance** management

### Technology Stack

- **Frontend Framework**: uni-app (Vue 3)
- **Backend Platform**: WeChat Cloud Development (WXCloud)
- **Database**: WeChat Cloud Database
- **Payment**: WeChat Pay API
- **AI**: DeepSeek / Zhipu AI API
- **Build Tool**: Vite
- **Package Manager**: npm

### Key Concepts

- **Multi-Role System**: Users can have multiple roles (parent + distributor, teacher + distributor)
- **Role-Based Access Control**: All routes and functions validate user roles
- **Single Codebase**: All interfaces (Parent, Teacher, Student, Admin) share one codebase
- **Cloud-First**: Business logic lives in cloud functions, not client

---

## Architecture

### System Architecture

```
┌─────────────────────────────────────────────┐
│         WeChat Mini Program (Client)        │
│  (uni-app + Vue 3, Single Codebase)         │
├─────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │  Parent  │  │ Teacher  │  │ Student  │  │
│  │Interface │  │Interface │  │Interface │  │
│  └──────────┘  └──────────┘  └──────────┘  │
│  ┌──────────────────────────────────────┐   │
│  │      Admin Interface (WXCloud)        │   │
│  └──────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────┐
│        WXCloud Backend Services             │
├─────────────────────────────────────────────┤
│  Cloud Functions:                           │
│  - chat.sendMessage                         │
│  - booking.*                                │
│  - payment.*                                │
│  - teacher.*                                │
│  - distribution.*                           │
│  - finance.*                                │
│  - admin.*                                  │
├─────────────────────────────────────────────┤
│  Cloud Database Collections:                │
│  - users, students, teachers                │
│  - bookings, orders, payments               │
│  - counseling_logs                          │
│  - distributors, referrals, commissions     │
│  - withdrawals                              │
└─────────────────────────────────────────────┘
```

### Client Architecture

The client follows a **component-based** architecture with:

- **Pages**: Route-based pages under `src/pages/`
- **Components**: Reusable components under `src/components/`
- **Stores**: Vue 3 reactive stores under `src/stores/`
- **Utils**: Utility functions under `src/utils/`
- **API Clients**: Cloud function wrappers under `src/utils/cloud/`

### Backend Architecture

Cloud functions follow a **modular** structure:

- **Shared Code**: Common utilities in `cloudfunctions/shared/`
- **Function Modules**: Each function is a separate module
- **Database Access**: Direct access via WXCloud SDK
- **Security**: All functions validate `openid` from context

---

## Development Workflow

### Local Development

1. **Start Development Server**
   ```bash
   npm run dev:mp-weixin
   ```

2. **Open WeChat DevTools**
   - Project should auto-open
   - If not, manually open DevTools and select project directory

3. **Make Changes**
   - Edit files in `src/`
   - Changes hot-reload automatically
   - Cloud functions require redeployment (see [Deployment](#deployment))

### Cloud Functions Development

1. **Local Testing** (Recommended for fast iteration)
   - Use `ai.properties` file for AI configuration (see [AI Configuration](#ai-configuration))
   - Test with stub responses first
   - Deploy to cloud for end-to-end testing

2. **Cloud Function Structure**
   ```
   cloudfunctions/
   ├── functionName/
   │   ├── index.js       # Main function code
   │   └── package.json   # Dependencies (if any)
   ```

3. **Deploy Cloud Function**
   - Use WeChat DevTools Cloud Functions panel
   - Right-click function → Upload and deploy
   - Or use CLI: `wx-cloud deploy functionName`

### Code Organization

Follow these conventions:

- **Naming**: Use camelCase for variables/functions, PascalCase for components
- **File Structure**: Mirror route structure for pages
- **Components**: Group by feature (shared, parent, teacher, etc.)
- **API Clients**: One file per domain (bookingApi.js, paymentApi.js, etc.)

### Git Workflow

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**
   - Write code
   - Write/update tests
   - Update documentation

3. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat: add feature description"
   ```

4. **Push and Create PR**
   ```bash
   git push origin feature/your-feature-name
   ```
   Then create a Pull Request on GitHub.

**Commit Message Format**:
- `feat: ` - New feature
- `fix: ` - Bug fix
- `docs: ` - Documentation changes
- `style: ` - Code style changes (formatting, etc.)
- `refactor: ` - Code refactoring
- `test: ` - Test changes
- `chore: ` - Build/tooling changes

---

## Code Structure

### Directory Structure

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
│   │   └── shared/               # Shared components
│   │       ├── RoleGuard.vue     # Route guard wrapper
│   │       ├── BookingCalendar.vue
│   │       ├── PaymentForm.vue
│   │       └── ...
│   ├── stores/                   # Vue 3 reactive stores
│   │   ├── user.js               # User state
│   │   ├── booking.js            # Booking flow state
│   │   └── distribution.js       # Distribution stats
│   ├── utils/                    # Utility functions
│   │   ├── auth.js               # Authentication/authorization
│   │   ├── cloud/                # Cloud function API clients
│   │   │   ├── chatApi.js
│   │   │   ├── bookingApi.js
│   │   │   ├── paymentApi.js
│   │   │   └── ...
│   │   └── safety/               # Safety utilities
│   │       └── safetyFilter.js
│   ├── i18n/                     # Internationalization
│   │   ├── index.js
│   │   └── locales/
│   │       ├── zh.json           # Chinese translations
│   │       └── en.json           # English translations
│   ├── App.vue                   # Root component
│   ├── main.js                   # Entry point
│   ├── manifest.json             # uni-app configuration
│   ├── pages.json                # Route configuration
│   └── sitemap.json              # Sitemap (SEO)
├── cloudfunctions/               # Cloud function code
│   ├── shared/                   # Shared utilities
│   │   ├── aiService.js          # AI service wrapper
│   │   ├── aiConfig.js           # AI configuration
│   │   ├── prompts.js            # LLM prompts
│   │   └── risk.js               # Risk detection
│   ├── chat.sendMessage/         # Chat function
│   ├── booking/                  # Booking functions
│   ├── payment/                  # Payment functions
│   ├── teacher/                  # Teacher functions
│   ├── distribution/             # Distribution functions
│   ├── finance/                  # Finance functions
│   └── admin/                    # Admin functions
├── docs/                         # Documentation
│   ├── FUNCTIONAL_REQUIREMENTS.md
│   ├── DEVELOPER_GUIDE.md        # This file
│   ├── ARCHITECTURE.md
│   ├── DATA_MODEL.md
│   ├── CLOUD_FUNCTIONS.md
│   └── ...
├── dist/                         # Build output (generated)
├── node_modules/                 # Dependencies (generated)
├── package.json                  # Project dependencies
├── vite.config.js                # Vite configuration
└── README.md                     # Project README
```

### Key Files Explained

#### `src/pages.json`
Route configuration for uni-app. Defines all pages and their navigation bar settings.

#### `src/manifest.json`
uni-app manifest configuration. Contains app metadata, permissions, and platform-specific settings.

#### `src/utils/auth.js`
Authentication and authorization utilities. Contains role-checking functions used throughout the app.

#### `src/utils/cloud/*.js`
API client wrappers for cloud functions. These files abstract away the `wx.cloud.callFunction` calls and provide typed interfaces.

#### `cloudfunctions/shared/`
Shared utilities used across multiple cloud functions. Common code should live here to avoid duplication.

---

## Cloud Functions

### Cloud Functions Overview

Cloud functions are server-side code that runs on WXCloud. They handle:

- Business logic
- Database operations
- External API calls (WeChat Pay, AI APIs)
- Security-sensitive operations

### Calling Cloud Functions from Client

All cloud function calls go through API client wrappers in `src/utils/cloud/`. Example:

```javascript
// In a Vue component
import { createBookingOrder } from '@/utils/cloud/bookingApi.js'

// Call cloud function
const result = await createBookingOrder({
  teacherId: 'teacher_123',
  studentId: 'student_456',
  scheduledAt: Date.now() + 86400000, // Tomorrow
  duration: 60,
  serviceType: 'counseling'
})
```

### Creating a New Cloud Function

1. **Create Function Directory**
   ```
   cloudfunctions/
   └── yourFunctionName/
       ├── index.js
       └── package.json (if dependencies needed)
   ```

2. **Write Function Code**
   ```javascript
   // cloudfunctions/yourFunctionName/index.js
   const cloud = require('wx-server-sdk')
   
   cloud.init({
     env: cloud.DYNAMIC_CURRENT_ENV
   })
   
   exports.main = async (event, context) => {
     // Get user openid from context
     const { OPENID } = cloud.getWXContext()
     
     // Validate openid exists
     if (!OPENID) {
       return { error: 'Unauthorized', message: 'Missing openid' }
     }
     
     // Your business logic here
     const { data } = event
     
     // Return result
     return {
       success: true,
       data: result
     }
   }
   ```

3. **Create API Client Wrapper** (in `src/utils/cloud/yourApi.js`)
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
     
     // Dev fallback
     console.warn('[yourApi] no cloud call method; returning stub')
     return { success: true, data: {} }
   }
   ```

4. **Deploy Function**
   - Use WeChat DevTools Cloud Functions panel
   - Right-click function → Upload and deploy

### Cloud Functions Best Practices

1. **Always Validate `openid`**
   ```javascript
   const { OPENID } = cloud.getWXContext()
   if (!OPENID) {
     return { error: 'Unauthorized' }
   }
   ```

2. **Use Environment Variables for Secrets**
   - Never hardcode API keys
   - Use WXCloud environment variables
   - Or use `ai.properties` file (for AI config)

3. **Handle Errors Gracefully**
   ```javascript
   try {
     // Your code
   } catch (error) {
     console.error('Function error:', error)
     return {
       error: 'InternalError',
       message: error.message
     }
   }
   ```

4. **Return Consistent Response Format**
   ```javascript
   // Success
   return { success: true, data: result }
   
   // Error
   return { error: 'ErrorCode', message: 'Error message' }
   ```

### Cloud Functions Setup

To test cloud functions end-to-end:

1. **Enable Cloud Development in WeChat DevTools**
   - Cloud Development → Create Cloud Environment (or select existing)
   - Note your environment ID

2. **Initialize Cloud in Mini Program**
   - In `src/App.vue` or similar, add:
   ```javascript
   // #ifdef MP-WEIXIN
   if (typeof wx !== 'undefined') {
     wx.cloud.init({
       env: 'your-env-id', // Your cloud environment ID
       traceUser: true
     })
   }
   // #endif
   ```

3. **Deploy Cloud Functions**
   - WeChat DevTools → Cloud Functions panel
   - Right-click each function → Upload and deploy
   - Or use CLI: `wx-cloud deploy --all`

4. **Configure AI Provider** (for chat functions)
   - See [AI Configuration](#ai-configuration) below

---

## Database

### Database Overview

We use **WeChat Cloud Database** (NoSQL, document-based). Collections are defined in `docs/DATA_MODEL.md`.

### Accessing Database from Cloud Functions

```javascript
const db = cloud.database()

// Get collection
const usersCollection = db.collection('users')

// Query
const result = await usersCollection.where({
  role: 'parent'
}).get()

// Insert
await usersCollection.add({
  data: {
    openid: OPENID,
    role: 'parent',
    createdAt: db.serverDate()
  }
})

// Update
await usersCollection.doc(docId).update({
  data: {
    profile: newProfile
  }
})

// Delete
await usersCollection.doc(docId).remove()
```

### Database Indexes

Create indexes for frequently queried fields:

- `users`: `openid` (unique), `role`, `roles`
- `bookings`: `parentOpenId`, `teacherId`, `status`, `scheduledAt`
- `orders`: `parentOpenId`, `status`, `createdAt`
- `commissions`: `distributorId`, `status`

Indexes can be created via WeChat DevTools Cloud Database panel.

### Database Security Rules

Set security rules in WeChat Cloud Console:

- Users can only read/write their own data
- Admins can read/write all data
- Teachers can read their own bookings and profile

Example security rule:
```javascript
{
  "read": "auth.openid == doc.parentOpenId",
  "write": "auth.openid == doc.parentOpenId"
}
```

---

## Testing

### Testing Strategy

We use a combination of:

1. **Manual Testing**: Test flows in WeChat DevTools
2. **Unit Tests**: Test utility functions (TODO: add test framework)
3. **Integration Tests**: Test cloud functions end-to-end
4. **E2E Tests**: Test complete user flows (TODO: add E2E framework)

### Testing Cloud Functions Locally

For fast iteration, test cloud functions with mock data:

```javascript
// In cloud function
const isLocal = process.env.NODE_ENV === 'development'

if (isLocal) {
  // Use mock data
  return { success: true, data: mockData }
}
```

### Testing Checklist

Before submitting a PR, ensure:

- ✅ Code runs without errors
- ✅ Cloud functions handle errors gracefully
- ✅ Role-based access control works
- ✅ Payment flows work (test mode)
- ✅ Booking flows complete successfully
- ✅ No console errors in DevTools
- ✅ UI responsive on different screen sizes

---

## Deployment

### Build for Production

```bash
npm run build:mp-weixin
```

This generates optimized code in `dist/` directory.

### Deploy to WeChat

1. **Upload Code**
   - WeChat DevTools → Upload
   - Fill in version number and project notes
   - Submit for review

2. **Deploy Cloud Functions**
   - Cloud Functions panel → Select all functions
   - Right-click → Upload and deploy (Production)

3. **Configure Cloud Environment**
   - Ensure production environment ID is set in code
   - Test all functions in production environment

### Environment Configuration

Use different cloud environments for dev/staging/production:

```javascript
// In App.vue or config
const envId = process.env.NODE_ENV === 'production' 
  ? 'prod-env-id' 
  : 'dev-env-id'

wx.cloud.init({ env: envId })
```

---

## Troubleshooting

### Common Issues

#### 1. "node_modules not found"

**Solution**:
```bash
cd /Users/partha/XinLing
npm install
```

If that doesn't work:
```bash
rm -rf node_modules package-lock.json
npm install
```

#### 2. "No matching version found for @dcloudio/..."

**Solution**: Check npm registry:
```bash
npm config set registry https://registry.npmjs.org/
npm install
```

#### 3. "Vue 2 vs Vue 3 conflict"

**Solution**: Clean install:
```bash
rm -rf node_modules package-lock.json
npm install
```

#### 4. "Cannot read properties of undefined (reading 'vueOptions')"

**Solution**: Version mismatch. Do clean reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev:mp-weixin
```

#### 5. Cloud Functions Not Working

**Check**:
- Cloud environment initialized in `App.vue`?
- Environment ID correct?
- Functions deployed?
- Network permissions set in WeChat Console?

#### 6. Payment Not Working

**Check**:
- WeChat Pay configured in WeChat Console?
- Merchant account verified?
- Payment callbacks configured correctly?
- Test mode vs Production mode?

#### 7. AI Chat Not Responding

**Check**:
- AI provider configured? (See [AI Configuration](#ai-configuration))
- API key valid?
- Rate limits not exceeded?
- Check cloud function logs in WeChat Console

### Getting Help

If you encounter issues not covered here:

1. Check existing documentation in `docs/`
2. Search existing issues on GitHub
3. Ask in team chat/Slack
4. Create a new issue with:
   - Error message
   - Steps to reproduce
   - Environment details (OS, Node version, etc.)
   - Screenshots/logs if applicable

---

## Best Practices

### Code Quality

1. **Follow ESLint Rules**
   - We use ESLint for code quality
   - Fix linting errors before committing

2. **Write Self-Documenting Code**
   - Use descriptive variable/function names
   - Add JSDoc comments for complex functions
   - Keep functions small and focused

3. **Handle Errors Gracefully**
   ```javascript
   try {
     const result = await someOperation()
   } catch (error) {
     console.error('Operation failed:', error)
     uni.showToast({
       title: '操作失败，请重试',
       icon: 'none'
     })
   }
   ```

4. **Use TypeScript (Future)**
   - We plan to migrate to TypeScript
   - Consider using JSDoc types now

### Security

1. **Never Expose API Keys**
   - All API keys must be in cloud functions
   - Never commit secrets to Git
   - Use environment variables or properties files

2. **Validate User Input**
   - Always validate input on client AND server
   - Use `msgSecCheck` for user-generated content
   - Sanitize database queries

3. **Check User Roles**
   - Always validate user role before sensitive operations
   - Use `requireRole()` from `utils/auth.js`
   - Check `openid` in cloud functions

4. **Protect Sensitive Data**
   - Student transcripts never sent to parents
   - Payment data encrypted
   - Personal information minimal

### Performance

1. **Optimize Database Queries**
   - Use indexes for frequently queried fields
   - Limit query results (pagination)
   - Avoid N+1 queries

2. **Minimize Cloud Function Calls**
   - Batch operations when possible
   - Cache frequently accessed data
   - Use client-side state management

3. **Optimize Images**
   - Compress images before upload
   - Use appropriate image formats (WebP if supported)
   - Lazy load images

4. **Code Splitting**
   - Use dynamic imports for large components
   - Split routes into separate bundles
   - Minimize initial bundle size

### Accessibility

1. **Use Semantic HTML**
   - Use proper HTML tags (`<button>`, `<nav>`, etc.)
   - Add ARIA labels where needed

2. **Keyboard Navigation**
   - Ensure all interactive elements keyboard accessible
   - Provide focus indicators

3. **Screen Readers**
   - Add descriptive alt text for images
   - Use proper heading hierarchy

### Internationalization (i18n)

We support Chinese (zh) and English (en). To add new translations:

1. Add keys to `src/i18n/locales/zh.json` and `src/i18n/locales/en.json`
2. Use `$t()` function in components:
   ```vue
   <template>
     <text>{{ $t('common.confirm') }}</text>
   </template>
   ```

---

## AI Configuration

### Overview

All AI/LLM calls go through `cloudfunctions/shared/aiService.js`. This service supports multiple providers:

- **DeepSeek**: Recommended for production
- **Zhipu**: Alternative Chinese provider
- **Ollama**: For local development

### Configuration Methods

#### Option 1: Properties File (Recommended for Local Dev)

1. Copy `cloudfunctions/shared/ai.properties.example` → `cloudfunctions/shared/ai.properties`
2. Edit the file:
   ```properties
   AI_PROVIDER=deepseek
   AI_BASE_URL=https://api.deepseek.com
   AI_MODEL=deepseek-chat
   AI_API_KEY=your-api-key-here
   ```

3. **Never commit `ai.properties` to Git** (it's in `.gitignore`)

#### Option 2: Environment Variables (For Production)

Set environment variables in WeChat Cloud Console:
- `AI_PROVIDER`: Provider name
- `AI_BASE_URL`: API base URL
- `AI_MODEL`: Model name
- `AI_API_KEY`: API key

#### Option 3: Direct Ollama (Dev Only)

For fast local iteration without cloud functions:

1. Start Ollama locally:
   ```bash
   ollama serve
   ollama pull llama3.1
   ```

2. Enable in `src/utils/cloud/devAiConfig.js`:
   ```javascript
   export const devAiConfig = {
     enableDirectOllama: true,
     ollamaBaseUrl: 'http://127.0.0.1:11434/v1',
     ollamaModel: 'llama3.1'
   }
   ```

**Warning**: Never enable `enableDirectOllama` in production builds!

### Testing AI Configuration

Test your AI configuration:

1. Start chat interface
2. Send a test message
3. Check console logs for AI provider being used
4. Verify AI response received

If AI not responding:
- Check API key is valid
- Check rate limits not exceeded
- Check network connectivity
- Check cloud function logs in WeChat Console

---

## Contributing

### Contribution Process

1. **Fork the Repository**
   - Fork on GitHub
   - Clone your fork locally

2. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make Changes**
   - Write code
   - Write/update tests
   - Update documentation

4. **Test Changes**
   - Run locally
   - Test in WeChat DevTools
   - Verify no console errors

5. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat: add feature description"
   ```
   Follow [commit message format](#git-workflow) above.

6. **Push to Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create Pull Request**
   - Go to GitHub
   - Click "New Pull Request"
   - Select your fork and branch
   - Fill in PR description
   - Request review

### Code Review Guidelines

- All PRs require at least one approval
- Address review comments promptly
- Keep PRs small and focused (one feature per PR)
- Update documentation if needed
- Add tests if applicable

### Pull Request Template

When creating a PR, include:

- **Description**: What does this PR do?
- **Changes**: List of changes made
- **Testing**: How was this tested?
- **Screenshots**: If UI changes
- **Related Issues**: Link to related issues

---

## Additional Resources

### Documentation

- [Functional Requirements](./FUNCTIONAL_REQUIREMENTS.md) - Detailed functional specifications
- [Architecture](./ARCHITECTURE.md) - Technical architecture overview
- [Data Model](./DATA_MODEL.md) - Database schema and collections
- [Cloud Functions](./CLOUD_FUNCTIONS.md) - Cloud function API specifications
- [UX Flows](./UX_FLOWS.md) - User experience flows
- [Running Guide](./RUNNING.md) - Detailed setup and troubleshooting

### External Resources

- [uni-app Documentation](https://uniapp.dcloud.net.cn/)
- [WeChat Mini Program Documentation](https://developers.weixin.qq.com/miniprogram/dev/framework/)
- [WeChat Cloud Development Documentation](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)
- [Vue 3 Documentation](https://vuejs.org/)
- [Vite Documentation](https://vitejs.dev/)

### Team Contacts

- **Technical Lead**: [Contact Info]
- **Product Manager**: [Contact Info]
- **Design Lead**: [Contact Info]

---

## FAQ

### Q: How do I add a new page?

A: 
1. Create Vue component in `src/pages/your-path/your-page.vue`
2. Add route to `src/pages.json`
3. Add navigation link if needed

### Q: How do I add a new cloud function?

A: See [Creating a New Cloud Function](#creating-a-new-cloud-function) above.

### Q: How do I access the database from a cloud function?

A: See [Accessing Database from Cloud Functions](#accessing-database-from-cloud-functions) above.

### Q: How do I test payment functionality?

A: Use WeChat Pay sandbox/test mode. Configure test merchant account in WeChat Console.

### Q: How do I debug cloud functions?

A: 
1. Add `console.log()` statements
2. Check logs in WeChat DevTools Cloud Functions panel
3. Or check logs in WeChat Cloud Console

### Q: How do I handle errors in cloud functions?

A: Always wrap operations in try-catch and return consistent error format:
```javascript
try {
  // Your code
} catch (error) {
  return { error: 'ErrorCode', message: error.message }
}
```

---

## Changelog

### Version 1.0 (Current)
- Initial developer guide
- Setup instructions
- Architecture overview
- Best practices
- Troubleshooting guide

---

**Last Updated**: 2024
**Maintained By**: Xinyutong Development Team

For questions or suggestions, please create an issue on GitHub or contact the team.
