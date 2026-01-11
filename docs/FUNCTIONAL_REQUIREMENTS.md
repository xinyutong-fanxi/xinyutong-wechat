# Xinyutong Platform - Functional Requirements Document

## Document Information
- **Version**: 1.0
- **Last Updated**: 2024
- **Status**: MVP Specification
- **Related Documents**: 
  - `requirements.md` - High-level product requirements
  - `ARCHITECTURE.md` - Technical architecture
  - `DATA_MODEL.md` - Database schema
  - `CLOUD_FUNCTIONS.md` - API specifications

## Table of Contents
1. [Executive Summary](#executive-summary)
2. [Product Overview](#product-overview)
3. [User Roles & Permissions](#user-roles--permissions)
4. [Parent Interface Requirements](#parent-interface-requirements)
5. [Teacher/Counselor Interface Requirements](#teachercounselor-interface-requirements)
6. [Student Interface Requirements](#student-interface-requirements)
7. [Admin Interface Requirements](#admin-interface-requirements)
8. [AI Module Requirements](#ai-module-requirements)
9. [Payment & Finance Requirements](#payment--finance-requirements)
10. [Distribution System Requirements](#distribution-system-requirements)
11. [Booking System Requirements](#booking-system-requirements)
12. [Security & Compliance Requirements](#security--compliance-requirements)
13. [Acceptance Criteria](#acceptance-criteria)

---

## Executive Summary

Xinyutong (Heart-Edu Connect) is an integrated platform that connects parents, students, and professional counselors/teachers for psychological counseling and educational guidance services. The platform combines AI-powered emotional support with human professional counseling, supported by a comprehensive booking, payment, and affiliate distribution system.

### Key Features
- Multi-role user system (Parents, Students, Teachers, Admins, Distributors)
- Teacher/Counselor directory with intelligent recommendations
- Online booking and payment system (WeChat Pay)
- AI companion for student emotional support and pre-screening
- Two-level affiliate distribution system
- Comprehensive admin backend for platform management

### MVP Goals
- Launch within 3 months
- Successfully execute Booking → Service → Evaluation → Referral → Settlement cycle
- Validate parent-driven affiliate distribution model

---

## Product Overview

### Product Name
Xinyutong (Heart-Edu Connect) / 心语通

### Product Positioning
An integrated "Psychological Counseling + Educational Guidance" booking and affiliate distribution platform for teenage families. Connects students and parents with trusted teachers/counselors, providing both AI emotional support and professional human counseling services.

### Target Users

**Primary Paying Users:**
- Parents seeking counseling and guidance services for their children

**Service Recipients:**
- Teenage students (ages 8-18)

**Service Providers:**
- Licensed teachers and psychological counselors
- Elite university students (985/211/Top-tier universities)

**Promoters:**
- Parent affiliates
- Teacher affiliates
- Partner institutions

### Problems Solved
1. **Trust Gap**: Difficulty verifying counselor/teacher credibility
2. **Delayed Intervention**: Late discovery of mental health issues
3. **Fragmented Services**: Lack of psychological support in educational platforms
4. **Growth Barriers**: High customer acquisition costs and low viral efficiency

---

## User Roles & Permissions

### Role Definitions

#### 1. Platform Administrator (Admin)
- **Description**: Full system control and platform management
- **Primary Functions**:
  - Teacher/Counselor auditing and approval
  - Order and finance management
  - Distribution configuration
  - Withdrawal approval
  - System configuration

#### 2. Parent
- **Description**: Primary account holder and payer
- **Primary Functions**:
  - Student profile management
  - Teacher/Counselor directory browsing
  - Booking appointments
  - Payment processing
  - View counseling records
  - Apply to become distributor
  - Track referrals and commissions

#### 3. Teacher/Counselor
- **Description**: Service provider
- **Primary Functions**:
  - Profile and credentials management
  - Schedule/availability management
  - Booking confirmation
  - Submit counseling session logs
  - View earnings and commissions
  - Withdrawal requests
  - Apply to become distributor (optional)

#### 4. Student
- **Description**: End-user of the service
- **Primary Functions**:
  - AI chat companion interaction
  - View own bookings (read-only)
  - View own counseling records (based on authorization level)

#### 5. Distributor (Multi-Role)
- **Description**: Parents, teachers, or institutions earning referral commissions
- **Primary Functions**:
  - Generate promotional posters
  - Track referral orders and commissions
  - Submit withdrawal requests
  - View distribution statistics

### Permission Principles

#### Data Minimization
- Access only necessary data for role functionality
- Student data visible to parents based on `authorizationLevel`
- Counseling logs respect visibility settings (`full`, `summary`, `alerts_only`)

#### Parental Consent
- Student profile creation requires parent verification
- Data sharing settings managed by parent with student awareness
- Guardian mode required for certain features

#### Role-Based Access Control
- Route guards enforce role-based page access
- Cloud functions validate user role from context
- Admin functions require explicit admin role verification

---

## Parent Interface Requirements

### FR-P-1: Student Management

#### FR-P-1.1: Create Student Profile
**Description**: Parent can create student profiles for their children

**Functional Requirements**:
- Parent can add multiple student profiles (multi-child families)
- Required fields: name, age, grade
- Optional fields: avatar, additional notes
- Parent sets `authorizationLevel` (full/summary/alerts_only)
- Each student profile linked to parent's `openid`

**Business Rules**:
- Maximum 5 students per parent account
- Age must be between 8-18 years
- Student name must be valid (2-20 characters)

**Acceptance Criteria**:
- ✅ Parent can navigate to "Add Student" page
- ✅ Form validation prevents invalid data submission
- ✅ Student profile successfully created in `students` collection
- ✅ Parent redirected to student list after creation
- ✅ Student appears in parent's student selector

#### FR-P-1.2: Edit Student Profile
**Description**: Parent can edit existing student profiles

**Functional Requirements**:
- Parent can update student name, age, grade
- Parent can change `authorizationLevel`
- Parent can upload/change student avatar
- Changes saved to `students` collection

**Business Rules**:
- Cannot change `parentOpenId` after creation
- Age updates must remain within 8-18 range

**Acceptance Criteria**:
- ✅ Parent can edit student profile from student list
- ✅ Changes persist after save
- ✅ Validation prevents invalid updates

#### FR-P-1.3: Switch Between Students
**Description**: Parent can switch active student context for bookings

**Functional Requirements**:
- Parent sees list of all linked students
- Parent can select active student for booking flow
- Active student context persists during booking session
- Student selector available on booking creation page

**Acceptance Criteria**:
- ✅ Student selector shows all linked students
- ✅ Selected student context maintained throughout booking flow
- ✅ Booking correctly associated with selected student

### FR-P-2: Teacher/Counselor Directory

#### FR-P-2.1: Browse Teacher Directory
**Description**: Parent can browse available teachers/counselors

**Functional Requirements**:
- Display list of approved teachers (`status: "approved"`)
- Show teacher card with: name, avatar, expertise, rating, price per hour
- Support filtering by: expertise, service mode (online/offline), price range
- Support sorting by: rating, price, total sessions
- Pagination for large lists (20 per page)

**Business Rules**:
- Only approved teachers visible
- Suspended teachers hidden
- Teachers with 0 sessions can still appear

**Acceptance Criteria**:
- ✅ Teacher list loads with approved teachers only
- ✅ Filters apply correctly
- ✅ Sorting works as expected
- ✅ Pagination loads more teachers

#### FR-P-2.2: View Teacher Profile
**Description**: Parent can view detailed teacher profile

**Functional Requirements**:
- Display teacher bio, credentials, expertise tags
- Show certification badges
- Display service modes (online/offline)
- Show pricing information
- Display rating and review count
- Show availability calendar (read-only)
- Display "Book Appointment" button

**Business Rules**:
- Only approved teachers can be booked
- Pricing displayed in yuan (converted from cents)
- Rating calculated from parent feedback

**Acceptance Criteria**:
- ✅ Teacher profile displays all required information
- ✅ Booking button only enabled for approved teachers
- ✅ Availability calendar shows teacher's schedule

#### FR-P-2.3: Intelligent Recommendations
**Description**: System recommends teachers based on student's needs

**Functional Requirements**:
- AI analyzes student's issue type from chat or explicit selection
- System recommends 3-5 teachers matching issue type and age
- Recommendations show match score and reason
- Parent can view recommendations from teacher detail page
- Recommendations based on: issue type, age, expertise alignment, rating

**Business Rules**:
- Recommendations only for approved teachers
- Match score calculated: expertise (50%), age fit (20%), rating (20%), price (10%)

**Acceptance Criteria**:
- ✅ Recommendations appear on teacher detail page
- ✅ Recommendations relevant to student's needs
- ✅ Match scores and reasons displayed
- ✅ Clicking recommendation navigates to teacher profile

### FR-P-3: Booking Flow

#### FR-P-3.1: Create Booking
**Description**: Parent creates booking appointment

**Functional Requirements**:
- Parent selects teacher from directory
- Parent selects student from student selector
- Parent selects date and time slot from teacher's availability
- Parent confirms booking details (teacher, student, date, time, duration, price)
- System creates booking record with status "pending"
- System creates order record with status "pending"
- System calculates pricing: base price + platform fee (20-40%)

**Business Rules**:
- Booking cannot conflict with existing bookings
- Minimum booking duration: 30 minutes
- Maximum booking duration: 120 minutes
- Default duration: 60 minutes
- Teacher must be approved
- Time slot must be available in teacher's schedule

**Acceptance Criteria**:
- ✅ Booking creation flow completes successfully
- ✅ Booking and order records created
- ✅ Pricing calculated correctly
- ✅ Conflicts prevented
- ✅ Parent redirected to payment page

#### FR-P-3.2: Payment Processing
**Description**: Parent pays for booking using WeChat Pay

**Functional Requirements**:
- Display order summary (service, teacher, student, date, time, amount)
- Parent initiates WeChat Pay payment
- System calls `payment.createPayment` cloud function
- System receives payment parameters (prepayId, timeStamp, nonceStr, package, signType, paySign)
- Parent completes payment via `wx.requestPayment()`
- System handles payment callback via `payment.handleCallback`
- On successful payment: order status → "paid", booking paymentStatus → "paid"
- Teacher receives notification of new booking

**Business Rules**:
- Payment must complete within 15 minutes of order creation
- Orders expire if unpaid after 15 minutes
- Refund policy: full refund if cancelled >24h before, 50% if <24h

**Acceptance Criteria**:
- ✅ Payment flow completes successfully
- ✅ Order and booking status updated after payment
- ✅ Teacher receives notification
- ✅ Payment callback processed correctly

#### FR-P-3.3: View Bookings
**Description**: Parent views booking list and details

**Functional Requirements**:
- Display list of parent's bookings
- Filter by status: pending, confirmed, completed, cancelled
- Show booking card with: teacher name, student name, date, time, status
- Parent can view booking details
- Parent can cancel booking (if allowed)
- Parent can view counseling log (after completion)

**Business Rules**:
- Cancellation allowed if >24h before scheduled time
- Completed bookings show counseling log
- Cancelled bookings show refund status

**Acceptance Criteria**:
- ✅ Booking list displays correctly
- ✅ Filters work as expected
- ✅ Booking details show complete information
- ✅ Cancellation follows business rules

#### FR-P-3.4: View Counseling Logs
**Description**: Parent views counseling session logs submitted by teacher

**Functional Requirements**:
- Display counseling log: session date, duration, summary content
- Show teacher feedback section
- Parent can submit feedback (rating 1-5, optional comment)
- Parent feedback updates teacher's average rating
- Visibility based on student's `authorizationLevel`

**Business Rules**:
- Log visible only after session completion
- Feedback can only be submitted once per booking
- Feedback content checked for safety (`msgSecCheck`)

**Acceptance Criteria**:
- ✅ Counseling log displays after completion
- ✅ Parent can submit feedback
- ✅ Teacher rating updated correctly
- ✅ Visibility rules enforced

### FR-P-4: Distribution Center

#### FR-P-4.1: Apply to Become Distributor
**Description**: Parent can apply to become a distributor

**Functional Requirements**:
- Parent navigates to distribution center
- Parent clicks "Apply to Become Distributor"
- Parent fills application form (optional: additional information)
- System creates distributor record with status "pending"
- Admin reviews and approves/rejects application
- Parent receives notification of approval/rejection

**Business Rules**:
- Only parents can apply (teachers can apply separately)
- Distributor status: "none" → "pending" → "approved"/"rejected"
- Upon approval, system generates unique referral code

**Acceptance Criteria**:
- ✅ Application form submits successfully
- ✅ Distributor record created with "pending" status
- ✅ Admin can review application
- ✅ Approval generates referral code

#### FR-P-4.2: Generate Promotional Poster
**Description**: Distributor can generate promotional poster with referral code

**Functional Requirements**:
- Distributor navigates to poster generation page
- System calls `distribution.generatePoster` cloud function
- System generates QR code containing mini-program path with referral code
- System creates poster image with: app branding, incentive text, QR code
- Poster and QR code uploaded to WXCloud Storage
- Distributor can download/share poster

**Business Rules**:
- Only approved distributors can generate posters
- Referral code unique per distributor
- QR code links to mini-program registration with referral parameter

**Acceptance Criteria**:
- ✅ Poster generated successfully
- ✅ QR code contains correct referral code
- ✅ Poster displays app branding and incentive text
- ✅ Distributor can download/share poster

#### FR-P-4.3: Track Referrals and Commissions
**Description**: Distributor can track referral statistics and commissions

**Functional Requirements**:
- Display referral statistics: total referrals, active referrals, total orders
- Display commission statistics: total earned, available balance, total withdrawn
- Display commission breakdown by referral level (Level 1, Level 2)
- Display recent referral orders with commission details
- Display commission history with settlement status

**Business Rules**:
- Level 1 commission: 15% of order amount (configurable)
- Level 2 commission: 5% of order amount (configurable)
- Commissions settled after order completion
- Commissions can be withdrawn after settlement

**Acceptance Criteria**:
- ✅ Statistics display correctly
- ✅ Commission calculations accurate
- ✅ Referral history shows all referrals
- ✅ Commission status updates correctly

#### FR-P-4.4: Withdrawal Request
**Description**: Distributor can request withdrawal of earned commissions

**Functional Requirements**:
- Distributor navigates to withdrawal page
- System displays available balance (settled commissions)
- Distributor enters withdrawal amount (minimum 10 yuan)
- System validates sufficient balance
- System creates withdrawal record with status "pending"
- Admin reviews and processes withdrawal
- Withdrawal processed via WeChat Pay transfer
- Distributor receives notification upon completion

**Business Rules**:
- Minimum withdrawal: 10 yuan (1000 cents)
- Only settled commissions can be withdrawn
- Withdrawal requires admin approval
- Withdrawal processed via WeChat Pay transfer API

**Acceptance Criteria**:
- ✅ Withdrawal request created successfully
- ✅ Validation prevents invalid amounts
- ✅ Admin can review withdrawal
- ✅ WeChat Pay transfer processed correctly

---

## Teacher/Counselor Interface Requirements

### FR-T-1: Profile Management

#### FR-T-1.1: Create/Update Profile
**Description**: Teacher can create and update profile information

**Functional Requirements**:
- Teacher fills profile form: name, title, bio, expertise tags, service modes
- Teacher uploads credentials: ID card, qualifications, university, certificates
- Teacher sets pricing: price per hour (in yuan, converted to cents)
- Teacher can update profile after creation
- Profile updates trigger re-audit if credentials changed

**Business Rules**:
- Profile required for teacher approval
- Credentials must be valid (file upload required)
- Price per hour: minimum 50 yuan, maximum 1000 yuan
- Service modes: must select at least one (online/offline)
- Expertise tags: must select at least one

**Acceptance Criteria**:
- ✅ Profile form validates correctly
- ✅ Credentials upload successfully
- ✅ Profile saved to `teachers` collection
- ✅ Profile updates trigger re-audit when credentials change
- ✅ Teacher status set to "pending" after profile submission

#### FR-T-1.2: View Profile Status
**Description**: Teacher can view profile approval status

**Functional Requirements**:
- Display profile status: pending, approved, rejected, suspended
- Show approval/rejection reason if applicable
- Display approval date and admin who approved
- Show any admin notes or feedback

**Business Rules**:
- Only approved teachers can receive bookings
- Rejected teachers can update profile and re-apply
- Suspended teachers cannot receive new bookings

**Acceptance Criteria**:
- ✅ Status displays correctly
- ✅ Rejection reason shown if rejected
- ✅ Approval information displayed if approved

### FR-T-2: Schedule Management

#### FR-T-2.1: Set Availability
**Description**: Teacher can set availability schedule

**Functional Requirements**:
- Teacher navigates to schedule management page
- Teacher selects date range
- Teacher sets available time slots (e.g., 9:00-12:00, 14:00-18:00)
- System validates no conflicts with existing bookings
- System saves schedule to `teacher_schedule` collection
- Teacher can clear availability for specific dates

**Business Rules**:
- Time slots must be in 30-minute increments
- Cannot set past dates
- Cannot remove slots with confirmed bookings
- System warns if setting slots conflict with existing bookings

**Acceptance Criteria**:
- ✅ Schedule saves successfully
- ✅ Conflicts detected and prevented
- ✅ Existing bookings protected
- ✅ Schedule displays correctly on profile

#### FR-T-2.2: View Schedule
**Description**: Teacher can view current schedule and bookings

**Functional Requirements**:
- Display calendar view of availability
- Show booked time slots
- Show pending booking requests
- Display booking details on click
- Color-coded: available (green), booked (blue), pending (yellow)

**Business Rules**:
- Only show teacher's own schedule
- Past bookings displayed but not editable

**Acceptance Criteria**:
- ✅ Calendar displays correctly
- ✅ Bookings shown accurately
- ✅ Booking details accessible

### FR-T-3: Booking Management

#### FR-T-3.1: Receive Booking Requests
**Description**: Teacher receives and reviews booking requests

**Functional Requirements**:
- Teacher receives notification of new booking request
- Display booking request details: parent, student, date, time, duration, service type
- Teacher can confirm or reject booking request
- If confirmed: booking status → "confirmed", teacher receives confirmation
- If rejected: booking cancelled, order refunded, parent notified

**Business Rules**:
- Teacher must respond within 24 hours
- If no response: booking auto-cancelled after 24 hours
- Rejection requires reason (optional but recommended)

**Acceptance Criteria**:
- ✅ Teacher receives notification
- ✅ Booking request displays correctly
- ✅ Confirmation updates booking status
- ✅ Rejection triggers refund process

#### FR-T-3.2: View Bookings
**Description**: Teacher views all bookings (upcoming and past)

**Functional Requirements**:
- Display list of teacher's bookings
- Filter by status: pending, confirmed, completed, cancelled
- Show booking card with: parent name, student name, date, time, status
- Teacher can view booking details
- Teacher can cancel booking (if allowed)

**Business Rules**:
- Cancellation allowed if >24h before scheduled time
- Cancellation triggers refund (based on policy)
- Completed bookings show counseling log

**Acceptance Criteria**:
- ✅ Booking list displays correctly
- ✅ Filters work as expected
- ✅ Cancellation follows business rules

#### FR-T-3.3: Submit Counseling Log
**Description**: Teacher submits counseling session log after completion

**Functional Requirements**:
- Teacher navigates to booking detail page after session
- Teacher fills log form: session date, duration, summary content (min 50 characters)
- System validates log content (safety check via `msgSecCheck`)
- System saves log to `counseling_logs` collection
- Booking status updates to "completed"
- Order status updates to "completed" (if applicable)
- Parent receives notification of log submission

**Business Rules**:
- Log can only be submitted after scheduled session time
- Log content must pass safety check
- Log summary must be meaningful (min 50 characters)
- Only one log per booking

**Acceptance Criteria**:
- ✅ Log form validates correctly
- ✅ Safety check passes
- ✅ Log saves successfully
- ✅ Booking and order status updated
- ✅ Parent receives notification

#### FR-T-3.4: View Parent Feedback
**Description**: Teacher can view parent feedback on counseling sessions

**Functional Requirements**:
- Display parent feedback: rating (1-5), comment (optional)
- Show feedback date
- Display average rating across all sessions
- Show feedback history for all bookings

**Business Rules**:
- Rating affects teacher's overall rating
- Feedback visible only after parent submits
- Comments checked for safety

**Acceptance Criteria**:
- ✅ Feedback displays correctly
- ✅ Average rating calculated correctly
- ✅ Feedback history shows all feedback

### FR-T-4: Earnings & Finance

#### FR-T-4.1: View Earnings
**Description**: Teacher can view earnings and commission statistics

**Functional Requirements**:
- Display total earnings: completed sessions, pending settlement, available balance
- Display earnings breakdown by time period (daily, weekly, monthly)
- Display earnings per session with details
- Display commission from distribution referrals (if teacher is distributor)
- Show withdrawal history

**Business Rules**:
- Earnings calculated from `teacherEarning` field in orders
- Earnings settled after session completion
- Platform fee deducted before earnings calculation

**Acceptance Criteria**:
- ✅ Earnings display correctly
- ✅ Breakdown shows accurate calculations
- ✅ Commission included if applicable

#### FR-T-4.2: Request Withdrawal
**Description**: Teacher can request withdrawal of earnings

**Functional Requirements**:
- Teacher navigates to withdrawal page
- System displays available balance (settled earnings)
- Teacher enters withdrawal amount (minimum 10 yuan)
- System validates sufficient balance
- System creates withdrawal record with status "pending"
- Admin reviews and processes withdrawal
- Withdrawal processed via WeChat Pay transfer
- Teacher receives notification upon completion

**Business Rules**:
- Minimum withdrawal: 10 yuan (1000 cents)
- Only settled earnings can be withdrawn
- Withdrawal requires admin approval
- Withdrawal processed via WeChat Pay transfer API

**Acceptance Criteria**:
- ✅ Withdrawal request created successfully
- ✅ Validation prevents invalid amounts
- ✅ Admin can review withdrawal
- ✅ WeChat Pay transfer processed correctly

---

## Student Interface Requirements

### FR-S-1: AI Chat Companion

#### FR-S-1.1: Chat Interface
**Description**: Student can interact with AI companion for emotional support

**Functional Requirements**:
- Student opens chat interface (`/pages/index/index`)
- Mood picker displayed at session start (emoji + optional label)
- Student sends text messages
- AI responds with empathetic, supportive messages
- Chat history persists across sessions
- Optional voice input ("Venting" button)

**Business Rules**:
- Chat content checked for safety (local triage + `msgSecCheck`)
- High-risk content triggers parent alert
- AI explicitly states it does not provide medical diagnosis or treatment
- Chat memory limited to summarized entities and tags (not full transcripts)

**Acceptance Criteria**:
- ✅ Chat interface loads correctly
- ✅ Mood picker appears at session start
- ✅ Messages send and receive correctly
- ✅ Safety checks applied
- ✅ High-risk alerts triggered appropriately

#### FR-S-1.2: Pre-screening Assessment
**Description**: AI conducts preliminary assessment before recommending human counseling

**Functional Requirements**:
- AI detects issue types: learning_anxiety, social_stress, family_conflict, exam_anxiety
- AI provides basic stress assessment
- AI suggests booking professional counselor when appropriate
- Booking recommendation appears inline in chat
- Student can click recommendation to navigate to booking flow

**Business Rules**:
- Recommendations only for non-high-risk situations
- Issue type detection based on keyword analysis and sentiment
- Recommendations personalized based on age and issue type

**Acceptance Criteria**:
- ✅ Issue types detected correctly
- ✅ Recommendations appear when appropriate
- ✅ Recommendations link to booking flow
- ✅ Age-appropriate recommendations

### FR-S-2: View Bookings (Read-Only)

#### FR-S-2.1: View Own Bookings
**Description**: Student can view their own bookings (read-only)

**Functional Requirements**:
- Display list of student's bookings
- Show booking details: teacher name, date, time, status
- Student cannot edit or cancel bookings (parent must do this)
- Booking details respect `authorizationLevel`

**Business Rules**:
- Only bookings linked to student's profile visible
- Visibility based on student's `authorizationLevel` in profile
- Read-only access enforced

**Acceptance Criteria**:
- ✅ Booking list displays correctly
- ✅ Only student's bookings shown
- ✅ Read-only access enforced
- ✅ Visibility rules respected

### FR-S-2.2: View Counseling Records (Read-Only)

#### FR-S-2.2: View Counseling Records
**Description**: Student can view counseling session records (based on authorization)

**Functional Requirements**:
- Display list of completed counseling sessions
- Show session details: date, teacher, summary (based on `authorizationLevel`)
- Full log visible if `authorizationLevel: "full"`
- Summary only if `authorizationLevel: "summary"`
- No log visible if `authorizationLevel: "alerts_only"` (alerts only)

**Business Rules**:
- Visibility strictly based on `authorizationLevel`
- Records read-only (no editing)
- Only completed sessions visible

**Acceptance Criteria**:
- ✅ Records display correctly
- ✅ Visibility rules enforced
- ✅ Read-only access maintained

---

## Admin Interface Requirements

### FR-A-1: Teacher Management

#### FR-A-1.1: Teacher Auditing
**Description**: Admin reviews and approves/rejects teacher applications

**Functional Requirements**:
- Admin views list of pending teacher applications
- Admin clicks teacher to view full profile and credentials
- Admin can approve or reject application
- Admin can add rejection reason (optional but recommended)
- Upon approval: teacher status → "approved", `approvedAt` and `approvedBy` set
- Upon rejection: teacher status → "rejected", `rejectionReason` set
- Teacher receives notification of decision

**Business Rules**:
- Only pending teachers can be audited
- Approval requires verification of credentials
- Rejected teachers can update profile and re-apply
- Admin decision is final (no appeal process in MVP)

**Acceptance Criteria**:
- ✅ Admin dashboard shows pending teachers
- ✅ Teacher profile displays all information
- ✅ Approval updates status correctly
- ✅ Rejection saves reason correctly
- ✅ Teacher receives notification

#### FR-A-1.2: Teacher Management
**Description**: Admin manages all teachers (view, suspend, enable)

**Functional Requirements**:
- Display list of all teachers with status
- Filter by status: pending, approved, rejected, suspended
- Admin can suspend approved teachers
- Admin can enable suspended teachers
- Admin can view teacher statistics: total sessions, earnings, ratings

**Business Rules**:
- Suspended teachers cannot receive new bookings
- Existing bookings with suspended teachers remain valid
- Suspension requires reason (logged)

**Acceptance Criteria**:
- ✅ Teacher list displays correctly
- ✅ Filters work as expected
- ✅ Suspension/Enable functions work correctly
- ✅ Statistics display accurately

### FR-A-2: Order Management

#### FR-A-2.1: View All Orders
**Description**: Admin views all platform orders

**Functional Requirements**:
- Display list of all orders
- Filter by status: pending, paid, completed, refunded, cancelled
- Filter by date range
- Show order details: order number, parent, teacher, student, amount, status, date
- Admin can view order details
- Admin can process refunds (if applicable)

**Business Rules**:
- All orders visible to admin
- Refunds processed via WeChat Pay refund API
- Refund reason required

**Acceptance Criteria**:
- ✅ Order list displays correctly
- ✅ Filters work as expected
- ✅ Order details show complete information
- ✅ Refund process works correctly

#### FR-A-2.2: Finance Overview
**Description**: Admin views financial statistics and reports

**Functional Requirements**:
- Display dashboard with key metrics:
  - Today's orders count and revenue
  - Total orders count and revenue
  - Platform commission earned
  - Pending withdrawals count
- Display revenue trends (daily, weekly, monthly)
- Display commission breakdown by service type

**Business Rules**:
- Revenue calculated from platform fees
- Commission rates configurable
- Statistics real-time (or near real-time)

**Acceptance Criteria**:
- ✅ Dashboard displays key metrics
- ✅ Trends display correctly
- ✅ Calculations accurate
- ✅ Data updates appropriately

### FR-A-3: Distribution Configuration

#### FR-A-3.1: Configure Commission Rates
**Description**: Admin configures distribution commission rates

**Functional Requirements**:
- Admin navigates to distribution configuration page
- Admin sets Level 1 commission rate (percentage, e.g., 15%)
- Admin sets Level 2 commission rate (percentage, e.g., 5%)
- Admin sets platform commission rate (percentage, e.g., 30%)
- System saves configuration to `system_config` collection
- New commissions use updated rates (existing commissions unchanged)

**Business Rules**:
- Level 2 rate must be ≤ Level 1 rate
- Rates must be between 0-100%
- Platform rate affects teacher earnings calculation
- Configuration changes logged (audit trail)

**Acceptance Criteria**:
- ✅ Configuration form validates correctly
- ✅ Rates save successfully
- ✅ New commissions use updated rates
- ✅ Existing commissions unchanged
- ✅ Audit trail maintained

#### FR-A-3.2: Distributor Management
**Description**: Admin manages distributor applications and status

**Functional Requirements**:
- Display list of distributor applications (status: pending)
- Admin can approve or reject applications
- Display list of all distributors with status
- Admin can view distributor statistics: referrals, commissions, withdrawals
- Admin can suspend distributors (if needed)

**Business Rules**:
- Only approved distributors can generate posters and earn commissions
- Suspended distributors cannot earn new commissions
- Existing commissions remain valid

**Acceptance Criteria**:
- ✅ Distributor list displays correctly
- ✅ Approval/Rejection works correctly
- ✅ Statistics display accurately
- ✅ Suspension functions correctly

### FR-A-4: Withdrawal Approval

#### FR-A-4.1: Review Withdrawal Requests
**Description**: Admin reviews and processes withdrawal requests

**Functional Requirements**:
- Admin views list of pending withdrawal requests
- Admin clicks withdrawal to view details: applicant, type (teacher/distributor), amount, commission breakdown
- Admin can approve or reject withdrawal
- If approved: system processes WeChat Pay transfer, updates withdrawal status to "approved", updates commission status to "withdrawn"
- If rejected: admin provides rejection reason, withdrawal status → "rejected", commissions remain "settled"
- Applicant receives notification of decision

**Business Rules**:
- Withdrawal can only be approved if sufficient balance
- WeChat Pay transfer must succeed for approval
- Rejection requires reason
- Minimum withdrawal: 10 yuan (already validated in request)

**Acceptance Criteria**:
- ✅ Withdrawal list displays correctly
- ✅ Withdrawal details show complete information
- ✅ Approval processes WeChat Pay transfer correctly
- ✅ Rejection saves reason correctly
- ✅ Applicant receives notification
- ✅ Commission status updated correctly

---

## AI Module Requirements

### FR-AI-1: Chat Functionality

#### FR-AI-1.1: Message Processing
**Description**: AI processes student messages and generates responses

**Functional Requirements**:
- System receives student message
- Local safety filter checks for high-risk keywords
- System calls `msgSecCheck` for content safety
- System retrieves relevant memory (entities, tags, summaries)
- System composes LLM prompt with persona and context
- System calls LLM API (DeepSeek/Zhipu)
- System calls `msgSecCheck` on AI response (if required)
- System persists message and response
- System returns response to client

**Business Rules**:
- High-risk keywords trigger escalation immediately
- Memory limited to summarized entities (not full transcripts)
- LLM persona: empathetic "older sibling" (星辰/Xingchen)
- Response must be supportive and age-appropriate
- Explicit disclaimer: not medical diagnosis or treatment

**Acceptance Criteria**:
- ✅ Messages processed successfully
- ✅ Safety checks applied
- ✅ Memory retrieved correctly
- ✅ LLM responses appropriate
- ✅ Responses persisted

#### FR-AI-1.2: Issue Detection
**Description**: AI detects issue types from student messages

**Functional Requirements**:
- System analyzes message content for issue keywords
- System detects issue types: learning_anxiety, social_stress, family_conflict, exam_anxiety, emotional_issues, behavior_problems
- System assigns confidence score to each issue type
- System stores issue type in session metadata
- System uses issue type for recommendations

**Business Rules**:
- Issue detection based on keyword matching and sentiment analysis
- Multiple issue types can be detected
- Confidence threshold: 0.6 (60%) for recommendation trigger

**Acceptance Criteria**:
- ✅ Issue types detected correctly
- ✅ Confidence scores calculated
- ✅ Issue types stored correctly
- ✅ Recommendations use issue types

#### FR-AI-1.3: Booking Recommendations
**Description**: AI recommends booking professional counselor when appropriate

**Functional Requirements**:
- System detects issue type from conversation
- System calls `ai.getRecommendations` with issue type and age
- System receives teacher recommendations with match scores
- System displays recommendation inline in chat: "Based on your situation, we recommend booking a session with [Teacher Name]. Click here to book."
- Student can click recommendation to navigate to booking flow

**Business Rules**:
- Recommendations only for non-high-risk situations
- Recommendations personalized by age and issue type
- Maximum 3 recommendations shown
- Recommendations appear after 3-5 relevant messages

**Acceptance Criteria**:
- ✅ Recommendations appear when appropriate
- ✅ Recommendations relevant to issue type
- ✅ Recommendations link to booking flow
- ✅ Recommendations age-appropriate

### FR-AI-2: Safety & Risk Management

#### FR-AI-2.1: Risk Detection
**Description**: System detects high-risk content in student messages

**Functional Requirements**:
- Local safety filter scans for high-risk keywords (self-harm, severe depression, etc.)
- Sentiment analysis scores message negativity
- System triggers escalation if: high-risk keyword OR sentiment < threshold
- System calls `alert.triggerParent` to notify parent
- System switches AI response to "Professional Support" tone
- System encourages trusted adult outreach and provides hotline placeholder

**Business Rules**:
- High-risk keywords: self-harm terms, severe depression indicators, withdrawal signs
- Sentiment threshold: -0.7 (highly negative)
- Parent alert sent immediately (subscribe message)
- Alert does not include transcript (privacy)

**Acceptance Criteria**:
- ✅ High-risk content detected correctly
- ✅ Parent alerts triggered appropriately
- ✅ AI response switches to support tone
- ✅ Hotline information provided

#### FR-AI-2.2: Content Safety
**Description**: All user-generated content checked for safety

**Functional Requirements**:
- Student messages checked via `msgSecCheck` (input)
- AI responses checked via `msgSecCheck` (output, if required)
- Teacher counseling logs checked via `msgSecCheck`
- Parent feedback comments checked via `msgSecCheck`
- If content rejected: user notified, content not saved/published

**Business Rules**:
- All content must pass `msgSecCheck` before persistence
- Rejected content logged but not saved
- User receives friendly error message

**Acceptance Criteria**:
- ✅ All content checked for safety
- ✅ Rejected content handled appropriately
- ✅ Users notified of safety issues

---

## Payment & Finance Requirements

### FR-PAY-1: Payment Processing

#### FR-PAY-1.1: Create Payment
**Description**: System creates WeChat Pay payment for order

**Functional Requirements**:
- Parent initiates payment from order page
- System calls `payment.createPayment` cloud function with orderId and amount
- Cloud function validates order exists and is in "pending" status
- Cloud function creates payment record in `payments` collection
- Cloud function calls WeChat Pay unified order API
- Cloud function receives prepayId and payment parameters
- Cloud function returns payment parameters to client
- Client calls `wx.requestPayment()` with parameters
- Payment processed by WeChat Pay

**Business Rules**:
- Payment amount must match order amount
- Order must be in "pending" status
- Payment expires after 15 minutes if unpaid
- Payment parameters include: timeStamp, nonceStr, package (prepayId), signType, paySign

**Acceptance Criteria**:
- ✅ Payment creation successful
- ✅ WeChat Pay API called correctly
- ✅ Payment parameters returned correctly
- ✅ Client payment flow completes

#### FR-PAY-1.2: Payment Callback
**Description**: System handles WeChat Pay payment callback

**Functional Requirements**:
- WeChat Pay sends callback to `payment.handleCallback` cloud function
- Cloud function verifies callback signature
- Cloud function extracts payment result from XML
- If payment successful: payment status → "paid", order status → "paid", booking paymentStatus → "paid"
- Cloud function triggers booking confirmation flow
- Cloud function sends notification to teacher
- Cloud function returns XML response to WeChat Pay

**Business Rules**:
- Signature verification required for security
- Payment can only be processed once (idempotency check)
- Callback must be handled within 5 seconds (WeChat requirement)

**Acceptance Criteria**:
- ✅ Callback received correctly
- ✅ Signature verified
- ✅ Payment status updated correctly
- ✅ Booking confirmation triggered
- ✅ XML response returned correctly

### FR-PAY-2: Refund Processing

#### FR-PAY-2.1: Process Refund
**Description**: System processes refunds for cancelled bookings

**Functional Requirements**:
- Parent or teacher cancels booking
- System calculates refund amount based on cancellation policy
- System calls WeChat Pay refund API
- System creates refund record
- Payment status → "refunded", order status → "refunded"
- Parent receives refund via WeChat Pay

**Business Rules**:
- Full refund if cancelled >24h before scheduled time
- 50% refund if cancelled <24h before scheduled time
- Platform fee non-refundable
- Refund processed within 1-3 business days

**Acceptance Criteria**:
- ✅ Refund amount calculated correctly
- ✅ WeChat Pay refund API called correctly
- ✅ Payment and order status updated
- ✅ Parent receives refund

### FR-PAY-3: Commission Calculation

#### FR-PAY-3.1: Calculate Teacher Earnings
**Description**: System calculates teacher earnings from orders

**Functional Requirements**:
- When order status → "completed", system calculates teacher earnings
- Teacher earning = order amount - platform fee - distributor commission (if applicable)
- System updates order with `teacherEarning` field
- System updates teacher's total earnings in profile

**Business Rules**:
- Platform fee: 20-40% of order amount (configurable)
- Teacher earning: remaining amount after platform fee
- Distributor commission deducted from platform fee (not teacher earning)

**Acceptance Criteria**:
- ✅ Teacher earnings calculated correctly
- ✅ Platform fee deducted correctly
- ✅ Teacher profile updated correctly

---

## Distribution System Requirements

### FR-DIST-1: Referral Tracking

#### FR-DIST-1.1: Track Referral Registration
**Description**: System tracks when parent registers with referral code

**Functional Requirements**:
- Parent scans QR code or clicks referral link with referral code parameter
- Parent registers via mini-program
- System extracts referral code from URL parameter
- System calls `distribution.trackReferral` with action "register"
- System creates referral record in `referrals` collection
- System links parent to distributor via referral code
- Referral level set to 1 (direct)

**Business Rules**:
- Referral code must be valid (belongs to approved distributor)
- Each parent can only be referred once (first registration)
- Referral relationship permanent (cannot change)

**Acceptance Criteria**:
- ✅ Referral code extracted correctly
- ✅ Referral record created
- ✅ Parent linked to distributor
- ✅ Referral level set correctly

#### FR-DIST-1.2: Track Referral Order
**Description**: System tracks when referred parent makes first paid order

**Functional Requirements**:
- Referred parent creates booking and pays
- System calls `distribution.trackReferral` with action "firstOrder"
- System updates referral record with `firstOrderId` and `firstOrderAt`
- System triggers commission calculation for distributor
- System creates commission records in `commissions` collection
- System updates distributor stats (totalOrders, totalCommission)

**Business Rules**:
- Commission only calculated on first paid order
- Subsequent orders from same parent do not generate new commissions
- Commission calculated based on referral level (Level 1 or Level 2)

**Acceptance Criteria**:
- ✅ First order tracked correctly
- ✅ Referral record updated
- ✅ Commission calculated correctly
- ✅ Distributor stats updated

#### FR-DIST-1.3: Track Secondary Referrals
**Description**: System tracks two-level referral chain (Level 2)

**Functional Requirements**:
- Parent A refers Parent B (Level 1)
- Parent B refers Parent C (Level 2)
- When Parent C makes first order: Parent A receives Level 2 commission, Parent B receives Level 1 commission
- System creates commission records for both distributors
- System updates `parentReferrerId` in referral record

**Business Rules**:
- Maximum referral levels: 2
- Level 2 commission: 5% (configurable)
- Level 1 commission: 15% (configurable)
- Commission rates can be configured by admin

**Acceptance Criteria**:
- ✅ Two-level referral tracked correctly
- ✅ Both distributors receive commissions
- ✅ Commission levels calculated correctly

### FR-DIST-2: Commission Management

#### FR-DIST-2.1: Calculate Commission
**Description**: System calculates commission when order completes

**Functional Requirements**:
- When order status → "completed" and order has `distributorId`, system calls `distribution.calculateCommission`
- System determines referral level (1 or 2)
- System retrieves commission rate from configuration (Level 1: 15%, Level 2: 5%)
- System calculates commission amount: order amount × commission rate
- System creates commission record in `commissions` collection with status "pending"
- System updates distributor stats (totalCommissionEarned)
- System updates referral relationship stats (totalCommission)

**Business Rules**:
- Commission only calculated on completed orders
- Commission calculated on order amount (not platform fee)
- Commission rates configurable by admin
- Commission status: "pending" → "settled" (after order completion) → "withdrawn" (after withdrawal)

**Acceptance Criteria**:
- ✅ Commission calculated correctly
- ✅ Commission record created
- ✅ Distributor stats updated
- ✅ Referral stats updated

#### FR-DIST-2.2: Settle Commission
**Description**: System settles commission after order completion

**Functional Requirements**:
- When order status → "completed", commission status → "settled"
- System updates commission record with `settledAt` timestamp
- Commission becomes available for withdrawal
- System updates distributor's available balance

**Business Rules**:
- Commission settled immediately after order completion
- Only settled commissions can be withdrawn
- Settlement cannot be reversed

**Acceptance Criteria**:
- ✅ Commission status updated to "settled"
- ✅ Settled timestamp recorded
- ✅ Available balance updated

---

## Booking System Requirements

### FR-BOOK-1: Booking Creation

#### FR-BOOK-1.1: Create Booking Order
**Description**: System creates booking and order when parent selects teacher, student, and time

**Functional Requirements**:
- Parent selects teacher from directory
- Parent selects student from student selector
- Parent selects date and time slot from teacher's availability
- System validates: teacher approved, time slot available, no conflicts
- System calls `booking.createOrder` cloud function
- Cloud function calculates pricing: base price (teacher's pricePerHour × duration) + platform fee (20-40%)
- Cloud function creates booking record with status "pending"
- Cloud function creates order record with status "pending"
- Cloud function tracks referral if referral code present
- System returns bookingId, orderId, orderNo, amount to client
- Parent redirected to payment page

**Business Rules**:
- Booking cannot conflict with existing bookings
- Minimum duration: 30 minutes
- Maximum duration: 120 minutes
- Default duration: 60 minutes
- Platform fee: 20-40% (configurable)
- Teacher must be approved

**Acceptance Criteria**:
- ✅ Booking creation successful
- ✅ Validation prevents conflicts
- ✅ Pricing calculated correctly
- ✅ Booking and order records created
- ✅ Referral tracked if applicable

### FR-BOOK-2: Booking Confirmation

#### FR-BOOK-2.1: Teacher Confirmation
**Description**: Teacher confirms or rejects booking request

**Functional Requirements**:
- Teacher receives notification of new booking request
- Teacher navigates to booking detail page
- Teacher clicks "Confirm" or "Reject"
- System calls `booking.confirmAppointment` cloud function
- If confirmed: booking status → "confirmed", `confirmedAt` set, parent notified
- If rejected: booking status → "cancelled", order refunded, parent notified

**Business Rules**:
- Teacher must respond within 24 hours
- If no response: booking auto-cancelled after 24 hours
- Rejection triggers refund process

**Acceptance Criteria**:
- ✅ Teacher receives notification
- ✅ Confirmation updates booking status
- ✅ Rejection triggers refund
- ✅ Parent notified correctly

### FR-BOOK-3: Booking Completion

#### FR-BOOK-3.1: Complete Booking
**Description**: System marks booking as completed after session

**Functional Requirements**:
- After scheduled session time, teacher can submit counseling log
- When log submitted: booking status → "completed"
- Order status → "completed" (if applicable)
- System triggers commission calculation (if distributor involved)
- System settles teacher earnings
- Parent can view log and submit feedback

**Business Rules**:
- Booking cannot be completed before scheduled time
- Log required for completion
- Completion triggers all settlement processes

**Acceptance Criteria**:
- ✅ Booking status updated to "completed"
- ✅ Settlement processes triggered
- ✅ Parent can view log

---

## Security & Compliance Requirements

### FR-SEC-1: Data Privacy

#### FR-SEC-1.1: Student Data Protection
**Description**: Student data protected based on authorization levels

**Functional Requirements**:
- Student records visible based on `authorizationLevel`: "full", "summary", "alerts_only"
- Parents see full records only if `authorizationLevel: "full"`
- Summary-only parents see aggregated insights (no transcripts)
- Alerts-only parents receive risk alerts only (no records)
- Students can view own records (read-only) based on authorization

**Business Rules**:
- Authorization level set by parent during student profile creation
- Authorization level can be changed by parent
- Authorization level enforced in all data access points

**Acceptance Criteria**:
- ✅ Authorization levels enforced correctly
- ✅ Parents see appropriate data based on level
- ✅ Students see appropriate data based on level

#### FR-SEC-1.2: Transcript Privacy
**Description**: Chat transcripts never shared with parents

**Functional Requirements**:
- Chat messages stored in `messages` collection (student context only)
- Parents receive only derived insights (weekly_insights, alerts)
- Weekly insights contain summaries, trends, tags (no verbatim content)
- Alerts contain category and risk level (no transcript excerpts)
- Counseling logs visible to parents based on authorization level

**Business Rules**:
- Raw chat transcripts never accessible to parents
- Insights derived from messages but do not contain verbatim content
- Counseling logs are teacher summaries (not chat transcripts)

**Acceptance Criteria**:
- ✅ Parents cannot access chat transcripts
- ✅ Insights contain no verbatim content
- ✅ Privacy boundary maintained

### FR-SEC-2: Content Safety

#### FR-SEC-2.1: Content Moderation
**Description**: All user-generated content moderated for safety

**Functional Requirements**:
- Student messages checked via `msgSecCheck` (input)
- AI responses checked via `msgSecCheck` (output, if required)
- Teacher counseling logs checked via `msgSecCheck`
- Parent feedback comments checked via `msgSecCheck`
- Rejected content not saved, user notified

**Business Rules**:
- All content must pass `msgSecCheck` before persistence
- Rejected content logged for audit but not saved
- User receives friendly error message explaining rejection

**Acceptance Criteria**:
- ✅ All content checked before saving
- ✅ Rejected content handled appropriately
- ✅ Users notified of rejections

### FR-SEC-3: Financial Security

#### FR-SEC-3.1: Payment Security
**Description**: Payment operations secured and verified

**Functional Requirements**:
- All payment operations server-side only (no API keys in client)
- Payment callbacks verified with WeChat signature
- Payment amounts validated against order amounts
- Payment status tracked and auditable

**Business Rules**:
- Payment API keys never exposed to client
- Signature verification required for all callbacks
- Payment operations logged for audit

**Acceptance Criteria**:
- ✅ Payment operations server-side only
- ✅ Callbacks verified correctly
- ✅ Payment audit trail maintained

#### FR-SEC-3.2: Commission Audit
**Description**: Commission calculations auditable and transparent

**Functional Requirements**:
- All commission calculations logged in `commissions` collection
- Commission records include: orderId, distributorId, amount, rate, level, status
- Commission history accessible to distributors and admins
- Commission calculations use configured rates (audit trail)

**Business Rules**:
- Commission records immutable (no edits after creation)
- Commission rates configurable but changes logged
- Commission history maintained indefinitely

**Acceptance Criteria**:
- ✅ Commission records complete and accurate
- ✅ Commission history accessible
- ✅ Audit trail maintained

### FR-SEC-4: Legal Compliance

#### FR-SEC-4.1: Non-Medical Disclaimer
**Description**: Platform explicitly states non-medical nature

**Functional Requirements**:
- AI chat interface displays disclaimer: "This service provides educational and consultative support only, not medical diagnosis or treatment."
- Booking pages display disclaimer: "Counseling services are educational/consultative, not medical services."
- Terms of service clearly define platform scope

**Business Rules**:
- Disclaimers must be visible and clear
- Users must acknowledge disclaimers
- Platform cannot claim medical/therapeutic benefits

**Acceptance Criteria**:
- ✅ Disclaimers displayed correctly
- ✅ Users acknowledge disclaimers
- ✅ Legal compliance maintained

#### FR-SEC-4.2: Minor Protection
**Description**: Platform adheres to minor privacy laws

**Functional Requirements**:
- Student profiles require parent verification
- Data sharing requires explicit parental consent
- Student data minimization (collect only necessary data)
- Data retention policies defined and enforced
- Right to deletion respected

**Business Rules**:
- Parent verification required for student account creation
- Consent mechanisms clear and documented
- Data retention: chat messages 90 days, insights 1 year, orders indefinitely (financial records)
- Deletion requests processed within 7 days

**Acceptance Criteria**:
- ✅ Parent verification enforced
- ✅ Consent mechanisms clear
- ✅ Data retention policies enforced
- ✅ Deletion requests processed

---

## Acceptance Criteria

### Overall Platform Acceptance Criteria

#### AC-1: Multi-Role System
- ✅ All five roles (Admin, Parent, Teacher, Student, Distributor) functional
- ✅ Role-based access control enforced
- ✅ Multi-role support (parent + distributor) works correctly

#### AC-2: Booking Flow
- ✅ Complete booking flow: Directory → Select Teacher → Select Student → Select Time → Payment → Confirmation → Completion
- ✅ Payment integration (WeChat Pay) functional
- ✅ Booking status transitions correct
- ✅ Notifications sent at appropriate stages

#### AC-3: Distribution System
- ✅ Referral tracking (Level 1 and Level 2) functional
- ✅ Commission calculation accurate
- ✅ Promotional poster generation works
- ✅ Withdrawal process complete

#### AC-4: AI Module
- ✅ Chat functionality operational
- ✅ Safety checks (local + msgSecCheck) functional
- ✅ Issue detection and recommendations work
- ✅ Risk escalation triggers parent alerts

#### AC-5: Admin Backend
- ✅ Teacher auditing functional
- ✅ Order management complete
- ✅ Distribution configuration works
- ✅ Withdrawal approval process functional

#### AC-6: Security & Compliance
- ✅ Data privacy rules enforced
- ✅ Content safety checks functional
- ✅ Payment security maintained
- ✅ Legal disclaimers displayed

### Performance Acceptance Criteria

#### AC-7: Response Times
- ✅ Page load times < 2 seconds
- ✅ API response times < 1 second (95th percentile)
- ✅ Payment callback processing < 5 seconds
- ✅ Chat message response < 3 seconds

#### AC-8: Scalability
- ✅ System handles 1000 concurrent users
- ✅ Database queries optimized (indexes on key fields)
- ✅ Pagination implemented for large lists
- ✅ Cloud functions handle concurrent requests

### Testing Acceptance Criteria

#### AC-9: Test Coverage
- ✅ Unit tests for commission calculations
- ✅ Integration tests for payment flow
- ✅ E2E tests for booking flow
- ✅ Security tests for content moderation

#### AC-10: Documentation
- ✅ API documentation complete (`CLOUD_FUNCTIONS.md`)
- ✅ Data model documented (`DATA_MODEL.md`)
- ✅ Architecture documented (`ARCHITECTURE.md`)
- ✅ Developer guide complete (`DEVELOPER_GUIDE.md`)

---

## Appendix A: Glossary

- **OpenID**: WeChat unique user identifier
- **WXCloud**: WeChat Cloud Development platform
- **Platform Fee**: Commission taken by platform (20-40% of order amount)
- **Teacher Earning**: Amount teacher receives (order amount - platform fee - distributor commission)
- **Distributor Commission**: Referral commission earned by distributor (Level 1: 15%, Level 2: 5%)
- **Referral Level**: Depth of referral relationship (Level 1: direct, Level 2: secondary)
- **Authorization Level**: Student data visibility setting ("full", "summary", "alerts_only")
- **msgSecCheck**: WeChat Content Security API for content moderation
- **Cents**: Currency stored in cents (1 yuan = 100 cents) for precision

## Appendix B: Related Documents

- `requirements.md` - High-level product requirements
- `ARCHITECTURE.md` - Technical architecture overview
- `DATA_MODEL.md` - Database schema and collections
- `CLOUD_FUNCTIONS.md` - Cloud function API specifications
- `UX_FLOWS.md` - User experience flows and page maps
- `SAFETY_COMPLIANCE.md` - Safety and compliance guidelines
- `DEVELOPER_GUIDE.md` - Developer onboarding guide

---

**Document Status**: Complete for MVP specification
**Next Review**: After MVP launch and user feedback
