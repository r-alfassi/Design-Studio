---
name: figma-production-loop
description: Run a Figma-first design iteration for an explicitly contracted screen or component, logging accepted deltas and promoting only approved work to production.
---

# Figma-to-production loop

Use this skill when a project wants to iterate a screen or component in Figma
before changing production, and needs a bounded, evidence-backed translation
to production. Do not use it for a standalone Figma edit with no production
relationship, or to claim that an exploratory Figma change is shipped.

## Required project records

Before iteration, locate or create the project's instances of:

- `FIGMA-CHANGELOG.md`, following
  [figma-change-log.md](../../formats/figma-change-log.md)
- `FIGMA-TRANSLATION.md`, following
  [figma-implementation-contract.md](../../formats/figma-implementation-contract.md)
- the governing project `DESIGN.md` and relevant product/work decision

Read the contract's authority and conflict route before treating any Figma
observation as a design instruction.

## Loop

1. **Admit a bounded scope.** Name the Figma nodes, production surface, and
   governing decision. If a decision is absent, log a proposal; do not create a
   production commitment.
2. **Construct or revise in Figma.** Use `figma-build` when a Figma frame must
   be built or structurally changed. Use `figma-roundtrip` only for its
   HTML/CSS bridge; it is not an Android translator. Use preview tooling only
   when an HTML mockup is actually the relevant comparison surface.
3. **Log an accepted delta.** Add a concise, referential change-log entry. Do
   not log exploratory pixel nudges that have no decision or translation
   consequence.
4. **Update the implementation contract.** State the visual invariants,
   precise container topology, production-container mapping, and intentional
   platform differences. For every material visual container, name its
   parent/child role and layout rule (direction, padding, gap, alignment,
   sizing, scrolling or semantic overlay). In Figma, represent normal flow
   with nested Auto Layout frames; do not use absolute placement to fake a
   container. Read [Android Views guidance](adapters/android-views.md) when
   that is the target.
5. **Pass the promotion gate.** A production change requires a named Figma
   scope, governing decision, accepted contract entry, and separately granted
   implementation authority. Iterating in Figma does not authorize a code
   change, external action, or release.
6. **Implement and verify proportionately.** After authorized implementation,
   link code and device/runtime evidence from the contract and change log. A
   discovered runtime difference remains explicit until reconciled or accepted.

## Boundaries

Figma is working authority only for the visual construction of explicitly
contracted nodes: tokens, anatomy, variants, and layout. `DESIGN.md` owns
product and design decisions; production code owns runtime/platform behavior.
Figma does not decide data, accessibility, interaction, permissions, or Android
lifecycle merely because it is iterated first.

Container fidelity is a required part of visual construction. It means the
Figma hierarchy must truthfully express the containers that create the visible
result, while the contract explicitly records valid one-to-many or many-to-one
Android mappings. It does not require a decorative one-frame/one-View copy.

Referenced skills remain their own authorities. Do not copy or silently broaden
them. Review this loop if a referenced skill changes its scope or interface.
