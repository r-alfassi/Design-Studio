# Mobile design standard and sprint topology

State: In-flight.

Tier: now.

## Vision

Mobile Figma work has a readable text floor and a legible sprint history, so that a project can make dense screens usable without losing the work that led to a decision.

## Quest Q-64 — apply the standard and containment repair

State: In-flight.

Initiated: 2026-09-11. Designer approved.

Purpose: establish a selected, binding cross-project floor for readable mobile Figma text and prevent demonstrated Figma organization failures: page-level sprint or lab orphans, and independent initiatives merged into one visual row.

Admission:

- Kind: a standard, not a deliverable, reasoning framework, or procedure. It sets a stable design constraint with scope, validation, and an explicit exception route.
- Overlap: no existing resident establishes a binding mobile-legibility floor or exception rule. The Figma production loop remains the execution procedure and receives the structural gate rather than duplicating the standard.
- Shape: `standards/mobile-design.md`, containing scope, binding statement, validation, and exception route.
- Client-content scan: authored from a generalized mobile-screen case and contains no project names, node IDs, library keys, private token dumps, or operator paths.

Change:

- Introduce `standards/` as the fourth normative resident kind.
- Set a 14 px minimum for visible user-facing mobile Figma text, require structural responses to density, and make exceptions explicit.
- Generalize the Figma sprint-page model: one named horizontal section per initiative, a vertical chronological stack of those rows, and supporting labs contained in their originating initiative rather than promoted to their own page-level row.
- Make the post-write containment gate resolve the section ID, append or reparent clones before placement, then verify parentage, bounds, and absence of page-level orphans before review or promotion.

Evidence still required:

- Apply the containment repair to the affected Karma Warrior sprint.
- Inspect the hierarchy after repair.
- Cite `standards/mobile-design.md` from the Karma Warrior `DESIGN.md` when that project record is writable.
