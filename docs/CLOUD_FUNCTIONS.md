# WXCloud Functions (Contracts)

## Conventions
- All functions validate `openid` from WXCloud auth context.
- No LLM API keys are ever sent to client.

## `chat.sendMessage`
**Purpose**: Orchestrate safety checks + LLM call + persistence.

**Input**
- `sessionId`: string
- `content`: string
- `clientTriage`: object (optional)

**Output**
- `assistantMessage`: { `content`: string, `createdAt`: number }
- `risk`: { `highRiskFlag`: boolean, `category`: string, `riskScore`: number }

**Notes**
- Calls `safety.msgSecCheckProxy` on input.
- If output check is required, calls again for assistant content.
- If escalation triggered, invokes `alert.triggerParent` (async).

## `safety.msgSecCheckProxy`
**Purpose**: Wrap WeChat Content Security API `msgSecCheck` and normalize results.

**Input**
- `scene`: `"input" | "output"`
- `content`: string

**Output**
- `result`: `"pass" | "review" | "reject"`
- `raw`: object (provider response)

## `alert.triggerParent`
**Purpose**: Send immediate alert to parent and record event.

**Input**
- `childOpenId`: string
- `severity`: `"high" | "critical"`
- `category`: string
- `riskScore`: number

**Output**
- `status`: `"queued" | "sent" | "failed"`

**Notes**
- Uses WeChat **subscribe message** mechanism (parent must opt-in).
- Does not include transcript; includes category + "please check-in" guidance.

## `insights.generateWeekly`
**Purpose**: Aggregate the past 7 days into parent-facing insights.

**Input**
- `childOpenId`: string
- `weekStart`: string (YYYY-MM-DD)

**Output**
- `weeklyInsightId`: string

**Notes**
- Uses LLM summarization on derived signals (not raw transcripts) whenever possible.
- Stores in `weekly_insights`.

## `guardian.verify`
**Purpose**: Guardian mode flows (auth/linking/verification).

**Input**
- `action`: `"start" | "complete" | "status" | "linkChild"`
- `payload`: object

**Output**
- `status`: object

**Open questions**
- How "real-name verification" is implemented in this product context (WeChat capability + compliance).
- Child-parent linking UX (QR scan, device pairing, or household code).

## Booking Functions

### `booking.createOrder`
**Purpose**: Create a booking order when parent selects teacher, student, and time slot.

**Input**
- `teacherId`: string (teacher _id)
- `studentId`: string (student _id)
- `parentOpenId`: string (parent's openid, auto from context)
- `scheduledAt`: number (timestamp)
- `duration`: number (minutes, default 60)
- `serviceType`: string (`"counseling" | "guidance" | "ai_chat"`)
- `referralCode`: string | null (optional, for distribution tracking)

**Output**
- `bookingId`: string
- `orderId`: string
- `orderNo`: string (unique order number)
- `amount`: number (total amount in cents)
- `platformFee`: number (commission in cents)
- `teacherEarning`: number (in cents)
- `distributorCommission`: number (in cents, if applicable)
- `scheduledAt`: number (timestamp)

**Notes**
- Validates teacher availability and time slot conflicts
- Calculates pricing based on teacher's pricePerHour and platform commission rate
- Tracks referral if referralCode is provided
- Creates both booking and order records

### `booking.confirmAppointment`
**Purpose**: Teacher confirms or rejects a booking request.

**Input**
- `bookingId`: string
- `action`: `"confirm" | "reject"`
- `teacherOpenId`: string (auto from context for verification)
- `rejectionReason`: string (optional, if action is "reject")

**Output**
- `success`: boolean
- `bookingId`: string
- `status`: `"confirmed" | "cancelled"`
- `confirmedAt`: number | null (timestamp)

**Notes**
- Verifies booking belongs to teacher
- Updates booking status
- If rejected, cancels associated order and triggers refund logic

### `booking.submitFeedback`
**Purpose**: Submit parent feedback (rating and comment) for a completed counseling session.

**Input**
- `bookingId`: string
- `rating`: number (1-5, required)
- `comment`: string (optional)

**Output**
- `success`: boolean
- `bookingId`: string
- `message`: string
- `error`: string (if failed)
- `message`: string (error message)

**Notes**
- Only allows feedback for completed bookings
- Verifies parent owns the booking
- Checks if feedback already exists (prevents duplicate)
- Content safety check for comment (if provided)
- Updates counseling log with feedback
- Recalculates teacher's average rating
- Used by parent after viewing counseling log

### `booking.cancelBooking`
**Purpose**: Cancel a booking (can be called by parent or teacher).

**Input**
- `bookingId`: string
- `openid`: string (parent or teacher openid, auto from context)
- `role`: `"parent" | "teacher"`
- `cancellationReason`: string

**Output**
- `success`: boolean
- `bookingId`: string
- `refundAmount`: number (in cents, if applicable)
- `message`: string (refund message if applicable)

**Notes**
- Verifies caller has permission to cancel
- Calculates refund based on cancellation policy (full refund if >24h before, 50% if <24h)
- Updates booking and order status
- Initiates refund via WeChat Pay if applicable

## Payment Functions

### `payment.createPayment`
**Purpose**: Create WeChat Pay payment for an order.

**Input**
- `orderId`: string
- `amount`: number (in cents)
- `description`: string (optional, default: "心理咨询服务")

**Output**
- `paymentId`: string
- `paymentNo`: string
- `timeStamp`: string (for wx.requestPayment)
- `nonceStr`: string
- `package`: string (prepay_id)
- `signType`: string (`"RSA" | "MD5"`)
- `paySign`: string

**Notes**
- Verifies order exists and is in pending status
- Creates payment record in database
- Calls WeChat Pay unified order API
- Returns payment parameters for `wx.requestPayment()`
- All payment operations are server-side only

### `payment.handleCallback`
**Purpose**: Handle WeChat Pay payment callback (notify URL).

**Input** (from WeChat Pay XML):
- `return_code`: `"SUCCESS" | "FAIL"`
- `result_code`: `"SUCCESS" | "FAIL"`
- `out_trade_no`: string (order number)
- `transaction_id`: string (WeChat Pay transaction ID)
- `total_fee`: number (amount in cents)
- `sign`: string (signature)
- ... other WeChat Pay callback fields

**Output** (XML response for WeChat Pay):
- XML string: `<xml><return_code><![CDATA[SUCCESS]]></return_code><return_msg><![CDATA[OK]]></return_msg></xml>`

**Notes**
- Called by WeChat Pay server when payment is completed
- Verifies signature for security
- Updates payment and order status to "paid"
- Updates booking paymentStatus to "paid"
- Triggers booking confirmation flow (notification to teacher)
- Returns XML response to acknowledge receipt

## Teacher Functions

### `teacher.manageSchedule`
**Purpose**: Manage teacher's availability schedule.

**Input**
- `action`: `"get" | "set" | "clear"`
- `teacherOpenId`: string (auto from context)
- `date`: string (YYYY-MM-DD, for get/clear)
- `startDate`: string (YYYY-MM-DD, for get)
- `endDate`: string (YYYY-MM-DD, for get)
- `timeSlots`: Array<{date: string, time: string, available: boolean}> (for set)

**Output**
- `success`: boolean
- `schedule`: Array<{date: string, time: string, available: boolean}> (for get action)
- `message`: string (for set/clear actions)
- `conflicts`: Array (optional, if booking conflicts found during set)

**Notes**
- Verifies teacher exists and is approved
- For `set` action, checks for booking conflicts before saving
- Returns conflicts if any time slots overlap with existing bookings
- Stores schedule in `teacher_schedule` collection (to be created)

### `teacher.submitLog`
**Purpose**: Submit counseling session log after session completion.

**Input**
- `bookingId`: string
- `teacherOpenId`: string (auto from context)
- `logContent`: string (session summary, min 50 chars recommended)
- `sessionDate`: number (timestamp)
- `duration`: number (minutes, actual duration)

**Output**
- `success`: boolean
- `logId`: string
- `message`: string

**Notes**
- Validates booking belongs to teacher
- Checks if log already exists for booking
- Runs content safety check (`msgSecCheckProxy`) on log content
- Creates record in `counseling_logs` collection
- Updates booking status to "completed"
- Updates order status to "completed" if applicable
- Sends notification to parent

### `teacher.updateProfile`
**Purpose**: Update teacher profile information.

**Input**
- `teacherOpenId`: string (auto from context)
- `profile`: object (partial profile update)
  - `name`: string
  - `title`: string
  - `bio`: string
  - `expertise`: string[]
  - `serviceModes`: string[] (`"online" | "offline"`)
  - `pricePerHour`: number (in cents)
  - `credentials`: {
      `idCard`: string
      `qualifications`: string[]
      `university`: string
      `certificates`: string[] (cloud storage URLs)
    }

**Output**
- `success`: boolean
- `teacherId`: string
- `status`: string (if status changed, e.g., pending -> approved)
- `statusChanged`: boolean
- `message`: string

**Notes**
- Validates profile update (pricePerHour must be positive, serviceModes must be valid)
- Runs content safety check on bio if provided
- If credentials are updated while teacher is approved, status changes to "pending" for re-review
- Updates both `teachers` collection and `users.teacherProfile`
- Teacher receives notification if status changes to pending

## Distribution Functions

### `distribution.trackReferral`
**Purpose**: Track referral relationship when parent registers with referral code or makes first order.

**Input**
- `action`: `"register" | "firstOrder"`
- `parentOpenId`: string (auto from context)
- `referralCode`: string (required for "register" action)
- `orderId`: string (required for "firstOrder" action)

**Output**
- `success`: boolean
- `referralId`: string (for "register" action)
- `commissionId`: string (optional, for "firstOrder" action if commission calculated)
- `message`: string

**Notes**
- For "register" action: Creates referral relationship record in `referrals` collection
- For "firstOrder" action: Updates referral with first order, triggers commission calculation
- Supports two-level referral (Level 1: direct, Level 2: secondary)
- Updates distributor stats (totalReferrals, totalOrders)

### `distribution.generatePoster`
**Purpose**: Generate promotional poster with referral code QR code.

**Input**
- `distributorOpenId`: string (auto from context)
- `template`: string (optional, poster template ID, default: "default")

**Output**
- `success`: boolean
- `posterUrl`: string (cloud storage URL for poster image)
- `qrCodeUrl`: string (cloud storage URL for QR code only)
- `referralCode`: string
- `message`: string

**Notes**
- Verifies distributor exists and is approved
- Generates QR code containing mini-program path with referral code
- Creates promotional poster image with app branding, incentive text, and QR code
- Uploads both QR code and poster to WXCloud Storage
- Updates distributor record with last generated poster URL

### `distribution.calculateCommission`
**Purpose**: Calculate commission for distributor when order is completed.

**Input**
- `orderId`: string

**Output**
- `success`: boolean
- `commissions`: Array<{commissionId: string, distributorId: string, commissionAmount: number, referralLevel: number}>
- `message`: string

**Notes**
- Only calculates for paid/completed orders
- Checks if commissions already calculated (prevents duplicate)
- Supports Level 1 (direct) and Level 2 (secondary) referral commissions
- Commission rates configurable (default: 15% for Level 1, 5% for Level 2)
- Creates records in `commissions` collection
- Updates distributor stats (totalCommissionEarned)
- Updates referral relationship stats (totalCommission)

## Finance Functions

### `finance.requestWithdrawal`
**Purpose**: Request withdrawal for teacher or distributor earnings.

**Input**
- `applicantOpenId`: string (auto from context)
- `applicantType`: `"teacher" | "distributor"`
- `amount`: number (in cents, minimum 1000 = 10 yuan)

**Output**
- `success`: boolean
- `withdrawalId`: string
- `withdrawalNo`: string (unique withdrawal number, format: WD{timestamp}{random})
- `status`: `"pending"`
- `message`: string
- `error`: string (if failed)
- `message`: string (error message)

**Notes**
- Validates applicant has sufficient balance (queries orders/commissions based on applicantType)
- Creates withdrawal record in `withdrawals` collection
- Status set to "pending" (requires admin approval)
- Links to commission records if applicable (for distributors)
- Updates commission status to 'pending' (will be marked as 'withdrawn' after approval)
- Minimum withdrawal amount: 10 yuan (1000 cents)
- Withdrawal will be processed via WeChat Pay transfer after admin approval

## Admin Functions

### `admin.approveWithdrawal`
**Purpose**: Approve or reject withdrawal request and process WeChat Pay transfer if approved.

**Input**
- `withdrawalId`: string
- `action`: `"approve" | "reject"`
- `adminOpenId`: string (auto from context)
- `rejectionReason`: string (required if action is 'reject')

**Output**
- `success`: boolean
- `withdrawalId`: string
- `status`: `"approved" | "rejected"`
- `wechatPayTransferId`: string | null (if approved and transfer successful)
- `message`: string
- `error`: string (if failed)
- `message`: string (error message)

**Notes**
- Verifies admin authorization
- Validates withdrawal exists and is in 'pending' status
- For approval: Processes WeChat Pay transfer using transfer API, updates withdrawal status to 'approved', updates commission records to 'withdrawn', updates applicant stats (totalWithdrawn)
- For rejection: Updates withdrawal status to 'rejected', sets rejection reason, updates commission records back to 'settled' (removes withdrawalId link)
- Sends notifications to applicant (TODO: implement notification system)

### `admin.auditTeacher`
**Purpose**: Approve or reject teacher application.

**Input**
- `teacherId`: string (teacher's _id or openid)
- `action`: `"approve" | "reject"`
- `adminOpenId`: string (auto from context)
- `rejectionReason`: string (optional, for reject action)

**Output**
- `success`: boolean
- `teacherId`: string
- `status`: `"approved" | "rejected"`
- `message`: string
- `rejectionReason`: string | null (if rejected)
- `error`: string (if failed)
- `message`: string (error message)

**Notes**
- Verifies admin authorization
- Validates teacher exists and is in 'pending' status
- For approval: Updates teacher status to 'approved' in both `teachers` and `users.teacherProfile`, sets approvedAt and approvedBy fields, generates referral code if user is also a distributor
- For rejection: Updates teacher status to 'rejected' in both collections, sets rejectionReason, reviewedAt, reviewedBy
- Sends notifications to teacher (TODO: implement notification system)

### `admin.viewDashboard`
**Purpose**: Get aggregated stats for admin dashboard.

**Input**
- `adminOpenId`: string (auto from context)
- `date`: string (YYYY-MM-DD, optional, defaults to today)

**Output**
- `success`: boolean
- `stats`: object {
    - `pendingTeachers`: number
    - `pendingWithdrawals`: number
    - `todayOrders`: number
    - `todayRevenue`: number (in cents)
    - `totalTeachers`: number
    - `totalOrders`: number
    - `totalRevenue`: number (in cents)
  }
- `message`: string
- `error`: string (if failed)
- `message`: string (error message)

**Notes**
- Verifies admin authorization
- Aggregates stats from multiple collections (teachers, withdrawals, orders)
- Calculates today's metrics based on date parameter or current date
- Provides overview metrics for admin dashboard display

### `admin.configureDistribution`
**Purpose**: Update commission rates and distribution rules.

**Input**
- `adminOpenId`: string (auto from context)
- `config`: object {
    - `level1Rate`: number (percentage, e.g., 10 for 10%, optional)
    - `level2Rate`: number (percentage, e.g., 5 for 5%, optional)
    - `platformRate`: number (percentage, e.g., 30 for 30%, optional)
  }

**Output**
- `success`: boolean
- `config`: object (updated configuration)
- `message`: string
- `error`: string (if failed)
- `message`: string (error message)

**Notes**
- Verifies admin authorization
- Validates rates are between 0 and 100
- Ensures Level 2 rate ≤ Level 1 rate
- Creates or updates `system_config` collection document with type 'distribution'
- Stores audit trail (updatedAt, updatedBy)
- New commission calculations use updated rates; existing commissions are not retroactively changed

### `finance.calculateCommission`
**Note**: This is an alias for `distribution.calculateCommission`. Commission calculation is handled by the distribution module.

**See**: `distribution.calculateCommission` above.

## AI Functions

### `ai.getRecommendations`
**Purpose**: Get intelligent teacher recommendations based on issue type, age, and other factors.

**Input**
- `issueType`: string (e.g., 'learning_anxiety', 'social_stress', 'family_conflict', 'exam_anxiety')
- `age`: number (student age, must be between 8 and 18)
- `studentId`: string (optional, student _id for personalized recommendations)
- `parentOpenId`: string (auto from context, optional)

**Output**
- `success`: boolean
- `recommendations`: Array<{
    - `teacherId`: string
    - `teacherName`: string
    - `expertise`: string[]
    - `pricePerHour`: number (in cents)
    - `rating`: number (0-5)
    - `matchScore`: number (0-100, how well this teacher matches the issue)
    - `matchReason`: string (explanation of why this teacher is recommended)
  }>
- `message`: string
- `error`: string (if failed)
- `message`: string (error message)

**Notes**
- Matches teachers based on expertise alignment with detected issue type
- Considers age-appropriate expertise (elementary, middle school, high school)
- Scores teachers based on rating, expertise match, and age preferences
- Returns top 5 recommendations sorted by match score
- Used by AI chat interface to suggest teachers when issues are detected
- Issue types: learning_anxiety, social_stress, family_conflict, exam_anxiety, emotional_issues, behavior_problems

### `chat.sendMessage` (Enhanced)
**Note**: The existing `chat.sendMessage` function has been enhanced to include booking recommendations.

**Enhanced Output** (in addition to existing fields):
- `bookingRecommendation`: object | null {
    - `suggested`: boolean (true if booking is recommended)
    - `issueType`: string (detected issue type if applicable)
    - `message`: string (recommendation message to display)
  }

**Notes**
- Automatically detects issue keywords in user messages
- Suggests booking professional counselor when issues are detected and risk is not high
- Provides seamless transition from AI chat to booking flow
- Booking recommendation appears inline with assistant messages in the chat interface

