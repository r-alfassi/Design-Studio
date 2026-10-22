# Design Studio

Cross-project design craft — RTL, platform norms, Figma/HTML bridge conventions, and design-process skills — decoupled from any client engagement and any one project. The Compass record holds its current intent and work.

This repo never accumulates client-identifying content. That was the specific drift that entangled Harness — a standing rule here, not a one-time cleanup.

## What's where

`standards/` holds binding cross-project design constraints selected by a
project. `mobile-design` sets the mobile visible-text floor and its validation
path.

| Directory | Holds |
|---|---|
| `formats/` | Deliverable-shape specs — what a correctly-formed design output looks like: `product-design`, `product-component`, `strategic-deck`, `ux-benchmark`, `video`, `figma-change-log` + `figma-implementation-contract`. |
| `frameworks/` | Thinking methods — a sequence of questions and quality bars for reasoning to a design choice; no deliverable shape, no procedure. `brand-strategy-foundations`, `ux-expert` (the 30 Laws of UX). |
| `standards/` | Binding cross-project design constraints selected by a project. `mobile-design` sets the mobile visible-text floor and its validation path. |
| `skills/` | Procedures — steps you run. Design-craft (Figma audit-structure/ds-recreate/design-system, RTL, new-component, render-html, md-renderer, preview-server, screenshot-verify, translate, transcript-ingestion, pptx-to-context-md, checklist-design, brandkit, design-taste-frontend) and meta (skill-creator, figma-conversion-skill-builder, figma-production-loop). Full index + "reach for it when": `skills/README.md`. |
| `references/` | This repo's own operational how-tos (tool setup, connection config) |
| `library/` | External, non-binding design/UX resources worth returning to — pattern catalogs, methodologies this repo didn't author. Governs nothing; a shelf. |
| `STRUCTURE.md` | How the resource is organized — the format / framework / standard / skill distinction and how to choose a resident. |
| `CONVENTIONS.md` | The admission checklist, naming rules, how residents are consumed. |
| `skills-lock.json` | Provenance + integrity for vendored third-party skills (source, pinned ref, license, hash). |

## How a project links in

A project's own `DESIGN.md` cites the relevant convention here rather than duplicating it — the same split CULTURE.md holds with PRODUCT.md across this suite.

## Status

The Compass record governs the current intent and work. Design Studio remains a
passive knowledge repo, read and applied on demand rather than consulted as an
active agent. Principal is the steward; the Designer approves material changes.
