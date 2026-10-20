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

## Quest Q-67 — refine the sprint practice and give Design Studio its own Figma file

State: Defined.

Initiated: 2026-10-19.

Purpose: document how a design is iterated on a shared board, and make that practice repeatable, by giving Design Studio its own Figma file and refining the `figma-production-loop` skill from what real sprint pages showed.

Surfaces:

- The Design Studio Figma file (https://www.figma.com/design/hxtrXjUnWvocZfjvDrRtcE/Design-Studio) with pages Practice, Template, Examples, Foundations, Components and Assets. Foundations holds neutral studio tokens, Components holds the state label, placeholder box, direction-summary card and operating-board card, Template holds a duplicable operating board and sprint section, Practice shows the practice and its layout principle, and Examples holds annotated captures of real sprint boards.
- `skills/figma-production-loop/SKILL.md`, which now states the alternating layout axes, sprint-group containers, frame labels and states, the operating board and studio containers.
- Open backlog entries F-005, F-006, F-007 and F-008 in `skills/figma-production-loop/backlog/`. F-007 is the separation of the game design from the sprint layout, and F-008 is the listed dry run before any bulk removal.

Boundary: the rules and their reasons live in the skill; the Figma file shows them and carries the shapes. The studio containers stay neutral so a project's own design is the only strong identity on a board. The examples are captures from two of the Designer's personal projects, used with the Designer's clearance on 2026-10-19; no client material is in the file.

Tasks:

1. Decide what belongs on the Assets page, because it is empty.
2. Decided 2026-10-20: a small test is one frame per step, never one auto-layout sequence frame. Reason: only the per-step form lets a step carry its own state label and lets a rejected branch stay beside the work it was compared with, and a sequence frame also becomes the sprint's parent in place of the section. The evidence is a personal game project's sprint page of twenty sprints, where seven sprints used the sequence frame and were unpacked. The rule is in the skill, under design apart from layout.
3. Built 2026-10-20: a sprint-group section on a real project page, with the sprints stacked inside it, a tinted container bound to the studio color token, direction summaries as the library component, frame cards with state labels, and placeholder boxes where a sprint had no summary. F-005 and F-006 stay open: the page still has about forty unnumbered frames with no state label, and its operating board is out of date.
4. Run the admission checklist on any resident this adds, because the Figma file is new.

Done when: F-005 and F-006 are closed on evidence, the Assets page is filled or removed, and the sequence-frame question is decided.
