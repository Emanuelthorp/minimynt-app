# MiniMynt Founder Packet

**Version:** v5 (Refined 2026-02-17)
**Audience:** Solo founder — execution reference
**Sources:** 01-positioning.md, 02-v1-spec.md, 03-growth-playbook.md
**Scope discipline:** Every section must answer "Does this help ship v1 in 14 days?"

---

## 1. What MiniMynt Is

**One sentence:** MiniMynt is a family economy operating system for Norwegian parents who want to teach their children how money actually works — through real work, real approval, and real earnings via Vipps. Not a game. Not a bank. Not a wallet.

**Tagline:** "This is how money works."

**Core workflow:** Task created by parent → Child claims and completes → Parent approves → Vipps payment sent automatically (0.5% platform fee). No points. No streaks. No fake currency.

**What it is not:** Not gamified. Not a debit card. Not a subscription product. Not a savings app. Not a Norwegian Greenlight.

---

## 2. Who It's For

**ICP: "Kristin" — The Conscious Nordic Parent**

- Age 35-50, urban/suburban Norway (Oslo, Bergen, Stavanger first)
- Household income NOK 900k-1.4M+, university educated, professional
- 2-3 children aged 6-16
- Vipps daily user; declining cash usage
- Values: financial responsibility, transparency, practical education
- Rejects gamification; wants pedagogy, not behavioral hooks
- Pain: allowance feels like entitlement; no visible work-to-value connection
- Goal: children understand that effort converts to real money, in their own Vipps account

**Why Kristin acts now:**
1. Vipps has 4.6M users (83% Norway penetration) — payment rail already trusted
2. Post-pandemic shift toward intentional financial education in Norwegian families
3. Gimi and MyMonii are going full-stack fintech/gamification; no one owns the simple, pedagogical niche
4. Cash is dead (<5% of transactions); Kristin needs a digital solution that isn't a toy

---

## 3. Positioning

**Primary message:** "Your family's economy. Transparent. Real money. No games."

**Three pillars:**

| Pillar | What it means |
|--------|--------------|
| Real Money, Direct Connection | Tasks generate actual NOK via Vipps. Children see earnings in their own account. |
| Pedagogical, Not Behavioral | No engagement optimization. App is transparent infrastructure. Language: tasks/approval/payment — not quests/rewards/coins. |
| Vipps-Native, Norway-First | Built on the payment rail Norwegian families already use daily. One login. No new ecosystem. |

**Competitive edge:** Gimi gamifies. MyMonii cards. Greenlight is US. MiniMynt is the only non-gamified, Vipps-native, pedagogically grounded option in Norway.

**Tone:** Clear, direct, Scandinavian. No hype, no cute, no corporate.

---

## 4. Day 0: Go/No-Go Gate (Before Build Starts)

**Stop. These three gates must be confirmed before the 14-day clock starts.**

### Gate 1: Business Entity
If no Norwegian business entity (AS or ENK) exists, the 14-day build clock does NOT start until registration is complete.
- ENK: 1-3 days
- AS: 1-2 weeks
- **Action:** Register before touching code.

### Gate 2: Vipps Merchant Fee Schedule
Before Day 4, obtain the Vipps merchant fee schedule **in writing**. If Vipps merchant fees exceed 0.3% per transaction, reconsider the platform fee model before locking payment architecture.

| Scenario | Action |
|----------|--------|
| Vipps fee ≤ 0.3% | Proceed with 0.5% platform fee as designed |
| Vipps fee 0.3%-0.5% | Raise platform fee (e.g., to 1%) or switch to subscription model |
| Vipps fee > 0.5% | Platform fee model is net-negative from day one — redesign before Day 4 |

**Do not build payment architecture against an unconfirmed fee assumption.**

### Gate 3: Two-Step Payment Model Confirmation
Confirm with Vipps that MiniMynt can act as merchant intermediary (parent pays MiniMynt, MiniMynt pays child payout). If not supported, fallback is direct P2P with no platform fee — revenue deferred to v2.

### Vipps Checklist (Day 1)
- [ ] Apply for Vipps merchant account
- [ ] Request ePayment API access (test + production)
- [ ] Confirm two-step payment model is supported
- [ ] Confirm child payout model (minors, Vipps Under 15)
- [ ] Obtain test credentials

---

## 5. Critical Unvalidated Vipps Assumptions

| Assumption | Risk if wrong | Action |
|------------|--------------|--------|
| MiniMynt can act as merchant intermediary (parent pays MiniMynt, MiniMynt pays child) | Entire payment architecture changes; platform fee not collectible; revenue deferred to v2 | Email Vipps support Day 1 with architecture diagram. Wait for confirmation before Day 4. |
| Children under 15 can receive payouts (or use Vipps Under 15 accounts) | Payout model changes significantly; may require parent-side account flow | Confirm with Vipps before Day 1. |
| Parent "Approve & Pay" does NOT require Vipps app redirect for every approval | High UX friction if redirect required for each task approval | Confirm if pre-authorized merchant charges are supported. |
| Platform fee viability: 0.5% fee > Vipps merchant fees | At 100 tasks/month × 100 NOK = 10,000 NOK volume: MiniMynt earns 50 NOK, pays ~150 NOK to Vipps. Net: -100 NOK/month | Get exact Vipps merchant fee schedule before locking pricing (Gate 2 above). |

**Fallback if two-step payment fails:** Direct P2P (parent pays child directly via Vipps). No platform fee. Revenue model deferred to v2.

---

## 6. v1 Feature Set

### In Scope (ship in 14 days)

| Feature | Core purpose |
|---------|-------------|
| Phone-based auth | SMS for children, Vipps login for parents |
| Family creation + join codes | Parent-controlled onboarding |
| Task lifecycle | Available → Taken → Awaiting Approval → Approved → Paid |
| Work submission with optional photo | Child accountability |
| Parent approval workflow | Quality control + payment trigger |
| Vipps payment (0.5% fee) | Real money movement |
| Transaction history | Transparency for both roles |
| SMS notifications | Async coordination |
| Family + child dashboards | Command center for each role |

### Out of Scope (v1)
Recurring tasks, task templates, multiple families per parent, savings goals, social features, AI features, native app, in-app chat, partial payments, gamification.

---

## 7. Tech Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Frontend | Next.js 16 + React 19.2 + Tailwind + shadcn/ui | Turbopack builds, View Transitions, mobile-first |
| Backend | Next.js API routes, Node.js 20+ | Single codebase |
| Database | Supabase Postgres + Prisma 6 | Integrated storage, stable post-Neon acquisition |
| Auth | Custom JWT + HTTP-only cookies | Flexibility for SMS + Vipps OAuth |
| Payment | Vipps ePayment API v1 | Official future-proof API |
| SMS | Telnyx ($0.004/msg vs Twilio $0.065/msg) | 16x cheaper; Twilio as fallback |
| Storage | Supabase Storage | Integrated, 1GB free |
| Hosting | Vercel (Europe North region) | Minimal latency for Norway |
| Monitoring | Sentry + Axiom | Error tracking + payment audit trail |

**Stack is locked. No substitutions in v1.**

---

## 8. Data Model (v1)

Key models: `User`, `Family`, `Task`, `Transaction`, `SmsVerification`, `WebhookEvent`

**Removed from v1:** `PaymentLedgerEntry` (double-entry ledger deferred to v1.5 — not needed for 10-100 families)

**Critical design decisions:**
- All amounts stored in øre (integers) to avoid floating-point errors
- Two-step payment: `parentPaymentVippsId` and `childPayoutVippsId` tracked separately on `Transaction`
- Idempotency key on every Transaction for safe retries
- `Task.version` field for optimistic locking (concurrent claiming)
- `WebhookEvent` table with unique `[provider, externalId]` constraint for webhook deduplication
- `PAYMENT_FAILED` task status for manual intervention (no automatic retry queue)
- If payment fails, parent must re-approve manually — no exponential backoff, no auto-retry

---

## 9. Payment Flow

```
Parent clicks "Approve & Pay"
  → Backend calls Vipps ePayment API (parent pays MiniMynt: task amount + 0.5% fee)
  → Parent completes payment in Vipps, redirected back
  → Vipps webhook received (HMAC-SHA256 verified, deduplicated)
  → MiniMynt initiates child payout (separate Vipps API call)
  → Task status → PAID, SMS sent to child
```

**Fee example:** 100 NOK task → parent pays 100.50 NOK. Child receives 100 NOK.

**Security:** Webhook signature verification, replay attack prevention (5-min timestamp check), idempotency keys prevent double-charging, Serializable DB isolation for payment operations.

**`/api/payment/initiate` is server-side only:** Called internally from `/api/tasks/:id/approve`. Not exposed as a standalone HTTP endpoint. No direct HTTP access.

---

## 10. 14-Day Build Sequence

| Phase | Days | Key output |
|-------|------|-----------|
| Foundation | 1-3 | Auth (SMS + Vipps), DB schema, apply for Vipps production access on Day 1 |
| Family + Vipps Setup | 4-5 | Family creation/join, task creation, Vipps test payments begin |
| Task Lifecycle | 6-9 | Full claim → submit → approve → reject flow (no payment yet) |
| Payment Integration | 10-11 | Parent payment + child payout + webhooks — CRITICAL PATH |
| Polish | 12-13 | Transaction history, SMS notifications, mobile UX |
| Launch | 14 | End-to-end testing, production deploy |

**Highest risk:** Days 10-11 (Vipps payment integration). Mitigated by starting Vipps setup on Day 4.

**Timeline only starts after:** Business entity registered + Vipps merchant account confirmed + fee schedule obtained.

**Vipps production approval fallback:** If Vipps production access is not approved by Day 10, do not delay launch. Launch to 5-10 beta families in Vipps sandbox mode. Task approval flow works normally; payments are confirmed manually by the founder (outside the app) until production approval arrives. Communicate clearly to beta families: "Payments are processed manually during beta."

**If behind schedule:**
- Day 7: Cut SMS notifications (verbal communication works)
- Day 10: Simplify to direct P2P if two-step fails (no platform fee)
- Day 13: Launch to friends-and-family only (5-10 users)

---

## 11. Key Technical Risks

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Vipps production approval delayed | CRITICAL | Apply Day 1 morning. Follow up Day 3, escalate Day 5. Fallback: sandbox launch with 5-10 beta families. |
| Two-step payment not supported by Vipps | CRITICAL | Confirm Day 1. Fallback: direct P2P, defer revenue. |
| Vipps merchant fee > 0.3% (fee model negative) | HIGH | Gate 2 — get fee schedule before Day 4. Adjust platform fee or model before building. |
| Child Vipps accounts (under 15) | High | Confirm payout model before Day 1. |
| Race condition: two children take same task | Medium | `FOR UPDATE SKIP LOCKED` + optimistic version locking |
| SMS delivery failures | Medium | Test Telenor, Telia, Ice on Day 2. Twilio fallback ready. |
| Webhook replay attacks | High | HMAC-SHA256 + timestamp check + `WebhookEvent` deduplication |

---

## 12. Risks: GDPR, Vipps Fallback, Fee Model

### Risk A: GDPR / Child Data
MiniMynt handles financial data for children aged 6-16. Datatilsynet (Norwegian DPA) has specific rules on processing children's personal data.

**Explicit posture:** Founder accepts GDPR compliance risk in v1. A privacy policy is required at launch — a template is acceptable. No user data is sold or shared with third parties. Datatilsynet review is deferred to post-PMF. If the platform reaches 1,000+ users, a formal GDPR audit should be scheduled.

**Minimum at launch:** Privacy policy live on site (template OK). HTTPS enforced (Vercel default). Encrypted database (Supabase default). No data sold.

### Risk B: Vipps Production Approval Dependency
If production access is not granted by Day 10, Days 10-14 do not become a dead zone. Fallback: soft launch to 5-10 beta families in sandbox mode with manual payout confirmation by founder. Communicate clearly to beta families. Switch to live payments when production credentials arrive.

### Risk C: Platform Fee Model Viability
The entire build (transaction fee logic, Day 10 payment architecture) assumes 0.5% fee is viable. If Vipps merchant fees exceed 0.3%, the platform loses money on every transaction.

**Gate:** Before Day 4, get Vipps merchant fee schedule in writing. If fees > 0.3%, adjust platform fee or switch to subscription before locking payment architecture. Do not build to an unconfirmed fee assumption.

---

## 13. Success Metrics (Post-Launch)

**North Star:** Tasks paid per week (real money moving).

**Primary target:** 15-50 active families paying in first 30 days.
**Stretch goal:** 500+ families.

| Metric | Target |
|--------|--------|
| Parent onboarding completion | >70% |
| Child join rate | >80% |
| Task approval rate | >80% |
| Time to first payment | <3 days |
| Parent payment success | >95% |
| Child payout success | >98% |
| First-payment rate (Day 30) | 40-50% of signups |
| Parent retention (14-day) | 60%+ |

**Financial:** Break-even at ~2,000 NOK/month in task payments to cover Supabase ($25) + SMS costs.

---

## 14. Growth Strategy (First 30 Days)

### Five Core Patterns
1. **Real Money > Fake Points** — Lead with "real money via Vipps" in all messaging
2. **Parent-to-Parent Virality** — "My kid earned 150 NOK doing dishes" spreads organically in WhatsApp groups
3. **Pedagogical Positioning** — "Teaching tool" not "app"; unlocks trust and institutional credibility
4. **Single Entry Point (Parent Setup)** — Parent-first onboarding gates the system; higher engagement and retention
5. **Community Trust + First-Mover Advantage** — Hyper-focus on Norway; win Oslo/Bergen/Stavanger first

### Three Active Experiments (Days 1-30)

**Experiment 1: Golden Family Program**
- Target: 15 households (5 per neighborhood: Oslo, Bergen, Stavanger)
- Method: Direct outreach in neighborhood Facebook groups; 500 NOK launch credit framed as payment testing
- Success signal: 12/15 complete first payment by Day 10; 3-5 organic referrals by Day 30

**Experiment 2: Content + Community Blitz**
- 3 blog posts mapped to launch slots:
  - Day 1: "Real Money vs. Fake Points" — foundation SEO piece
  - Day 5: "The Allowance You Grew Up With Doesn't Work Anymore" — pedagogy + keyword targeting
  - Day 12: "Chores Aren't Punishment. They're Your Kid's First Job." — conversion-focused
- Facebook group seeding: 10-15 neighborhood groups; credibility-first, no early CTAs
- Babyverden + KK.no: Answer 5+ threads before mentioning MiniMynt
- Remaining 7 content angles reserved for Month 2+ after launch data exists

**Experiment 3: Micro-Influencer Seeding**
- Target: 5-8 Norwegian parenting micro-influencers (5k-20k followers, 7%+ engagement)
- Method: DM with free access, no sponsored post required; honest testimonial requested after use
- Success signal: 30-50 signups from referral links by Day 30

### Channel Priority (Honest Primary Targets)

The numbers below are the honest Day 30 forecast for a solo founder. Channel numbers in the growth playbook show aspirational upper bounds; use this table for execution planning.

| Rank | Channel | Honest Day 30 target | CAC |
|------|---------|---------------------|-----|
| 1 | Parent Facebook Groups | 5-10 signups | ~50 NOK |
| 2 | Organic content + SEO | 10-20 signups | ~30 NOK |
| 3 | Babyverden + forums | 5-10 signups | ~40 NOK |
| 4 | Micro-influencer | 5-10 signups | ~100-150 NOK |
| 5 | Founder/early referrals | 5-10 signups | ~25 NOK |

**Total honest Day 30 forecast: 30-60 signups across all channels.** Primary goal is 15-50 active families paying real money.

**School outreach:** Deferred to Month 2 only. Schools have 2-3 week decision lag — not viable for 30-day signal.

### Content Rules
- Never use: streaks, badges, achievements, rewards, levels, fun, addictive
- Always use: real money, task structure, economic literacy, parental authority, real earnings
- Skepticism test: "Would a skeptical Norwegian parent find this trustworthy or too salesy?"

---

## 15. Growth Targets

**Primary (honest):** 15-50 active families paying real money in first 30 days.
**Stretch:** 500+ families.

The 15 "golden families" in Experiment 1 are the real Day 1-30 goal. If 15 families are paying consistently, product-market fit is real. Scale from there.

---

## 16. Post-v1 Roadmap (Not for 14-Day Build)

**Days 15-20:** Admin dashboard, email notifications, task editing, basic analytics

**v1.5 (Month 2-3):** Recurring tasks, task templates, task categories, child profile pictures

**v2 (Month 4-6):** Allowance feature, savings goals, task deadlines, referral program

**v3 (Month 7+):** Sweden/Denmark expansion, native app, child-initiated task proposals

---

## 17. Pre-Build Checklist

- [ ] Business entity registered (AS or ENK) — **clock does not start until this is done**
- [ ] Vipps merchant fee schedule obtained in writing — **if fees > 0.3%, adjust fee model before Day 4**
- [ ] Two-step payment model confirmed with Vipps
- [ ] Child payout model (under-15 Vipps accounts) confirmed
- [ ] Approve & Pay UX friction (redirect vs. pre-auth) confirmed
- [ ] Vipps merchant account applied for
- [ ] Vipps ePayment API test credentials obtained
- [ ] Telnyx account created and Norwegian SMS tested
- [ ] Supabase project created (Europe region)
- [ ] Vercel project created (Europe North region)
- [ ] Domain registered (minimynt.no)
- [ ] Privacy policy drafted (template acceptable) — **required at launch**

---

**End of Founder Packet**

*This document is a synthesis of 01-positioning.md, 02-v1-spec.md, and 03-growth-playbook.md. For full detail on any section, refer to the source file. This packet is the execution reference — concise, actionable, scope-disciplined.*
