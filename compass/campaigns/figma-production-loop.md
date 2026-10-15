# Figma-to-production loop

State: Defined.

Tier: next.

## Vision

A project can iterate visual construction in Figma and translate only accepted scope into production, so that neither design exploration nor runtime work silently becomes a product commitment.

## Quest Q-53 — complete the first project pilot

State: Defined.

Initiated: 2026-08-26.

Purpose: let a project iterate visual construction cheaply in Figma while retaining a bounded, checkable path to production. Figma deltas must not silently become product or platform commitments, and production changes must not require pushing every exploratory adjustment into the application.

Surfaces:

- `formats/figma-change-log.md` specifies the project change record.
- `formats/figma-implementation-contract.md` specifies the bounded Figma-to-production mapping.
- `skills/figma-production-loop/SKILL.md` orchestrates the loop and refers to existing procedures rather than copying them.
- Container topology is a required contract invariant: material visible boxes must have a truthful Figma hierarchy and named Android mapping, not merely similar pixels.
- `adapters/android-views.md` applies only to Android Views.

Pilot: Sharon is the first project instance. Its records are root files, `FIGMA-CHANGELOG.md` and `FIGMA-TRANSLATION.md`, beside `DESIGN.md`; two files do not justify a new directory. The component or screen is intentionally unselected; the next real Sharon design change supplies the candidate.

Exit evidence: one explicitly contracted Figma component or screen has a linked decision, change-log delta, mapping with named intentional platform differences, separately authorized implementation, and production or device verification. The pass shows whether the loop reduces avoidable production churn without creating a second product history.

Non-goals: do not claim Figma parity for an uncontracted node; do not treat Figma as authority for data, accessibility, interaction, permissions, or Android lifecycle; do not broaden the Android Views adapter to Compose; do not create or change Sharon production code merely to demonstrate the process.
