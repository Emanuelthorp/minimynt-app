# MiniMynt — Decision Log

**Purpose:** Chronological record of locked decisions. Format: what, why, tradeoffs, risk, status.

---

## D1: No Gamification — LOCKED

No points, streaks, badges, XP, levels, or behavioral hooks. Ever.
**Why:** Core differentiator. Nordic parents reject gamification. Pedagogical positioning requires real economics.
**Risk:** May reduce child engagement short-term.

## D2: Vipps as Sole Payment Rail — LOCKED (v1)

Vipps ePayment API v1. No Stripe, no bank transfers, no cards.
**Why:** 83% Norway penetration. Zero friction for families.
**Risk:** Locks to Norwegian market. Vipps merchant fees UNVALIDATED.

## D3: Two-Step Payment — LOCKED (pending Vipps confirmation)

Parent → MiniMynt → child. Not direct P2P.
**Why:** Enables platform fee, dispute mediation, audit trail.
**Risk:** UNVALIDATED. Vipps may not support merchant-initiated payouts to children. Fallback: P2P, no fee, revenue deferred to v2.

## D4: Tech Stack — LOCKED

Next.js 16 + React 19.2 + Tailwind + shadcn/ui + Supabase Postgres + Prisma 6 + Telnyx SMS + Vercel Europe North.
**Why:** Solo-founder friendly. Single codebase. Cheapest SMS. Lowest latency for Norway.
**Risk:** Low.

## D5: Mobile-First Web, Not Native — LOCKED (v1)

Responsive web app. No native app for v1.
**Why:** Faster to build (14 days). No App Store review.
**Risk:** Expo prototype exists and contradicts this. Prototype is UI reference only.

## D6: Supabase over Neon — LOCKED

**Why:** Post-Databricks acquisition stability. Integrated DB + storage. Fewer vendors.

## D7: Telnyx over Twilio — LOCKED

$0.004/msg vs $0.065/msg (16x cheaper). Twilio as fallback.
**Risk:** Untested on Norwegian carriers. Test Day 2.

## D8: Ledger Deferred to v1.5 — LOCKED

PaymentLedgerEntry removed from v1. Transaction model + idempotency keys suffice at 10-100 families.
**Risk:** Two stale ledger references remain in `02-v1-spec.md` (fix pending in strategic-directive.md v6).

## D9: Platform Fee 0.5% Per Transaction — LOCKED (pending fee validation)

0.5% added to parent's total per task payment.
**Why:** Simpler than subscription for v1.
**Risk:** HIGH. At est. 1-2% Vipps merchant fees, model is net-negative at low volume. Must get fee schedule before Day 4.

## D10: Go/No-Go Gate Before Build — LOCKED

Three gates before the 14-day clock starts:
1. Business entity (AS or ENK) registered
2. Vipps merchant fee schedule in writing
3. Two-step payment confirmed with Vipps

**Gate status:** UNKNOWN. Not yet passed.

---

## Open Contradictions (not decisions — require founder resolution)

| ID | Issue | See |
|----|-------|-----|
| C1 | Web spec vs Expo native prototype | README.md contradictions table |
| C2 | No-gamification contract vs DESIGN_RULES.md | `CLAUDE.md` vs `minimynt-app/DESIGN_RULES.md` |
| C3 | Fee rate 0.5% (spec) vs 0.1% (Expo code) | `founder-packet.md` vs `minimynt-app/src/store/types.ts:34` |
