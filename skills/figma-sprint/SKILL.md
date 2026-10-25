---
name: figma-sprint
description: Run a design sprint in Figma for a screen or component: a marked area that leaves a trail, options side by side, the Designer's own tweaks kept, and agreed work handed off as design debt. Use when the Designer wants to iterate a design in Figma before anything changes in the product.
---

# Figma sprint

Use this skill when the Designer wants to iterate a screen or component in Figma
before anything changes in the product, and to hand the agreed result to
production work as design debt. It ends at the handoff. Implementing, releasing
and verifying production are the project's own work. Do not use it to claim that
an exploratory Figma change is shipped.

## Required project records

Before iteration, locate or create the project's instances of:

- `DESIGN-DEBT.md`, following
  [design-debt.md](../../templates/design-debt.md)
- `FIGMA-TRANSLATION.md`, following
  [figma-implementation-contract.md](../../templates/figma-implementation-contract.md),
  only when a component's production form differs structurally from the design
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

Removals follow `standards/stopping-rules.md`: list what would go, show the
list, and remove nothing until the Designer confirms. After restoring a version,
read back what came back and what was lost before relying on it.

### No board of work in progress

Do not keep a board of what is active, next, done or parked in the Figma file.
The project's own record holds that, and a board beside it is a second source
that goes stale. Link to the project's status where a reader needs it.

### Studio containers

Build the chrome of a sprint page (direction summaries, state labels,
placeholder boxes, frame cards, section backgrounds) as `standards/studio-presentation.md`
requires, from the Design Studio Figma file's components and tokens. That
standard is where the rule and its exception route live.

### One concern per sprint

A sprint tests one change to the experience, so that every difference between its frames is the thing being compared. Write the change as one plain sentence. If that sentence needs "and", or the proposals differ from the baseline in two unrelated ways, it is two sprints. Each other concern stays where the project already holds it, such as a proposal or an open question on the flow, and becomes its own sprint after the earlier one decides, since a later sprint builds on an earlier outcome. A frame never carries a second concern for company. Found 2026-10-23 on ProShift, where one sprint on the schedule screen mixed unfilled slots, the rest-ratio panel and a week-change question, and the Designer could not focus on any of them.

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

### The Flows page

A project's Flows page holds its journeys as storyboards, one section per journey. A section opens with a section header. Under it sits one row of frame cards, one card per screen state, from the empty product to the filled one, each labelled Current and named for the step and the state ("1 · Roles, empty"). A right-to-left product reads from the right, so step 1 sits at the right end. A state that no screen reaches normally, such as an empty product or an open dialog, is reached by driving the running app and captured as it is, and a defect the capture shows is recorded beside its frame with a callout and not hidden. The sprint-close review adds the agreed result as a second row under the journey's current one. The Flows page is not a diagram of decisions.

**Mapping the product as it is.** A journey is a sequence of states a person passes through to get one thing done, read from the product and not from a plan. Name the journeys from what the product lets a person do, list each journey's states in the order a person reaches them, and give each state a name that says the step and the situation ("3 · Pill menu open"). A state that repeats an earlier journey's frame is copied and not captured again. A state that could not be reproduced is named in the section header's description, so a gap is never silent. A callout states only what its screens show, and where a screen shows a defect or an open question, it points at the sprint or the debt row that handles it. The map belongs to the project, and so do its state pages. What the product should do instead is a decision the Designer makes elsewhere.

The work has three mechanical steps, and each has a tool that is provisional until a second project has used it:

1. **Capture the states.** `tools/capture-states.cjs` reads a manifest with the product's page, a seed and one short script per state. In `pages` mode it writes a scratch page per state and, with `--shots`, a browser screenshot of each, reporting a state that throws. Look at the screenshots before asking for capture ids. In `capture` mode it opens each page in a fresh browser profile with the id the agent got from `generate_figma_design`, then the agent polls each id.
2. **Clean the captures.** `scripts/figma/clean-captured-frames.js` mirrors the frames to right to left, removes the hidden toast, keeps popups where the browser put them, end-aligns a hug-width tab strip, and names each frame. Compare each frame with its browser screenshot.
3. **Lay the section.** `scripts/figma/build-journey-section.js` builds the kit header, the Frame cards and the callouts, with step 1 at the right.

### Sprint-close promotion review

Before closing a sprint, explicitly review the accepted result against the
shared Components and Flows pages. Record both decisions in the sprint's
record beside its final outcome frame:

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

### Capturing the running product as a baseline

A capture is evidence of what was built, and it is a baseline and not an approved design. Before relying on one, compare it with a browser render of the same page. A right-to-left page comes into Figma mirrored, with its rows in DOM order from left to right, so it is checked and mirrored on a clone as `skills/rtl/references/figma.md` describes. Build proposals from the browser render or the corrected clone and never from the raw capture's order. A hidden fixed element, such as a toast, comes in as an empty frame and is removed from the clone. To capture a state that needs data or a click, serve a scratch copy of the page that seeds the app's data and calls its own functions, clears any stored data first, and carries the capture script in its head. Inject the seeding script before the file's last closing body tag, since an earlier one can sit inside a string. Capture each state in a fresh browser profile.

## Loop

1. **Admit a bounded scope.** Name the Figma nodes, the production surface, and
   the governing decision. If a decision is absent, record a proposal and do not
   create a production commitment.
2. **Construct or revise in Figma.** Use the Figma plugin's `figma-use` and
   `figma-generate-design` when a Figma frame must be built or structurally
   changed, and its `generate_figma_design` capture to bring a running page into
   Figma and `get_design_context` to read a node back as code. Present the work
   with the studio presentation standard. Use preview tooling only when an HTML
   mockup is the relevant comparison surface.
3. **Agree.** Done when the Designer says the result is agreed. Before that, run
   `figma-audit` on the agreed frames, and report what a library component owns
   without fixing it. If the Designer agreed before the audit ran, run it now,
   before any debt row, and report what it found. A finding does not undo the
   agreement, and the Designer decides whether it is fixed first.
4. **Open a design-debt row for each agreed change that production does not yet
   match.** Follow the design-debt template: the direction (which side is ahead,
   as `frameworks/which-side-is-newer.md` decides it), the Figma reference, the
   governing decision, what differs, the status and the evidence that will close
   the row. Create `DESIGN-DEBT.md` when the project has none, and say so. Do not
   record exploratory nudges that carry no decision.
5. **Write a translation record only where production differs structurally.**
   State the visual invariants, the container topology, the production mapping
   and the intentional differences, and account for the contract's platform
   difference checks. In Figma, represent normal flow with nested Auto Layout
   frames, and never use absolute placement to fake a container.
6. **Hand off, and stop.** The agreed design now goes to the project's own
   production work, which this skill neither does nor authorizes. Whoever makes
   production match removes the row, in the same commit, with the evidence.
   When the Designer asks for it, compare the built result with the approved
   design and report the differences, moving nothing.

## Boundaries

`DESIGN.md` owns product and design decisions, and production code owns
runtime and platform behavior. Figma does not decide data, accessibility,
interaction, permissions or platform lifecycle merely because it is iterated
first. When Figma and production disagree on how something looks, neither wins
by default: the direction goes into the row, and a disagreement that cannot be
shown to lead either way is put to the Designer.

Container fidelity is a required part of visual construction. The Figma
hierarchy must truthfully express the containers that create the visible
result, while the translation record states valid one-to-many and many-to-one
mappings. It does not require a decorative one-frame, one-view copy.

Referenced skills remain their own authorities. Do not copy or silently broaden
them. Review this skill if a referenced skill changes its scope or interface.
