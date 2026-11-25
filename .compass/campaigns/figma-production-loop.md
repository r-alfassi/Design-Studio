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

- `templates/figma-change-log.md` specifies the project change record.
- `templates/figma-implementation-contract.md` specifies the bounded Figma-to-production mapping.
- `skills/figma-sprint/SKILL.md` orchestrates the loop and refers to existing procedures rather than copying them.
- Container topology is a required contract invariant: material visible boxes must have a truthful Figma hierarchy and named Android mapping, not merely similar pixels.
- `adapters/android-views.md` applied only to Android Views, and was folded on 2026-10-23 into the translation record's platform difference checks.

Pilot: Sharon is the first project instance. Its records are root files, `FIGMA-CHANGELOG.md` and `FIGMA-TRANSLATION.md`, beside `DESIGN.md`; two files do not justify a new directory. The component or screen is intentionally unselected; the next real Sharon design change supplies the candidate.

Exit evidence: one explicitly contracted Figma component or screen has a linked decision, change-log delta, mapping with named intentional platform differences, separately authorized implementation, and production or device verification. The pass shows whether the loop reduces avoidable production churn without creating a second product history.

Non-goals: do not claim Figma parity for an uncontracted node; do not treat Figma as authority for data, accessibility, interaction, permissions, or Android lifecycle; do not broaden the Android Views adapter to Compose; do not create or change Sharon production code merely to demonstrate the process.

## Quest Q-67 — refine the sprint practice and give Design Studio its own Figma file

State: Defined.

Initiated: 2026-10-19.

Purpose: document how a design is iterated on a shared board, and make that practice repeatable, by giving Design Studio its own Figma file and refining the `figma-sprint` skill from what real sprint pages showed.

Surfaces:

- The Design Studio Figma file (https://www.figma.com/design/hxtrXjUnWvocZfjvDrRtcE/Design-Studio) with pages Practice, Template, Examples, Foundations, Components and Assets. Foundations holds neutral studio tokens, Components holds the state label, placeholder box, direction-summary card and operating-board card, Template holds a duplicable operating board and sprint section, Practice shows the practice and its layout principle, and Examples holds annotated captures of real sprint boards.
- `skills/figma-sprint/SKILL.md`, which now states the alternating layout axes, sprint-group containers, frame labels and states, the operating board and studio containers.
- Open backlog entries F-005, F-006, F-007 and F-008 in `skills/figma-sprint/backlog/`. F-007 is the separation of the game design from the sprint layout, and F-008 is the listed dry run before any bulk removal.

Boundary: the rules and their reasons live in the skill; the Figma file shows them and carries the shapes. The studio containers stay neutral so a project's own design is the only strong identity on a board. The examples are captures from two of the Designer's personal projects, used with the Designer's clearance on 2026-10-19; no client material is in the file.

Tasks:

1. Decide what belongs on the Assets page, because it is empty.
2. Decided 2026-10-20: a small test is one frame per step, never one auto-layout sequence frame. Reason: only the per-step form lets a step carry its own state label and lets a rejected branch stay beside the work it was compared with, and a sequence frame also becomes the sprint's parent in place of the section. The evidence is a personal game project's sprint page of twenty sprints, where seven sprints used the sequence frame and were unpacked. The rule is in the skill, under design apart from layout.
3. Built 2026-10-20: a sprint-group section on a real project page, with the sprints stacked inside it, a tinted container bound to the studio color token, direction summaries as the library component, frame cards with state labels, and placeholder boxes where a sprint had no summary. F-005 and F-006 stay open: the page still has about forty unnumbered frames with no state label, and its operating board is out of date.
4. Run the admission checklist on any resident this adds, because the Figma file is new.

Done when: F-005 and F-006 are closed on evidence, the Assets page is filled or removed, and the sequence-frame question is decided.

Backlog entries moved here on 2026-10-23, when the sprint skill's `backlog/` folder was removed. Each stays open until its condition is evidenced:

- F-004, harden the sprint practice with a modular runbook and regression evidence. Close when the skill has modular references and a reconciliation-record template, the five named regression cases have been run and captured, and one test shows a user edit detected, preserved, classified and either rebound to an accepted token or kept as a pending token decision.
- F-005, label every frame on the canvas with a name and a state. Close when the next completed sprint on a page built with the studio components passes a canvas read-through in which every frame's state can be named without opening the layer panel, and the hierarchy review finds no unnamed section.
- F-006, alternate the layout axes. Close when a project page with at least two related sprints is arranged as a tinted group section holding stacked sprint sections, and a page-level review confirms the axes and containment. The operating-board part was withdrawn on 2026-10-22.
- F-007, keep the design apart from the sprint layout. Close when a project page of at least five sprints is arranged this way, with a read-back that every step is a direct child of its sprint section and carries a state label, and the Designer confirms a reader can tell the design from the layout.
- F-008, list the nodes before any bulk removal. Close when the next bulk change to a project's Figma file shows a listed dry run to the Designer before removing anything, and no node that holds design is removed.

## Quest Q-72 — bring FigJam diagrams into a Figma design file as live nodes

State: Seed.

Initiated: 2026-11-25.

Origin: the Designer, 2026-11-25, while explaining how Compass keeps its record in step. The Designer found that a FigJam section copied and pasted into a Figma design file keeps its shapes and connectors as nodes. The pasted section was checked: the shapes and connectors arrived as separate nodes, with the connector labels. The Designer called it an initiative proposal, not a journal note.

Problem: a diagram drawn from Mermaid lives in FigJam, away from the design file where the sprint's frames are. A design file cannot create connectors or FigJam shapes with the Figma tools, so a diagram cannot be built there directly.

Outcome: a diagram that belongs with a design sits in that design's Figma file as editable nodes and connectors, and the practice for getting it there is written down.

Done when: Open: the Designer says what counts as done. The pasted section is one case.

Relations: touches `skills/figma-sprint/SKILL.md`, where the practice would live, and the Compass console Figma file, which holds the first pasted section.

Tasks:

1. Open: decide whether this is a step in `skills/figma-sprint/SKILL.md`, a skill of its own, or a note in the Figma craft, once the Designer says how often diagrams come up in design work.
2. Open: find out whether the paste keeps connector attachment, so that moving a shape moves its connectors, and whether the text stays editable. The tools can read the nodes but cannot test dragging.
3. Write the hand steps, since the agent cannot copy between files: draw in FigJam, select, copy, paste into the design file, then the agent reads the nodes and labels the section.
