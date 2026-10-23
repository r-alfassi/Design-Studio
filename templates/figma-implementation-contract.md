---
name: figma-implementation-contract
description: "The required shape of a bounded mapping from named Figma nodes to a production surface — preserves structural intent and declared platform differences. Not Figma parity for uncontracted nodes. Used with the figma-sprint skill and the figma-change-log format."
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
- **Intentional differences:** Named platform or runtime difference, why it
  exists, and its reconciliation route if one is expected. Account for each
  check under "Platform difference checks" below.
- **Status and evidence:** Exploring, accepted for translation, implemented,
  or device-verified; link code revision and proportionate verification.
```

No entry means no claimed parity. Link outward to the Figma change log and
governing documents instead of duplicating their history or rationale.

## Platform difference checks

Before declaring parity, account for each of these, whatever the platform. A
difference that affects the result is an intentional difference to record. It
is not a reason to edit Figma silently or to misrepresent the record.

- **Text metrics.** The platform's fonts, line heights and text scaling differ
  from Figma's, so a fixed height in Figma may be content-sized in production.
- **System insets and safe areas.** Status bars, navigation bars, notches and
  keyboards. Say whether a fixed padding stands in for an inset.
- **Touch and pointer targets.** The platform's minimum size for a tappable
  element, measured against the Figma frame and the built view.
- **Layout direction.** Right-to-left mirroring, and whether the production
  layout uses start and end, not left and right.
- **Accessibility semantics.** Labels, roles and focus order, which Figma does
  not carry.
- **Dynamic content.** Long names, wrapping, truncation, empty and error states.
- **Runtime-only states.** Pressed, focused, loading and gesture states that a
  resting frame does not show.
- **Variants as named states.** Map a Figma variant to a named production state
  or branch, and do not collapse materially different states into an undocumented
  boolean.

## Quality check

Can a cold reader trace every material visible container from Figma through
the production mapping, identify its layout rule and intentional differences,
and tell what evidence supports the current relationship?
