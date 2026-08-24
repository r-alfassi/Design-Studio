# WORK.md — Design Studio

Principal-owned initiative registry. Ordered by urgency — top is most important.
Only living initiatives appear here; completed work is recorded in git commit history.

---

## Overview

Summary tree (mirrors document order — most urgent first):
- **[Q-52] Design Studio conformance** — declare resource authority and test
  its on-demand access-and-interpretation path on the Sharon design case.

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

Closed 2026-07-26, recorded in git (`dabd51b`): C-01/Q-01 (bootstrap from Harness). `formats/`, `skills/`, `references/` populated per the reuse manifest, verified independently (not just self-reported): a scoped grep across all three directories for "Deloitte"/"Poalim"/"Isracard"/the source operator's username returns zero matches; `figma-borrow/` carries no library index; `figma-roundtrip/scripts/` carries no client-sourced scripts; `figma-build`'s and `figjam`'s worked examples are genuinely replaced with neutral placeholders, not just flagged, confirmed by direct inspection. `render-html.js` was read in full and confirmed to resolve all paths from its own arguments — no hardcoded paths of any kind. One honest residual: a repo-wide grep still matches inside this file's own history and `PRODUCT.md`/`README.md`, because those governance docs necessarily name what was excluded when describing the scrub — not a leak, correctly left alone rather than scrubbed into vagueness.

---
