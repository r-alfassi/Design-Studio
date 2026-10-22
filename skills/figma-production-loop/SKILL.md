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

### Reconciliation preflight

Before every Figma mutation, reconcile the exact contracted scope. Treat the
current Figma canvas as the authority for visual construction and treat any
local state ledger only as a record of previously created node IDs.

1. Read the scoped source frames, component sets, foundations, and nearby
   assembly area that the planned mutation depends on.
2. Run [scripts/reconcile-figma-scope.js](scripts/reconcile-figma-scope.js)
   in a read-only `use_figma` call, passing only the known node IDs relevant to
   the request. Return hierarchy, Auto Layout, dimensions, text, component
   properties, and variable/style bindings.
3. Compare that snapshot with the previous ledger entry. Preserve every user
   change found in Figma; never restore or overwrite an earlier agent state.
   When the user has refined the latest agent proposal, treat that refined
   proposal as the current authority. Do not substitute an earlier raw source,
   reference, or parallel experiment merely because it is easier to inspect.
4. Classify a detected difference before writing:
   - **local visual adjustment**: retain it and continue from it;
   - **reusable component or token rule**: retain it, update the component or
     foundation deliberately, then update the ledger; or
   - **cross-project operating rule**: retain it and promote the decision into
     the appropriate Design Studio standard.
5. Update the ledger with the accepted current IDs and any newly established
   reusable rule before the next mutation.

### Tokenization decision for reconciled edits

When reconciliation finds a user-made change inside a reusable component,
first check whether an existing scoped variable already represents that value
and role. Never repurpose a broader token simply because its prior binding is
convenient.

- When a suitable token exists, retain the user change and propose rebinding
  the affected component property to that token.
- When no suitable token exists, retain the user change, record it as a
  **pending reusable-token decision**, and propose the narrowest appropriate
  primitive or semantic token before making a Figma mutation. State its value,
  scope, implementation syntax, and every affected component property.
- Create and bind the proposed token only after the decision is accepted.
  Apply it consistently to the relevant variants, then update the foundation
  documentation and ledger.

For example, a Metric Cell label/value stack changed from `4` to `0` must not
alter the shared `space/4` token. If no zero-gap token exists, propose
`space/0` with `GAP` scope and a scoped implementation syntax; preserve the
unbound user edit until that proposal is accepted.

### Pixel-raster fidelity gate

When a Figma component family presents pixel or other raster source artwork,
its preview structure must never silently change the asset silhouette. Before
promotion, run `scripts/audit-pixel-raster-fidelity.js` in a read-only
`use_figma` call with the exact source component-set IDs.

- The component set, every variant root, and every immediate raster host must
  have a zero corner radius and no effects.
- Treat zero radius as fixed asset geometry, not a radius token. The rule
  prevents Figma's default preview treatment from rounding or softening a
  pixel edge; it is not a ban on intentional pixel-art chamfers drawn in the
  raster itself.
- Do not use a decorative frame, mask, shadow, or rounded presentation wrapper
  as a source primitive. If one is needed for documentation, keep it outside
  the source family and name it as presentation-only.
- The audit only reports violations. Apply a correction only to the exact
  source nodes it returns, then re-run the audit and inspect one representative
  preview at native size.

Do not scan the entire file by default: reconciliation is intentionally scoped
to avoid noise and to respect unrelated work. Run a deeper system audit before
production promotion, a component-library handoff, or a material foundations
change. The helper reports state only; it must never write, revert, detach, or
promote Figma nodes.

### Figma sprint-page row model

On a page used for design sprints -- for example `Sprints` or `Production
sync` -- organize work as a chronological vertical stack of **initiative rows**.
Each initiative owns one named horizontal Figma section. Within that section,
place its direction summary, evidence, experiments, comparisons, decision, and
current authority left-to-right in the order the work was explored. Name each
frame for its phase and state so the row is understandable without opening the
contract.

An asset lab, palette test, anatomy study, or other supporting experiment is
part of the initiative that prompted it. Keep it inside that initiative's
section and continue the same left-to-right reading order; do not create a
page-level lab section or a separate row merely because the medium changes.
Preserve prior candidates beside later ones when comparison matters.

A genuinely new concept, subject, or product question starts a new dedicated
section below the preceding initiative row. Do not merge the histories of
independent sprints or arrange them as one horizontal mega-row. A set of
related sprints may sit together in a sprint-group section (see
"Alternating layout axes"); unrelated sprints never share one.

Before adding work, identify the target initiative and phase; place the frame
in that sprint section rather than as a page-level orphan or a new global phase
section. Figma Sections do not provide Auto Layout, so this is an intentional
canvas arrangement: preserve a consistent left-to-right gap and resize the
sprint section to contain its frames. A later sprint is a new section, not a
continuation tacked onto an earlier sprint. A distinct stage of the same topic
is a half-step sprint, numbered NN.5, in its own section directly below sprint
NN; it never extends NN's section.

### Alternating layout axes

The layout direction flips at each level of grouping. Frames inside a sprint
run horizontally, left to right, in the order explored. Sprints on a page, or
inside a group, stack vertically. Sprint groups sit side by side horizontally,
each group a vertical stack of sprints. A group of groups stacks vertically
again. Give each sprint group its own container section, tinted differently
from the sprint sections inside it, so the extra level is visible. A reader
then finds any frame by going across, then down, then across.

### Frame labels and states

Put each frame's name and one state label on the canvas, not only in the layer
panel. A reader on the canvas must be able to tell a baseline from current
authority. The states are current, proposal, rejected, superseded, final
outcome and placeholder; the State label component in the Design Studio Figma
file defines their look.

- Keep a rejected branch beside the work it was compared with, labelled
  Rejected, with its reason in its name or beside it. Dimming alone is not a
  label.
- Mark any gap with a placeholder box that names what will fill it and who
  provides it. Never fill a gap with invented content to make a frame look
  finished.

### Design apart from layout

A sprint section is the direct parent of the sprint's steps. A sequence frame
that holds the steps, and also the sprint's title and question, is unpacked:
each step becomes a direct child of the section, and the title and question
become the direction summary.

A step is a frame card from the Design Studio library: a header with the state
label and the frame's name, then the design and nothing else. The design is the
project's own frame, component instance or raster. Notes, titles and captions
are text in the card. A presentation background, border or title inside the
design frame is layout, and it is removed.

Where an explanatory board shows something that has since become a component,
replace the board with instances of the component. Keep a board that is the
sprint's own construction evidence, or a rejected candidate, as labelled
history.

### Arranging a sprint page

Arrange a page in this order, reading the page back after each step: section
backgrounds and names; frame cards and state labels; direction summaries as the
library component, with a placeholder box where a sprint has none; unpacking
sequence frames; stripping chrome from image tests; separating notes from design
in explanatory boards; then restacking the sections and checking that every
frame sits inside its section with no overlap. Take a frame's state from its
name where it says one. Otherwise a baseline, source, evidence or reference is
Current and a numbered step is Proposal, and the Designer corrects any that are
wrong.

### Bulk changes

Before any change that removes more than one node, return the exact list of what
it would remove, with the evidence that each holds only what was already moved
or copied, and show it to the Designer first. A node is annotation only when
every child is a text node and nothing is nested, because text inside a frame
can be interface text. After restoring a version, read back what came back and
what was lost before relying on it.

### Sprint operating board

Keep one sprint operating board per project with four zones: Now (one active
scope, or an explicit "none", and the decision it is making), Next, History
(resolved, superseded or kept as evidence, with no current authority), and a
Parking lot. A parked item needs a named decision that unlocks it. The
Template page of the Design Studio Figma file holds the board.

### Studio containers

Build sprint containers (direction summaries, state labels, placeholder boxes,
the operating board) from the Design Studio Figma file's components and tokens,
so the project's own design is the only strong visual identity on the board.
The same file's Practice page shows this practice and its Examples page shows
it in use.

### Sprint direction summary

Begin every exploratory Figma sprint with a concise **Sprint direction
summary** as the first frame in its section. It gives a reviewer the premise
for the screens that follow without making a proposal look like production
authority. Keep it short and decision-focused:

- the experience change being tested, in one plain-language sentence;
- the two or three design principles or constraints that govern the attempt;
- the intended reading order or player question sequence; and
- the specific scope of the comparison, including what it deliberately does
  not decide.

Retain the summary when later variants are added. It is the shared frame of
reference for comparison, not a screen to be replaced by the latest proposal.
Name it `Sprint direction summary` (with the sprint/topic where useful) and
place it to the left of the historical baseline and proposed variants.

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
- each such frame's bounds sit within that section's bounds;
- no named current-authority frame for that sprint remains a page-level child
  or other orphan outside the section; and
- no unnamed section remains on the sprint page.

If any check fails, stop, repair or reparent the affected node, resize the
section when needed, and re-run the inspection. Do not mark the screen
reviewable, log an accepted delta, promote it, or translate it to production
until the containment gate passes.

### Sprint-close promotion review

Before closing a sprint, explicitly review the accepted result against the
shared Components and Flows pages. Record both decisions in the sprint's
project change record:

First, place a clearly named **Final outcome** artifact at the far right of the
sprint's progression. It must show the accepted result in the context of the
work that led to it. Only then may that outcome be promoted into Components,
Foundations, or Flows. The promoted artifact can be an instance, a deliberately
linked copy, or a documented source reference, but it must not become the only
place where the accepted result is visible.

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
2. **Construct or revise in Figma.** Use the Figma plugin's `figma-use` and
   `figma-generate-design` when a Figma frame must be built or structurally
   changed. Use the Figma plugin's `generate_figma_design`
   capture to bring a running page into Figma and `get_design_context` to read a
   node back as code; neither is an Android translator. Use preview tooling only
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
