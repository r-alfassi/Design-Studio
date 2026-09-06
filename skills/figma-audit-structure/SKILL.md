---
name: figma-audit-structure
description: Audit a Figma frame for structural issues — overflow, redundant wrappers, missing auto-layout, hard-pinned positions — then fix authorized findings. Always inspects and gates before touching anything.
---

# figma-audit-structure

Inspect a Figma frame for layout and structure problems, report findings at a gate, then apply authorized fixes.

---

## When to use

Load this skill when a frame has suspected structural issues: layout breakage, misaligned children, overflowing content, or a tree that looks deeper than it should be.

---

## Scripts

Reusable Figma scripts live in `scripts/figma/`. Set the parameter block at the top of each script before running. All scripts return a structured result plus an inline screenshot.

| Script | Phase | Use for |
|---|---|---|
| `inspect.js` | Phase 1 | Structural inspection — returns issue list and tree; drives Phase 2 classification. Also annotates component ownership (Component Guardrail) and checks `constraints` on ignore-auto-layout children (`hard-pinned-position`) |
| `fix-flatten-wrappers.js` | Phase 3 | Collapse redundant nested frames; reconciles the survivor's `itemSpacing`/padding if it's auto-layout |
| `fix-overflow.js` | Phase 3 | Default `MODE:'FILL'` — adopt the parent's size declaratively instead of resize/reposition |
| `fix-auto-layout.js` | Phase 3 | Convert plain frame to auto-layout; derives item spacing from current child gaps, or use `WRAP_RANGE` for a flex-spacer when a trailing child must stay pinned to an edge |
| `fix-hard-pinned-position.js` | Phase 3b | Lightweight fix for a single-edge-pinned child: set `constraints` on an ignore-auto-layout node instead of restructuring the tree |

When a fix reveals a new structural issue not in the original report, stop, re-run `inspect.js`, and re-gate before continuing.

---

## Prerequisites

Load `figma-use` before any `use_figma` call.

---

## References

`references/` holds research notes that back specific taxonomy rules and fix choices —
load them when a new scenario doesn't cleanly match the taxonomy, or when a fix's
correctness feels uncertain, rather than guessing or re-deriving from scratch.

| Reference | Covers |
|---|---|
| `references/auto-layout-best-practices.md` | Figma's own documented patterns vs. what this skill encodes — confirms `createFrame()`'s default white fill, FILL-container preconditions, instance override restrictions, and the spacer-with-FILL technique; documents the constraints-based alternative to `hard-pinned-position` fixes; flags open, not-yet-promoted ideas (broader redundant-wrapper detection, `space-between` vs. spacer tradeoffs) |

---

## Phases

### Phase 1 — Inspect

Run two parallel calls:
- `inspect.js` (via `use_figma`) on the target node — returns structured issue list and layer tree
- `get_screenshot` — capture the current visual state

Do not modify anything yet.

### Phase 2 — Classify

Match findings against the issue taxonomy. Assign each finding as **Mechanical**, **Judgment**, or **Component-owned** (see taxonomy and Component Guardrail below).

**Normal mode:** Do not produce a full report. Proceed directly to Phase 3a — mechanical fixes run without a gate. Surface only Judgment findings as selects (Phase 3b).

**Dev mode:** Produce the full audit report (see Report Format → Dev Mode), grouped by layer. Gate before proceeding to Phase 3a.

### Clone-Before-Fix Guardrail

Never apply Phase 3 fixes directly to an established/production section, page, or frame that others rely on. Before running any Mechanical or Judgment fix at section- or page-scope (not a single working-copy frame the operator already isolated for this purpose), clone the target section/frame first and redirect all fix operations to the clone. Report which node is the original and which is the clone in every subsequent message, so the operator always knows which one is safe to touch and which one is the record of "how it looked before." Only the operator decides when (or whether) fixes get merged back into the original — this skill never does that automatically.

This does not apply retroactively to a frame the operator has already set up as a disposable working copy (e.g. duplicated into a comparison section for this exact purpose) — that is already the clone.

### Component Guardrail

Before classifying a finding as Mechanical or Judgment, check whether the affected node is component-governed:
- The node itself is a `COMPONENT` or `COMPONENT_SET` (a main component definition), or
- The node is an `INSTANCE` (or nested inside one) whose `mainComponent` is `remote: true` (from a published library), or otherwise not owned by this file/page.

If either is true, reclassify the finding as **Component-owned** and do not attempt a fix, even if the operator has already approved a batch that would otherwise cover it. Report it separately: name the component, describe the fix that would be needed, and recommend it be made at the source (the main component or the owning library file), not as a local override on this instance. This applies even when a property fix *looks* achievable — some auto-layout properties (e.g. `layoutPositioning`) are locked against instance overrides by the component author and will throw `"This property cannot be overridden in an instance"` even though the same edit succeeds when done by hand in the Figma UI on that specific file. A caught error on retry is not a green light to work around the restriction (e.g. by detaching the instance) — surface it as a Component-owned finding instead.

### Phase 3a — Mechanical fixes (no gate in normal mode)

Apply in dependency order without asking:
1. Redundant wrappers (flatten first — establishes clean structure for everything else)
2. Overflow containers (correct sizes and offsets)
3. Missing auto-layout (convert frames once their children are clean)

Each fix is a separate `use_figma` call. Screenshot after each one. When all are done, report a brief summary of what was applied (see Report Format → Normal Mode).

In dev mode: gate before applying (single batch authorization).

### Phase 3b — Judgment fixes (select per finding)

Present each Judgment finding as a select — not an open question. State the assumption, then offer three options:

```
[Fix]  [Skip]  [Mark as intentional]
```

- **Fix** — apply the fix
- **Skip** — leave unchanged this session
- **Mark as intentional** — leave unchanged and suppress from future audits on this frame

Order: width mismatches first, then hard-pinned positions.

---

## Issue Taxonomy

**Layer** determines how a finding is gated: Mechanical findings are batched into a single authorization; Judgment findings are gated individually with assumption disclosure; Component-owned findings are never fixed by this skill — see Component Guardrail above.

| Issue class | Layer | Detection signal | Severity | Default fix |
|---|---|---|---|---|
| `redundant-wrappers` | Mechanical | 2+ consecutively nested frames with identical (or near-identical) dimensions and no layout purpose | High | Collapse to single container; move children up. If the survivor is itself auto-layout, reconcile its `itemSpacing`/padding with the effective gap the removed wrapper was actually producing (`fix-flatten-wrappers.js` does this automatically) — do not assume copying x/y is sufficient |
| `overflow-container` | Mechanical | Child frame wider/taller than parent, or negative x/y offset | Medium | Default to `layoutSizingHorizontal/Vertical = 'FILL'` on the offending node (plus centered alignment on it and any text children using oversized widths to fake centering) — not a resize/reposition. Treat as a real defect to fix, not a possibly-intentional centering technique; "it renders correctly today" is not evidence of intent when nothing in the tree declares the relationship. See `fix-overflow.js` MODE='FILL' |
| `no-auto-layout` | Mechanical | Frame with structurally-related children using absolute x/y (children that stack, align, or space together) | Medium | For a simple stack: convert to auto-layout, derive spacing from current gaps. For a fixed-viewport frame with a trailing child pinned to an edge (e.g. header/content/footer where the footer must stay put): do NOT apply one uniform derived spacing — it will drag the pinned child out of position. Instead wrap the in-between children in a new frame with `layoutSizingVertical/Horizontal = 'FILL'` (a flex-spacer that absorbs the leftover space in a FIXED-height parent), so the trailing child's position falls out of the layout instead of a hardcoded gap. See `fix-auto-layout.js` WRAP_RANGE |
| `width-mismatch` | Judgment | Container narrower than screen — may be intentional margin; state assumption before fixing | Medium | Widen to screen width with padding, or confirm narrow is intentional |
| `hard-pinned-position` | Judgment | Ignore-auto-layout (`layoutPositioning: 'ABSOLUTE'`) child inside an auto-layout parent, still on Figma's default `MIN`/`MIN` constraints — no declared relationship to any edge. A node with the same ABSOLUTE positioning but *non-default* constraints is presumed deliberately anchored (Figma's own recommended pattern) and should NOT be flagged | Low | Single-edge relationship (e.g. pin to bottom): set the matching `constraints` — `fix-hard-pinned-position.js`. Needs to flex with leftover space among multiple siblings: bring into the flow via a FILL spacer — `fix-auto-layout.js` WRAP_RANGE. See `references/auto-layout-best-practices.md` |
| `component-owned` | Component-owned | Node is a `COMPONENT`/`COMPONENT_SET`, or an `INSTANCE` (or descendant of one) backed by a remote/library `mainComponent` | — | No local fix. Report the needed change and point to the source component/library file |

---

## Report Format

### Normal Mode

After Phase 3a completes, print a brief applied summary. Then present each Judgment finding as a select.

```
Applied N fixes to [Frame Name]:
  ✓ Collapsed N redundant wrapper frames
  ✓ Corrected overflow container ([detail])
  ✓ Converted [Frame name] to vertical auto-layout

---

[If judgment findings exist:]

WIDTH-MISMATCH · [Frame name]
Assumption: [state the assumption]
Fix: [what will change]
[ Fix ]  [ Skip ]  [ Mark as intentional ]

HARD-PINNED-POSITION · [Frame name]
Assumption: [state the assumption]
Fix: [what will change]
[ Fix ]  [ Skip ]  [ Mark as intentional ]

---

[If component-owned findings exist:]
⚪ [Component name] — fix needed at source component, not overridden here.
```

### Dev Mode

Full report before any fixes are applied. Gate before Phase 3a.

```
## Structure Audit — [Frame Name]
[screenshot]

### Mechanical findings (N) — Confirmed

🔴 REDUNDANT-WRAPPERS · High · Confirmed
[Frame names and IDs]
[One-line description]
Fix: [what will change]

🟡 OVERFLOW-CONTAINER · Medium · Confirmed
[Frame name and ID]
[One-line description]
Fix: [what will change]

🟡 NO-AUTO-LAYOUT · Medium · Confirmed
[Frame name and ID]
[One-line description]
Fix: [what will change]

→ Gate: Fix all mechanical findings? (or call out any to skip)
  Apply order: wrappers → overflow → auto-layout

---

### Judgment findings (N) — Inferred

🟡 WIDTH-MISMATCH · Medium · Inferred
Assumption: [state the assumption]
Fix: [what will change]
[ Fix ]  [ Skip ]  [ Mark as intentional ]

🔵 HARD-PINNED-POSITION · Low · Inferred
Assumption: [state the assumption]
Fix: [what will change]
[ Fix ]  [ Skip ]  [ Mark as intentional ]

---

### Component-owned findings (N) — not fixed by this skill

⚪ COMPONENT-OWNED · [Component/instance name, ID, library]
[What the issue is and what fix would resolve it]
→ Fix at source component/library
```

**Severity legend:**
- 🔴 High — likely broken or broken-looking today
- 🟡 Medium — fragile; will break on content change
- 🔵 Low — maintainability issue; not visually broken

---

## Improvement Loop

This skill improves through real audits. Use this workflow to feed learnings back into the taxonomy.

**After each audit session** — log any of the following as a `.md` file in `backlog/`:
- A new issue class that caused real breakage but isn't in the taxonomy
- A detection heuristic that produced a false positive or missed a case
- A severity that felt wrong (too high, too low) given the actual impact

Each backlog file should include: what was observed, which frame/project it came from, and what the proposed taxonomy change is.

**When enough evidence has accumulated** — review `backlog/` and promote into the skill:
- New issue class → add a row to the taxonomy table with detection signal, severity, and default fix
- Refined heuristic → update the detection signal on an existing row
- Severity adjustment → update the severity and note the reasoning
- Promoted entries → delete from `backlog/` once merged

**When promoting**, enable skill dev mode (confidence markers on) and run the updated taxonomy against a real frame to verify the new entry classifies correctly before committing it. A new class that can't produce a Confirmed or Inferred finding against real data isn't ready yet.

---

## Skill Dev Mode

When iterating on this skill itself, append confidence markers to each finding header:

```
🟡 OVERFLOW-CONTAINER · Medium · Confirmed
🟡 WIDTH-MISMATCH · Medium · Inferred
```

- **Confirmed** — detectable from metadata alone (e.g. negative x/y, child exceeds parent bounds, `layoutMode` absent)
- **Inferred** — requires judgment about intent (e.g. narrow container that could be intentional margin)

Confidence markers are hidden in normal operation. Enable them only when actively developing or debugging the skill taxonomy.

---

## Operating Rules

- Always inspect before touching anything — never skip Phase 1
- Always classify before fixing — never skip Phase 2
- **Normal mode:** apply mechanical fixes without a gate; present only Judgment findings as selects
- **Dev mode:** full report + gate before Phase 3a; confidence markers visible on all findings
- Fix mechanical findings in dependency order — wrappers → overflow → auto-layout
- Screenshot after each fix — catch regressions before moving to the next
- Judgment selects have exactly three options: Fix / Skip / Mark as intentional — never ask open-ended
- If a Judgment finding is marked as intentional, note it so future audits don't re-flag it
- If a fix reveals a new structural issue, stop — re-run `inspect.js` and present as a new Judgment select before continuing
- Never run Phase 3 fixes directly on an established/production section, page, or frame — clone it first and work on the clone, unless the operator has already isolated a disposable working copy (see Clone-Before-Fix Guardrail); always state which node is the original and which is the clone
- Never attempt to edit a main component (`COMPONENT`/`COMPONENT_SET`) or an instance backed by a remote/library component — classify as Component-owned and report it instead (see Component Guardrail)
- If an instance property edit throws an override-restriction error (e.g. `"This property cannot be overridden in an instance"`), do not work around it (detaching the instance, editing a different property to fake the same effect) — reclassify the finding as Component-owned and report it
- Any node created with `figma.createFrame()` (or `figma.createAutoLayout()`) — e.g. a spacer/wrapper introduced by `no-auto-layout` or restructure fixes — defaults to a solid white fill. Always set `fills = []` on it immediately after creation unless a visible fill is actually wanted; verify with `node.fills` in the same script's return value, not just a screenshot (a white fill over a white/light canvas can pass a visual check unnoticed)
- Before flagging `hard-pinned-position`, check the node's `constraints` — an ignore-auto-layout child with deliberately set (non-default) constraints is a correctly anchored element, not a defect; only flag it when still on Figma's default `MIN`/`MIN`
- When a new scenario doesn't cleanly match the taxonomy, or a fix's correctness is uncertain, consult `references/` before guessing — it documents which of this skill's rules are confirmed against Figma's own documentation and which are still open questions
