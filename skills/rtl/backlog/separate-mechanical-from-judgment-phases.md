# Backlog: Separate pure-mechanical procedure from judgment/exceptions

**Status:** Not started — captured for a future session, do not execute inline during a live conversion job.

## The problem

`SKILL.md` and `references/figma.md` currently interleave two very different kinds of instruction within the same early phases:

1. **Pure mechanical steps** that are always safe to apply with zero case-by-case judgment (flip this property, swap that value).
2. **Judgment/exception-handling prose** that accumulated into those same phases every time a production bug was found and fixed during real sessions — because the natural place to document a bug found *in* Phase 1 or Phase 2 was inside that phase's own section.

The result: Phase 1 ("Mechanical flips") now contains a paragraph about font-bridge branching logic that requires knowing Phase 0's scoping answer. Phase 2 ("Element order reversal") contains the WRAP-grid-per-row-reversal math, the hidden-children heuristic blind spot, the short-label heuristic blind spot, the "keep as-is needs the same evidence as reverse" standard, and the circular-verification trap — none of which is mechanical, all of which requires reasoning about the specific row in front of you.

Someone reading the skill top-to-bottom hits heavy judgment-call material before they even reach the phase everyone already knows is hard (Phase 3, directional icons). The skill's shape no longer matches its own intent: "mechanical first, reasoning second."

## The agreed direction

Restructure into two clearly distinct parts:

### Phase 1 — Mechanical (stays *only* what's always safe, no exceptions)
- Text alignment flip (RIGHT↔LEFT / LEFT↔RIGHT)
- Auto-layout axis flip (`primaryAxisAlignItems` / `counterAxisAlignItems`)
- Padding swap
- Constraints flip
- The auto-heuristic reversal for the clear-cut 2-visible-child asymmetric row case (small icon vs. large content) — this stays here *because* it's a confident, rule-based resolution, not a judgment call, when it applies
- Pattern-based skips (timestamps, numerics, emoji glyphs) stay here — they're lookups against a fixed list, not decisions

Nothing that requires deciding "is this the right call for *this specific* row/node" belongs in Phase 1. If a step needs a case-by-case decision, it moves to Phase 2.

### Phase 2 — Judgment & Exceptions (new; merges old Phase 2's hard parts + old Phase 3 entirely)
Everything that requires reasoning about a specific instance, moved here as one unified phase:
- Rows the Phase 1 heuristic couldn't resolve (flagged, ambiguous 2-child rows; 3+ child rows with a possibly-fixed middle element)
- `WRAP` grid per-row reversal (the row-chunking math) vs. `NO_WRAP` full-array reversal — telling them apart via `layoutWrap`
- Absolute-positioned decorations: detecting rotation, choosing among Cases A/B/C/D (simple mirror / full-matrix mirror / rendered-bounds reposition / coordinate-with-Phase-3), verifying against a reference
- The "keep as-is requires the same evidence standard as reverse" rule, and the circular-verification trap (comparing a node to its own untouched original isn't verification)
- The visible-children-only rule for size/symmetry judgments
- The short-source-label heuristic blind-spot, and the correct way to resolve a flagged queue (check the *specific* flagged node, not a same-named sibling assumed representative)
- `COMPONENT_SET` variant handling (`insertChild` blocked, manual `.x` workaround)
- Frame re-identification by structure after any reorder
- Directional icons (full content of old Phase 3): keyword/rotation candidate search plus mandatory visual screenshot review of list rows, nav headers, and disclosure affordances — a directional icon can have `rotation === 0` and a generic name, so property-based detection alone is insufficient

### Renumbering
- Old Phase 4 (Structural verification) → Phase 3
- Old Phase 5 (Translation) → Phase 4

## Scope of the edit when this is picked up

1. `SKILL.md`: renumber phases, move the Phase 1 font-bridge-branching paragraph into Phase 2, merge old Phase 3's content into new Phase 2, update all internal phase-number cross-references (Guardrails section references "Phase 2" for the horizontal-grouping-decision rule — verify it still points to the right phase after renumbering; the `translate` skill invocation reference in the frontmatter description and Purpose section says "Phase 5" and needs to become "Phase 4").
2. `references/figma.md`: same renumbering, move content between the equivalent `## Phase N` headers, update the "Ready-to-run scripts" table's Phase column, update the "Complete Operations Reference" table's Phase column, update all `Phase N` prose cross-references sprinkled through the gotcha sections (there are many — e.g. "batch Phase 1/2 fixes" should become "batch Phase 1 / Phase 2 fixes" or similar depending on which mechanical vs. judgment step is meant; each needs individual review since "Phase 2" meant different things before and after this restructuring).
3. `scripts/figma/`: filenames currently encode old phase numbers (`phase1b-find-absolute-children.js`, `phase2a-find-horizontal-layouts.js`, `phase2b-auto-reverse-icon-rows.js`, `phase2c-reverse-wrap-grid.js`, `phase3-find-directional-icons.js`). Decide whether to renumber files to match the new phase scheme (e.g. everything judgment-related becomes `phase2*`, directional icons becomes `phase2d` or similar) or leave filenames as historical/internal labels decoupled from the document's phase numbers. Renumbering is more consistent but touches more files and any external references to them; leaving them is lower-risk but means filenames won't match the doc's phase language. **Recommend deciding this explicitly before executing, not defaulting silently.**
4. Checklist (bottom of `figma.md`): reorder items to match the new two-part shape (mechanical items first, judgment/exception items grouped together after), without losing any existing item.
5. Re-read the whole of both files once more after editing — this session's iterative bug-driven edits mean there may be other stray "Phase N" references not caught by a simple grep (e.g. prose that says "the mechanical phases" or "Phases 1-2" as a range that will mean something different post-restructuring).

## Why this was deferred rather than done immediately

The user explicitly asked to capture this as a backlog item instead of executing inline, mid-conversion-job. This is a structural edit to the skill itself, not a fix for the frame currently being worked on — better done as a focused pass with fresh attention than squeezed into an active production session.
