# WORK.md — Design Studio

Principal-owned initiative registry. Ordered by urgency — top is most important.
Only living initiatives appear here; completed work is recorded in git commit history.

---

## Overview

Summary tree (mirrors document order — most urgent first):
- [C-01] 🌱 Bootstrap from Harness
  - [Q-01] 📋 Migrate and scrub the reuse manifest

---

### [C-01] Bootstrap from Harness
🌱 Seed

- Problem: The design craft this repo exists to hold — RTL, Figma workflows, design-process formats, governance meta-skills — currently sits inside Harness, a repo cloned from a Deloitte employee's environment and entangled with real client engagement data (Poalim, Isracard). It needs to move here, minus everything client-identifying.
- Vision: Design Studio holds the same proven skills and formats, verified clean of any Deloitte or client reference, ready to be read and applied across every project Principal governs.
- Quests: Q-01
- Known unknowns: none — the reuse manifest (below) was scoped in detail before this repo was built, via a live inventory scan of the Harness repo.

#### [Q-01] Migrate and scrub the reuse manifest
📋 Defined

- Origin: Vision
- Problem: The reusable material lives in `c:\Roey\Studio\Harness`, mixed with Deloitte-branded assets and real client data. A prior read-only scan (2026-07-26, principal repo session) produced a precise inventory of what's clean, what's excluded outright, and what needs scrubbing before reuse.
- Purpose: Copy the in-scope material into this repo's `formats/`, `skills/`, and `references/` directories, genericizing the specific items flagged below, and verify — by grep, not by trust — that nothing Deloitte-branded or client-identifying survived the copy.
- Design — the manifest, in full:

  **Copy as-is:**
  - `skills/deploy.md`, `adopt.md`, `assess.md`, `promote.md`, `prune.md`, `migrate.md`, `gather.md`, `wrapup.md`, `new-component.md`, `render-html.md` (+ `render-html.js` — check this script specifically for hardcoded paths before copying; the source review didn't rule it out)
  - `skills/rtl/`, `skills/preview-server/`, `skills/transcript-ingestion/`, `skills/ux-expert/`, `skills/skill-creator/` (confirm a `LICENSE.txt` exists for `skill-creator` and copy it too if so)
  - `formats/layered-deck.md` (strip the incidental "CX GenAI" changelog mention), `formats/product-design.md`

  **Copy with specific edits:**
  - `skills/figma-build/` — copy as-is except `references/component-selection.md`: replace the "Poalim popover" worked example with a neutral placeholder example that preserves the same teaching point (component reuse/scavenging discipline)
  - `skills/figma-roundtrip/` — copy `SKILL.md` and its mapping-table content; remove the "Test Evidence" section referencing real Poalim project paths and Figma file/node IDs; do NOT copy `scripts/push-salesforce-nav-full.js` or `scripts/test-console-nav-push.js` as-is — either drop them or rewrite them against a generic/placeholder component, since they're sourced from a named client component
  - `skills/figjam/` — copy as-is except `standards.md`: replace the "Poalim project" example (Matab, Retail, Sales, Mortgages domain names) with a neutral placeholder
  - `skills/figma-borrow/` — copy `SKILL.md` only (the borrow workflow). Do NOT copy `libraries/awesome-ds.md` — it's a real Deloitte-internal design-system library key and file key, explicitly scoped to "Deloitte Studios org members." This repo needs no library index yet; note in `SKILL.md` (or leave as an open question here) that a real library index is a future addition once this studio has its own
  - `references/figma-mcp.md` — copy with the operator's real Windows username path genericized to a placeholder

  **Do not copy under any circumstances:**
  - `skills/deloitte-pptx/` and `skills/deloitte-pptx-node/` — entire directories, including the actual Deloitte-branded `.pptx` template file, brand colors, fonts, and copyright/footer strings
  - `.claude/settings.json`, `.claude/hooks/turn-counter.ps1` — leak real client folder paths and the operator's Deloitte OneDrive path
  - `.harness/01_PROJECT.md`'s "Studio Projects" table (the Poalim/Isracard engagement records) — the surrounding methodology in the same file is not being migrated at all this round (only the specific skills/formats listed above are in scope; the broader Harness governance methodology itself is a separate, not-yet-scoped question)
  - `initiatives/figma-html-bridge/` — out of scope, not relevant going forward (Designer's call, 2026-07-26)

- Tasks:
  - Copy the "as-is" list into `formats/` and `skills/`
  - Apply the specific edits above to `figma-build`, `figma-roundtrip`, `figjam`, `figma-borrow`, and `references/figma-mcp.md`
  - Verify: grep the entire new repo (including any copied scripts, comments, and binary-adjacent files) for "Deloitte", "Poalim", "Isracard", and the operator's real username string — zero matches required before reporting complete
  - Report exactly what was copied, what was edited and how, and the verification grep's result
