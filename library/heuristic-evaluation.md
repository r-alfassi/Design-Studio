# Heuristic Evaluation (Nielsen Norman Group)

**Source:** [nngroup.com/articles/how-to-conduct-a-heuristic-evaluation](https://www.nngroup.com/articles/how-to-conduct-a-heuristic-evaluation/)
**Author/owner:** Nielsen Norman Group (external) — not authored or owned by this repo

## What it is

The methodology most checklist- and audit-style UX tools (including
`checklist-design.md` in this same library, and the underlying logic of
`frameworks/ux-expert.md`'s Laws of UX) ultimately derive from: Jakob Nielsen's 10
usability heuristics (visibility of system status, match between system and
the real world, user control and freedom, consistency and standards, error
prevention, recognition over recall, flexibility and efficiency, aesthetic
and minimalist design, error recovery, help and documentation), evaluated
by walking through real tasks and flagging violations by severity.

This is the academic bedrock, not a tool — kept here as the reference point
for *why* the more actionable checklists say what they say, useful when a
specific checklist doesn't cover a case and the underlying principle needs
to be reasoned from directly.

## When to reach for it

When a design question doesn't map cleanly onto an existing checklist item
or Law of UX, and the actual first-principles question — does this violate
error prevention, user control, recognition-over-recall, or one of the
other nine — is the faster path to a grounded answer than guessing.

## Why it's here

Surfaced 2026-08-24 while researching a mature framework to replace ad hoc,
invented rules for a real Sharon interaction bug. See
`pajamas-destructive-actions.md` for the concrete pattern that case
resolved to; this entry is the deeper grounding underneath it.
