# MiniMynt Strategic Directive v6

**From:** Jarvis (Strategic Brain)
**Date:** 2026-02-18
**Based on:** v5 directive + full review of v5 outputs (founder-packet.md, 01-positioning.md, 02-v1-spec.md, 03-growth-playbook.md)

---

## What v5 Fixed Well (Do Not Revisit)

- All nine v5 items are addressed in founder-packet.md: Go/No-Go gate added, Vipps fallback documented, GDPR posture explicit, channel targets reconciled, stale Next Steps replaced, endpoint auth clarified, retry contradiction resolved, content angles mapped to 3 posts, and ICP is locked. Founder-packet is now the clean execution reference.

---

## What STILL Needs Tightening

### 02-v1-spec.md — Four Remaining Inconsistencies

**1. Appendix B conclusion paragraph — ledger language survives**
Line 1056 in Appendix B still reads: "Better financial reconciliation (ledger always balances)." Line 1187 (closing paragraph) reads: "The data model is production-ready with double-entry ledger for financial reconciliation." Both contradict the v4 decision to remove `PaymentLedgerEntry`. Appendix B is the only place this language should exist — but it should be updated to reflect current reality (Transaction model with idempotency keys is the reconciliation mechanism). Fix: replace both ledger references with "Transaction model + idempotency keys provide sufficient reconciliation for v1."

**2. Appendix D (Line 1177) — reconciliation script references "ledger"**
Post-launch priority #2 reads: "Transaction reconciliation script (Day 17): Verify ledger balances match Vipps statements." There is no ledger. Fix: rewrite as "Verify Transaction table records match Vipps statement exports."

**3. Appendix D (Line 1110) — Vipps approval timeline contradicts build sequence**
Appendix D says "MUST arrive by Day 7 to test production flow. If delayed beyond Day 10, timeline breaks." The build sequence (Section 10 in founder-packet, Appendix C in spec) says sandbox fallback handles the Day 10+ scenario. These are contradictory: one says timeline breaks, the other documents a working fallback. Fix: update Appendix D to align — "If production approval delayed past Day 10, sandbox launch fallback applies (5-10 beta families, manual payouts). Timeline does not break."

**4. Closing paragraph (Line 1187-1188) — summary is stale**
The closing paragraph still describes the spec as if it were a first-revision document ("This revised spec addresses..."). It no longer reflects the current state (v2.0 with multiple rounds of refinement). This creates no builder confusion but is misleading. Low priority — fix if touching this section anyway, otherwise skip.

### 03-growth-playbook.md — One Remaining Issue

**5. Section 4 (Distribution Channel Ranking) — stretch targets not labeled in-table**
The founder-packet v5 correctly added: "Note: these are stretch-goal ranges" as a disclaimer in the metrics table (Appendix/analytics section). However, the main Section 4 channel table itself (lines 310-311) still shows "40-60 signups" and "100-150 signups" without an inline label. A founder reading only Section 4 gets the misleading numbers. Fix: add a single note at the top of Section 4 table: "Impact ranges below are aspirational upper bounds. Execution reference: see founder-packet.md Section 14 for honest Day 30 targets."

---

## New Risks Spotted in v5 Outputs

**Risk D: 02-v1-spec.md Appendix B still contains "Alternative Considered: Direct P2P" rationale**
This is the one "Why Not X" appendix item correctly preserved in v5 (it has active fallback implications). However, the fallback described in Appendix B (line 1065) says "platform fee charged separately" if two-step fails — which is a different fallback from the founder-packet (which says: P2P with no platform fee, revenue deferred to v2). These two documents now describe different fallbacks for the same scenario. The founder-packet is authoritative. Fix: align Appendix B fallback language to match founder-packet Section 5 exactly.

**Risk E: Appendix C (Vipps checklist) and Section 17 (Pre-Build Checklist in founder-packet) are nearly identical but not identical**
Two checklists exist for the same Day 1 Vipps actions. Minor divergence in wording creates the possibility a founder checks one but misses an item in the other. Low risk at 10-100 users. No action required unless the spec is being used as the primary build reference (founder-packet is).

---

## Strategic Priorities for v6 Refinement Pass

1. **Fix the two ledger references in 02-v1-spec.md** (Appendix B line 1056, closing paragraph line 1187). These are documentation bugs that contradict a locked decision and will confuse a builder who reads the spec directly.
2. **Fix the Vipps timeline contradiction in Appendix D** (line 1110 vs. sandbox fallback). Builder needs one consistent statement about what happens if production is delayed.
3. **Align Appendix B P2P fallback language** with founder-packet Section 5. One sentence fix.
4. **Add stretch-goal disclaimer to Section 4 table header** in 03-growth-playbook.md. One line.

Items 1-3 are documentation consistency bugs in 02-v1-spec.md. Item 4 is a minor clarity fix. None require strategic decisions — all are execution edits.

---

## What NOT to Change in v6

- Do not re-open any decision from v4 or v5. All major decisions are locked.
- Do not revise founder-packet.md. It is now clean and authoritative.
- Do not expand v1 feature scope. Scope is correct.
- Do not add more growth experiments or content angles. The playbook is right-sized.
- Do not revisit ICP, tech stack, or competitive positioning.
- Appendix B's "Why Not Direct P2P" section should be kept — it is the one "Why Not X" entry with active fallback implications. Just align its fallback language.

---

## State of Play

**Documents that are done and should not require further passes:**
- `01-positioning.md` — complete. Next Steps is correct.
- `founder-packet.md` — authoritative execution reference. No changes needed.
- `03-growth-playbook.md` — one minor table label fix (item 4 above), then done.

**Document requiring one more targeted pass:**
- `02-v1-spec.md` — three specific line-level fixes (items 1, 2, 3 above). After these are made, the spec is consistent with all other documents.

---

**End of Directive.**
