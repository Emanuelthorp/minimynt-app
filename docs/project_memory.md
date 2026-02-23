# MiniMynt — Project Memory

**Last updated:** 2026-02-22

---

## Platform Decision

**v1 = Next.js 16 responsive web app** (per `02-v1-spec.md` and `CLAUDE.md`).
The Expo/React Native app at `/home/emanuel/minimynt-app/` is a UI prototype only. It is not the v1 product.

---

## Build Status

| Area | Status | Notes |
|------|--------|-------|
| Strategy docs | COMPLETE | 4 minor fixes pending (strategic-directive.md v6) |
| Landing page | PROTOTYPE | `index.html` — static HTML/CSS |
| Expo UI prototype | PROTOTYPE | 22 files, local state only, mock auth/payment |
| Next.js web app | NOT BUILT | — |
| Backend / API | NOT BUILT | — |
| Database | NOT BUILT | — |
| Real auth (SMS + Vipps OAuth) | NOT BUILT | — |
| Real Vipps payments | NOT BUILT | — |
| Business entity (AS/ENK) | UNKNOWN | Required for Vipps merchant account |
| Vipps merchant account | NOT STARTED | Go/No-Go gate not passed |
| Domain (minimynt.no) | UNKNOWN | — |
| Tests | NOT BUILT | — |

---

## Unvalidated Assumptions (block build start)

1. Vipps two-step payment (parent → MiniMynt → child) — CRITICAL
2. Child Vipps accounts (under 15) — payout model may change
3. Approve & Pay UX — redirect per transaction?
4. Platform fee viability — 0.5% may be net-negative after Vipps fees
5. Business entity existence

---

## Current Focus

Pre-build consolidation. Next actions:
1. Apply 4 doc fixes from strategic-directive.md v6
2. Founder resolves Go/No-Go gate (business entity, Vipps confirmation)
3. Founder resolves Expo vs Web contradiction

---

## Non-Goals (v1)

No gamification. No AI. No social features. No native app (per spec). No recurring tasks. No savings goals. No multi-currency. No in-app chat. No subscriptions. No child-initiated proposals.
