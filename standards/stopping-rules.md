# Stopping rules

Binding cross-project standard for when an agent doing visual design work proceeds on its own and when it stops for the Designer. Adopt it in a project's `DESIGN.md` when an agent does visual work on the project, in Figma or in code. It governs the agent's conduct around approved work only. What the project's design should be stays the project's decision.

## Binding statement

Work freely where nothing is approved, and stop for the Designer before changing anything approved.

What counts as approved:

- an approved design in Figma, and the accepted result of a sprint;
- the project's `DESIGN.md`;
- a library component, meaning one that belongs to a published library or to the design system;
- production, in code and in what ships;
- the removal of anything.

Where nothing is approved, the agent explores without asking. That is a marked sprint area in Figma, or a branch in code. In a sprint area the agent may create, revise and compare frames. On a branch it may change and show visuals. Neither is approved until the Designer says so, and merging a branch is the Designer's approval.

## What the agent does around approved work

1. **Keep the Designer's hand.** A change the Designer makes in Figma is the new truth. Before writing to a file the Designer may have edited, read what is there, and never restore or overwrite an earlier state of the agent's own. A hand change inside a reusable component is kept, and a token it needs is proposed to the Designer before it is created.
2. **Do not change a library component's layout locally.** Report the finding, name where the fix belongs, and do not work around the restriction by detaching the instance.
3. **Work on a clone for a larger fix.** Before a fix at section or page scale, clone the target, say which node is the original and which is the clone, and apply the fix to the clone.
4. **List a removal first.** Before removing more than one node, return the exact list of what would go, with the evidence that each holds only what has already been moved or copied. Show it, and remove nothing until the Designer confirms. A node counts as annotation only if every child is text and nothing is nested, because text inside a frame can be interface text.
5. **Wait for the decision to formalize.** A proposal to turn a component into part of the design system waits for the Designer's yes before any change to the design system.
6. **Raise a disagreement between design and production.** When Figma and production disagree on how something looks, either side may be ahead. Say which one is, put the disagreement to the Designer, and never resolve it silently. The record of it says which direction it runs.
7. **Hand intent back.** A finding that implies a change to the project's direction goes back to whoever owns intent. It is not decided in a Figma file or in code.

## Validation

Before reporting work as done, list every change made to anything approved, and confirm each has the Designer's yes. List every removal with its approved list. A change without a yes, or a removal without a list, is a defect.

## Exceptions

A project may name more things as approved, or grant a standing yes for a named kind of change, such as renaming layers in a sprint area. It records the grant in its `DESIGN.md` with its scope and the reason. An unrecorded exception is a defect, not a discretionary adjustment.
