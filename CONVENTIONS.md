# Design Studio — Conventions

Normative conventions for working with this resource. Not design-craft doctrine
(that lives in the individual residents) — these are rules about how residents
are admitted, named, and consumed. For how the resource is organized, see
`STRUCTURE.md`.

Governed by `federation/RESOURCE.md`. Principal is the steward; the Designer
approves material changes.

---

## Admission checklist — run before adding any resident

Before a skill, format, framework, or standard is added — new-authored or vendored —
answer these four in the resident's `federation/WORK.md` entry. An unanswered
checklist is not an admission.

1. **Kind.** Which is it — format, framework, standard, or skill (see `STRUCTURE.md`)?
   Does it actually fit that kind's definition, or is it being forced? A skill
   that mostly guides a choice is a framework; a document with a required
   structure is a format. A reusable non-negotiable constraint with validation
   and an exception route is a standard.
2. **Overlap.** Does an existing resident already do this, or most of it? If
   so, the default is **extend or reference the existing one**, not add a
   second. Only add a separate resident when it does something the existing one
   genuinely does not, and say what that is.
3. **Shape.** A skill is `skills/<name>/SKILL.md` with frontmatter (`name`,
   `description`) — not a loose `.md`. A format is a named spec (single file or
   a directory with `FORMAT.md`). A framework is a single self-contained file.
   A standard is a self-contained `standards/<name>.md` that names its scope,
   binding statement, validation, and exception route.
4. **Client-content scan.** `grep` for client names, engagement names, operator
   paths/usernames, and — for design material — hardcoded private libraries,
   component-key indexes, and token dumps. Clean, or scrubbed to neutral
   placeholders. This is the standing rule, not a one-time check.

Then update `skills/README.md` (for a skill) so the resident is discoverable.

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
