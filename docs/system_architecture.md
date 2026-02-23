# MiniMynt — System Architecture & Agent Protocol

**Last updated:** 2026-02-22

---

## 1. Agent Roles

| Agent | Role | Output | Authority |
|-------|------|--------|-----------|
| **Jarvis** | Strategic Brain | `strategic-directive.md` (v1-v6) | Reviews all outputs. Issues fix directives. Approves strategic decisions. |
| **Researcher** | Market Research | Fed into `01-positioning.md` | Must verify all claims. Cannot add unverified statistics. |
| **Architect** | Technical Spec | `02-v1-spec.md` | Owns data model, API, build sequence. Cannot change stack without directive. |
| **Growth** | Growth Strategy | `03-growth-playbook.md` | Owns channels, experiments, metrics. Must label stretch vs honest targets. |

**Coordination:** Jarvis issues directives → agents apply fixes → Jarvis reviews → next directive. Six iterations produced current doc set.

**Gap identified:** No operational controller exists between Jarvis (strategy) and operators (output). This means no entity sequences tasks, verifies fix application, or enforces guardrails at write-time. See analysis in session 2026-02-22. Pending founder decision on whether to formalize a team-lead-2 role.

**Current state:** Agent team is not active. Docs complete pending 4 fixes in strategic-directive.md v6.

---

## 2. Model Policy

| Task type | Model | Gate |
|-----------|-------|------|
| Strategic decisions, cross-doc review | Opus | Jarvis approval required |
| Implementation (code, bug fixes) | Sonnet | Default for all coding work |
| Simple lookups, formatting | Haiku | No gate |

**Rules:**
- No model introduces new features without explicit founder directive
- Sonnet is the default unless task requires strategic judgment (Opus) or is trivial (Haiku)
- All models follow the startup protocol in CLAUDE.md before working

---

## 3. Iteration Protocol

1. Read `project_memory.md` and `decision_log.md`
2. Check `strategic-directive.md` for pending fixes
3. Identify target document(s)
4. Apply only requested changes — no scope expansion
5. Verify cross-document consistency
6. Update `project_memory.md` if state changed
7. Update `decision_log.md` if new decision made

---

## 4. Guardrails

**Scope:** v1 feature set is LOCKED. No gamification. No AI. No social. Tech stack locked.

**Documents:** `founder-packet.md` is read-only. `CLAUDE.md` requires founder approval to change. LOCKED decisions in `decision_log.md` are not debatable.

**Code:** Amounts in øre (integers). Idempotency keys on payments. HMAC-SHA256 webhook verification. No sensitive data in logs. RBAC on all endpoints. Zod validation on all inputs.

**Tone:** Clear, direct, Scandinavian. Norwegian UI labels. No hype.

---

## 5. Shutdown Protocol

1. Update `project_memory.md` with state changes
2. Log new decisions in `decision_log.md`
3. Note unfinished work
4. No partially applied cross-document changes
5. Ensure all files consistent
