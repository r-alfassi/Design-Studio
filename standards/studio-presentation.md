# Studio presentation

Binding cross-project standard for the presentation layer of Figma files: the
containers, labels and section backgrounds that hold and name work, such as a
sprint page or a design-system page. Adopt this standard in a project's
`DESIGN.md` when its Figma file presents sprints or a design system. It governs
presentation chrome only. The project's own design, tokens and decisions stay
project-owned.

## Binding statement

The standard binds every project that adopts it, by naming it in its `DESIGN.md`. The Designer confirmed on 2026-10-23 that adoption is explicit, as with the mobile standard.

Presentation chrome is built from the studio kit, the components and tokens in
Design Studio's Figma file, so that the project's own design is the only strong
visual identity on the page. Chrome means:

- state labels, placeholder boxes, direction-summary cards and frame cards;
- sprint and sprint-group section backgrounds and names;
- on a design-system page, section headers and the containers that hold a
  component with its variants.

The kit's pieces for design-system pages, drawn from Sharon's and Karma
Warrior's Figma files and from what the official documentation pages of
Carbon, Atlassian and Primer share:

- **Section header:** a title, one line saying what the section holds, and a
  status (for example provisional, accepted or deprecated) with its date.
- **Component container:** an eyebrow naming the kind (primitive, atom,
  assembly), the component name, one line of description, a preview slot for
  its variants, and a usage line. It also has two optional slots, one for an
  anatomy diagram and one for do and don't pairs, which the Designer chose to
  include.
- **Callout:** a notice for a standard or an accepted exception that applies to
  what is shown.
- **Token tile:** a color swatch, a spacing bar, or a type sample, each with the
  token's name and value.

A component's documentation can span several views, such as examples, usage
and accessibility. Each view is its own section and not a bigger container.

## One page for a design system

A design system has one page. It is divided into sections by layer, such as
atoms, molecules and organisms, and each section opens with a section header.
Inside a layer section, each component has its own section, named for the
component, tinted differently from the layer. That section holds two things: the
component container on one side, as the spec card, and the component's own main
component or component set on the other. The main component is shown once. The
container does not repeat its variants, so its preview is left empty and hidden.
A second page that holds the same components is not kept, and neither is a copy
of a component beside its source, because duplicates compete and drift. A main
component cannot sit inside a container's slot through the Plugin API, so it
sits beside the container. The main component is the project's own design and
not chrome. It passes the check when its name is the name its container shows.

The pieces are built on the Components page of the studio's Figma file and the Designer published the library on 2026-10-23. A file imports them by key, and `tools/check-presentation-chrome.js` read the library's variables correctly on a subscribing file. Open: the Template page's sprint-section fill is not yet bound to a kit variable.

The kit is quiet on purpose. A project's presentation then reads the same way
from one project to the next, and the thing being shown is never competing with
the frame around it.

## How a project gets the kit

The kit is published as a team library from Design Studio's Figma file, and a
project's Figma file subscribes to it. There is one source, so a fix to the kit
reaches every project that adopts the standard. The Designer chose this on
2026-10-23. Publishing is a step in Figma and not something an agent can do.

The Designer published the library on 2026-10-23, and the check has run on files that subscribe to it.

## What it does not govern

- The project's own design, and its design system.
- Any record of work in progress, such as a board of what is active, next or
  parked. The project's record holds that, and a copy in Figma goes stale.

## Validation

Before a page is reviewable, list the nodes that act as chrome and confirm that
each one is an instance of a kit component or uses kit variables, with no raw
color, radius or spacing of its own. Re-check after cloning or restructuring a
page.

A script produces the list: `tools/check-presentation-chrome.js`. It is read-only.
For each section on a page it reports every direct child that is not an instance
of a kit component, and every section whose own fill does not use a kit variable.
A main component or component set passes when a container in the same section
shows its name. The sprint route runs it before a page is reviewable. A project's design belongs
inside a kit frame card or container, not directly in a section.

A section may group other sections, as a tinted sprint-group section does. A
grouping section passes when its own fill uses a kit variable and its direct
children are sections or kit instances. Every other direct child of a section is
chrome that must be a kit instance, which the Designer confirmed on 2026-10-23.

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
