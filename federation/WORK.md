# WORK.md — Design Studio

Principal-owned initiative registry. Ordered by urgency — top is most important.
Only living initiatives appear here; completed work is recorded in git commit history.

---

## Overview

**Active:** [Q-54] Global Design Studio skill availability; [Q-53] Figma-to-production loop pilot.

Summary tree (mirrors document order — most urgent first):
- **[Q-54] Global Design Studio skill availability** — make the Studio a
  directly discoverable, user-scoped workshop for every product project while
  retaining its repository as the canonical source.
- **[Q-53] Figma-to-production loop pilot** — establish a Figma-first,
  evidence-backed iteration path before Sharon production changes.
- **[Q-52] Design Studio conformance** — declare resource authority and test
  its on-demand access-and-interpretation path on the Sharon design case.

---

## [Q-54] Global Design Studio skill availability

Initiated 2026-08-26

- **Decision:** Design Studio is the Suit's readily available workshop for any
  product project. Its reusable procedures must therefore be globally
  discoverable to Codex for this user, rather than available only through
  Principal citation from the Design Studio repository.
- **Target posture:** `C:\Roey\Studio\design-studio` remains the canonical,
  version-controlled source. Each current Design Studio skill is exposed at
  Codex's user discovery scope through a link, rather than copied into a
  divergent local installation. Formats, library material, and references
  remain repository material reached through the selected skill.
- **Guardrails:** Global discovery is not global authority or automatic use.
  A skill remains bounded by its own description and is loaded only when
  selected. Project-specific decisions remain in the project. No plugin,
  marketplace publication, connector, or client-content change is part of
  this pilot.
- **Exit evidence:** From a non-Design-Studio product repository, Codex lists
  the linked skills; an explicit invocation and a matching implicit task load
  a selected skill correctly; an upstream Design Studio edit is reflected
  without a duplicate copy; link removal or disablement has a documented,
  reversible path. The access path is verified on this workstation before any
  wider distribution decision.
- **Current evidence:** Eleven user-scope Windows directory junctions point
  directly to the canonical packages, with no copied installation. A fresh
  Desktop-host session lists the linked skills from
  `C:\Users\User\.agents\skills`, including `figma-production-loop` and the
  newly admitted `checklist-design`; the availability path is accepted for
  this workstation. An earlier CLI-only negative was isolated to the separate
  `CodexSandboxOffline` home and is not host evidence. Explicit and implicit
  selection will be exercised by the next real Design Studio task; no
  artificial Design Studio edit is needed merely to prove that a junction
  reflects its target.
- **Non-goals:** Do not turn every Design Studio resident into a project
  dependency, preload full skill instructions into sessions, or claim
  availability on another person's machine. A plugin is deferred until the
  workshop needs distribution beyond this locally governed environment.

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

Closed 2026-08-26, recorded in git: Q-55 (Checklist Design skill admission). The Designer approved admission of `Checklist-Design/skills` v3.2.1 (`d5c2e833c9a2a17792751a67f86f2ca4aca0c14b`) as an MIT-licensed third-party procedure. The canonical Design Studio snapshot preserves the source package unchanged plus its upstream `LICENSE`; a scoped client-content scan and independent Care Circle discovery test passed. Sharon's matching untracked local package and its one-entry stale lock were removed only after that global proof.

Closed 2026-07-26, recorded in git (`dabd51b`): C-01/Q-01 (bootstrap from Harness). `formats/`, `skills/`, `references/` populated per the reuse manifest, verified independently (not just self-reported): a scoped grep across all three directories for "Deloitte"/"Poalim"/"Isracard"/the source operator's username returns zero matches; `figma-borrow/` carries no library index; `figma-roundtrip/scripts/` carries no client-sourced scripts; `figma-build`'s and `figjam`'s worked examples are genuinely replaced with neutral placeholders, not just flagged, confirmed by direct inspection. `render-html.js` was read in full and confirmed to resolve all paths from its own arguments — no hardcoded paths of any kind. One honest residual: a repo-wide grep still matches inside this file's own history and `PRODUCT.md`/`README.md`, because those governance docs necessarily name what was excluded when describing the scrub — not a leak, correctly left alone rather than scrubbed into vagueness.

---
