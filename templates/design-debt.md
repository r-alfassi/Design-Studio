---
name: design-debt
description: "The required shape of a project's design-debt file: the places where production and the approved design disagree, one row for each component, open debt only. Used with the figma-sprint and figma-formalize skills and the figma-implementation-contract template."
---

# Template: Design debt

## Purpose

Lists the components where production and the approved design disagree, so that what was agreed and has not shipped, or what shipped ahead of Figma, is visible at a glance. It is a status ledger that spans design and production. It is not a history, a release note, or a place to restate the reasons behind a decision, which the project's `DESIGN.md` and record hold.

## When it is used

When an agreed change is not yet in production, or when production is ahead of Figma for a component. A project that tunes its visuals in place has no design debt, because the design is the code.

## Project instance

One file named `DESIGN-DEBT.md` at the project root, beside `DESIGN.md`. It begins, under its title, with this paragraph, word for word.

> Open debt only. A row leaves when production matches the design, in the commit by whoever made it match, with the evidence in that commit. No row means no known gap. It does not mean verified.

## Row shape

One row for each component or screen, with only these fields.

```
## Component or screen name

- **Direction:** production is behind Figma, or Figma is behind the code.
- **Figma:** the URL and named node or nodes.
- **Governing decision:** a link to the exact `DESIGN.md` section or project decision that authorizes it, or "proposal" if none exists yet.
- **Disagreement:** one line on what differs.
- **Status:** agreed, in progress, or blocked, and what blocks it.
- **Evidence:** links to the code change or review once it exists.
- **Translation record:** a link to its entry in `FIGMA-TRANSLATION.md`, only when production differs structurally from the design.
```

- **Direction** says which side is ahead, as `frameworks/which-side-is-newer.md` decides it. A disagreement that neither side can be shown to lead is put to the Designer, and the row waits.
- **Governing decision** keeps the row from becoming a second record of why. A discovery in Figma that would change a governing decision is a proposal until that decision is updated.
- **Status** has no closed state, because a closed row is removed.

## Closing a row

The commit that makes production match the design removes the row and carries the evidence. When the Designer asks, Design Studio compares the built result with the approved design and reports the differences, and it moves nothing.

## What not to add

A closed row, or the history of one, which version control holds. The rationale for a change, which belongs in `DESIGN.md`. Release or runtime behavior. A task, a plan, or a note on how far the work has got.

## Quality check

Can a reader find, for each row, which side is ahead, what differs, what authorizes it, and what evidence will close it, without treating this file as another source of truth for the design?
