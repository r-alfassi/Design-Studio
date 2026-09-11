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

## Shared-file stewardship

When the contracted scope lives in an existing Figma file, the file itself is
part of the deliverable. Before creating, cloning, or moving a frame, inspect
the relevant page, section, and nearby nodes. Classify the needed work as one
of: revise the current node; add a named state or variant to its established
section; or preserve a superseded node as explicitly labelled history.

Do not add a peer frame merely because it is fast to construct. A new frame is
appropriate only when it represents a distinct documented state or variant and
has a clear place in the page's hierarchy. When a prior frame is superseded,
either revise it or place the retained historical reference in a named historic
area; never leave two visually similar frames as competing current authority.
Before archiving an existing iteration, compare its distinct containers and
state treatments with the governing contract and the proposed current frame.
Adopt or explicitly reject any stronger reusable structure; archive is a
conclusion of that comparison, not a substitute for it.

After a Figma write, review the affected page as well as the target frame:
names, section membership, reading order, spacing, and the relationship between
current and historic work must make sense to a human opening the file cold.
This is a bounded cleanup of the contracted area, not authorization to
reorganize unrelated design work.

### Production sync sprint layout

On a page named `Production sync`, organize work by sprint rather than by a
growing mixture of global phases. Each sprint owns one named horizontal Figma
section. Within that section, place its frames left-to-right in the order the
sync actually proceeds: evidence or baseline first, then the applicable
comparison/decision and current Figma authority, then implementation or runtime
evidence when it exists. Name each frame for its phase and state so the order is
understandable without opening the contract.

Before adding work to `Production sync`, identify the target sprint and phase;
place the frame in that sprint section rather than as a page-level orphan or a
new global phase section. Figma Sections do not provide Auto Layout, so this is
an intentional canvas arrangement: preserve a consistent left-to-right gap and
resize the sprint section to contain its frames. A later sprint is a new
section, not a continuation tacked onto an earlier sprint.

### Sprint containment gate

Treat containment as a structural invariant, not a visual impression. Before a
create, clone, or move, resolve the actual target section ID and record the
named sprint frames that must belong to it. A clone is page-level by default
until proven otherwise: append or reparent it to the target section before
setting its final canvas position. Do not infer its parent from matching x/y
coordinates or visual overlap.

After every write, independently inspect the page hierarchy and verify all of
the following:

- every named current-authority frame for the sprint is a direct child of the
  target section;
- each such frame's bounds sit within that section's bounds; and
- no named current-authority frame for that sprint remains a page-level child
  or other orphan outside the section.

If any check fails, stop, repair or reparent the affected node, resize the
section when needed, and re-run the inspection. Do not mark the screen
reviewable, log an accepted delta, promote it, or translate it to production
until the containment gate passes.

### Sprint-close promotion review

Before closing a sprint, explicitly review the accepted result against the
shared Components and Flows pages. Record both decisions in the sprint's
project change record:

- **Components:** decide whether the result reveals a reusable component,
  variant, token, or a correction to an existing component. Update the
  component library when it does; otherwise record why the work remains
  screen-specific.
- **Flows:** decide whether the result changes a user journey, state
  transition, entry point, or handoff. Bring it into the Flows page when it
  does; otherwise record why no flow update is needed.

This is a deliberate promotion review, not an automatic duplication of every
screen into Components or Flows. Close the sprint only after the review is
evidenced, including an explicit “no update required” outcome where applicable.

## Process-feedback backlog

`backlog/` holds concise, reusable feedback from demonstrated loop failures.
Before a Figma mutation, scan the relevant open entry or entries; do not load
unrelated history. Each entry states the observed failure, its operating
correction, and the condition for closing it. Add an entry when feedback changes
how this skill should operate, then distill the durable rule into this file and
close the entry only when its stated condition is evidenced. The backlog is not
a changelog or a substitute for project design records.

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
