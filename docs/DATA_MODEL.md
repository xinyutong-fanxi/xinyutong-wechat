# Data Model (WXCloud DB)

> Naming is indicative. Adjust to WXCloud collection naming conventions if needed.

## Collections

### `users`
Enhanced with multi-role support and role-specific profiles.

- **_id**: string
- **openid**: string (WeChat unique user id)
- **role**: `"parent" | "teacher" | "student" | "admin" | "distributor"` (primary role, for backward compatibility)
- **roles**: string[] (multi-role support, e.g., ["parent", "distributor"])
- **createdAt**: timestamp
- **profile**
  - **nickname**: string
  - **avatarUrl**: string
  - **phone**: string
  - **realNameVerified**: boolean
  - **languagePreference**: `"zh" | "en"` (user's preferred language, defaults to "zh")
- **parentProfile**: (if role includes "parent")
  - **linkedStudents**: string[] (student _ids)
  - **distributorStatus**: `"none" | "pending" | "approved" | "rejected"`
  - **distributorCode**: string (unique referral code)
- **teacherProfile**: (if role includes "teacher")
  - **status**: `"pending" | "approved" | "rejected" | "suspended"`
  - **credentials**: {
    - **idCard**: string
    - **qualifications**: string[]
    - **university**: string
    - **certificates**: string[] (cloud storage URLs)
  }
  - **expertise**: string[]
  - **serviceModes**: string[] (e.g., ["online", "offline"])
  - **priceRange**: { **min**: number, **max**: number }
  - **rating**: number
  - **totalSessions**: number
- **studentProfile**: (if role includes "student")
  - **parentOpenId**: string
  - **age**: number
  - **grade**: string
  - **authorizationLevel**: `"full" | "summary" | "alerts_only"`
- **guardian**: (legacy, for backward compatibility)
  - **linkedParentOpenId**: string | null
  - **guardianModeEnabled**: boolean
  - **verificationStatus**: `"unverified" | "pending" | "verified"`

### `child_sessions`
- **_id**
- **childOpenId**
- **startedAt**
- **endedAt**: timestamp | null
- **mood**
  - **emoji**: string
  - **label**: string
  - **note**: string | null
- **risk**
  - **highRiskFlag**: boolean
  - **riskScoreMax**: number
  - **latestCategory**: `"none" | "low" | "medium" | "high"`

### `messages`
- **_id**
- **childOpenId**
- **sessionId**
- **role**: `"user" | "assistant"`
- **content**: string
- **createdAt**
- **safety**
  - **localTriage**: object | null
  - **msgSecCheckInput**: `"pass" | "review" | "reject" | "unknown"`
  - **msgSecCheckOutput**: `"pass" | "review" | "reject" | "unknown"`

### `entities_tutors`
Tracks tutor/teacher mentions and compatibility signals.
- **_id**
- **childOpenId**
- **name**: string (e.g., “张老师”)
- **subject**: string | null (e.g., “数学”)
- **notes**: string | null (short summary)
- **signals**
  - **frictionTags**: string[] (e.g., “语速快”, “声音大”)
  - **lastMentionedAt**: timestamp
  - **sentimentTrend**: number (rolling)

### `weekly_insights`
Parent-facing insights only (no transcripts).
- **_id**
- **childOpenId**
- **weekStart**: date string (YYYY-MM-DD)
- **metrics**
  - **pressureLevelDaily**: number[] (7 values)
  - **moodVolatility**: number
  - **tutorFitScore**: number
  - **riskScoreMax**: number
- **summary**
  - **highlights**: string[]
  - **watchouts**: string[]
  - **suggestions**: string[]
- **derivedFrom**
  - **sessionCount**: number
  - **messageCount**: number

### `alerts`
Records alert events and delivery status.
- **_id**
- **childOpenId**
- **parentOpenId**
- **createdAt**
- **severity**: `"high" | "critical"`
- **category**: `"self_harm" | "severe_depression" | "withdrawal" | "other"`
- **riskScore**: number
- **delivery**
  - **channel**: `"subscribe_message"`
  - **status**: `"queued" | "sent" | "failed"`
  - **providerResponse**: object | null

### `students`
Extends the existing child concept with structured profile data.

- **_id**: string
- **parentOpenId**: string
- **studentOpenId**: string | null (if student has separate account)
- **name**: string
- **age**: number
- **grade**: string
- **createdAt**: timestamp
- **authorizationLevel**: `"full" | "summary" | "alerts_only"`
- **activeBookings**: string[] (booking _ids)

### `teachers`
Teacher/Counselor profile and credentials.

- **_id**: string
- **teacherOpenId**: string
- **status**: `"pending" | "approved" | "rejected" | "suspended"`
- **credentials**: {
  - **idCard**: string
  - **qualifications**: string[]
  - **university**: string
  - **certificates**: string[] (cloud storage URLs)
}
- **expertise**: string[]
- **serviceModes**: string[] (e.g., ["online", "offline"])
- **pricePerHour**: number (in cents)
- **rating**: number
- **totalSessions**: number
- **createdAt**: timestamp
- **approvedAt**: timestamp | null
- **approvedBy**: string (admin openid)

### `bookings`
Counseling appointment bookings.

- **_id**: string
- **orderId**: string (links to orders collection)
- **parentOpenId**: string
- **studentId**: string
- **teacherId**: string
- **serviceType**: `"counseling" | "guidance" | "ai_chat"`
- **scheduledAt**: timestamp
- **duration**: number (minutes)
- **status**: `"pending" | "confirmed" | "completed" | "cancelled"`
- **paymentStatus**: `"unpaid" | "paid" | "refunded"`
- **createdAt**: timestamp
- **confirmedAt**: timestamp | null
- **completedAt**: timestamp | null
- **cancellationReason**: string | null

### `orders`
Payment orders and commission tracking.

- **_id**: string
- **orderNo**: string (unique order number)
- **parentOpenId**: string
- **studentId**: string
- **teacherId**: string
- **serviceType**: string
- **amount**: number (total amount in cents)
- **platformFee**: number (commission in cents)
- **teacherEarning**: number (in cents)
- **distributorCommission**: number (in cents, if applicable)
- **distributorId**: string | null
- **referralLevel**: `1 | 2 | null` (1 for direct, 2 for secondary)
- **status**: `"pending" | "paid" | "completed" | "refunded" | "cancelled"`
- **paymentMethod**: `"wechat_pay"`
- **paymentTransactionId**: string | null
- **createdAt**: timestamp
- **paidAt**: timestamp | null
- **completedAt**: timestamp | null

### `payments`
Payment transactions and WeChat Pay integration.

- **_id**: string
- **orderId**: string
- **paymentNo**: string
- **amount**: number (in cents)
- **status**: `"pending" | "paid" | "failed" | "refunded"`
- **wechatPayTransactionId**: string | null
- **wechatPayPrepayId**: string | null
- **createdAt**: timestamp
- **paidAt**: timestamp | null
- **callbackData**: object | null

### `counseling_logs`
Teacher-submitted counseling session logs.

- **_id**: string
- **bookingId**: string
- **teacherId**: string
- **studentId**: string
- **parentOpenId**: string
- **sessionDate**: timestamp
- **duration**: number (minutes)
- **logContent**: string (teacher-submitted summary)
- **parentFeedback**: {
  - **rating**: number (1-5)
  - **comment**: string | null
  - **submittedAt**: timestamp | null
}
- **visibilityLevel**: `"full" | "summary" | "alerts_only"`
- **createdAt**: timestamp

### `distributors`
Affiliate distributors (parents, teachers, institutions).

- **_id**: string
- **distributorOpenId**: string
- **distributorType**: `"parent" | "teacher" | "institution"`
- **status**: `"pending" | "approved" | "rejected"`
- **referralCode**: string (unique)
- **commissionRate**: number (percentage, e.g., 10 for 10%)
- **totalReferrals**: number
- **totalCommissionEarned**: number (in cents)
- **totalWithdrawn**: number (in cents)
- **createdAt**: timestamp
- **approvedAt**: timestamp | null

### `referrals`
Referral relationships and tracking.

- **_id**: string
- **distributorId**: string
- **referralCode**: string
- **referredParentOpenId**: string
- **referralLevel**: `1 | 2` (1 = direct, 2 = secondary)
- **parentReferrerId**: string | null (if level 2)
- **firstOrderId**: string | null
- **totalOrders**: number
- **totalCommission**: number (in cents)
- **createdAt**: timestamp
- **firstOrderAt**: timestamp | null

### `commissions`
Commission records for orders.

- **_id**: string
- **orderId**: string
- **distributorId**: string
- **referralLevel**: `1 | 2`
- **commissionAmount**: number (in cents)
- **commissionRate**: number (percentage)
- **status**: `"pending" | "settled" | "withdrawn"`
- **settledAt**: timestamp | null
- **withdrawalId**: string | null
- **createdAt**: timestamp

### `withdrawals`
Withdrawal requests from teachers and distributors.

- **_id**: string
- **withdrawalNo**: string
- **applicantOpenId**: string
- **applicantType**: `"teacher" | "distributor"`
- **amount**: number (in cents)
- **commissionIds**: string[] (links to commissions collection)
- **status**: `"pending" | "approved" | "rejected" | "completed"`
- **rejectionReason**: string | null
- **wechatPayTransferId**: string | null
- **submittedAt**: timestamp
- **reviewedAt**: timestamp | null
- **reviewedBy**: string | null (admin openid)
- **completedAt**: timestamp | null

## Data minimization rules (MVP)
- Parent dashboard reads only `weekly_insights` + `alerts`.
- Parent never reads `messages` content.
- Student records visible based on `authorizationLevel` (full/summary/alerts_only).
- Counseling logs respect visibility settings.
- Payment and commission data only accessible by authorized roles.


