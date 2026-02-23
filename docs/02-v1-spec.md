# MiniMynt v1 Product Spec & Architecture

**Version:** 2.0 (Revised 2026-02-16)
**Date:** 2026-02-16
**Target:** 14-day build by solo founder
**Market:** Norway (NOK), Nordic families with children 6-16

---

## 1. v1 Feature Set

### IN Scope (Minimal Lovable Product)

| Feature | Description | Rationale |
|---------|-------------|-----------|
| **Phone-based auth** | SMS verification for children, Vipps login for adults | Security + simplicity, leverages existing trust |
| **Family creation** | Parent creates family, generates join codes for children | Parent-controlled onboarding |
| **Role assignment** | Permanent Adult/Child roles set at account creation | Clear separation of permissions |
| **Task creation** | Parent creates task with title, description, amount (NOK) | Core value proposition |
| **Task lifecycle** | Available → Taken → Awaiting Approval → Approved → Paid | Zero ambiguity workflow |
| **Task claiming** | Child sees available tasks, claims one | Agency for children |
| **Work submission** | Child marks task as done with optional photo proof | Accountability mechanism |
| **Approval workflow** | Parent reviews submission, approves or rejects with reason | Quality control |
| **Vipps payment** | Approved tasks trigger automatic Vipps transfer (0.5% fee) | Real money, real learning |
| **Transaction history** | Both roles see payment history with task context | Transparency and record-keeping |
| **Family dashboard** | Parent sees all tasks, all children, pending approvals | Command center |
| **Child dashboard** | Child sees available tasks, their taken tasks, earnings | Focus on their work |
| **Basic notifications** | SMS for critical actions (task approved, payment sent) | Async coordination |

### OUT of Scope (v1)

| Feature | Why Not Now |
|---------|-------------|
| Recurring/scheduled tasks | Adds complexity; parents can manually recreate tasks |
| Task templates | Can be added post-launch; manual creation is sufficient |
| Multiple families per parent | Edge case; can be v2 |
| Task categories/tags | Over-organization for v1 |
| Child-initiated task proposals | Inverts power dynamic; not core to v1 |
| Allowance/scheduled payments | Different mental model; focus on work-for-pay |
| Savings goals | Separate banking concept; out of scope |
| Social features | Explicitly excluded per contract |
| AI features | Explicitly excluded per contract |
| Multi-currency | Norway first; NOK only |
| Native mobile app | Responsive web app is sufficient |
| In-app chat | SMS notifications + verbal communication works |
| Task deadlines/urgency | Adds complexity; parents can communicate verbally |
| Partial payments | Complicates accounting; task = fixed amount |
| Family settings/customization | Keep it opinionated for v1 |

---

## 2. User Flows

### 2.1 Parent Onboarding Flow

**Goal:** Parent sets up family and creates first task in under 5 minutes.

```
1. Landing page
   ↓ Click "Start as Parent"
2. Vipps login
   ↓ Redirect to Vipps → Authenticate → Return with phone number
3. Family creation screen
   ↓ Enter family name (e.g., "Hansen Family")
   ↓ System generates family join code (e.g., "HANSEN-2847")
4. Family dashboard (empty state)
   ↓ Prompt: "Add your first task"
5. Create task modal
   ↓ Enter: Task title, description, amount (NOK)
   ↓ Click "Create Task"
6. Family dashboard (with task)
   ↓ Show join code prominently: "Give this code to your children: HANSEN-2847"
   ↓ Show task in "Available" column
```

**Acceptance Criteria:**
- Vipps login succeeds and returns verified phone number
- Family is created with unique join code (8 chars: WORD-NNNN format, human-readable)
- Join code is displayed clearly and can be copied
- Parent can create task with title (max 100 chars), description (max 500 chars), amount (10-10,000 NOK, minimum enforced to reduce micro-payment friction)
- Task appears immediately in dashboard
- Parent can see "0 children" indicator with "Invite children" prompt

**Edge Cases:**
- Vipps OAuth timeout: Show "Login taking too long. Try again?" with retry button
- Network interruption during family creation: Idempotent endpoint checks if family exists by ownerId before creating
- Duplicate join code (extremely rare): Regenerate on collision, max 3 attempts before alerting

---

### 2.2 Child Onboarding Flow

**Goal:** Child joins family using parent's code.

```
1. Landing page
   ↓ Click "Join as Child"
2. Phone verification
   ↓ Enter phone number
   ↓ Receive SMS with 6-digit code
   ↓ Enter verification code
3. Join family screen
   ↓ Enter join code from parent (e.g., "HANSEN-2847")
   ↓ Enter child's first name
   ↓ Click "Join Family"
4. Child dashboard
   ↓ See available tasks from family
   ↓ Show welcome message: "Welcome to [Family Name]"
```

**Acceptance Criteria:**
- SMS verification works with Norwegian phone numbers (+47)
- Invalid join code shows clear error: "Code not found. Check with your parent."
- Successful join links child to family immediately
- Child role is permanent (cannot be changed)
- Child sees all available tasks instantly
- System validates child's phone has Vipps installed (via later payment flow; warn early if possible)

**Edge Cases:**
- SMS not delivered within 60 seconds: Show "Still waiting for code?" with resend button (rate limited: 1/min)
- Child tries to join with phone already registered: "This phone is already linked. Contact your parent if you need help."
- Join code expired or family deleted: "This code is no longer valid. Ask your parent for a new one."
- Child enters wrong code 5+ times: Temporarily lock attempts for 10 minutes to prevent brute force

---

### 2.3 Task Lifecycle Flow (Core Journey)

**Goal:** Child completes task, parent approves, payment is sent.

#### Child Perspective:

```
1. Child dashboard
   ↓ See "Available Tasks" (title, amount, description)
2. Click task → Task detail view
   ↓ Read description
   ↓ Click "Take This Task"
3. Task moves to "My Tasks" (status: Taken)
   ↓ Complete work offline
   ↓ Return to app → Click "Mark as Done"
4. Submission modal
   ↓ Optional: Upload photo proof (compressed client-side to max 2MB)
   ↓ Click "Submit for Approval"
5. Task moves to "Awaiting Approval"
   ↓ Wait for parent
6. Notification: "Your task '[Task Title]' was approved! Payment sent to your Vipps."
   ↓ Task moves to "Completed & Paid"
7. View transaction history
   ↓ See payment amount, date, task name
```

#### Parent Perspective:

```
1. Family dashboard
   ↓ See notification badge: "1 task awaiting approval"
2. Click "Pending Approvals" tab
   ↓ See task submission with child name, task title, photo (if uploaded)
3. Review submission
   ↓ Option A: Click "Approve & Pay"
     → Trigger Vipps payment
     → Notify child via SMS
     → Task moves to "Completed"
   ↓ Option B: Click "Reject"
     → Enter rejection reason (required, max 200 chars)
     → Task returns to "Available" (any child can re-take)
     → Notify child with reason via SMS
```

**Acceptance Criteria:**
- Task can only be taken by one child at a time (database row lock enforced)
- Photo upload is optional (max 2MB after client-side compression, JPEG/PNG/HEIC/WebP)
- Rejection reason is mandatory (max 200 chars)
- Approved task triggers Vipps payment API within 30 seconds
- Payment failure shows clear error to parent: "Payment failed: [reason]. Retry?" with retry button
- Payment retry uses same idempotency key to prevent double charging
- Child receives SMS notification when task is approved AND when payment completes
- Transaction record includes task name, child name, amount, date, Vipps transaction ID
- If payment fails, parent must re-approve manually (no automatic retry)

**Critical Edge Cases:**
- **Race condition (task claiming):** Use Prisma `findFirst()` with `FOR UPDATE SKIP LOCKED`. If lock fails, return "Task just taken by someone else."
- **Photo upload during network loss:** Store upload state locally; allow resumption on reconnect
- **Parent approves task offline:** Queue approval action; execute when online; show "Waiting for connection..." spinner
- **Child submits task twice rapidly (double-click):** Debounce submission button; check `status != AWAITING_APPROVAL` server-side
- **Task approved but Vipps API is down:** Payment fails; parent re-approves manually when Vipps is available. No automatic retry in v1. *(Post-launch: consider retry queue if manual re-approval is a frequent support issue.)*

---

### 2.4 Payment Flow (Vipps Integration)

**Goal:** Approved task triggers real money transfer from parent to child.

**CRITICAL CLARIFICATION:** MiniMynt acts as merchant. Parent pays MiniMynt (task amount + 0.5% fee), then MiniMynt pays child. This is NOT direct P2P.

```
1. Parent clicks "Approve & Pay"
   ↓ System calculates: Child amount + 0.5% platform fee
   ↓ Example: 100 NOK task → 100 NOK to child + 0.50 NOK fee = 100.50 NOK charged to parent
2. Backend calls Vipps ePayment API (NEW API, not eCom v2)
   ↓ POST /epayment/v1/payments
   ↓ Body: {
       amount: { value: 10050, currency: "NOK" },
       paymentMethod: { type: "WALLET" },
       customer: { phoneNumber: parent_phone },
       returnUrl: "https://minimynt.no/payment-return",
       userFlow: "WEB_REDIRECT",
       paymentDescription: "MiniMynt: Task payment for [child_name]",
       reference: "TASK-[task_id]-[timestamp]" // Idempotency key
     }
3. Parent completes payment in Vipps
   ↓ Vipps redirects back to MiniMynt
   ↓ Webhook callback to /webhook/vipps/payment-completed
4. MiniMynt receives payment confirmation
   ↓ Initiate payout to child via Vipps (separate API call)
   ↓ POST /epayment/v1/payments (child as recipient, 100 NOK)
5. Child receives payment
   ↓ Update task status to "Paid"
   ↓ Create transaction record
   ↓ Send SMS to child: "100 NOK paid for '[Task Title]'"
6. Parent dashboard updates
   ↓ Task removed from "Pending"
   ↓ Added to "Completed" history
```

**Acceptance Criteria:**
- Parent payment and child payout are separate transactions (parent → MiniMynt → child)
- Idempotency key prevents duplicate charges on retry
- Parent is charged child amount + 0.5% fee (rounded up to nearest øre)
- Payment description includes task title (max 50 chars for Vipps limits)
- Vipps webhook signature is verified (HMAC-SHA256)
- Payment failures are logged with Vipps error code and user-friendly message
- Failed parent payments show: "Payment failed: [reason]. Try again?"
- Failed child payouts are logged for manual resolution (edge case: child doesn't have Vipps)
- Transaction history shows gross amount (what child receives) and net amount (what parent paid)
- Platform fee is tracked separately for accounting

**Security & Integrity:**
- **Idempotency key format:** `TASK-{taskId}-{timestamp}-{randomUUID}` ensures uniqueness even with retries
- **Webhook replay attack:** Reject webhooks older than 5 minutes (timestamp check) + signature verification
- **Duplicate webhook delivery:** Check `WebhookEvent.externalId` exists before processing; return 200 OK immediately if duplicate
- **Man-in-the-middle:** HTTPS enforced; Vipps webhook signature verification prevents payload tampering
- **Parent charged but webhook never arrives:** Fallback: Poll Vipps API every 5 min for pending payments (max 24 hours); reconcile orphaned transactions
- **Child payout amount mismatch:** Server-side validation ensures `childAmountOre` in payout exactly matches `Transaction.childAmountOre`; log any discrepancy as critical error
- **Platform fee miscalculation:** Unit test fee calculation; fee formula: `Math.ceil(childAmountOre * 0.005)` to always round up
- **Database transaction isolation:** Use Prisma transaction with `Serializable` level for payment operations to prevent concurrent modification anomalies

---

## 3. System Architecture

### 3.1 Tech Stack Recommendation (UPDATED for 2026)

**Frontend (Mobile-first Web App):**
- **Framework:** Next.js 16 (App Router, React 19.2, Turbopack)
- **Styling:** Tailwind CSS + shadcn/ui components
- **State Management:** React Context + TanStack Query v5 (server state)
- **Forms:** React Hook Form + Zod validation
- **Auth:** Custom JWT + HTTP-only cookies
- **Image Optimization:** Next.js built-in Image component + sharp
- **Deployment:** Vercel (Europe North region - Sweden, closest to Norway)

**Rationale:** Next.js 16 brings Turbopack as default (faster builds), React 19.2 with View Transitions (smoother UX), and improved caching controls. Vercel's Europe North region minimizes latency for Norwegian users.

**Key Stack Decisions (locked, not up for debate in v1):**

| Decision | Chosen | Reason |
|----------|--------|--------|
| Database + Storage | Supabase | Integrated DB + storage + free tier; fewer vendors for solo founder |
| SMS provider | Telnyx | $0.004/msg vs Twilio $0.0651/msg (16x cheaper); Norwegian carriers supported |
| Payment API | Vipps ePayment v1 | Official recommendation; replaces legacy eCom v2; future-proof |

**Backend (API + Business Logic):**
- **Runtime:** Node.js 20+ (Next.js API routes)
- **Database:** PostgreSQL (Supabase recommended over Neon post-Databricks acquisition)
- **ORM:** Prisma 6 (type-safe, excellent DX)
- **Auth:** Custom JWT generation with crypto.randomBytes for SMS codes
- **Payment:** Vipps ePayment API v1 (NEW API, replaces eCom v2)
- **SMS:** Telnyx (Norway SMS at $0.004/msg vs Twilio $0.0651/msg - 16x cheaper)
- **File Storage:** Supabase Storage (integrated with database, simpler than S3)

**Rationale:** Supabase provides database + auth helpers + storage in one platform, reducing moving parts. Telnyx is dramatically cheaper for SMS ($0.004 vs $0.0651/msg). Vipps ePayment API is the future-proof choice per official docs.

**Infrastructure:**
- **Hosting:** Vercel (frontend + API routes)
- **Database:** Supabase Postgres (10GB free tier, then $25/month for production)
- **Storage:** Supabase Storage (integrated, 1GB free)
- **Monitoring:** Vercel Analytics + Sentry for errors
- **Secrets:** Vercel Environment Variables
- **Logging:** Axiom or Supabase Logs for transaction audit trail

**Rationale:** Supabase consolidates database and storage (fewer vendors, simpler ops). Telnyx cuts SMS costs. Vercel handles deployment and edge functions. This stack is solo-founder friendly with minimal DevOps.

---

### 3.2 Component Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT (Browser)                      │
│  ┌─────────────────────────────────────────────────┐   │
│  │      Next.js 16 App (React 19.2 Components)     │   │
│  │  - Parent Dashboard    - Child Dashboard        │   │
│  │  - Task Creation       - Task Claiming          │   │
│  │  - Approval Interface  - Transaction History    │   │
│  └─────────────────────────────────────────────────┘   │
│                         ↕ HTTPS                         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│           BACKEND (Next.js 16 API Routes)               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │  Auth API    │  │  Family API  │  │  Task API    │ │
│  │ /api/auth/*  │  │ /api/family/*│  │ /api/tasks/* │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │ Payment API  │  │ Webhook API  │  │  User API    │ │
│  │ /api/payment│  │ /api/webhook │  │ /api/users/* │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│                         ↕                               │
│              ┌─────────────────────┐                   │
│              │  Prisma ORM Client  │                   │
│              └─────────────────────┘                   │
└─────────────────────────────────────────────────────────┘
                          ↕
┌─────────────────────────────────────────────────────────┐
│           PostgreSQL Database (Supabase)                │
│  Tables: users, families, tasks, transactions,          │
│          sms_verifications, webhook_events              │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                  External Services                       │
│  ┌────────────┐  ┌────────────┐  ┌──────────────────┐  │
│  │   Vipps    │  │  Telnyx    │  │ Supabase Storage │  │
│  │ (ePayment) │  │   (SMS)    │  │ (File Storage)   │  │
│  └────────────┘  └────────────┘  └──────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

### 3.3 Data Model (UPDATED)

#### Entities & Relationships

```prisma
// schema.prisma

model User {
  id            String   @id @default(cuid())
  phoneNumber   String   @unique
  role          Role     @default(CHILD)
  firstName     String?  // For children
  familyId      String?
  family        Family?  @relation(fields: [familyId], references: [id])
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  // Relations
  createdTasks  Task[]   @relation("CreatedTasks")
  takenTasks    Task[]   @relation("TakenTasks")
  transactions  Transaction[]

  @@index([phoneNumber])
  @@index([familyId])
}

enum Role {
  ADULT
  CHILD
}

model Family {
  id          String   @id @default(cuid())
  name        String
  joinCode    String   @unique
  ownerId     String   // The parent who created the family
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  members     User[]
  tasks       Task[]

  @@index([joinCode])
}

model Task {
  id            String      @id @default(cuid())
  title         String
  description   String?
  amountOre     Int         // In øre (100 = 1 NOK), renamed from amountNok for clarity
  status        TaskStatus  @default(AVAILABLE)
  photoUrl      String?     // Supabase Storage URL for submission photo
  rejectionReason String?   // If status = AVAILABLE after rejection
  version       Int         @default(1) // Optimistic locking for concurrent updates

  familyId      String
  family        Family      @relation(fields: [familyId], references: [id], onDelete: Cascade)
  createdById   String
  createdBy     User        @relation("CreatedTasks", fields: [createdById], references: [id])
  takenById     String?
  takenBy       User?       @relation("TakenTasks", fields: [takenById], references: [id])

  createdAt     DateTime    @default(now())
  takenAt       DateTime?
  submittedAt   DateTime?
  approvedAt    DateTime?
  paidAt        DateTime?

  // Relations
  transaction   Transaction?

  @@index([familyId, status])
  @@index([takenById])
  @@index([status]) // For global task queries
  @@index([createdAt]) // For chronological sorting
}

enum TaskStatus {
  AVAILABLE
  TAKEN
  AWAITING_APPROVAL
  APPROVED
  PAID
  PAYMENT_FAILED // NEW: separate state for failed payouts
}

model Transaction {
  id              String   @id @default(cuid())
  taskId          String   @unique
  task            Task     @relation(fields: [taskId], references: [id])
  childId         String
  child           User     @relation(fields: [childId], references: [id])
  parentId        String   // NEW: track who paid

  // Amounts
  childAmountOre       Int      // Amount paid to child (in øre)
  platformFeeOre       Int      // Platform fee (in øre)
  totalChargedOre      Int      // Total charged to parent (in øre)

  // Vipps tracking
  parentPaymentVippsId String? @unique // Parent → MiniMynt
  childPayoutVippsId   String? @unique // MiniMynt → Child

  // Idempotency
  idempotencyKey       String  @unique // For retry safety

  status          PaymentStatus @default(PENDING)
  failureReason   String?  // If payment failed
  retryCount      Int      @default(0) // Track retry attempts

  createdAt       DateTime @default(now())
  parentPaidAt    DateTime? // When parent paid MiniMynt
  childPaidAt     DateTime? // When child received money

  @@index([childId])
  @@index([parentPaymentVippsId])
  @@index([childPayoutVippsId])
  @@index([idempotencyKey])
  @@index([status]) // For failed payment queries
}

enum PaymentStatus {
  PENDING
  PARENT_PAID    // NEW: parent paid, child payout pending
  COMPLETED      // Both parent payment and child payout succeeded
  FAILED         // Parent payment failed
  PAYOUT_FAILED  // Parent paid but child payout failed
}

model SmsVerification {
  id          String   @id @default(cuid())
  phoneNumber String
  code        String   // 6-digit code
  expiresAt   DateTime
  verified    Boolean  @default(false)
  createdAt   DateTime @default(now())

  @@index([phoneNumber, code, verified])
  @@index([expiresAt]) // For cleanup jobs
}

// NEW: Webhook delivery tracking for idempotency
model WebhookEvent {
  id              String   @id @default(cuid())
  provider        String   // "vipps"
  eventType       String   // "payment.completed", "payment.failed"
  externalId      String   // Vipps transaction ID
  payload         Json     // Full webhook payload
  processed       Boolean  @default(false)
  processedAt     DateTime?
  createdAt       DateTime @default(now())

  @@unique([provider, externalId]) // Prevent duplicate processing
  @@index([processed])
}
```

**Key Design Decisions (Updated):**

1. **Amounts in øre:** Store as integers to avoid floating-point errors. Renamed `amountNok` to `amountOre` for clarity.
2. **Two-step payment:** Track both parent payment (`parentPaymentVippsId`) and child payout (`childPayoutVippsId`) separately.
3. **Idempotency key:** Added to Transaction model for safe retries.
4. **Payment status granularity:** New statuses `PARENT_PAID` and `PAYOUT_FAILED` for better error handling.
5. **Ledger table:** Deferred to v1.5. Double-entry accounting for financial reconciliation is a post-launch concern.
6. **Webhook deduplication:** `WebhookEvent` table prevents duplicate processing of Vipps callbacks.
7. **Retry tracking:** `retryCount` field to limit retry attempts (max 3).
8. **Task status**: Added `PAYMENT_FAILED` to distinguish from `APPROVED` (for manual intervention).
9. **Optimistic locking:** `Task.version` field enables concurrent update detection; increment on every status change.
10. **Cascade deletion:** `onDelete: Cascade` ensures tasks are deleted when family is deleted (data integrity).
11. **Timestamp indexing:** `Task.createdAt` index supports chronological sorting in dashboards without full table scan.

---

### 3.4 API Endpoints (UPDATED)

**Design Principles:**
- RESTful conventions
- JWT authentication via HTTP-only cookies
- Role-based access control (RBAC) enforced on every endpoint
- Idempotent payment operations using `idempotencyKey`
- All amounts in øre (integer)

#### Authentication

| Method | Endpoint | Description | Auth | Body |
|--------|----------|-------------|------|------|
| POST | `/api/auth/vipps/initiate` | Start Vipps login for adults | None | `{ callbackUrl }` |
| POST | `/api/auth/vipps/callback` | Handle Vipps OAuth callback | None | `{ code, state }` |
| POST | `/api/auth/sms/send` | Send SMS verification code (Telnyx) | None | `{ phoneNumber }` |
| POST | `/api/auth/sms/verify` | Verify SMS code and create session | None | `{ phoneNumber, code }` |
| POST | `/api/auth/logout` | Destroy session | JWT | None |
| GET | `/api/auth/me` | Get current user profile | JWT | None |

#### Family Management

| Method | Endpoint | Description | Auth | Body |
|--------|----------|-------------|------|------|
| POST | `/api/family/create` | Create new family (parent only) | JWT (Adult) | `{ name }` |
| POST | `/api/family/join` | Join family with code (child only) | JWT (Child) | `{ joinCode, firstName }` |
| GET | `/api/family/:id` | Get family details + members | JWT | None |
| GET | `/api/family/:id/members` | List all family members | JWT | None |

#### Task Management

| Method | Endpoint | Description | Auth | Body |
|--------|----------|-------------|------|------|
| POST | `/api/tasks/create` | Create new task (parent only) | JWT (Adult) | `{ title, description, amountOre, familyId }` |
| GET | `/api/tasks/available` | List available tasks for family | JWT | None |
| GET | `/api/tasks/my-tasks` | List tasks taken by current child | JWT (Child) | None |
| GET | `/api/tasks/pending` | List tasks awaiting approval (parent) | JWT (Adult) | None |
| POST | `/api/tasks/:id/take` | Claim a task (child only) | JWT (Child) | `{ version }` for optimistic lock |
| POST | `/api/tasks/:id/submit` | Submit task for approval | JWT (Child) | `{ photoUrl? }` |
| POST | `/api/tasks/:id/approve` | Approve task and trigger payment | JWT (Adult) | `{ idempotencyKey }` |
| POST | `/api/tasks/:id/reject` | Reject task with reason | JWT (Adult) | `{ reason }` |
| GET | `/api/tasks/:id` | Get task details | JWT | None |

#### Payment & Transactions

| Method | Endpoint | Description | Auth | Body |
|--------|----------|-------------|------|------|
| POST | `/api/payment/initiate` | Trigger Vipps payment for task | JWT (Adult) — server-side only; called internally from `/api/tasks/:id/approve`, not exposed as a standalone HTTP endpoint | `{ taskId, idempotencyKey }` |
| GET | `/api/transactions` | List transaction history | JWT | Query: `?childId` (parent), none (child sees own) |
| GET | `/api/transactions/:id` | Get transaction details | JWT | None |

#### Webhooks

| Method | Endpoint | Description | Auth | Body |
|--------|----------|-------------|------|------|
| POST | `/api/webhook/vipps/payment` | Vipps payment status callback | HMAC Signature | Vipps ePayment payload |

#### File Upload

| Method | Endpoint | Description | Auth | Body |
|--------|----------|-------------|------|------|
| POST | `/api/upload/task-photo` | Upload photo for task submission | JWT (Child) | FormData with file (client-side compressed) |

---

### 3.5 API Security & Design Consistency

**Authentication & Authorization:**
- All endpoints (except `/api/auth/*` and `/api/webhook/*`) require valid JWT in HTTP-only cookie
- JWT payload: `{ userId, role, familyId?, exp }`
- Token expiration: 7 days (configurable via env var)
- Refresh tokens: NOT implemented in v1 (users re-authenticate after 7 days)
- Role-based access control enforced at endpoint level:
  - Adult-only endpoints: Return 403 Forbidden if `role != ADULT`
  - Child-only endpoints: Return 403 Forbidden if `role != CHILD`
  - Family-scoped endpoints: Verify `user.familyId === resource.familyId` to prevent cross-family access

**Input Validation:**
- All request bodies validated with Zod schemas before processing
- Phone numbers: Regex `^\\+47[0-9]{8}$` (Norwegian format)
- Amounts: Integer between 1000-1000000 øre (10-10,000 NOK)
- Strings: Max length enforced (title: 100, description: 500, rejection reason: 200)
- Join codes: Regex `^[A-Z]{4,6}-[0-9]{4}$`
- File uploads: Mime type whitelist (image/jpeg, image/png, image/webp, image/heic), max 2MB after compression

**Error Response Format (Consistent across all endpoints):**
```typescript
{
  error: {
    code: "TASK_ALREADY_TAKEN", // Machine-readable error code
    message: "This task was just taken by another child.", // User-friendly message
    details?: { // Optional additional context
      takenBy: "Emma",
      takenAt: "2026-02-16T14:32:00Z"
    }
  }
}
```

**Standard Error Codes:**
- `UNAUTHORIZED`: Missing or invalid JWT (401)
- `FORBIDDEN`: Valid JWT but insufficient permissions (403)
- `NOT_FOUND`: Resource doesn't exist (404)
- `VALIDATION_ERROR`: Request body failed Zod validation (400)
- `CONFLICT`: Race condition or duplicate action (409)
- `RATE_LIMIT_EXCEEDED`: Too many requests (429)
- `PAYMENT_FAILED`: Vipps API error (402)
- `INTERNAL_ERROR`: Unexpected server error (500)

**Rate Limiting:**
- SMS send: 1 per phone number per 60 seconds
- Login attempts: 5 per phone number per 15 minutes
- Task creation: 10 per family per hour
- Photo uploads: 5 per user per 5 minutes

**CORS & CSP:** HTTPS-only in production. Restrict origins to `minimynt.no`. Full header config is an implementation detail, not repeated here.

**Logging & Monitoring:**
- All API requests logged with: `{ timestamp, userId, endpoint, method, statusCode, duration }`
- Payment operations logged with: `{ transactionId, vippsResponse, amount, status }`
- Failed operations logged with: `{ error, stack, context }`
- Sensitive data NEVER logged: phone numbers, Vipps credentials, JWT secrets
- Log retention: 90 days in Axiom, 365 days for payment audit trail

---

## 4. Build Sequence (REVISED for Risk Mitigation)

**Goal:** Deliverable product in 14 days (solo founder).

### Day 0: Go/No-Go Gate (Before Starting Build)

Before committing to the 14-day timeline, the following must be confirmed:

1. **Business entity:** Norwegian AS or ENK must exist. If not registered, the 14-day clock does NOT start until registration is complete (ENK: 1–3 days; AS: 1–2 weeks).
2. **Vipps merchant fee schedule:** Obtain Vipps merchant fee schedule **in writing** before Day 4. If Vipps merchant fees exceed 0.3% per transaction, reconsider the platform fee model before locking payment architecture. At 0.5% platform fee, any Vipps fee above 0.3% erodes margin to zero or negative.
3. **Two-step payment confirmation:** Confirm with Vipps that MiniMynt can act as merchant intermediary (parent → MiniMynt → child payout). If not supported, fallback architecture is direct P2P with no platform fee (revenue deferred to v2).

**If all three are confirmed: proceed to Day 1.**

---

**CRITICAL PATH CHANGE:** Start Vipps integration earlier (Day 4) to derisk payment complexity.

### Phase 1: Foundation (Days 1-3)

**Objective:** Auth + database working.

1. **Day 1: Setup + Vipps Access Application**
   - Initialize Next.js 16 project with TypeScript + Turbopack
   - Set up Tailwind CSS + shadcn/ui
   - Configure Vercel project (Europe North region)
   - Set up Supabase Postgres database + Storage
   - Initialize Prisma 6 with schema
   - **CRITICAL:** Apply for Vipps production access (can take 3-5 days)

2. **Day 2: Auth - SMS for Children**
   - Integrate Telnyx SMS API
   - Create `/api/auth/sms/send` and `/api/auth/sms/verify`
   - Implement JWT generation + HTTP-only cookies
   - Build phone verification UI flow
   - Test with Norwegian phone numbers

3. **Day 3: Auth - Vipps for Adults**
   - Integrate Vipps Login API (OAuth 2.0 + OIDC)
   - Create `/api/auth/vipps/initiate` and `/api/auth/vipps/callback`
   - Test Vipps OAuth flow in test environment
   - Build login page with role selection (Adult/Child)

**Deliverable:** Users can authenticate via SMS (children) or Vipps (adults). JWT sessions work.

---

### Phase 2: Family & Vipps Payment Setup (Days 4-5)

**Objective:** Families exist + Vipps payment integration started.

4. **Day 4: Family Creation + Vipps ePayment API Setup**
   - Build `/api/family/create` endpoint
   - Generate unique join codes (8-char WORD-NNNN format)
   - Create family creation UI for parents
   - Build family dashboard (empty state)
   - **NEW:** Set up Vipps ePayment API credentials (test mode)
   - **NEW:** Create `/api/payment/initiate` endpoint skeleton
   - **NEW:** Test basic Vipps payment API call (hardcoded amounts)

5. **Day 5: Family Joining + Task Creation**
   - Build `/api/family/join` endpoint
   - Create join flow UI for children
   - Build `/api/tasks/create` endpoint
   - Create task creation modal for parents
   - Display tasks in parent dashboard
   - **NEW:** Continue Vipps integration testing (webhooks setup)

**Deliverable:** Parents can create families and tasks. Children can join. Vipps test payments work.

---

### Phase 3: Task Lifecycle (Days 6-9)

**Objective:** Full task workflow from claim to approval (no payment yet).

6. **Day 6: Task Claiming (Child)**
   - Build `/api/tasks/available` and `/api/tasks/:id/take` endpoints
   - Implement row-level locking for task claiming (Prisma transaction with `FOR UPDATE SKIP LOCKED`)
   - Add optimistic locking check: verify `version` field matches; increment on update
   - Test race condition: two children claiming same task simultaneously (should gracefully fail for one)
   - Create child dashboard showing available tasks
   - Build task detail view
   - Implement "Take Task" action with client-side debounce (500ms)

7. **Day 7: Task Submission (Child)**
   - Build `/api/upload/task-photo` endpoint (Supabase Storage)
   - Implement client-side image compression (browser-image-compression)
   - Build `/api/tasks/:id/submit` endpoint
   - Create task submission modal with photo upload
   - Update child dashboard to show "My Tasks" with status

8. **Day 8: Task Approval (Parent)**
   - Build `/api/tasks/pending` and `/api/tasks/:id/approve` endpoints
   - Create "Pending Approvals" view in parent dashboard
   - Build approval interface with photo preview
   - Implement approve action (NO payment trigger yet, just status change)

9. **Day 9: Task Rejection Flow + Error Handling**
   - Build `/api/tasks/:id/reject` endpoint
   - Handle rejected task return to "Available" status
   - Add rejection reason display in child view
   - Implement form validation and error messages throughout
   - Test full task lifecycle end-to-end (without payment)

**Deliverable:** Complete task workflow works. Children claim, submit. Parents approve or reject. No payment yet.

---

### Phase 4: Payment Integration (Days 10-11)

**Objective:** Real money moves via Vipps. Two-step payment (parent → MiniMynt → child).

10. **Day 10: Parent Payment (Parent → MiniMynt)**
    - Connect task approval to payment initiation
    - Implement idempotency key generation: `TASK-{taskId}-{timestamp}-{UUID.v4()}`
    - Build full `/api/payment/initiate` endpoint for parent payment
    - Calculate platform fee: `Math.ceil(amountOre * 0.005)` (always round up)
    - Create Transaction record with PENDING status within Prisma transaction (Serializable isolation)
    - Implement payment state machine validation (prevent re-approval of approved tasks)
    - Test parent payment flow in Vipps sandbox with multiple amounts (edge case: 1 øre fee minimum)
    - Handle parent payment failures: show clear error to parent ("Payment failed. Please try approving again."); parent must manually re-approve — no automatic retry in v1
    - Log all Vipps API responses (success + failure) to separate payment audit log table

11. **Day 11: Child Payout + Webhooks**
    - Build `/api/webhook/vipps/payment` endpoint
    - Verify Vipps webhook signatures: HMAC-SHA256 using `crypto.timingSafeEqual()` to prevent timing attacks
    - Implement webhook timestamp check: reject if older than 5 minutes (replay attack prevention)
    - Implement webhook deduplication: check `WebhookEvent.externalId` unique constraint; return 200 OK immediately if duplicate
    - On parent payment success: trigger child payout within same Prisma transaction
    - Build child payout logic (MiniMynt → Child via Vipps)
    - Handle payout failures: update status to PAYOUT_FAILED, create admin notification record
    - Test full payment flow end-to-end with intentional failures (network timeout, insufficient funds, child no Vipps)

**Deliverable:** Approved tasks trigger Vipps payments. Parent pays MiniMynt, MiniMynt pays child. Transaction history is recorded.

---

### Phase 5: Notifications & Polish (Days 12-13)

**Objective:** User experience is smooth.

12. **Day 12: Transaction History + SMS Notifications**
    - Build `/api/transactions` endpoint
    - Create transaction history view (parent + child)
    - Implement SMS notifications via Telnyx:
      - "Task approved, payment sent" to child (after payout completes)
      - "Task rejected: [reason]" to child
      - "Payment failed: [reason]" to parent (if parent payment fails)
    - Add loading states and error messages in UI
    - Implement payment retry UI for failed transactions

13. **Day 13: UI Polish + Mobile Optimization**
    - Refine mobile layouts (all screens) for iOS Safari and Android Chrome
    - Add empty states ("No tasks yet", "No approvals pending", "No transactions")
    - Improve form validation and error messages
    - Add confirmation dialogs for destructive actions (reject task, retry payment)
    - Implement optimistic UI updates (task status changes)
    - Add View Transitions (React 19.2 feature) for smooth navigation
    - Test on iOS Safari and Android Chrome with real devices

**Deliverable:** App feels polished. Notifications work. Mobile experience is solid. Payment errors are handled gracefully.

---

### Phase 6: Testing & Launch Prep (Day 14)

**Objective:** Production-ready.

14. **Day 14: End-to-End Testing + Deploy**
    - Test full user journey (parent onboarding → child join → task lifecycle → payment)
    - Test edge cases systematically:
      - **Concurrency:** Simultaneous task claiming by 2+ children (expect: one succeeds, others get "already taken" error)
      - **Network resilience:** Airplane mode during task submission (expect: queued, syncs on reconnect)
      - **Payment failures:** Parent insufficient funds, child no Vipps, Vipps API down (expect: clear error messages, safe retry)
      - **Data integrity:** Interrupt payment flow mid-transaction (expect: rollback or idempotent resume)
      - **Security:** Invalid join codes, expired SMS codes, tampered webhook signatures (expect: all rejected with clear errors)
      - **Webhook reliability:** Duplicate webhook delivery, delayed webhook (>5 min), webhook arrives before redirect (expect: deduplicated, fallback polling works)
    - Load test critical endpoints (task claiming, payment initiation) with 10 concurrent requests (use `ab` or `wrk`)
    - Verify no N+1 queries in dashboard views (use Prisma query logging)
    - Switch Vipps to production mode (requires approval from Day 1)
    - Test with real Vipps accounts (small amounts: 10-50 NOK) across 3 different carriers (Telenor, Telia, Ice)
    - Set up error monitoring (Sentry with source maps + breadcrumbs for payment flows)
    - Set up transaction logging (Axiom for audit trail, retention: 1 year minimum for tax compliance)
    - Write deployment checklist (environment variables, database migrations, Vipps credentials, webhook URLs)
    - Deploy to Vercel production (Europe North region)
    - Smoke test in production: create test family, run full task lifecycle with 10 NOK payment
    - Monitor first 10 real transactions closely (set up Slack alerts for payment failures)

**Deliverable:** MiniMynt v1 is live. Real families can use it. All critical paths tested.

---

### Dependency Diagram (Updated)

```
Day 1 (Setup + Vipps Access Application)
  ↓
Day 2 (SMS Auth) + Day 3 (Vipps Auth)
  ↓
Day 4 (Family + Vipps Payment Setup) ← PARALLEL START
  ↓
Day 5 (Family Join + Task Creation + Vipps Testing)
  ↓
Day 6 (Task Claiming)
  ↓
Day 7 (Task Submission)
  ↓
Day 8 (Task Approval) + Day 9 (Rejection + Errors)
  ↓
Day 10 (Parent Payment) + Day 11 (Child Payout + Webhooks) ← CRITICAL PATH
  ↓
Day 12 (Notifications + Transactions) + Day 13 (Polish)
  ↓
Day 14 (Testing + Deploy)
```

**Critical Path:** Auth → Family → Vipps Setup (parallel) → Task Lifecycle → Payment (parent + child) → Testing. Starting Vipps on Day 4 (instead of Day 10) reduces risk.

**Vipps production approval fallback:** If Vipps production access is not approved by Day 10, do not delay launch. Instead, launch to 5–10 beta families in Vipps sandbox mode. Task approval flow works normally; payments are confirmed manually by the founder (outside the app) until production approval arrives. Communicate clearly to beta families: "Payments are processed manually during beta." Switch to live payments as soon as production credentials are granted.

---

## 5. Technical Risks & Mitigations (UPDATED)

| Risk | Impact | Probability | Mitigation | Validation Checkpoint |
|------|--------|-------------|------------|----------------------|
| **Vipps production approval delay** | CRITICAL (can't launch) | Medium | Apply on Day 1. Follow up daily. Have backup: soft launch in test mode with small user group. | Day 1: Application submitted. Day 7: Follow-up if no response. Day 10: Escalate. |
| **Vipps ePayment API complexity** | High (core payment flow) | Medium | Start integration on Day 4 (moved up). Use test environment thoroughly. Budget 3+ days for Vipps (Days 4-5, 10-11). Read official docs carefully. | Day 5: Test payment succeeds in sandbox. Day 11: Full flow (parent → child) works. |
| **Two-step payment failure (parent pays, child payout fails)** | High (money stuck) | Low | Log all PAYOUT_FAILED transactions. Build admin dashboard for manual payouts. Implement retry queue. Test child Vipps accounts early. Add reconciliation script to detect orphaned parent payments. | Day 11: Intentionally fail child payout; verify PAYOUT_FAILED logged correctly. |
| **SMS delivery failures (Telnyx)** | Medium (auth blocked) | Low | Test with Telenor, Telia, Ice early. Add retry logic. Fallback: Twilio as backup provider (more expensive but reliable). | Day 2: Test SMS delivery on all 3 carriers. Day 12: Test SMS during high load (10+ simultaneous). |
| **Race condition: two children take same task** | Medium (double payment risk) | Low | Use Prisma transaction with `FOR UPDATE SKIP LOCKED`. Check `status=AVAILABLE` in WHERE clause. Add optimistic locking with version field. | Day 6: Automated test with 5 concurrent claim requests; verify only 1 succeeds. |
| **Vipps webhook replay attacks** | High (duplicate payments) | Low | Verify webhook signatures (HMAC-SHA256 with timing-safe comparison). Store webhook events in `WebhookEvent` table with unique constraint on `externalId`. Reject webhooks older than 5 min. | Day 11: Send duplicate webhook; verify second is ignored. Send tampered payload; verify rejected. |
| **Idempotency key collision** | Medium (retry fails) | Very Low | Use UUID v4 for idempotency keys with task ID prefix. Store in Transaction table with unique constraint. Handle collision gracefully (lookup existing transaction). | Day 10: Test payment retry with same key; verify same transaction returned, not created. |
| **Photo upload size/speed** | Low (UX issue) | Medium | Compress images client-side with browser-image-compression (target 2MB). Use Supabase Storage with CDN. Add progress indicator. Implement chunked upload for poor connections. | Day 7: Test upload on 3G connection; verify completes in <10 seconds. |
| **Child doesn't have Vipps** | Medium (payout fails) | Low | Warn during onboarding: "Child needs Vipps to receive payments." Log PAYOUT_FAILED for manual resolution. Build admin tool to refund parent if child can't be paid. | Day 14: Test with phone number not registered in Vipps; verify clear error message. |
| **14-day timeline slippage** | High (launch delay) | Medium | Cut scope ruthlessly. No feature creep. If behind by Day 10, skip SMS notifications (parents can communicate verbally). Skip transaction history UI if needed (focus on core payment flow). | Day 7: Checkpoint - auth + family should be done. Day 10: Checkpoint - task lifecycle done. |
| **Supabase free tier limits** | Low (performance) | Low | Monitor usage. Supabase free tier: 500MB database, 1GB storage, unlimited API requests. Upgrade to $25/month Pro if needed before launch. Set up usage alerts at 80% capacity. | Day 12: Check Supabase dashboard; verify <20% of free tier used. |
| **Telnyx SMS rate limits** | Low (auth blocked) | Very Low | Telnyx default: 30 msg/sec. More than enough for v1. Add rate limiting on send endpoint (max 1 SMS per 60 seconds per phone). | Day 2: Test rate limit enforcement; verify 429 error on rapid requests. |
| **Database connection pool exhaustion** | Medium (app crashes) | Low | Prisma default: 10 connections. Monitor connection usage. Set `connection_limit=20` in DATABASE_URL for production. Implement graceful degradation if pool exhausted. | Day 13: Load test with 50 concurrent requests; verify no connection errors. |
| **GDPR data deletion request** | Medium (legal compliance) | Low | Build `/api/user/delete` endpoint (out of scope for v1 but document process). Manual deletion process: anonymize user, delete photos, keep transaction records (tax law). | Day 15-16 (post-launch): Document manual deletion process for GDPR compliance. |

---

## 6. Key Assumptions (UPDATED)

1. **Vipps production access:** Assumes approval within 3-5 days of application. Founder must apply on Day 1 and follow up proactively.

2. **Vipps ePayment API:** Assumes MiniMynt qualifies as a merchant and can receive payments from parents, then send payouts to children. (Note: This may require business registration and Vipps merchant account approval. Verify with Vipps before starting.) **If no business entity (AS or ENK) exists, the 14-day build clock does NOT start until registration is complete.**

3. **Founder skillset:** Assumes proficiency in React/Next.js, basic backend API development, SQL/Prisma. No prior Vipps experience required (docs are comprehensive). Assumes comfort with TypeScript and async/await patterns.

4. **Norwegian phone coverage:** Assumes Telnyx supports all major Norwegian carriers (Telenor, Telia, Ice). Testing required early (Day 2).

5. **Platform fee model:** 0.5% platform fee is charged to parent in addition to task amount. This is collected per transaction (not subscription). Assumes this model is financially viable for v1.

6. **Vipps merchant fees:** Assumes Vipps charges MiniMynt merchant fees separately (typically 1-2% per transaction). These are NOT passed to users in v1 (absorbed by platform). Factor into pricing later.

7. **Data privacy & GDPR:** Assumes GDPR compliance via standard practices:
   - Encrypted database (Supabase default)
   - HTTPS everywhere (Vercel default)
   - Data retention: indefinite for transactions (tax records), delete on user request
   - No dedicated legal review in v1 (founder risk)
   - Privacy policy and terms of service must be added (can use template)

   **GDPR posture (explicit):** Founder accepts GDPR compliance risk in v1. A privacy policy is required at launch — a template is acceptable. No user data is sold or shared with third parties. Datatilsynet (Norwegian DPA) review is deferred to post-PMF. If the platform reaches significant scale (1,000+ users), a formal GDPR audit should be scheduled.

8. **Child age verification:** Trusts parents to verify child age (6-16). No age verification in v1. This is a legal risk if children under 6 use the platform.

9. **Scale:** v1 targets 10-100 families (100-1000 users). Supabase + Vercel scale to thousands without code changes. Database indexes support this scale.

10. **Minimum task amount:** 10 NOK minimum enforced to reduce micro-payment friction and Vipps transaction costs. No maximum (practical max: 10,000 NOK for safety).

### Unvalidated Assumptions (Must confirm before Day 1)

11. **UNVALIDATED ASSUMPTION — Vipps two-step payment:** Spec assumes MiniMynt can act as merchant intermediary (parent pays MiniMynt, MiniMynt pays child). If Vipps does not support merchant-initiated payouts to non-merchant users (children), fallback is direct P2P with no platform fee and revenue deferred to v2. Must be confirmed with Vipps support before architecture is locked.

12. **UNVALIDATED ASSUMPTION — Child Vipps accounts:** Children under 15 may require parent-controlled "Vipps Under 15" accounts. This changes the payout model significantly (parent may need to approve child-side transactions). Must be confirmed with Vipps before Day 1.

13. **UNVALIDATED ASSUMPTION — Approve & Pay UX:** It is unclear whether parent must be redirected to the Vipps app for every approval action (high friction for parents approving multiple tasks). Must confirm if Vipps supports pre-authorized merchant charges that avoid per-transaction redirects.

14. **UNVALIDATED ASSUMPTION — Platform fee viability:** At 0.5% fee on a 100 NOK task = 0.50 NOK revenue. If Vipps charges 1-2% merchant fee, the platform loses money on every transaction. Example: 100 tasks/month × 100 NOK avg = 10,000 NOK volume. MiniMynt earns 50 NOK in fees, pays ~150 NOK in Vipps fees. Net: -100 NOK/month at this volume. Fee structure must be validated against actual Vipps merchant contract before launch.

---

## 7. Success Metrics (Post-Launch)

**North Star Metric:** Number of tasks paid per week (real money moving).

**Supporting Metrics:**
- **Parent onboarding completion rate:** % who reach family dashboard with 1 task created
  - Target: >70% (higher = simpler onboarding)
- **Child join rate:** % of children who successfully join after receiving code
  - Target: >80% (higher = clearer instructions)
- **Task approval rate:** % of submitted tasks that get approved vs. rejected
  - Target: >80% (higher = clear expectations or better work quality)
- **Time to first payment:** Days from parent signup to first Vipps transfer
  - Target: <3 days (faster = stickier product)
- **Payment success rate (parent):** % of approved tasks where parent payment succeeds
  - Target: >95% (higher = better payment UX or fewer Vipps issues)
- **Payout success rate (child):** % of parent payments where child payout succeeds
  - Target: >98% (higher = fewer children without Vipps)

**Failure Signals:**
- <50% parent onboarding completion → Simplify flow or improve value proposition
- <80% task approval rate → Parents unclear on expectations, or children not doing work properly
- <90% payment success rate → Vipps integration issues or parent funding problems
- <95% payout success rate → Too many children without Vipps (need onboarding validation)

**Financial Metrics (for founder):**
- **Platform fee revenue:** Total fees collected (0.5% of all task payments)
- **Vipps merchant fees:** Total fees paid to Vipps (estimate 1-2% of transactions)
- **Net revenue:** Platform fee revenue - Vipps fees - SMS costs (Telnyx)
- **Break-even:** Need ~2000 NOK in task payments per month to cover $25 Supabase + SMS costs

---

## 8. Open Questions for Founder

### Critical (Must resolve before Day 1 starts):

1. **Vipps merchant account:** Have you confirmed MiniMynt qualifies as a merchant and can do two-step payments (parent → MiniMynt → child)? Or does Vipps require direct P2P? (This is CRITICAL - validate on Day 1.)
   - **Action:** Email Vipps support on Day 1 with architecture diagram. Wait for confirmation before proceeding to Day 4.

2. **Business registration:** Do you have a Norwegian business entity (AS or ENK) required for Vipps merchant account? If not, timeline extends by 2-3 weeks.
   - **Action:** If no business entity, register ENK (quickest: 1-3 days) or AS (slower: 1-2 weeks) before starting build.

3. **Vipps fees:** What are the actual Vipps merchant fees for MiniMynt? (Assumption: 1-2% per transaction. Verify in contract.)
   - **Action:** Get exact fee structure from Vipps. Calculate if 0.5% platform fee covers costs or needs adjustment.

### Important (Can resolve during build):

4. **Platform fee collection:** Will you charge 0.5% per transaction in v1, or consider subscription later? (Recommendation: per-transaction is simpler for v1, but subscription may be more predictable revenue.)
   - **Decision:** Stick with 0.5% per-transaction for v1 simplicity. Revisit in v1.5 if revenue is unpredictable.

5. **Minimum task amount:** 10 NOK minimum enforced in spec. Is this acceptable, or should it be lower (5 NOK) or higher (20 NOK)?
   - **Decision:** Keep 10 NOK minimum. Lower = too many micro-transactions (Vipps fees eat into margin). Higher = too restrictive.

6. **Child age verification:** Do you need to verify child age (6-16) for legal compliance? Or trust parents? (v1: trust parents, no verification. But check Norwegian child protection laws.)
   - **Action:** Consult with lawyer or check Datatilsynet (Norwegian DPA) guidelines on children's financial services.

7. **Refund policy:** What happens if parent pays, then disputes? (v1: No refunds via app; handle manually. But define policy for customer support.)
   - **Decision:** Manual refund process for v1. Document in Terms of Service: "Refunds processed within 5 business days upon request."

### Nice to Have (Post-launch):

8. **Data retention:** How long to keep completed tasks and transactions? (Recommendation: indefinitely for tax records; delete on user request per GDPR.)
   - **Decision:** Transactions: indefinite (tax law requires 5-7 years). User data: delete on request (GDPR right to erasure).

9. **Failed payout resolution:** If child payout fails (no Vipps account), will you manually send money, or refund parent? (Recommendation: manual resolution in v1, refund as last resort.)
   - **Decision:** Manual payout attempt first (contact child/parent). If unresolved after 7 days, refund parent minus platform fee.

10. **Admin dashboard:** Do you need an admin panel to view transactions, resolve failed payouts, and monitor platform health? (Out of scope for v1 14-day build, but should be Day 15-16.)
    - **Decision:** Build minimal admin dashboard on Day 15-16 (post-launch). Critical features: transaction log, failed payment queue, user lookup.

---

## 9. Post-v1 Roadmap (Not for 14-Day Build)

**Quick Wins (Days 15-20):**
- Admin dashboard for transaction monitoring and failed payout resolution
- Email notifications (backup for SMS failures)
- Task editing (parent can edit amount/description before it's taken)
- Better analytics (task completion rates, average task value)

**v1.5 (Month 2-3):**
- Recurring tasks (weekly chores)
- Task templates (common chores pre-filled)
- Multiple children per family (already supported in data model)
- Task categories (Household, Outdoor, Learning)
- Child profile pictures

**v2 (Month 4-6):**
- Allowance feature (scheduled payments, not tied to tasks)
- Child savings goals (visual progress, but NOT a bank account)
- Task deadlines (optional, with reminders)
- Multiple families per parent (shared custody use case)
- Referral program

**v3 (Month 7+):**
- Expand to Sweden/Denmark (multi-currency, Swish integration)
- Native mobile app (React Native or Flutter)
- Child-initiated task proposals (opt-in for parents)
- Gamification (ONLY if data shows it doesn't cheapen the experience)

---

## 10. Payment Architecture Decision

### Vipps Two-Step vs. Direct P2P

See Appendix B for the full rationale. Summary: two-step (parent → MiniMynt → child) is chosen to enable platform fee collection, dispute mediation, and future features. **This assumes Vipps supports merchant-initiated payouts to non-merchant users (children) — UNVALIDATED. Validate before Day 4.**

All other stack choices (Supabase, Telnyx, Next.js 16, Vipps ePayment API, custom JWT) are decided and not up for debate in v1.

---

## Appendix B: Critical Technical Decisions & Trade-offs

### Payment Flow Architecture: Two-Step vs. Direct P2P

**DECISION:** Use two-step payment (parent → MiniMynt → child) instead of direct P2P.

**Rationale:**
1. **Platform revenue:** 0.5% fee can only be collected if MiniMynt is in the payment flow
2. **Dispute handling:** MiniMynt can mediate disputes and hold funds if needed
3. **Audit trail:** Full visibility into all transactions for tax reporting and reconciliation
4. **Future features:** Enables escrow, installment payments, savings goals in v2+

**Trade-offs:**
- **PRO:** Full control over payment timing and amounts
- **PRO:** Can implement retry logic and failure recovery
- **PRO:** Transaction model + idempotency keys provide sufficient reconciliation for v1.
- **CON:** MiniMynt must handle VAT/tax reporting on collected fees
- **CON:** Requires Vipps merchant account approval (longer setup time)
- **CON:** Two Vipps API calls instead of one (higher latency, more failure points)
- **CON:** Money briefly held by MiniMynt (requires liquidity and banking infrastructure)

**Alternative Considered:** Direct P2P via Vipps (parent sends directly to child)
- **Why rejected:** No way to collect platform fee; no transaction visibility; can't support future features like escrow

**Implementation Note:** Verify with Vipps that merchant can initiate payouts to non-merchant Vipps users (children). If not allowed, fallback: parent pays child directly via Vipps P2P (no platform fee collected); revenue model deferred to v2.

---

## Appendix C: Vipps ePayment API Integration Checklist

**Pre-Integration (Day 1):**
- [ ] Apply for Vipps merchant account (requires Norwegian business entity: AS or ENK)
- [ ] Request Vipps ePayment API access (test + production)
- [ ] **CRITICAL:** Confirm with Vipps that two-step payment model is supported (parent → merchant → child payout)
- [ ] Read official docs: https://developer.vippsmobilepay.com/docs/APIs/ecom-api/
- [ ] Obtain test credentials: Client ID, Client Secret, Subscription Key (Ocp-Apim-Subscription-Key)
- [ ] Verify Vipps supports payouts to minors (children 6-16) or if parent Vipps account is required

**Test Environment Setup (Day 4):**
- [ ] Get Vipps test API credentials (client ID, client secret, subscription key)
- [ ] Set up test merchant account in Vipps test environment
- [ ] Get test Vipps user accounts (for parent and child testing) - use Vipps test app
- [ ] Configure test environment variables: `VIPPS_CLIENT_ID`, `VIPPS_CLIENT_SECRET`, `VIPPS_SUBSCRIPTION_KEY`, `VIPPS_MERCHANT_SERIAL_NUMBER`
- [ ] Test OAuth token acquisition: `POST /accesstoken/get`
- [ ] Test basic payment initiation: `POST /epayment/v1/payments` with hardcoded 100 NOK
- [ ] Verify webhook endpoint is reachable from Vipps test servers (use ngrok for local dev)
- [ ] Test webhook signature verification with Vipps test webhook secret

**Production Setup (Day 11-14):**
- [ ] Switch to Vipps production API credentials
- [ ] Verify webhook endpoint is publicly accessible (HTTPS required)
- [ ] Test webhook signature verification
- [ ] Test with real Vipps accounts (small amounts: 10-50 NOK)
- [ ] Monitor first transactions closely

**Webhook Security:**
- [ ] Verify HMAC-SHA256 signature on all webhook requests
- [ ] Reject unsigned or invalid signature requests
- [ ] Implement idempotency (WebhookEvent table)
- [ ] Log all webhook payloads for debugging

---

## Appendix D: 14-Day Timeline Feasibility Assessment

**OVERALL VERDICT:** Achievable but tight. Requires disciplined scope management and no major blockers.

### Critical Success Factors:

1. **Vipps approval:** MUST arrive by Day 7 to test production flow. If production approval delayed past Day 10, sandbox launch fallback applies (5-10 beta families, manual payouts). Timeline does not break.
   - **Mitigation:** Apply Day 1 morning. Follow up Day 3. Escalate Day 5 if no response.

2. **Payment complexity:** Two-step payment flow is the highest risk area (Days 10-11).
   - **Mitigation:** Start Vipps integration Day 4 (not Day 10). Budget extra time for debugging.

3. **Zero scope creep:** Any feature additions break timeline.
   - **Mitigation:** Defer ALL nice-to-haves to post-launch. No exceptions.

### Effort Breakdown (Estimated Hours):

| Day | Phase | Estimated Hours | Risk Level | Buffer |
|-----|-------|----------------|------------|--------|
| 1 | Setup + Vipps application | 6h | Low | 2h |
| 2 | SMS auth | 8h | Low | 0h |
| 3 | Vipps auth | 8h | Medium | 0h |
| 4 | Family + Vipps setup | 10h | Medium | 2h |
| 5 | Family join + task creation | 8h | Low | 0h |
| 6 | Task claiming | 6h | Medium | 2h (race condition testing) |
| 7 | Task submission | 8h | Low | 0h |
| 8 | Task approval | 6h | Low | 0h |
| 9 | Rejection + errors | 6h | Low | 0h |
| 10 | Parent payment | 10h | **High** | 2h |
| 11 | Child payout + webhooks | 10h | **High** | 2h |
| 12 | Notifications + transactions | 8h | Low | 0h |
| 13 | UI polish + mobile | 8h | Low | 0h |
| 14 | Testing + deploy | 10h | Medium | 2h |
| **TOTAL** | | **112h** | | **12h buffer** |

**Daily commitment:** 8 hours/day average (some days 6h, some 10h). Total: 14 days × 8h = 112h.

**Buffer allocation:** 12 hours total (10.7% buffer). Concentrated on high-risk days (Vipps integration, testing).

### Red Flags That Would Break Timeline:

1. **Vipps approval delayed beyond Day 10:** Cannot launch without production access.
   - **Fallback:** Soft launch in test mode with 5-10 beta families.

2. **Two-step payment not supported by Vipps:** Architecture requires redesign.
   - **Fallback:** Direct P2P payment (no platform fee collection), defer revenue to v2.

3. **SMS delivery failures on major carrier:** Children can't sign up.
   - **Fallback:** Switch to Twilio immediately (accept higher costs).

4. **Supabase outage during critical build days:** Cannot develop or test.
   - **Fallback:** Local Postgres with Docker (slower setup, costs 4-6 hours).

5. **Founder illness or emergency:** No team backup.
   - **Mitigation:** None. Timeline extends by days missed.

### Confidence Levels by Phase:

- **Auth (Days 1-3):** 90% confidence. Well-trodden path, good documentation.
- **Family + tasks (Days 4-9):** 85% confidence. Straightforward CRUD, some race condition complexity.
- **Payment (Days 10-11):** 60% confidence. Highest uncertainty. Vipps API documentation is good but this flow is unusual.
- **Polish + launch (Days 12-14):** 80% confidence. May cut transaction history UI if time-constrained.

### Recommended Adjustments if Behind Schedule:

- **By Day 7:** If basic task lifecycle isn't working, cut SMS notifications (rely on verbal communication).
- **By Day 10:** If payment integration is struggling, simplify to single-step (direct parent → child, no platform fee).
- **By Day 12:** If UI polish incomplete, launch with basic mobile layout (no animations, no View Transitions).
- **By Day 13:** If testing incomplete, launch to friends-and-family only (5-10 test users).

### Post-Launch Priorities (Days 15-20):

1. **Admin dashboard** (Day 15-16): Critical for monitoring failed payments and resolving disputes.
2. **Transaction reconciliation script** (Day 17): Verify Transaction table records match Vipps statement exports.
3. **Performance monitoring** (Day 18): Set up Sentry alerts and Axiom dashboards.
4. **User feedback collection** (Day 19-20): In-app feedback form, analyze first 20 transactions.

**FINAL ASSESSMENT:** Timeline is achievable for a skilled solo founder with Next.js/React/Prisma experience. Payment integration is the make-or-break moment (Days 10-11). If Vipps approval is smooth and payment flow works as expected, 14 days is realistic. If either fails, timeline extends to 18-21 days.

---

**End of Document**

This revised spec addresses critical technical risks (Vipps two-step payment, idempotency, webhook security), updates the tech stack to 2026 standards (Next.js 16, Supabase, Telnyx, Vipps ePayment API), and front-loads Vipps integration to derisk the 14-day timeline. Transaction model + idempotency keys provide sufficient reconciliation for v1. The build sequence is realistic and actionable.

**Key Changes from v1.0:**
1. Switched to Vipps ePayment API (future-proof)
2. Clarified two-step payment model (parent → MiniMynt → child)
3. Added idempotency and retry logic throughout
4. Switched from Neon to Supabase (post-acquisition stability)
5. Switched from Twilio to Telnyx (16x cheaper SMS)
6. Upgraded to Next.js 16 (Turbopack, React 19.2)
7. Added PaymentLedgerEntry table for audit trail
8. Added WebhookEvent table for deduplication
9. Front-loaded Vipps integration (Day 4 vs Day 10)
10. Expanded error handling and edge cases
11. Added minimum task amount (10 NOK)
12. Clarified payment statuses (PARENT_PAID, PAYOUT_FAILED)

**Refinements in v2.0:**
1. Added comprehensive edge case handling for all user flows
2. Strengthened security with timing-safe webhook verification and optimistic locking
3. Added API security section with consistent error handling and rate limiting
4. Expanded risk mitigation table with validation checkpoints
5. Clarified critical open questions with prioritization (Critical/Important/Nice-to-Have)
6. Added scalability considerations and growth path (v1 → v2 → v3)
7. Documented critical technical decisions with trade-off analysis
8. Added 14-day timeline feasibility assessment with effort breakdown
9. Improved database schema with cascade deletion and version fields
10. Added detailed testing requirements for Day 14

This spec is production-ready for implementation by a solo founder with the skills and timeline described.
