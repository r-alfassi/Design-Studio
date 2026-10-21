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
3. Figma cluster restructure: commissioned. Changed 2026-10-21 by the Designer: `figma-build`, `figma-borrow` and `figjam` retire outright, because the official Figma plugin's skills cover the same ground (`figma-use`, `figma-generate-design`, `figma-use-figjam`) and the three had never been invoked. `figma-borrow` no longer retires into `instancing.md`. The FigJam board conventions are kept as `references/figjam-board-conventions.md`. The Designer is breaking down what is useful in the remaining four Figma skills before the router and shared references are decided. Earlier plan:  The handoff defines a `skills/figma/` router and shared `instancing`, `auditing`, and `plugin-api` references; `figma-borrow` retires into `instancing.md`; `figma-design-system` becomes `figma-organize-ds`; leaf skills keep discoverable `skills/<name>/SKILL.md` homes. It awaits executor dispatch and Principal assessment.

Done when: every resident is filed against the Design Studio model; the Figma cluster has no duplicated procedure across skills; the admission checklist is in `CONVENTIONS.md`; and a new resident cannot be added without it.

## Quest Q-68 — make the visual phase a package, with Figma as one of its tools

State: Defined (2026-10-21, after a grilling session with the Designer; the requirements are in `product/requirements.md`, R-01 to R-17).

Decided 2026-10-21: the whole of Design Studio becomes an installable package with an `AGENTS.md` spine that routes by kind of work, as Compass does. The visual phase is its main route, in any medium. It has three entry points: sprints, formalizing the design system, and tuning in place. It keeps `DESIGN.md` (the format `impeccable` reads), `DESIGN-DEBT.md` (open debt only, each row with a direction) and a `FIGMA-TRANSLATION.md` only for structurally different components. It never defines a project's intent and does not assume Compass.

Done when: the package has a spine and routes, every resident is kept, folded in or retired against requirements R-15 and R-16, and the `product-design` and `figma-change-log` formats match the scope above.

Tasks:

1. Sketch the package structure: the spine, the standards, templates, contained procedures and tools. Serves: `product/requirements.md` R-17.
2. Choose, for each existing resident, whether it is kept, folded in or retired, by a fresh-run test. The remaining Figma skills (`figma-production-loop`, `figma-audit-structure`, `figma-roundtrip`, `figma-ds-recreate`, `figma-design-system`) come first. Serves: R-16.
3. Decide the fate of the `product-design` format, whose intent and flow layers define intent, and of the `figma-change-log` format, which `DESIGN-DEBT.md` replaces.
4. Decide what marks the end of work on the in-place path, and how the agent picks an entry point. Serves: R-02.

Origin of the quest: seed below, logged earlier the same session series.

State (before): Seed.

Initiated: 2026-10-19.

Origin: the Designer, 2026-10-19, at the end of a session: incorporating Figma in Design Studio has become a practice much more intricate than a skill, and it is worth considering what adjustments would make it a more prominent part of the build. Logged so it is not forgotten; no design has been discussed.

Problem (as stated, not yet examined): the Figma work now spans the figma-production-loop skill, the sprint and layout practice, the Figma cluster of skills, two formats (the change log and the implementation contract), a reference, and a dedicated Design Studio Figma file with pages and components. The organizing model has four kinds (format, framework, standard, skill) and no home that shows this as one practice.

Open questions for the Designer, none decided:

- Is the Figma practice a new kind of resident, a grouping of existing ones, or a skill with a larger footprint?
- What does "more prominent part of the build" mean: in `STRUCTURE.md`, in the discovery index, in how a project is set up, or in what Design Studio ships?
- How does it relate to Q-63's commissioned `skills/figma/` router and to Q-67's Figma file?

Relations: Q-63 (the Figma cluster restructure), Q-67 (the Design Studio Figma file and the sprint practice), `STRUCTURE.md`, `CONVENTIONS.md`.
