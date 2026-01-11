# Xinyutong (Heart-Edu Connect) - Product Requirements

## I. Product Overview

### 1.1 Product Name (Provisional)
Xinyutong (Heart-Edu Connect)

### 1.2 Product Positioning
An integrated "Psychological Counseling + Educational Guidance" booking and affiliate distribution platform for teenage families. It connects students and parents with trusted teachers/counselors, providing both AI emotional support and professional human counseling services.

### 1.3 Target Users
**Core Paying Users:** Parents.

**Service Recipients:** Teenage students.

**Supply Side:** Licensed teachers, psychological counselors, and elite university students (985/211/Top-tier universities).

**Promoters:** Parent affiliates, teacher affiliates, and partner institutions.

### 1.4 Problems to Solve
- **Trust Gap:** Parents find it difficult to verify the credibility of counselors/teachers.
- **Delayed Intervention:** Teen mental health issues are often discovered late and are expensive to treat.
- **Fragmented Services:** Educational platforms often lack psychological support.
- **Growth Barriers:** High customer acquisition costs and low viral "fission" efficiency.

## II. Product Goals (MVP)
- Launch a Minimum Viable Product (MVP) within 3 months.
- **Streamline the Loop:** Successfully execute the cycle of Booking → Service → Evaluation → Referral/Distribution → Settlement.
- **Model Validation:** Verify the viability of the parent-driven affiliate distribution model.

## III. Overall Architecture

### 3.1 Platform Interfaces
- **Admin Backend:** (Web-based)
- **Client Frontend:** (Mini-program)
  - Parent Interface (Core)
  - Teacher/Counselor Interface
  - Student Interface (Lightweight)

### 3.2 Core Modules
- User & Role Management System
- Teacher/Counselor Management
- Counseling & Booking System
- AI Psychological Dialogue (Companion)
- Distribution & Affiliate Management
- Finance & Withdrawals

## IV. Roles & Permissions

### 4.1 Role Definitions
- **Platform Administrator:** Full system control.
- **Teacher/Counselor:** Service provider.
- **Parent:** Primary account holder and payer.
- **Student:** End-user of the service.
- **Distributor:** Parents, teachers, or institutions earning referral commissions.

### 4.2 Permission Principles
- **Data Minimization:** Access only what is necessary.
- **Parental Consent:** Student privacy must be authorized by parents.
- **Tiered Visibility:** Counseling records are visible based on specific authorization levels.

## V. Functional Requirements (Detailed)

### 5.1 Admin Backend

#### 5.1.1 Teacher/Counselor Management
- Audit profiles (ID, qualifications, academic credentials).
- Identity type tagging.
- Expertise configuration.
- Service mode and price range management.
- Status control (Enable/Disable/Ban).

#### 5.1.2 Distribution Management
- Affiliate role configuration.
- Commission ratio configuration (≤ 2 levels).
- Promotional QR codes and poster generation.
- Referral order tracking.

#### 5.1.3 Orders & Finance
- Counseling order management.
- AI service subscription/usage orders.
- Profit-sharing rules.
- Withdrawal audit and approval.

### 5.2 Parent Interface (MVP Core)

#### 5.2.1 Student Management
- Create/Edit student profiles.
- Manage student data authorization.
- Switch between multiple students (for multi-child families).

#### 5.2.2 Counseling Services
- Teacher/Counselor directory.
- Intelligent recommendations (based on issue type/age).
- Booking and payment flow.
- View counseling summaries/records.

#### 5.2.3 Distribution Center
- Apply to become a distributor.
- Access promotional posters.
- Track referral orders and commission stats.
- Submit withdrawal requests.

### 5.3 Teacher/Counselor Interface

#### 5.3.1 Personal Homepage
- Bio, certification badges, expertise, and pricing.

#### 5.3.2 Counseling Management
- Schedule/Availability management.
- Booking confirmation.
- Fill out counseling session logs.
- View parent feedback.

#### 5.3.3 Earnings & Referrals
- Self-promotion tools.
- Affiliate earnings tracking.
- Withdrawal management.

### 5.4 Student Interface (Lightweight)
- AI psychological dialogue (Companion).
- Booking entry point.
- Personal records (Read-only).

## VI. AI Psychological Module (MVP)

### 6.1 Functional Positioning
- **Emotional Venting:** A safe space for students to talk.
- **Stress Assessment:** Basic evaluation of mental state.
- **Pre-screening:** Preliminary assessment before human counseling.

### 6.2 Constraints & Safety
- **Non-Medical:** Explicitly stated that it does not provide diagnosis or treatment.
- **Red Flag Alerts:** High-risk keywords trigger a prompt for human intervention.
- **Disclaimers:** Clear legal disclaimers regarding the nature of AI responses.

## VII. Business Process
1. Parent Registration
2. Create Student Profile
3. Select Teacher/Counselor
4. Book & Pay
5. Conduct Counseling Service
6. Evaluation & Re-purchase
7. Affiliate Referral (Fission)

## VIII. Business Model
- **Service Commission:** Platform takes 20%–40% per counseling session.
- **AI Services:** Pay-per-use or subscription-based models.
- **Institutional Partnerships:** Revenue sharing with schools or organizations.

## IX. Compliance & Risk Control
- **Non-Medical Status:** Clearly define the platform as educational/consultative, not medical.
- **Minor Protection:** Strict adherence to minor privacy laws.
- **Data Security:** Full encryption for sensitive conversation data.
- **Crisis Intervention:** Standardized workflows for handling emergency psychological situations.

## X. Milestones
- **Month 1:** MVP Design + Tech Stack Selection.
- **Month 2:** Development + Integration Testing.
- **Month 3:** Beta Testing + Small-scale Launch.
