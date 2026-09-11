# Mobile design

Binding cross-project standard for the legibility of mobile UI designed in
Figma. Adopt this standard in a project's `DESIGN.md` when mobile screens are
within scope. It governs visual construction only; product decisions, runtime
accessibility behavior, and platform implementation remain project-owned.

## Legibility floor

Visible, user-facing text in a mobile Figma frame must be **14 px or larger**.
This includes labels, metadata, controls, tab labels, stat values, helper text,
and comparison-table content that a person must read to use or understand the
screen.

The floor is a Figma logical-size rule. It does not replace platform text
scaling, contrast requirements, localization testing, or appropriately sized
interactive targets.

## Design response to density

When the content will not fit at 14 px, change the structure before shrinking
the type. Prefer one or more of:

- split dense information into a dedicated view or progressive disclosure;
- use clearer labels and fewer simultaneous attributes;
- create a two-line summary or a scannable row rather than a compressed table;
- increase vertical space or allow scrolling where the product flow supports it.

Do not use undersized text merely to preserve a desktop-like density on a
phone.

## Exceptions

Decorative marks that are not required to understand or operate the interface
are outside this rule. Any other exception requires an explicit project design
decision, a link to the affected Figma node, the reason the 14 px treatment is
not viable, and the compensating legibility treatment. An undocumented
exception is a defect, not a discretionary adjustment.

## Construction and validation

Use named local text styles at or above the floor; avoid one-off smaller text.
Before a mobile screen is reviewable, inspect the visible text nodes in the
contracted frame and confirm that none is below 14 px. Re-check after cloning,
responsive reflow, localization, or density changes.

At the Figma-to-production boundary, preserve the intent in the implementation
contract and verify the resulting mobile UI at its supported text-scaling and
viewport conditions. A 14 px Figma style alone is not evidence of an
accessible runtime experience.
