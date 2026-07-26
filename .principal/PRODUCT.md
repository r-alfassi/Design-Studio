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
Holds design-craft skills (RTL, Figma build/roundtrip/borrow, FigJam, preview-server, transcript-ingestion, UX critique, skill-creator), governance meta-skills (deploy, adopt, assess, promote, prune, migrate, gather, wrapup, new-component, render-html), and format specs (layered-deck, product-design) migrated from Harness.

**Content requirements**
Each skill/format file in its proven internal shape (frontmatter + body + `references/`/`scripts/`/`assets/` as needed) — Anthropic's standard skill format, reused not reinvented. A `README.md` indexing them. A `.principal/` cartridge like every other governed repo.

**Exclusions**
Deloitte-branded assets (the `deloitte-pptx`/`deloitte-pptx-node` skills). Deloitte-internal data (the `figma-borrow` library index). Any client-identifying content (Poalim/Isracard references, hardcoded operator paths) — standing rule, not a one-time cleanup. Harness's own `initiatives/` tracking format (this repo uses Principal's own WORK.md convention instead). Harness's `HARNESS.md` master-index pattern (redundant with `README.md`, already this ecosystem's convention). Personal Designer preferences (the Roey repo's domain). Universal collaboration principles (CULTURE.md's domain). Per-project design application (stays in each project's own `DESIGN.md`).

---

## Structure

**Interaction design**
A reader — human or Principal — opens `README.md` for orientation, then goes to `formats/` or `skills/` for the specific thing needed. Skills are read on-demand, matching Principal's own `skills/` convention ("read only when the current session requires a specific procedure") — not loaded at every session's Initiation, unlike the Roey repo's cartridge, which is universal context about the Designer rather than situational tooling.

**Information architecture**
`README.md` + `.principal/{PRODUCT.md, WORK.md}` + `formats/` + `skills/` + `references/`. Each governed project's own `DESIGN.md` cites into this repo rather than duplicating its content.

---

## Skeleton

**Interface design**
Flat top-level categories (`formats/`, `skills/`, `references/`); skill subdirectories follow the standard SKILL.md + `references/`/`scripts/`/`assets/` shape unchanged from how they arrived.

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
| Standing exclusion: never accumulate client-identifying content | The specific drift that entangled Harness, named explicitly as a durable rule rather than a one-time cleanup |

**Open questions**
- Whether Harness itself (beyond what's extracted here) gets a dedicated study pass later — the Designer named it as a parallel "generalist harness" experiment worth studying on its own terms, separate from this extraction.
- Whether Design Studio ever needs an active-agent layer later, if a "what would our design conventions say" consultation need emerges — same posture as the Roey repo's own reclassification; not assumed now.
