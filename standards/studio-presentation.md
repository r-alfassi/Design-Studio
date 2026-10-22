# Studio presentation

Binding cross-project standard for the presentation layer of Figma files: the
containers, labels and section backgrounds that hold and name work, such as a
sprint page or a design-system page. Adopt this standard in a project's
`DESIGN.md` when its Figma file presents sprints or a design system. It governs
presentation chrome only. The project's own design, tokens and decisions stay
project-owned.

## Binding statement

Presentation chrome is built from the studio kit, the components and tokens in
Design Studio's Figma file, so that the project's own design is the only strong
visual identity on the page. Chrome means:

- state labels, placeholder boxes, direction-summary cards and frame cards;
- sprint and sprint-group section backgrounds and names;
- on a design-system page, section headers and the containers that hold a
  component with its variants.

Open: the section headers and component containers for design-system pages are
not in the kit yet.

The kit is quiet on purpose. A project's presentation then reads the same way
from one project to the next, and the thing being shown is never competing with
the frame around it.

## What it does not govern

- The project's own design, and its design system.
- Any record of work in progress, such as a board of what is active, next or
  parked. The project's record holds that, and a copy in Figma goes stale.

## Validation

Before a page is reviewable, list the nodes that act as chrome and confirm that
each one is an instance of a kit component or uses kit variables, with no raw
color, radius or spacing of its own. Re-check after cloning or restructuring a
page.

Open: no script produces that list yet. It belongs in `tools/`, since what must
be exact should come from a tool.

## Exceptions

A project that cannot subscribe to the kit's library, or needs a container the
kit does not have, records the exception in its `DESIGN.md` with the affected
node, the reason, and the compensating treatment. An undocumented exception is a
defect, not a discretionary adjustment.

## Construction

Keep the project's design apart from the layout: the design is the project's own
frame, component instance or raster, and the chrome sits around it. A step frame
is a kit frame card with a header carrying the state label and the frame's name,
then the design and nothing else.
