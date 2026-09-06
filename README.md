# Design Studio

Cross-project design craft — RTL, platform norms, Figma/HTML bridge conventions, design-process skills — decoupled from any client engagement and any one project. Extracted and scrubbed from Harness (a Deloitte-origin repo entangled with real client work) rather than adopted wholesale; see `federation/WORK.md` for the extraction record.

This repo never accumulates client-identifying content. That was the specific drift that entangled Harness — a standing rule here, not a one-time cleanup.

## What's where

| Directory | Holds |
|---|---|
| `formats/` | Deliverable/artifact specs — what a correctly-formed design output looks like. Product design, structured decks (`strategic-deck`), UX benchmarks (`ux-benchmark`), video/motion pieces (`video`), Figma change-log + implementation contract. |
| `skills/` | Procedures — governance meta-skills (deploy, adopt, assess, promote, prune, migrate, gather, wrapup, new-component, render-html) and design-craft workflows (RTL, Figma build/roundtrip/borrow/audit-structure/ds-recreate/design-system/conversion-skill-builder, FigJam, preview-server, transcript-ingestion, translate, screenshot-verify, md-renderer, pptx-to-md, UX critique, checklist-design, skill-creator, and the vendored taste skills brandkit + design-taste-frontend) |
| `references/` | This repo's own operational how-tos (tool setup, connection config) |
| `library/` | External, non-binding design/UX resources worth returning to — frameworks, pattern catalogs, methodologies this repo didn't author. Governs nothing; a shelf, not a procedure. |
| `CONVENTIONS.md` | Normative rules about how the skills are named and consumed (not design-craft doctrine — that's in each skill). |
| `skills-lock.json` | Provenance + integrity record for the third-party skills vendored into `skills/` (source, pinned ref, license, hash). |

## How a project links in

A project's own `DESIGN.md` cites the relevant convention here rather than duplicating it — the same split CULTURE.md holds with PRODUCT.md across this suite.

## Status

Governed by Principal (`federation/RESOURCE.md`, `federation/PRODUCT.md`,
`federation/WORK.md`), a passive knowledge repo — read and applied on demand,
not consulted as an active agent. Design history: Principal's `federation/WORK.md`, C-06.
