# Checklist Design

**Source:** [github.com/Checklist-Design/skills](https://github.com/Checklist-Design/skills)
**License:** MIT
**Author/owner:** Checklist Design (external) — not authored or owned by this repo

## What it is

A Claude Code (also Cursor/Codex-compatible) skill bundling 112 published
checklists for web, mobile, and design-system work — no external API calls,
content ships with the skill. Two modes:

- **Audit** — works through a matching checklist item-by-item as a table:
  a status per item (present / partially present / missing / not needed /
  can't tell) plus why it matters. Produces an artifact, not a vibe.
- **Critique** — quicker, conversational peer-review pass on hierarchy,
  layout, typography, color, accessibility, interaction, and polish.

Accepts screenshots, live URLs, or Figma files as input directly.

## Install

```
npx skills add checklist-design/skills
```

## When to reach for it

- Before shipping a new interactive control, when `skills/ux-expert`'s 30
  Laws of UX would benefit from a more systematic, checklist-table pass
  across a broader pattern catalog (forms, destructive actions, mobile
  interaction specifically) rather than a principles-based critique.
- Retroactively auditing an existing screen or component for gaps not yet
  found the hard way.

## Why it's here and not installed as an active skill (yet)

Found while diagnosing a real Sharon interaction bug (2026-08-24) — an
adjacent Save/Cancel icon pair with no visual or spatial distinction between
a confirm and a discard action. Kept as a library pointer rather than
installed: Design Studio's declared delivery path is citation and on-demand
reading. A shared skill-installation mechanism would be a separate adoption
decision. Install it locally in a project now if the need is immediate; this
entry exists so the option isn't re-researched from scratch next time.
