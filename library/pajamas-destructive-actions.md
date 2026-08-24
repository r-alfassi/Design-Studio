# Pajamas — Destructive Actions Pattern

**Source:** [design.gitlab.com/patterns/destructive-actions](https://design.gitlab.com/patterns/destructive-actions/)
**Author/owner:** GitLab (external) — not authored or owned by this repo

## What it is

GitLab's own design system's pattern for confirm-vs-destroy actions,
tiered by severity rather than treated as one undifferentiated case:

- **High severity** (hard to undo) — modal confirmation, danger-variant
  button, sometimes a typed confirmation of the object's name.
- **Medium severity** (frustrating but recoverable — e.g. discarding unsaved
  edits) — deliberate friction: an extra interaction step, real visual or
  spatial separation from the primary action. Not treated identically to
  Low.
- **Low severity** (cheaply reversed) — no added friction; default styling,
  commits immediately.

The organizing move: friction is proportional to consequence, not applied
uniformly and not skipped uniformly.

## When to reach for it

Any confirm/discard, save/cancel, or commit/undo pair where the two actions
currently look or sit the same. Use the severity tiers to decide how much
separation (visual weight, spacing, an added tap) the discard side actually
needs — not by intuition alone.

## Why it's here

Sharon's Corner Action cluster (Edit/Save/Cancel, `CasesActivity.kt`) placed
Save and Cancel as adjacent, same-size, same-treatment icons — exactly the
undifferentiated case this pattern warns against. Cancel there is Medium
severity (discards unsaved edits, doesn't destroy committed data), which by
this pattern should read as more separated from Save than it currently does.
Surfaced 2026-08-24; see Sharon's `federation/WORK.md` for the live case.
