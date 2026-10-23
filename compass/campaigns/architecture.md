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

1. Make the root `AGENTS.md` the package spine, and move the maintenance rules and the Compass import to a separate file for work on this repo. Decided 2026-10-21; open: where that file lives. The structure itself now stands in `product/system.md`, derived from the journeys and features. Serves: `product/requirements.md` R-17.
2. Choose, for each existing resident, whether it is kept, folded in or retired, by a fresh-run test. The remaining Figma skills (`figma-production-loop`, `figma-audit-structure`, `figma-roundtrip`, `figma-ds-recreate`, `figma-design-system`) come first. Serves: R-16.
3. Apply the scope line SC-13: the loop's promotion gate and its implement-and-verify step leave the package, and the contract's authority sentence, which makes Figma the fixed visual authority, changes to follow PN-02. Decide also the fate of the `product-design` format, whose intent and flow layers define intent, and of the `figma-change-log` format, which `DESIGN-DEBT.md` replaces.
4. Decide what marks the end of work on the in-place path, and how the agent picks an entry point. Serves: R-02.

Reuse decisions, 2026-10-21, for `figma-production-loop` (task 2):

- It becomes four parts. A `sprint` branch takes the row model, the alternating axes, frame labels and states, design apart from layout, arranging a sprint page, the direction summary and the sprint-close review (R-22, R-28). A short standard, "keep the Designer's hand", takes file stewardship, the reconciliation preflight, the tokenization decision and the bulk-removal list (R-19, R-27, R-04). The scripts become tools: the reconcile script, a containment check turned from prose into a script, and a script that lists what a change would remove. A handoff part takes loop steps 1 to 4, with a `DESIGN-DEBT.md` row replacing the change-log entry (R-08 to R-11).
- It loses the `FIGMA-CHANGELOG` record, the promotion gate, and the implement-and-verify step (scope line SC-13). Its `backlog/` folder goes: the open entries F-004 to F-008 become tasks under Q-67 in this registry.
- Admission of `skills/figma-pixel-fidelity/`, 2026-10-23: the Designer said the pixel-raster gate is a methodology developed and used on the game project for pixel-art design, uncommon, and deserving its own skill so it fires only when relevant. Kind: a skill, since it is steps run against a tool. Overlap: only the loop section it was taken from, which it replaces. Shape: `skills/figma-pixel-fidelity/SKILL.md` with its script. Client-content scan: names no project and holds no node ids or keys. Open: it has not been run against having no skill (R-16), and the new link is not made until `bin/link-skills.ps1` runs. Four parts had no failure record and no requirement: the sprint operating board, the studio containers, the pixel-raster fidelity gate, and the Android Views adapter. The Designer withdrew the operating board on 2026-10-22, because it is a second source beside the project's record, and the one on the game project had already gone out of date. The other three are being examined one at a time, each for the need it serves, before any test. The last two stay out of the spine, as each fits one project type.
- Open: whether a part that came from a recorded failure (F-001, F-003, F-007, F-008) counts as having passed the PN-03 test already. This is my suggested reading, and the Designer has not confirmed it.

Reuse decisions, 2026-10-21, for the other four Figma skills (task 2):

- `figma-audit-structure` becomes the audit branch. Its issue taxonomy, its mechanical, judgment and component-owned layers, and its five fix scripts carry over, the scripts as tools. The component guardrail and clone-before-fix move into the shared stopping standard (R-05, R-06). Its `backlog/` loop and its dev-mode confidence markers leave. Fresh-run test: audit a real frame with and without it, using the ProShift baseline frames from the raw capture.
- `figma-ds-recreate` is cut down to Phase 0: the audit with its fixed report format and stop for the Designer's yes, and `audit-bound-variables.js`. It joins the audit branch as the variable-binding check. Its Step 8 verify list becomes the definition of a formalized component (R-25). Steps 1 to 7 leave, because they call tools that do not exist here and repeat the plugin's `figma-generate-design`.
- `figma-design-system` becomes the formalize branch: scaffold, token extraction, variables, atom-molecule-organism classification, migration and the check that no instance loses its main component. Its four opening questions leave, replaced by the direction check and the Designer's gates. Fresh-run test: organize a real Figma file with and without it, since it has never run.
- `figma-roundtrip` keeps its CSS-to-Figma mapping tables, the parking of properties that cannot cross, the layout-mode rule on pull and its RTL rules. The per-component folder convention, the converter stored in the Figma file under a "harness" name, and the superseded phase material leave. It is the likeliest to leave whole: R-21 and R-26 may both be covered by the plugin's own tools. Fresh-run test: pull a frame to HTML and push a component, each against the plugin's capture and `get_design_context`.

Fresh-run results, 2026-10-22 (journal entry `2026-10-22-audit-skill-fresh-run.md`): `figma-audit-structure` was fixed and kept. `figma-design-system` did not beat having no skill on a read-only plan, and was rewritten around the formalize journey. `figma-roundtrip` did not beat having no skill on the pull side, at higher cost, and was retired on 2026-10-22 with its push side untested. Still to test: the four loop parts that have no failure record. Open: the formalize skill keeps the folder name `figma-design-system`, and its new name is not decided.

Admission of `standards/studio-presentation.md`, 2026-10-22 (the studio containers promoted to a shared standard by the Designer, who also wants it to cover design-system sections and component containers, a "design system's design system"; binding on a project that adopts it in its `DESIGN.md`):

- Kind: a standard, because it is a reusable constraint on presentation with a validation and an exception route, and a skill would only describe steps.
- Overlap: the studio containers section of `skills/figma-production-loop/SKILL.md`, which now points to the standard. No other resident covers presentation chrome.
- Shape: `standards/studio-presentation.md`, with scope, binding statement, validation and exception route.
- Client-content scan: written from the general case and holds no project name, node id, library key or operator path.
- Decided 2026-10-22, after reading Sharon's and Karma Warrior's files and the research note `2026-10-22-design-system-page-structure.md`: the kit's design-system pieces are a section header with status, a component container with optional anatomy and do-and-don't slots, a callout, and token tiles. Open: those pieces are not built yet.
- The standard keeps its name `studio-presentation`, settled by the Designer on 2026-10-23.
- The withdrawn board frame, its Board card component set and the empty card section shell were removed from the Design Studio Figma file on 2026-10-22. The Examples page keeps its capture of the real board as labelled evidence, with its note updated to say the board was withdrawn.

Validation of `standards/studio-presentation.md` chosen 2026-10-22 by the Designer: a script in `tools/`. `tools/check-presentation-chrome.js` was written and run read-only on two pages. On Design Studio's own Template page it reported 5 findings: the sprint section's fill is not bound to a kit variable, and the four step frames are plain frames, because the kit has no frame card component yet. On Karma Warrior's Sprints page, which predates the kit, it reported 204 findings across 31 sections and 207 children. Publishing chosen 2026-10-23: Design Studio's Figma file becomes a team library that projects subscribe to, which only the Designer can publish, and the script must then be run on a subscribing file. Tasks that follow: publish the file, build the missing kit pieces (a frame card, the section header, the component container, the callout and the token tile), and bind the template section's fill to a kit variable.

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
