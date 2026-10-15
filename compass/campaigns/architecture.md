# Design Studio architecture

State: In-flight.

Tier: now.

## Vision

Every Design Studio resident has one discoverable home, one clear kind, and no duplicated Figma procedure, so that the collection can grow without losing its shape.

## Quest Q-63 — finish the organizing model and Figma-cluster cleanup

State: In-flight.

Framed: 2026-09-06, following a Principal audit and Designer review. This is the live pruning and absorption instance of Principal's C-08.

Problem: after the Q-59 batch, the collection held 31 skills, 6 formats, and 1 framework accumulated unevenly.

1. Ten loose `skills/*.md` residents could not be discovered by `link-skills.ps1` or either agent tool, while 21 packaged skills could.
2. The eight-skill Figma cluster overlapped: `figma-borrow`'s procedure sat inside `figma-ds-recreate`; `figma-audit-structure` and phase 0 of `figma-ds-recreate` duplicated the audit, gate, and fix pattern; and `figma-design-system` conflicted in name with `figma-ds-recreate`.
3. `ux-expert` was a framework filed as a skill and `new-component` was a deliverable shape filed as a skill.
4. No admission discipline checked a new resident for category fit or overlap.

Frame: this is organizing work, not only cleanup. Categories, their relation, and the admission discipline need to be captured; scope is input to that model.

Settled decisions:

- Design-craft skills stay; eight cartridge-lifecycle skills leave.
- The model is one `STRUCTURE.md`, a `CONVENTIONS.md` admission checklist, and `skills/README.md` resident index. It adds no heavier framework.
- Admission checks category fit, overlap with an existing resident, package shape, and client-content scan. The addition's work record carries the result.
- Meta and process skills are a tag in the index, not a fourth category.
- The Figma cluster receives a layered restructure: a `figma` router and shared `instancing` and `auditing` references used by leaf skills.
- `ux-expert` moves to `frameworks/`; `new-component` becomes a `product-component` format and thin build skill; `checklist-design` remains a skill because it implements review and `library/heuristic-evaluation.md` holds its framework.
- Cartridge-lifecycle skills, `adopt`, `deploy`, `promote`, `prune`, `migrate`, `wrapup`, `assess`, and `gather`, are archived to a Principal-side location with a mining note. They are not relocated to a live home until a consultation on the governance structure.
- Principal writes the model and completes the mechanical pass as steward. The Figma restructure is commissioned as reusable procedure authoring against `STRUCTURE.md`; Principal assesses the return.
- `STRUCTURE.md` category definitions are Design-Studio-local. Hayley receives the finished document as a courtesy review, not a gate.

Execution units:

1. The model: `STRUCTURE.md`, the `CONVENTIONS.md` admission checklist, `skills/README.md`, and `frameworks/README.md`. Completed in commit `5fde40e`.
2. Mechanical reclassification: `ux-expert` moved to `frameworks/ux-expert.md`; `new-component` split into `formats/product-component.md` and `skills/new-component/SKILL.md`; `render-html` packaged; eight cartridge-lifecycle skills moved to `principal/archive/harness-cartridge-skills/`; selected skills tagged `meta`; unused material removed; Figma formats gained frontmatter; and `skills/pptx-to-md-skill/` became `skills/pptx-to-context-md/`. Open judgment: `library/checklist-design.md` points to the same source vendored as `skills/checklist-design/`; it may be redundant but `library/README.md` argues to retain both. The Designer decides.
3. Figma cluster restructure: commissioned. The handoff defines a `skills/figma/` router and shared `instancing`, `auditing`, and `plugin-api` references; `figma-borrow` retires into `instancing.md`; `figma-design-system` becomes `figma-organize-ds`; leaf skills keep discoverable `skills/<name>/SKILL.md` homes. It awaits executor dispatch and Principal assessment.

Done when: every resident is filed against the Design Studio model; the Figma cluster has no duplicated procedure across skills; the admission checklist is in `CONVENTIONS.md`; and a new resident cannot be added without it.
