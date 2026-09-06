# WORK.md — Design Studio

Principal-owned initiative registry. Ordered by urgency — top is most important.
Only living initiatives appear here; completed work is recorded in git commit history.

---

## Overview

**Active:** [Q-63] Architecture pass (organizing model + cleanup); [Q-54] Global Design Studio skill availability; [Q-53] Figma-to-production loop pilot; [Q-60] cartridge-reference conformance; [Q-61] image-gen adoption; [Q-62] Brand Strategy Foundations framework pilot.

Summary tree (mirrors document order — most urgent first):
- **[Q-63] Architecture pass** — the collection accumulated unevenly across the
  Q-59 batch: two skill shapes (half not discoverable), Figma-cluster overlap,
  category mis-fits, no growth discipline. Establish an organizing model
  (`STRUCTURE.md` + a `CONVENTIONS.md` admission checklist + a resident index),
  then apply it: reclassify, archive the cartridge-lifecycle skills, restructure
  the Figma cluster, clear cruft.
- **[Q-54] Global Design Studio skill availability** — make the Studio a
  directly discoverable workshop in every session, across Codex and Claude
  Code, by per-skill directory junction into each tool's skill-discovery
  scope; the repository stays the canonical source and nothing is copied.
- **[Q-53] Figma-to-production loop pilot** — establish a Figma-first,
  evidence-backed iteration path before Sharon production changes.
- **[Q-60] Cartridge-reference conformance** — the meta-skills still say
  `.harness/01_PROJECT.md` etc.; align them with the federation cartridge
  (`federation/PRODUCT.md` / `WORK.md`). Surfaced by Q-59's line-diff pass.
- **[Q-61] image-gen adoption** — bring in the `image-gen` skill from the
  Workspace_0 branch; it assumes the old `visuals/base.json` + `frames.json`
  split and needs reconciling with the `video` format's current `FRAMES.md`
  model. Deferred from Q-59's batch.
- **[Q-62] Brand Strategy Foundations framework pilot** — establish and
  exercise a reusable evidence-to-positioning method, then revise only what
  real project use shows is transferable.
- **[Q-52] Design Studio conformance** — declare resource authority and test
  its on-demand access-and-interpretation path on the Sharon design case.

---

## [Q-54] Global Design Studio skill availability

Initiated 2026-08-26 · Mechanism decided 2026-08-30

- **Decision:** Design Studio is the Suite's readily available workshop for any
  product project, across **both** agent tools this user runs it under — Codex
  and Claude Code — not reached only through Principal citation from the
  repository.
- **Target posture:** `C:\Roey\Studio\design-studio` stays the canonical,
  version-controlled source. Every exposure path reads the repository files
  **in place** — no copied or cached installation, ever. Formats, library
  material, and references remain repository material reached through the
  selected skill.
- **Mechanism (per tool, per-skill directory junction into that tool's own
  skill-discovery scope):**
  - *Codex* — `~/.agents/skills/<name>` → `<repo>/skills/<name>`.
  - *Claude Code* — `~/.claude/skills/<name>` → `<repo>/skills/<name>`. Verified
    in the CLI source (v2.1.78) that the user-skill loader accepts junction and
    symlink entries; it scans one level, so links are per-skill, not one
    repo-level link. `skill-creator` is excluded here — the
    `claude-plugins-official` plugin already owns that name.
  - `bin/link-skills.ps1` creates, repoints, and prunes the junctions for both
    scopes; it is the deploy-and-repair tool, run on a new machine and whenever
    a package is added or renamed. It links, never copies.
- **Rejected mechanisms:** `claude plugin install` (from a local marketplace)
  copies each plugin into a versioned cache under `~/.claude/plugins/cache/` —
  a snapshot that goes stale until `/plugin update` re-copies; this is the
  synced copy the target posture forbids. `--plugin-dir` loads a plugin in
  place with no copy, but is consumed only as a `claude` CLI flag at process
  start; the VSCode extension spawns `claude` with no shell, so its
  `claudeProcessWrapper` must be a native `.exe` — a script wrapper cannot
  carry the flag, and the Designer's entry path is `/principal` in that
  extension. A local plugin package (`.claude-plugin/plugin.json`) is not
  precluded for a future distribution need, but is not the load mechanism now.
- **Scope:** Loaded for every session on this workstation, federation or not
  (Designer decision, 2026-08-30). Acceptable because skills are
  description-gated — nothing loads until selected — so this neither preloads
  instructions nor creates project dependencies.
- **Governance:** The `/principal` entry procedure verifies the Design Studio
  craft skills resolve and, if a needed one is absent, names it unavailable
  material context and directs the Designer to run `bin/link-skills.ps1`
  (effective on the next session start). The link script is the mechanism;
  the entry adapter is the check.
- **Exit evidence:** (1) From a non-Design-Studio repository, both tools list
  the skills. (2) An explicit invocation and a matching implicit task each load
  a selected skill. (3) An upstream edit to a skill is reflected in the next
  session with no resync step, in both tools. (4) A wrapper/link-absent launch
  is caught by the `/principal` check. (5) Link removal or disablement has a
  documented, reversible path (`link-skills.ps1` prune, or manual `rmdir` of
  the junction).
- **Current evidence:** Codex scope — eleven junctions in `~/.agents/skills`,
  in place since 2026-08-26, verified under Codex. Claude Code scope — ten
  junctions created in `~/.claude/skills` on 2026-08-30 by `link-skills.ps1`;
  the running Claude Code session picked them up live (all ten offered in the
  skill list) without a restart, and `rtl/SKILL.md` was confirmed to resolve
  through the junction. The earlier "accepted for this workstation" claim was
  withdrawn as Codex-only (JOURNAL 2026-08-30); it is now met for both tools on
  this workstation. Exit items 2 and 4 await the next real Design Studio task
  and the `/principal` check landing.
- **Non-goals:** Do not turn every Design Studio resident into a project
  dependency, preload full skill instructions into sessions, publish a
  marketplace, or claim availability on another person's machine. Distribution
  beyond this locally governed workstation stays out of scope.

---

## [Q-53] Figma-to-production loop pilot

Initiated 2026-08-26

- **Purpose:** Let a project iterate visual construction cheaply in Figma while
  retaining a bounded, checkable path to production. Figma deltas must not
  silently become product or platform commitments, and production changes must
  not require pushing every exploratory adjustment into the application.
- **Surfaces:** `formats/figma-change-log.md` specifies the project change
  record; `formats/figma-implementation-contract.md` specifies the bounded
  Figma-to-production mapping; `skills/figma-production-loop/SKILL.md`
  orchestrates the loop and refers to existing procedures rather than copying
  them. Container topology is a required contract invariant: material visible
  boxes must have a truthful Figma hierarchy and named Android mapping, not
  merely similar pixels. `adapters/android-views.md` is explicitly Android
  Views-only.
- **Pilot:** Sharon is the first project instance. Its records will be root
  files (`FIGMA-CHANGELOG.md` and `FIGMA-TRANSLATION.md`) beside `DESIGN.md`;
  no directory is created for two files. The component/screen is intentionally
  not selected yet: the next real Sharon design change supplies the candidate.
- **Exit evidence:** One explicitly contracted Figma component or screen has a
  linked decision, change-log delta, mapping with named intentional platform
  differences, separately authorized implementation, and production/device
  verification. The pass must show whether the loop reduces avoidable
  production churn without creating a second product history.
- **Non-goals:** Do not claim Figma parity for an uncontracted node; do not
  treat Figma as authority for data, accessibility, interaction, permissions,
  or Android lifecycle; do not broaden the Android Views adapter to Compose;
  do not create or change Sharon production code merely to demonstrate the
  process.

---

## [Q-60] Cartridge-reference conformance

🌱 Seed — surfaced 2026-09-06 by Q-59's line-diff pass

- **Problem:** the governance meta-skills (`adopt`, `deploy`, `promote`,
  `prune`, `wrapup`, `figma-borrow`, `transcript-ingestion`) still instruct
  writing to `.harness/01_PROJECT.md`, `.harness/02_PRD.md`, `.harness/03_BUILD.md`
  etc. — the pre-federation cartridge. The federation cartridge is
  `federation/PRODUCT.md` / `WORK.md` / `SYSTEM.md` plus the standards. Both the
  Workspace_0 branch and design-studio carried this drift; it predates Q-59.
- **Also:** `deploy.md`/`adopt.md` still name `product-mockup` where the current
  format is `product-design`.
- **Outcome:** the meta-skills reference the current cartridge model. Whether
  the skills keep a `.harness/`-style local cartridge for *non-federated*
  projects, or move wholesale to the `federation/` shape, is the open design
  question — not assumed.
- **Done when:** TBD — concrete before the first Task.

---

## [Q-61] image-gen adoption

🌱 Seed — deferred from Q-59's batch 2026-09-06

- **Problem:** the `image-gen` skill (Workspace_0 branch, `skills/image-gen/`)
  is a two-part JSON prompting workflow for cinematic image generation, coupled
  to the `video` format. It assumes `visuals/base.json` + `visuals/frames.json`;
  the `video` format has since merged those into `FRAMES.md` (confirmed during
  the Adama work, 2026-09-06). Adopting it as-is would ship a skill that points
  at a structure the format no longer uses.
- **Outcome:** `image-gen` adopted into `skills/`, its base/shot-prompt loading
  reconciled with whatever the `video` format's current per-shot spec model is
  (`FRAMES.md`, or `base.json` if the format keeps both paths — that needs
  settling too).
- **Done when:** TBD.

---

## [Q-62] Brand Strategy Foundations framework pilot

Initiated 2026-09-06

- **Purpose:** Give recurring brand-strategy work a reusable method without
  confusing a thinking framework with a deliverable format or an operational
  skill.
- **Initial resident:** `frameworks/brand-strategy-foundations.md` guides an
  evidence bank, separate audience canvases, purpose and positioning, pillars
  with proof, values as behaviour, and expression implications. Its source
  shelf is `library/brand-strategy-foundations.md`.
- **Boundary:** The framework is Design Studio craft. Every project's brand
  choices, source research, workshop material, and production expression stay
  in that project. The framework authorizes no brand or implementation change
  on its own.
- **Learning loop:** Record transferable ambiguity, omissions, or friction
  after a real use. Make a project-local correction first; propose a framework
  revision only where the lesson generalizes. Material changes remain subject
  to Designer approval.
- **Done when:** The initial framework has been exercised on a real project
  and its first evidence-based revision decision is recorded (retain, revise,
  or narrow scope).

---

## [Q-63] Architecture pass — organizing model + cleanup

🔄 In Flight — framed 2026-09-06 (Principal audit + Designer grill). The live
blade-B (pruning/absorption) instance of Principal's C-08.

- **Problem:** After the Q-59 batch the collection is 31 skills / 6 formats /
  1 framework, accumulated unevenly. Concrete: (1) two skill shapes — 10 loose
  `skills/*.md` that `link-skills.ps1` and both agent tools cannot discover, vs
  21 packaged; (2) Figma cluster (8) with real overlap — `figma-borrow`'s whole
  procedure sits inside `figma-ds-recreate`; `figma-audit-structure` and
  `figma-ds-recreate` Phase 0 duplicate the audit→gate→fix shape; `figma-design-system`
  vs `figma-ds-recreate` naming; (3) category mis-fits — `ux-expert` is a
  framework filed as a skill; `new-component` is a deliverable shape; (4) no
  growth discipline — nothing checks a new resident for category fit or overlap.
  Full audit: `principal/temp/design-studio-architecture-audit.md`.
- **Frame (grill Q1):** organization, not just cleanup — the categories are
  defined but their relationship and the admission discipline aren't captured.
  Scope (what belongs here) is an input to that model.
- **Settled (grill Q2–Q11):**
  - Scope: design-craft skills stay; the 8 cartridge-lifecycle skills leave.
  - Model form: one `STRUCTURE.md` + `CONVENTIONS.md` admission checklist +
    `skills/README.md` resident index. No heavier framework.
  - Admission gate: category fit / overlap with an existing resident / package
    shape / client-content scan — recorded in the addition's WORK.md entry.
  - Meta/process skills: a tag in the index, not a fourth category.
  - Figma cluster: full layered restructure — a `figma` router + extracted
    shared `instancing` / `auditing` references the leaf skills draw from.
  - Reclassify: `ux-expert` → `frameworks/`; `new-component` → a
    `product-component` format + a thin build skill; `checklist-design` stays a
    skill (it implements review; the framework under it is
    `library/heuristic-evaluation.md`).
  - Cartridge-lifecycle skills (`adopt`, `deploy`, `promote`, `prune`,
    `migrate`, `wrapup`, `assess`, `gather`): **archived** to a Principal-side
    location with a note — mine for lessons as Principal's own cartridge /
    lifecycle methodology evolves (C-07 link). Not relocated to a live home
    now; that needs a Marcus consultation on federation structure.
  - Execution: Principal writes the model + does the mechanical pass as
    steward; the Figma restructure is **commissioned** (authoring reusable
    procedures, not stewarding) with a handoff spec against `STRUCTURE.md`;
    Principal assesses the return (EC-1).
  - `STRUCTURE.md` category definitions are design-studio-local — no Hayley
    gate, but she gets the finished doc as a courtesy review.
- **Units (each its own commit/review):**
  1. 🏁 The model — `STRUCTURE.md`, `CONVENTIONS.md` admission checklist,
     `skills/README.md` index, `frameworks/README.md` index. Commit `5fde40e`.
  2. 🏁 Mechanical — `ux-expert` → `frameworks/ux-expert.md` (reframed as a
     framework); `new-component` split into `formats/product-component.md`
     (the 4-file standard) + `skills/new-component/SKILL.md` (the procedure);
     `render-html` packaged to `skills/render-html/`; 8 cartridge-lifecycle
     skills → `principal/archive/harness-cartridge-skills/` with a mining note;
     `figma-conversion-skill-builder` / `figma-production-loop` / `skill-creator`
     tagged `meta` in the index; cruft cleared — deleted `formats/layered-deck.md`
     (no live refs) and empty `.principal/`, added frontmatter to the two Figma
     formats, `skills/pptx-to-md-skill/` → `skills/pptx-to-context-md/`.
     **Open judgment call:** `library/checklist-design.md` is now a pointer to
     the same source vendored as the `skills/checklist-design/` package —
     redundant, but `library/README.md` argues for keeping both. Left for the
     Designer.
  3. Figma cluster restructure — commissioned. Handoff spec next.
- **Done when:** the model exists and every resident is filed against it; the
  Figma cluster has no procedure duplicated across skills; the admission
  checklist is in `CONVENTIONS.md`; a new resident cannot be added without it.

---

## [Q-52] Design Studio conformance

✅ Complete 2026-08-24

- **Purpose:** Establish Design Studio as a declared governed resource: exact
  artifact statuses, stewardship, material-change path, maintenance lifecycle,
  and a tested on-demand reading path.
- **Current change:** `federation/RESOURCE.md` declares the candidate resource
  contract and separates normative procedure from external evidence. The
  cartridge moved from the legacy `.principal/` location without discarding
  Product or Work content.
- **Path test (2026-08-24):** Pass. The Sharon Save/Cancel adjacency case led
  from `README.md` to `library/` to `pajamas-destructive-actions.md`. The
  library preserved the source's external, non-binding status and ownership;
  the selected entry identified the case as a medium-severity unsaved-edit
  discard. Its linked GitLab source was reachable and confirmed that such an
  action may warrant an additional prevention step. The resulting bounded
  application is a design consideration — add deliberate separation or friction
  in proportion to consequence — not an instruction to alter Sharon.
- **Disposition:** The Designer registered this resource on 2026-08-24 after
  Principal's current compact-2026-08-24 review and path test. It is
  Registered / Verified / Available through its declared non-speaking resource
  route. Shared skill loading is explicitly out of scope until a separate
  adoption decision.

---

Closed 2026-09-06, recorded in git: Q-59 adoption batch (Workspace_0 → federation synthesis, Principal-owned in `../principal/federation/WORK.md`). Adopted 3 formats (`strategic-deck` — the renamed+restructured `layered-deck`, kept as a deprecation stub; `video`; `ux-benchmark`), 8 design skills (`figma-audit-structure`, `figma-conversion-skill-builder`, `figma-design-system`, `figma-ds-recreate` — given the library-agnostic `figma-borrow` treatment; `translate`, `screenshot-verify`, `md-renderer`, `pptx-to-md-skill`), 3 fold-deltas (`figma-build` §6 Plugin-API-vs-MCP boundary; `wrapup` no-silent-deferral; `adopt`/`deploy` `strategic-deck` rename), `skills-lock.json` (new — provenance for the 3 vendored skills), `CONVENTIONS.md` (new — `figma-` naming + trust-the-skill-file, routed from the WS0 `.memory/` store), and the vendored `brandkit` + `design-taste-frontend` (MIT, `Leonxlnx/taste-skill` @ `ccbc156`). Client-content scrubs applied to the copied formats/skills; scan clean. Commits `11620a9`, `42c697a`, `0d3f279`, and the governance-doc pass. Two items deferred to Q-60/Q-61. Registry reconciliation: artifact set changed → revalidation due.

Closed 2026-08-26, recorded in git: Q-55 (Checklist Design skill admission). The Designer approved admission of `Checklist-Design/skills` v3.2.1 (`d5c2e833c9a2a17792751a67f86f2ca4aca0c14b`) as an MIT-licensed third-party procedure. The canonical Design Studio snapshot preserves the source package unchanged plus its upstream `LICENSE`; a scoped client-content scan and independent Care Circle discovery test passed. Sharon's matching untracked local package and its one-entry stale lock were removed only after that global proof.

Closed 2026-07-26, recorded in git (`dabd51b`): C-01/Q-01 (bootstrap from Harness). `formats/`, `skills/`, `references/` populated per the reuse manifest, verified independently (not just self-reported): a scoped grep across all three directories for "Deloitte"/"Poalim"/"Isracard"/the source operator's username returns zero matches; `figma-borrow/` carries no library index; `figma-roundtrip/scripts/` carries no client-sourced scripts; `figma-build`'s and `figjam`'s worked examples are genuinely replaced with neutral placeholders, not just flagged, confirmed by direct inspection. `render-html.js` was read in full and confirmed to resolve all paths from its own arguments — no hardcoded paths of any kind. One honest residual: a repo-wide grep still matches inside this file's own history and `PRODUCT.md`/`README.md`, because those governance docs necessarily name what was excluded when describing the scrub — not a leak, correctly left alone rather than scrubbed into vagueness.

---
