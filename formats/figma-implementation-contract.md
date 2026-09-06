---
name: figma-implementation-contract
description: "The required shape of a bounded mapping from named Figma nodes to a production surface — preserves structural intent and declared platform differences. Not Figma parity for uncontracted nodes. Used with the figma-production-loop skill and the figma-change-log format."
---

# Format: Figma Implementation Contract

## Purpose

Defines the bounded mapping from named Figma nodes to a production surface. It
preserves structural intent and declared platform differences; it is not a
claim that every Figma frame maps one-to-one to a runtime view.

## Project instance

Create one project-owned instance named `FIGMA-TRANSLATION.md`, headed
"Figma-to-production translation record." It contains only the components and
screens explicitly admitted to the loop.

## Authority and conflict route

For components and screens explicitly named in this record, Figma is the
working authority for their current visual construction: tokens, anatomy,
variants, and layout. It does not create or override product, interaction,
accessibility, data, or platform commitments. The project's `DESIGN.md` owns
those design decisions; production code owns runtime and platform behavior.

A Figma discovery that would change a `DESIGN.md` decision is a logged proposal
and becomes authoritative only when the decision record is updated. A runtime
or platform constraint is recorded as an implementation difference, not
silently copied back into Figma.

## Required record shape

```markdown
## Component or screen name

- **Figma scope:** URL, named node(s), and revision/version.
- **Governing decision:** Exact DESIGN.md/product/work link.
- **Visual construction:** Tokens, variants, hierarchy, sizing, and layout
  invariants that production must preserve.
- **Container topology:** Named Figma parent/child containers and their roles.
  For each material visible container, record flow direction, padding, gap,
  alignment, sizing behavior, and any scroll, clip, or semantic overlay rule.
  Normal flow must be nested Auto Layout in Figma, not absolute placement
  arranged to look correct at one size.
- **Production mapping:** Target screen/component and its containers. Map the
  Figma topology to production owners and state one-to-many or many-to-one
  mappings where true; never invent one-to-one correspondence or wrapper Views
  merely for superficial parity.
- **Intentional differences:** Named Android/platform/runtime difference, why
  it exists, and its reconciliation route if one is expected.
- **Status and evidence:** Exploring, accepted for translation, implemented,
  or device-verified; link code revision and proportionate verification.
```

No entry means no claimed parity. Link outward to the Figma change log and
governing documents instead of duplicating their history or rationale.

## Quality check

Can a cold reader trace every material visible container from Figma through
the production mapping, identify its layout rule and intentional differences,
and tell what evidence supports the current relationship?
