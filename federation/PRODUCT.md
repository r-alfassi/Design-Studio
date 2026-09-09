# PRODUCT.md — Design Studio

---

## Strategy

**Problem statement**
Cross-project design craft — RTL, platform norms, Figma/HTML bridge conventions, design-process skills — has no dedicated home. It currently lives scattered inside Harness, a repo cloned from a Deloitte employee's environment and entangled with real client engagement data (Poalim, Isracard), and is distinct from both CULTURE.md (universal collaboration principles) and the Roey repo (personal preferences). Without a home, this knowledge doesn't accumulate — Principal re-derives or forgets design conventions project to project.

**Product objectives**
Give Principal, and any project it governs, a durable, growing library of design process and craft, decoupled from any client engagement, that compounds across projects instead of resetting each time.

**User needs**
Principal needs design conventions and skills to read and apply on demand during any project's UI/design work. Each governed project needs a place its own `DESIGN.md` can cite into rather than duplicate. The Designer needs assurance this repo never re-accumulates client-identifying content the way Harness did.

---

## Scope

**Functional specifications**
Holds three kinds of normative resident (see `STRUCTURE.md`):
- **skills** — design-craft procedures (RTL, the Figma set, FigJam, preview-server, transcript-ingestion, translate, screenshot-verify, md-renderer, pptx-to-context-md, checklist-design, new-component, render-html, brandkit, design-taste-frontend) and meta skills (skill-creator, figma-conversion-skill-builder, figma-production-loop);
- **formats** — deliverable shapes (`product-design`, `product-component`, `strategic-deck`, `ux-benchmark`, `video`, `figma-change-log`, `figma-implementation-contract`);
- **frameworks** — thinking methods (`brand-strategy-foundations`, `ux-expert`).

Plus `STRUCTURE.md` (the organizing model), `CONVENTIONS.md` (the admission checklist and naming rules), `skills/README.md` and `frameworks/README.md` (resident indexes), `skills-lock.json`, `references/`, and `library/`.

Cartridge-deployment and project-governance method is not held here — that is Principal/federation territory.

**Content requirements**
Skills retain their proven package shape (frontmatter + body + `references/`/`scripts/`/`assets/` as needed). Formats and frameworks are self-contained, named Markdown specifications. A `README.md` indexes the categories. A `federation/` cartridge governs the resource.

**Exclusions**
Deloitte-branded assets (the `deloitte-pptx`/`deloitte-pptx-node` skills). Deloitte-internal data (private library indexes, component-key tables, token dumps). Any client-identifying content (Poalim/Isracard references, hardcoded operator paths) — standing rule, not a one-time cleanup. Cartridge-deployment and project-governance method — that is Principal/federation method, not design craft. The pre-federation Harness cartridge-lifecycle skills (`adopt`/`deploy`/`promote`/`prune`/`migrate`/`wrapup`/`assess`/`gather`) sit in `principal/archive/harness-cartridge-skills/`. Harness's own `initiatives/` tracking format (this repo uses Principal's own WORK.md convention instead). Harness's `HARNESS.md` master-index pattern (redundant with `README.md`). Personal Designer preferences (the Roey repo's domain). Universal collaboration principles (CULTURE.md's domain). Per-project design application (stays in each project's own `DESIGN.md`).

---

## Structure

**Interaction design**
A reader — human or Principal — opens `README.md` for orientation, then goes to `formats/`, `frameworks/`, or `skills/` for the specific thing needed. Materials are read on-demand, matching Principal's own `skills/` convention ("read only when the current session requires a specific procedure") — not loaded at every session's Initiation, unlike the Roey repo's cartridge, which is universal context about the Designer rather than situational tooling.

**Information architecture**
`README.md` + `federation/{RESOURCE.md, PRODUCT.md, WORK.md}` + `formats/` + `frameworks/` + `skills/` + `references/` + `library/`. Each governed project's own `DESIGN.md` cites into this repo rather than duplicating its content.

---

## Skeleton

**Interface design**
Flat top-level categories (`formats/`, `frameworks/`, `skills/`, `references/`, `library/`); skill subdirectories follow the standard SKILL.md + `references/`/`scripts/`/`assets/` shape unchanged from how they arrived.

**Navigation design**
`README.md`'s table is the wayfinding mechanism; filenames are self-descriptive.

**Information design**
Migrated skills/formats keep their own proven internal formatting untouched. No provenance or migration narrative added inside the artifacts themselves — that's what git history is for.

---

## Surface

**Sensory and experiential design**
Procedural/reference material, not prose meant to be sat with. Migrated skill/format files keep their existing register (already clean and instructional). `README.md` plain and short, matching its siblings (`roey`, `sharon`). `PRODUCT.md`/`WORK.md` in Principal's usual declarative register.

---

## State

**Decisions**

| Decision | Rationale |
|----------|-----------|
| Passive knowledge repo, not an active agent | This is reference material and workflow, not a point of view needing its own reasoning pass — unlike Roey, whose Strategy plane surfaced the opposite need |
| Repo named `design-studio` (lowercase) | Matches the sibling-repo naming convention (`roey`, `sharon`, `principal`). Checked against the 2026-07-15 DESIGN.md precedent (a cartridge name is a promise) — as a repo name rather than a conventional filename with an external schema, it doesn't carry the same collision risk |
| No `HARNESS.md`-style master-index document | `README.md` already serves that role across this ecosystem; a second orientation format would duplicate an existing convention |
| No per-file provenance/migration notes in the migrated artifacts | Git commit history carries that story — matches a Lean-by-default correction made earlier the same session it was designed |
| Governed via Principal's own WORK.md convention, not Harness's separate `initiatives/` format | Consistency across the federation |
| Skills/formats read on-demand, not at session Initiation | Situational tooling, not universal context — the one deliberate asymmetry with the Roey repo |
| Frameworks are distinct from formats and skills | A framework preserves the questions, evidence discipline, and choice sequence for a recurring strategic problem; it does not prescribe a deliverable shape or operational steps |
| Standing exclusion: never accumulate client-identifying content | The specific drift that entangled Harness, named explicitly as a durable rule rather than a one-time cleanup |

**Open questions**
- Whether Harness itself (beyond what's extracted here) gets a dedicated study pass later — the Designer named it as a parallel "generalist harness" experiment worth studying on its own terms, separate from this extraction.
- Whether Design Studio ever needs an active-agent layer later, if a "what would our design conventions say" consultation need emerges — same posture as the Roey repo's own reclassification; not assumed now.
