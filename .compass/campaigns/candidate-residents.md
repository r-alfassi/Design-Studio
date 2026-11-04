# Candidate Design Studio residents

State: Seed.

Tier: later.

## Vision

Only reusable, non-overlapping, client-safe design guidance enters Design Studio, so that a local lesson does not become a permanent convention without evidence.

## Quest Q-65 — mockup comparison-control placement

State: Seed.

Origin: surfaced in a Sharon project session on 2026-07-14 and initially captured as personal working memory outside a governed record. It was corrected into Design Studio backlog material on 2026-09-19.

Purpose: a comparison or testing control in an interactive mockup, such as toggling container styles, layouts, or copy options, belongs in the mockup's outer testing harness alongside any existing tab or state switcher. It does not belong in the simulated interface. Putting the control in a phone screen alongside real controls blurs what a user would see in the shipped product and what exists only for comparison.

Proposed admission:

- Kind: a standard, a stable constraint on mockup construction rather than a deliverable shape or reasoning framework.
- Overlap: not yet checked against `preview-server` conventions.
- Shape: likely `standards/mockup-comparison-controls.md`, with scope, the binding rule, and guidance on avoiding CSS or selector collisions when an outer-harness class name is reused in app content.
- Client-content scan: not yet performed. The source incident comes from Sharon and needs a neutral generalized case before admission, following Q-59's precedent for adopted material.

Awaiting: Designer decision whether it deserves a dedicated standard or belongs in an existing mockup-building skill or reference.

## Quest Q-66 — research the convention first

State: Seed.

Origin: surfaced in a Sharon project session on 2026-08-15 and initially captured as personal working memory outside a governed record. It was corrected on 2026-09-19.

Purpose: before changing interaction-design or UI behavior, including keyboard dismissal, gesture handling, navigation patterns, or standard component behavior, research the platform convention and present the finding before proposing or implementing a change. A report of a symptom is not enough reason to patch directly.

Proposed admission:

- Kind: a framework, a reasoning discipline rather than a fixed deliverable or procedure.
- Overlap: not yet checked against the frameworks directory or `library/heuristic-evaluation.md`; it may belong inside existing material rather than stand alone.
- Shape: likely a short frameworks entry or a clause in an existing interaction-design framework.
- Client-content scan: not yet performed.

Awaiting: Designer decision whether the result is a new framework or a clause inside an existing one.

## Quest Q-69 — check what a generated diagram actually produced

State: Defined (2026-11-04, the Designer asked for the framework to be drafted; the keep-test below has not been run).

Origin: surfaced in a Figma MCP session on 2026-11-04 where an agent drew flowcharts on a FigJam board, and recorded in `journal/a-diagram-is-checked-by-its-render/2026-11-04-generated-diagram-placement-layout-connectors.md`. The 2026-11-03 journal entry on tall screens reviewed at a size that hides the error has the same cause: the agent checked what the tool reported and not what the render showed.

Purpose: before an agent draws a diagram on a FigJam board, and again after, it checks what the tool's reply does not say.

Before drawing:

- List the board's pages and read the page the Designer named. The diagram tool takes no page and writes to the first, appended to the right of existing work.
- Use one flow direction in a flowchart. A per-section direction can be dropped by the layout when edges cross sections.
- Keep a loop to one step back inside a section, and point a back-reference at a duplicate of its target and not across the diagram.
- Expect each new diagram to start where the last one ended, and say how wide the new one will be.

After drawing:

- Render the board and compare its size with what is expected. A render taken at the moment of a write can show the old state, so check the size again before judging.
- Compare each new section's bounds with its neighbours.
- After any scripted move, check connector sizes and render again. A connector attached to a node moved by script can keep its old route, and comparing endpoint ids does not show it. Do not shift attached nodes.
- Stop after two attempts at one diagram and change the structure before a third.

Admission, 2026-11-04:

- Kind: a framework, decided. One judgment ("is this diagram done, and where it was asked?") as questions and quality bars. A fixed procedure with a test would make it a standard instead.
- Overlap: the official Figma skills `figma-generate-diagram` and `figma-use-figjam`, which are why the Designer retired Design Studio's own `figjam` on 2026-10-21. This proposal overlaps them, and on two points the session found them wrong or silent: the FigJam skill says a file has a single page, and the diagram reference does not say a per-section direction can be ignored. It also overlaps R-34 (compare a capture with a browser render) and the sprint skill's right-to-left gate (1:1 crops), which are the same habit on other artifacts. A separate resident is justified only if the official skills stay silent on these points; the other route is to pass the two corrections upstream.
- Shape: `frameworks/is-the-diagram-done.md`, one self-contained file with a name and a description, a judgment, eight numbered questions and quality bars, a fallback line and a Do and a Don't. It names other material by concept and not by path, and it loads nothing. It is indexed in `frameworks/README.md` and is not routed from the spine or from a skill, so nothing loads it yet.
- Client-content scan: clean on the framework and on this quest. Neither names a client, a project, a file key or a node id.

Awaiting: the keep-test from `STRUCTURE.md`, a fresh agent drawing the same kind of diagrams on a board with and without the framework, and the Designer's decision where to route it. The likely junction is a skill that draws on a board, and the spine does not carry it. The evidence is still one session. Until the test is run the framework is a draft and stays unrouted, and it leaves if the test shows no difference or if the official Figma skills come to cover these points.
