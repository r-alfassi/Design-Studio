# Design Studio

Cross-project design craft — RTL, platform norms, Figma/HTML bridge conventions, design-process skills — decoupled from any client engagement and any one project. Extracted and scrubbed from Harness (a Deloitte-origin repo entangled with real client work) rather than adopted wholesale; see `federation/WORK.md` for the extraction record.

This repo never accumulates client-identifying content. That was the specific drift that entangled Harness — a standing rule here, not a one-time cleanup.

## What's where

| Directory | Holds |
|---|---|
| `formats/` | Deliverable-shape specs — what a correctly-formed design output looks like: `product-design`, `product-component`, `strategic-deck`, `ux-benchmark`, `video`, `figma-change-log` + `figma-implementation-contract`. |
| `frameworks/` | Thinking methods — a sequence of questions and quality bars for reasoning to a design choice; no deliverable shape, no procedure. `brand-strategy-foundations`, `ux-expert` (the 30 Laws of UX). |
| `skills/` | Procedures — steps you run. Design-craft (Figma build/roundtrip/borrow/audit-structure/ds-recreate/design-system, RTL, FigJam, new-component, render-html, md-renderer, preview-server, screenshot-verify, translate, transcript-ingestion, pptx-to-context-md, checklist-design, brandkit, design-taste-frontend) and meta (skill-creator, figma-conversion-skill-builder, figma-production-loop). Full index + "reach for it when": `skills/README.md`. |
| `references/` | This repo's own operational how-tos (tool setup, connection config) |
| `library/` | External, non-binding design/UX resources worth returning to — pattern catalogs, methodologies this repo didn't author. Governs nothing; a shelf. |
| `STRUCTURE.md` | How the resource is organized — the format / framework / skill distinction and how to choose a resident. |
| `CONVENTIONS.md` | The admission checklist, naming rules, how residents are consumed. |
| `skills-lock.json` | Provenance + integrity for vendored third-party skills (source, pinned ref, license, hash). |

## How a project links in

A project's own `DESIGN.md` cites the relevant convention here rather than duplicating it — the same split CULTURE.md holds with PRODUCT.md across this suite.

## Status

Governed by Principal (`federation/RESOURCE.md`, `federation/PRODUCT.md`,
`federation/WORK.md`), a passive knowledge repo — read and applied on demand,
not consulted as an active agent. Design history: Principal's `federation/WORK.md`, C-06.
