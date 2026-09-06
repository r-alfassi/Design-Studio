---
name: figma-conversion-skill-builder
description: Build a new Figma screen-conversion skill (e.g. desktop→mobile, old design system→new, LTR→RTL) through calibration against real screen pairs, rather than writing the procedure from a spec up front. Use when asked to create a repeatable process for converting many screens of one kind into another, when an existing conversion has been done ad hoc a few times and should be turned into a documented skill, or when auditing/extending an existing screen-conversion skill that keeps needing manual fixes. Produces a skill in this same shape (SKILL.md + references/ + scripts/figma/ + backlog/), and defers to skills/skill-creator for generic SKILL.md-authoring mechanics.
---

# Figma Conversion Skill Builder

## Purpose

A meta-skill: it doesn't convert screens itself, it builds the skill that will. Use it when a screen-conversion job (desktop↔mobile, RTL↔LTR-style layout mirroring, old design system→new, any "transform screen A into screen B using a shared Figma design system" problem) is about to become repeatable — done more than a couple of times, or done once and clearly generalizable — and deserves a documented, testable procedure instead of being re-invented by hand each time.

The core discipline this skill teaches is **calibration**: derive the procedure from real screen pairs by doing the work and writing down what you learn, rather than designing it from a spec. A screen-conversion skill built by guessing the steps in advance reliably misses the actual failure modes (naming variance, silently-stale sizing modes, retroactive fixes that don't propagate) that only show up once you've actually converted enough real screens.

This skill is Figma-specific — it assumes the conversion happens via `use_figma` script execution, and its reference material (traversal gotchas, sizing-mode interactions, detach/variant-invalidation pitfalls) is Figma Plugin API-specific. If the conversion target isn't Figma, this skill doesn't apply.

## When to Use

- A screen-conversion pattern has been done manually 2-3+ times and the same categories of mistake keep recurring — it's time to make the procedure explicit rather than re-deriving it from memory each time.
- Someone asks to "build a skill for converting X screens to Y" from scratch.
- An existing screen-conversion skill exists but keeps needing manual correction on screens it should already handle — this skill's calibration/testing discipline (Phases 2-4 below) doubles as an audit method for that existing skill.

## Relationship to other skills

- **Defers to `skills/skill-creator` for generic SKILL.md mechanics** — frontmatter conventions, versioning, how to structure a workflow section, etc. This skill focuses only on what's specific to screen-conversion: the calibration methodology, the mechanical/judgment split, the gotcha-catalogue habit, and batch/production discipline. Don't re-derive skill-authoring basics here; load `skill-creator` for those.
- **Not `figma-ds-recreate` or `figma-build`** — those build a single component/screen from a spec or an existing source. This skill is for a *repeatable transformation applied across many screens*, where the transformation itself needs to be discovered before it can be documented.

---

## Decision point 0: what kind of deliverable is this?

Before starting calibration, decide — don't default silently:

**Is the resulting skill tied to a specific client/engagement (an "initiative"), or is it a general craft-skill with no client tie?**

- **Client-tied initiative** (e.g. a specific client's desktop→mobile migration): the resulting skill lives inside that client's project folder and should get the full Harness initiative treatment — `Brief.md`, `PRD.md`, `README.md` alongside the `SKILL.md`/`references/`/`scripts/`/`backlog/` packaging. Follow the client project's own `.harness/` governance for where these live and what they should say.
- **General craft-skill** (no client tie, reusable across any project — e.g. a layout-mirroring skill): lives in `Studio/skills/`, and skips the Harness initiative docs entirely — just the `SKILL.md`/`references/`/`scripts/`/`backlog/` packaging (see Phase 5).

Getting this wrong produces either governance overhead nobody asked for, or a client-specific skill with no paper trail for why it exists. If genuinely unsure, ask rather than guess.

---

## Phase 1: Find a calibration pair, and fix the ground rules before touching content

1. **Get a source screen and, if one exists, a finished target for the exact same screen.** The target is not required to start — some conversions won't have one yet — but if it exists, state explicitly and immediately: **it is a QA comparison tool for the end, never a source for deriving a step.** Write this rule down before doing anything else; violating it once (deriving "delete rows until there are 4" from a target that happened to show 4) will cost a correction cycle later, and the corrected version of that mistake should itself become a documented principle, not just quietly fixed.
2. **Fix the working-copy discipline before any content work**: never edit the source or a previous checkpoint in place. Decide now whether calibration will run in *incremental mode* (a new clone per phase, inspectable, for this exploratory stage) — almost always the right choice during calibration itself, since you don't yet know which step will need to be re-run or inspected. (Production/batch mode, covered in Phase 4, is a later decision once the procedure is stable.)

## Phase 2: Find the design system's own mechanical lever, and exhaust it before anything manual

Every screen-conversion problem with a real design system behind it has *some* built-in mechanism that does part of the transformation for free — find it before assuming manual work is needed anywhere.

1. Identify the candidate mechanism: a variant property (not necessarily obviously named — check every variant's *option values*, not just property names that sound relevant), a theme/mode toggle, an auto-layout direction setting, anything the design system already encodes.
2. Build a sweep that applies it everywhere it can reach, and produces three outcomes per instance, not two: **applies cleanly**, **applies but collapses/changes something else as a side effect** (note this — it can be intentional, a design system choice to serve multiple source states from one target state), or **doesn't apply at all** (a gap — flag it, don't improvise a substitute; a missing design-system capability is separate work for whoever owns that component).
3. Expect the sweep to be incomplete on the first pass — content nested inside a not-yet-broken-down compound instance won't be reachable yet. Re-run the sweep after each later structural change that exposes previously-inaccessible content.

## Phase 3: Separate mechanical from judgment as two literal, distinct phases — not a mood

This is the single most important structural decision in the whole procedure, and it should be decided explicitly, in these words, before writing anything else:

- **Mechanical phases**: everything that has one correct, deterministic answer given the source structure — the variant sweep (Phase 2), establishing the target shell/frame shape, propagating a structural resize down through nesting level by level (verify via actual property values, not a screenshot — visual rendering can mask a skipped level), recognizing structural roles and canonicalizing names *before* batch-operating on anything by name (never trust the source's literal naming to stay consistent across instances — this will not hold).
- **The judgment phase**: content that doesn't fit its available space and needs a human-reasoned decision about *how* to make it fit. Build this phase around:
  - **A fit heuristic that isn't just "did it error."** Compare content's *natural* minimum usable size against available space — a row that divides available space evenly with zero overflow error can still be individually unusable.
  - **A hard guardrail: never delete or fabricate content to force a fit.** The answer to "these things don't fit together" is always some kind of reflow (restack, resize proportionally, re-parent) of what's already there.
  - **When a correctly-resolved reference for the same content pattern surfaces later** (found after the skill already ran on some screens) **and it contradicts an earlier judgment call, that's a real correction, not a preference** — update the skill's stated rule, and — critically — go back and re-fix every already-produced instance that has the wrong version. A partial fix that isn't propagated to prior output is worse than not having fixed it, because it creates inconsistent deliverables that look equally "official."
  - **Set any newly-needed sizing-mode fix (hug/fill, whichever axis) at the moment each judgment call is applied — don't defer it to a later audit pass.** Deferral reliably reintroduces the exact bug the audit phase (Phase 3's closing step, mirrored in Phase 6 below) exists to catch, turning a small fix into a separate repair pass.
- Everything mechanical happens before everything judgment-based, every time — don't interleave phases mid-screen based on convenience.

## Phase 4: Test against genuinely novel instances before trusting the procedure

Calibrating against 2-3 screens is not the same as the procedure being correct — it's the minimum needed to *have* a procedure to test. Once a first-draft procedure exists:

1. Run it end-to-end against a screen shape that wasn't part of calibration — a different content composition, not just a different data-filled copy of the same shape. New shapes are what surface new gotchas; re-running calibration screens won't, because the procedure was already fit to them.
2. Run a **dedicated verification pass, separate from making the judgment calls**, that checks *every axis* the procedure touches (not just the one that happened to be relevant to the last bug found) and walks *every leaf node*, not just the wrapper frames whose properties were directly set. A single-axis or wrappers-only audit reliably misses a real class of bug.
3. Treat every gotcha found during novel-instance testing as a permanent addition to the skill's reference material (Phase 5) — symptom, cause, fix, cross-referenced from the workflow step where it applies. Don't just fix it inline and move on; the whole point of this phase is building that catalogue.
4. Test at least once in **one-shot mode** (single working copy carried through every phase, no intermediate clones) once the incremental-mode procedure is trusted — production runs won't use incremental mode, and one-shot mode surfaces its own bugs (stale references after structural mutations, scripts written for "clone this" that need to instead operate in place) that incremental-mode testing alone won't catch.

## Phase 5: Package the result

Write the actual skill once the procedure has survived Phase 4, in this shape:

- **`SKILL.md`** — the procedure as *phases in execution order*, each phase stating what's mechanical vs. requires judgment, cross-referencing the reference catalogue by number for anything that needs more explanation than a sentence. Include a **Working method** section stating the incremental-vs-one-shot mode choice and the never-edit-in-place rule explicitly — this is easy to state once and easy to violate without a name for the rule.
- **`references/figma.md`** (or split further only once one file gets unwieldy) — the gotcha catalogue: one numbered entry per gotcha, each with the concrete symptom, the cause, and the fix — not just prose warnings. Full format/standard: `references/gotcha-catalogue-template.md`. This is the artifact that actually compounds in value over time; treat every future gotcha found (including after the skill ships) as an addition here, not a one-off fix.
- **`scripts/figma/`** — one script per phase, parameterized (a node-ID constant to set, not hardcoded), with a header comment stating which gotcha(s) its specific ordering/structure defends against. Full conventions and a header template: `references/scripts-conventions.md`. State explicitly in the produced skill's own `SKILL.md` that a phase should use the existing script (adapted) rather than re-deriving the same logic from memory — a live run re-introducing an already-solved gotcha because a script wasn't consulted is a real, recurring failure mode, not a hypothetical one.
- **`backlog/`** — open questions the calibration/testing process surfaced but didn't resolve. When one gets resolved later (as in Phase 3's "correctly-resolved reference surfaces later" case), mark the file **resolved**, keep the original wrong reasoning below the resolution for context, and don't delete it — the history of why something was believed is worth keeping.
- **Working-log scratch material** (a running log kept during calibration) is *not* the skill — it's the input that gets distilled into the above four artifacts. Fine to keep alongside for history; don't confuse it with the deliverable.
- Per Decision point 0: add `Brief.md`/`PRD.md`/`README.md` only if this is a client-tied initiative, following that project's own Harness governance for content and location.

## Phase 6: Batch/production discipline

Once the skill is trusted and run at scale (many screens, possibly unattended):

1. **A retroactive correction to already-produced output must re-verify everything computed *relative to* what it changed, not just the thing directly being fixed.** A height-changing fix propagates to anything positioned relative to that height (an avatar anchored above a button, a footer, anything computed as `otherElement.position - offset`) — recomputing only the thing you were fixing and not its dependents leaves a silent, second bug of exactly the same shape as the first. This has recurred more than once across different fixes; treat "what depends on this element's final geometry, across every screen this fix touches" as a mandatory question at the end of every retroactive correction, not an occasional afterthought.
2. When applying the same fix across many already-produced screens, verify the fix mechanism itself on the *first* instance in detail (don't assume the pattern that worked in calibration transfers unchanged) before broadcasting it across the rest — an axis mistake (setting the wrong sizing-mode property, e.g.) can look like it worked on one screen by coincidence and then fail silently on others with slightly different starting geometry.
3. Run the Phase 4 verification pass (both axes, all leaves) across the *whole batch* after any batch-wide fix, not just the screens you expect to have been affected — an assumption about which screens "have this pattern" can itself be wrong.
