---
name: rtl
description: Bidirectional RTL↔LTR layout-mirroring skill for Hebrew/Arabic and English. Use when building a screen for a right-to-left language, converting an existing design's layout direction between RTL and LTR, or reviewing a screen for RTL/LTR compliance. Covers medium-agnostic principles here; routes to Figma, HTML, and React implementation detail in references/. Translation itself is a separate skill — see `translate` — invoked as this skill's second-to-last phase.
version: 3.0.0
---

# RTL — Bidirectional Right-to-Left ↔ Left-to-Right

## Purpose

Mirror the layout direction of a screen — alignment, grouping, element order, and directional icons — between RTL (Hebrew, Arabic) and LTR (English and most other languages), in either direction. Covers medium-agnostic principles and workflow here; tool-specific implementation code lives in `references/`.

This skill does not translate text. If the job also needs new-language copy, that's the `translate` skill, invoked as this skill's Phase 5 (see Workflow below) — **after** all layout mirroring is applied and structurally verified, as the final step. A layout-direction change and a translation are independent concerns: you can mirror an English screen into RTL with no new copy yet, or translate into a same-direction language (English→French) with no layout change at all — which is exactly why Phase 0 asks about both before assuming anything.

## When to Use

- Building a new screen in Hebrew or Arabic (or English)
- Converting an existing design's layout direction from RTL to LTR, or from LTR to RTL
- Debugging RTL/LTR alignment or ordering bugs
- Reviewing a screen for direction compliance before sharing with a client

## Tool-Specific References

Load the reference file for the medium in use — each carries the full implementation code, gotchas, and a checklist for that medium:

- **Figma (and FigJam)** → `references/figma.md`
- **HTML / CSS** → `references/html.md`
- **React** → not yet written; when the need arises, extend `references/html.md`'s DOM/CSS principles with component-level patterns (prop-driven `dir`, RTL-aware styled-components, etc.) and split into `references/react.md`

For translating text content (independent of, or alongside, a layout mirror), see the separate `translate` skill.

---

## The Horizontal Mirror Principle

This is the single rule everything else in this skill implements. It holds across every medium — Figma, HTML, React, native.

> **Converting between RTL and LTR is a horizontal mirror of the entire layout — not just text alignment.** Every horizontal grouping of elements must also reverse its order, because "first" means the opposite physical side depending on direction — this is the default, and it holds unless a verified reference in the target direction (see Phase 2's evidence standard) shows a specific grouping genuinely doesn't follow it. The default exists because most groupings do follow it and there usually isn't a reference to check; it is not a claim that no exceptions exist.

Three layers must be applied together. Skipping any one produces a result that looks "almost right" — which is worse than obviously wrong, because it slips past review.

| Layer | What changes | RTL | LTR |
|---|---|---|---|
| Text alignment | Default text direction | Right | Left |
| Grouped-content alignment | Where a block of content clusters within its container | Right edge | Left edge |
| **Element order** | Sequence of siblings in a row | First-read = rightmost → **array/DOM order runs right-to-left visually** | First-read = leftmost → **array/DOM order runs left-to-right visually** |

Element order reversal is **the same operation in both directions** — it is its own inverse. Reversing `[A, B, C]` gives `[C, B, A]`; reversing again returns `[A, B, C]`. This is why one skill serves both conversion directions instead of two separate ones.

### Why element order matters

In every medium covered here, siblings render in source/array order, left to right on screen, by default. RTL context flips *how that order is interpreted* (in HTML, `dir="rtl"` does this natively for flex/grid; in Figma, there is no native flip — the array itself must be reversed). Either way, "first-read" and "array-first" point at opposite screen edges depending on direction. Converting between directions without reversing element order leaves icons, avatars, and action buttons on the wrong side even after alignment and text are otherwise correct.

Concrete examples seen in production (Figma, but the principle is medium-agnostic):
- Bot avatar + message: RTL `[text, avatar]` → LTR `[avatar, text]`
- Chat input bar: RTL `[mic, placeholder, +]` → LTR `[+, placeholder, mic]`
- Nav header (space-between layout): RTL `[menu, back]` → LTR `[back, menu]`
- Feedback tag row: RTL `[tag-C, tag-B, tag-A]` → LTR `[tag-A, tag-B, tag-C]`

---

## Core Principles (apply regardless of medium)

### 1. Reading direction governs layout

The page starts at the reading-direction edge and flows inward — right edge for RTL, left edge for LTR. "First" means whichever edge that language starts from. Every layout decision — element order, alignment, grouping — must reflect this.

### 2. Default text alignment follows reading direction

Text defaults to the reading-direction edge (right for RTL, left for LTR). Override to center only where explicitly justified. Leave already-centered content centered.

### 3. Element order mirrors reading direction

In a row of siblings, the most important or first-read element sits at the reading-direction edge (right for RTL, left for LTR). Secondary elements follow inward. Action buttons sit at the far edge — they are the last thing read, even when visually prominent.

**This principle applies to every icon just as much as to every other element** — including icons whose *shape* is non-directional (see Principle 4). Whether an icon's glyph should mirror and whether that icon's *position* in a row should reverse are two independent questions, decided by two different phases (Phase 3 and Phase 2 respectively). An icon being "non-directional" under Principle 4 is a statement about its shape only — it is not, by itself, a reason to exempt that icon's row from element-order reversal. The default for every horizontal row is reversal per this principle; treating a specific row as a fixed-position exception requires the evidence standard in Principle 4 and the tool-specific reference — not an inference borrowed from the icon's shape being non-directional.

### 4. Directional icons must flip; non-directional icons must not

Icons implying a reading direction — arrows, chevrons, breadcrumb separators, forward/back indicators — mirror horizontally when direction changes.

Do not flip: close (×), plus (+), checkboxes, status indicators, brand logos, non-directional decorative icons.

**This principle governs shape only** — whether the icon's own glyph gets horizontally mirrored. It says nothing about where that icon sits in its row; that's Principle 3's question, answered independently. Do not use "this icon is non-directional" as justification for leaving its row's element order unreversed.

A genuine fixed-position convention (an icon that stays in the same corner regardless of language, common for some profile/settings affordances in some design systems) is a real thing that does happen — but it is a claim about *this specific row*, not an inference from the icon's shape-mirroring status, and it needs the same evidence standard as any other "don't reverse this" decision: see the tool-specific reference for what counts as sufficient verification.

### 5. Numbers and code stay LTR regardless of context

Numerals, currency amounts, phone numbers, dates, URLs, and code always render LTR even inside an RTL layout. Set the base direction correctly and let the platform's bidirectional text handling do this automatically — do not manually reverse digit strings.

### 6. Spacing is directional, not symmetric

A left-side padding of 16px in LTR is a right-side padding of 16px in RTL. Padding, margin, and indentation are directional properties and must flip — most mediums do not do this automatically unless you use direction-aware properties (see each reference for the specifics).

---

## Confirm direction before starting

State (or infer from the source) which conversion is happening:

- **RTL → LTR**: Hebrew/Arabic source, English (or other LTR) target
- **LTR → RTL**: English (or other LTR) source, Hebrew/Arabic target
- **Building fresh in RTL or LTR**: no conversion, just apply Core Principles directly in the target direction

All workflow phases below are identical in shape for either conversion direction; only the flip direction (right↔left, MAX↔MIN, etc.) inverts. This symmetry is why a single skill — not two direction-specific ones — covers both.

---

## Workflow — execute in order (conversion tasks)

For building fresh (no existing opposite-direction source), skip straight to applying Core Principles in the target direction; the phases below assume a conversion from an existing frame/page.

### Phase 0: Scope the job, then recon

**Before anything else, ask explicitly**: does this job need a layout-direction change, a translation, or both? Don't infer or assume silently — even though the answer is "both" in the large majority of real jobs, stating it up front decides which later phases run:

- **Direction change only** → run Phases 1–4, skip Phase 5 entirely
- **Translation only, no direction change** → skip this skill; go straight to the `translate` skill
- **Both** (the common case) → run the full workflow below, Phase 5 included

Then, structural recon:

1. View the target visually first (screenshot for Figma, rendered page for HTML) — understand the structure before deciding a reorder/detach strategy.
2. Check for existing direction-handling machinery already in place (a component property, a `dir` attribute, a theme toggle) — use it instead of manual overrides where it exists.

(Font selection for the target language's script is a `translate`-skill concern, not this skill's — see there if Phase 5 applies to this job.)

### Phase 1: Mechanical flips (no judgment needed — with one exception)

Apply in one pass:
1. Flip text alignment to the target direction's reading edge. Skip timestamps, pure numerics, single icon glyphs, and anything intentionally centered.
2. Flip grouped-content alignment (whatever "cluster toward an edge" mechanism the medium offers) to the target edge.
3. Swap asymmetric directional spacing (padding/margin) where the two sides differ.
4. Flip any positional constraints/pinning that reference a screen edge.

**The one judgment call in this otherwise-mechanical phase:** some mediums require a resource (a loaded font, in Figma's case) to make even a pure alignment change, and the obvious workaround for a missing resource can have side effects specific to the *current* content's script/encoding. When that happens, whether the fix can be safely applied now or must be deferred to Phase 5 depends directly on Phase 0's scoping answer — if translation is coming, defer; if this is direction-only, flag rather than risk a fix that silently breaks the content. See the tool-specific reference for the concrete case.

### Phase 2: Element order reversal (mandatory)

**This is the step most commonly skipped, and the resulting bug is the most visually obvious kind of RTL/LTR error** — an icon or avatar sitting on the wrong side reads as broken to anyone, technical or not.

Apply an automated heuristic for the common "small element + large content" row pattern, and flag anything ambiguous (mixed-size groups, a semantically fixed middle element, or a structure the reorder mechanism can't safely touch) for manual review rather than silently skipping it. Tool-specific heuristics and code are in the reference files.

Every horizontal row must reach an explicit decision — reversed, kept, or flagged. None may be silently skipped.

### Phase 3: Directional icons — always executed, never skipped on the assumption Phases 1-2 covered it

Find candidates (arrows, chevrons, back/forward/prev/next-named elements, breadcrumb separators, anything inside nav/header rows) and decide per Core Principle 4: mirror if it encodes reading direction, keep if it doesn't.

**This phase must actually run — it is not covered by Phases 1-2 succeeding.** Mechanical alignment fixes and element-order reversal say nothing about whether an icon's own shape still points the wrong way; a clean Phase 1/2 pass creates no signal that Phase 3 is unnecessary. Found via production testing: an entire section's disclosure chevrons were left pointing the source-direction way because Phase 3 was never actually executed for that section, despite Phases 1-2 having run.

**Property-based detection (name keywords, rotation) is a rough filter, not sufficient on its own.** A real directional icon can have `rotation === 0` on its wrapper and a fully generic name — its direction baked into which vector artwork is used, not a property any script can read. Screenshotting representative list rows, nav headers, and expand/disclosure affordances is mandatory, not optional, alongside any automated candidate search.

### Phase 4: Structural verification

Review the mirrored result **before any translation happens** — text is still in the source language at this point, which is deliberate: a layout bug and a translation bug should never be debugged at the same time. Confirm:
- Text alignment matches the target direction, correctly
- Grouped content clusters at the correct edge
- Every reordered row has its elements on the correct side (avatars, icons, action buttons)
- Directional icons point the correct way
- Element order survived any batch property mutations intact (some engines can silently scramble order during bulk edits — re-verify after)

Only once this is clean does the job move on. Report what changed and flag anything still needing manual review before proceeding to Phase 5.

### Phase 5: Translation (only if scoped in at Phase 0)

The layout is now mirrored and verified. If Phase 0 scoped this job as including translation, do it now — last, using the `translate` skill.

Doing it in this order (mirror and verify first, translate last) means the mirroring phases operated on stable, unverified-but-simple source-language text, and translation's own overflow-checking (part of the `translate` skill) runs against the final, already-verified container shapes rather than pre-mirror ones. `translate`'s own overflow check is this job's final content-level verification — this skill doesn't need a Phase 6 to re-check after it.

If Phase 0 scoped this job as direction-only, skip this phase — the job is already done as of Phase 4.

---

## Guardrails

1. Never make destructive, hard-to-reverse structural changes (detaching a Figma component, deleting a shared HTML/React component) without explicit approval — flag and ask instead.
2. Never edit a shared/master definition (Figma main component, a shared React component, a base stylesheet used by more than this screen) unprompted — a change there affects everything that uses it. Flag it.
3. Every horizontal grouping must reach an explicit decision in Phase 2 — no silent skips.
4. If the same shared component/definition appears in multiple places being converted in one batch, convert the shared definition first to avoid double-processing or divergence.

## Failure protocol

When a step can't be completed (an ordering that can't be safely changed, a structure the reorder mechanism can't touch, a fix that would require a guardrail-violating action):

1. Flag it visibly in the medium (a red-stroked frame in Figma, a clearly marked TODO/comment in code) so it isn't missed.
2. Add a short note describing what's blocking it and what decision is needed.
3. Don't attempt further workarounds once flagged — let the operator decide.

Tool-specific flagging mechanics (e.g. exact Figma stroke code) are in the reference files.
