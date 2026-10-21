# Legacy convention conformance

State: Seed.

Tier: next.

## Vision

Design Studio's legacy meta-skills follow the current record model, so that a procedure does not send a project to a retired governance shape.

## Quest Q-60 — align legacy meta-skills

State: Seed.

Surfaced: 2026-09-06 by Q-59's line-diff pass.

Problem: the governance meta-skills `adopt`, `deploy`, `promote`, `prune`, `wrapup`, and `transcript-ingestion` still instruct a project to write to the retired Harness cartridge, including `.harness/01_PROJECT.md`, `.harness/02_PRD.md`, and `.harness/03_BUILD.md`. The current record is Compass: product intent, campaign registry, journal, and research notes. This drift predates Q-59 and occurs in both the Workspace_0 branch and Design Studio.

Also: `deploy.md` and `adopt.md` still name `product-mockup` where the current format is `product-design`.

Outcome: the meta-skills reference the current Compass record model. The open design question is whether non-Compass projects keep a `.harness/`-style local cartridge or move wholly to Compass; the campaign must not assume the answer.

Done when: concrete before the first task.
