# Candidate Design Studio residents

State: Seed.

Tier: later.

## Vision

Only reusable, non-overlapping, client-safe design guidance enters Design Studio, so that a local lesson does not become a permanent convention without evidence.

## Quest Q-65 — mockup comparison-control placement

State: Seed.

Origin: surfaced in a Sharon project session on 2026-07-14 and initially captured as personal working memory outside a governed record. It was corrected into Design Studio backlog material on 2026-09-19.

Purpose: a comparison or testing control in an interactive mockup, such as toggling container styles, layouts, or copy options, belongs in the mockup's outer testing harness alongside any existing tab or state switcher. It does not belong in the simulated interface. Putting the control in a phone screen alongside real controls blurs what a user would see in the shipped product and what exists only for comparison.

Proposed admission:

- Kind: a standard, a stable constraint on mockup construction rather than a deliverable shape or reasoning framework.
- Overlap: not yet checked against `preview-server` conventions.
- Shape: likely `standards/mockup-comparison-controls.md`, with scope, the binding rule, and guidance on avoiding CSS or selector collisions when an outer-harness class name is reused in app content.
- Client-content scan: not yet performed. The source incident comes from Sharon and needs a neutral generalized case before admission, following Q-59's precedent for adopted material.

Awaiting: Designer decision whether it deserves a dedicated standard or belongs in an existing mockup-building skill or reference.

## Quest Q-66 — research the convention first

State: Seed.

Origin: surfaced in a Sharon project session on 2026-08-15 and initially captured as personal working memory outside a governed record. It was corrected on 2026-09-19.

Purpose: before changing interaction-design or UI behavior, including keyboard dismissal, gesture handling, navigation patterns, or standard component behavior, research the platform convention and present the finding before proposing or implementing a change. A report of a symptom is not enough reason to patch directly.

Proposed admission:

- Kind: a framework, a reasoning discipline rather than a fixed deliverable or procedure.
- Overlap: not yet checked against the frameworks directory or `library/heuristic-evaluation.md`; it may belong inside existing material rather than stand alone.
- Shape: likely a short frameworks entry or a clause in an existing interaction-design framework.
- Client-content scan: not yet performed.

Awaiting: Designer decision whether the result is a new framework or a clause inside an existing one.
