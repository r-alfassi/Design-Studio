# Design Studio — Conventions

Normative conventions for working with this resource's skills and formats. Not
design-craft doctrine (that lives in the individual skills) — these are rules
about how the skills themselves are named and consumed.

Governed by `federation/RESOURCE.md`. Principal is the steward; the Designer
approves material changes.

---

## Skill naming — `figma-` prefix

New Figma-specific skills use a `figma-` prefix (`figma-build`, `figma-borrow`,
`figma-roundtrip`, `figma-ds-recreate`, `figma-audit-structure`,
`figma-design-system`, `figma-conversion-skill-builder`, `figma-production-loop`).

A skill counts as Figma-specific if it operates on Figma design files via the
Plugin API or Figma-native constructs. It does **not** apply to a skill that
merely touches Figma among other tools (`rtl` also covers HTML; `translate`
also handles plain text) or targets a different Figma surface (`figjam` is a
whiteboard tool, not design files).

Existing non-conforming names (`rtl`, `figjam`) are grandfathered by operator
decision — do not rename them under this rule.

## Trust the skill file

When a `SKILL.md` says to apply its rules without re-deriving the logic each
time, take that literally. Re-inspecting to verify what the skill already
documents wastes tool calls with no quality gain.

The pattern: read the skill → run one inspection pass to classify the work
(counts, edge cases the skill doesn't cover) → start executing. Only pause for
genuine surprises the skill doesn't address. Do not run "verification"
inspections on patterns the skill already defines.

---

*Provenance: routed from the Workspace_0 Harness `.memory/` store during the
Q-59 synthesis (2026-09-06). Original entries were `feedback_skill-naming-figma-prefix`
and `feedback_trust-skill-files`.*
