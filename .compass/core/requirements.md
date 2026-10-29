---
description: The outcomes the Designer and project agents can observe when Design Studio guides visual design work, each tied to the scope lines and principles it serves.
follows: [scope.md, constraints.md, principles.md]
---

# Requirements

This file says what outcomes someone using the product can observe, each as one testable statement with an ID and the principles, limits and scope lines it serves. It states what and why, and leaves how to the standards and scripts.

Source: the Designer's answers in the grilling session of 2026-10-21 on the single visual-design package, narrowed to work in a Figma file by the Designer on 2026-10-23. Open: a draft awaiting the Designer's reading of the wording.

## Starting the work

- **R-01** When a project states no direction, the agent asks where it is and stops before doing visual work. Serves: SC-05. <!-- R-01 -->
- **R-32** When the work has no Figma file, the agent offers to start one, from a capture of the running product or from the direction, and does no visual work until the Designer answers. Serves: SC-15. <!-- R-32 -->
- **R-34** A baseline captured from the running product is compared with a browser render before it is used, and a right-to-left page that arrives mirrored is corrected on a clone. Serves: SC-15. <!-- R-34 -->
- **R-03** A project without a `DESIGN.md` is offered one before visual work starts. Serves: SC-11. <!-- R-03 -->
- **R-21** The current state of the product is captured in Figma, readable in one place, before the agent changes any design. Serves: SC-15, SC-16. <!-- R-21 -->

## Where the agent stops

- **R-04** In a marked sprint area in Figma the agent works without asking, and before it changes anything approved it stops and asks. Serves: PN-01, SC-15. <!-- R-04 -->
- **R-19** A change the Designer makes by hand in Figma is never overwritten by the agent. Serves: PN-01. <!-- R-19 -->
- **R-27** A change the Designer makes by hand inside a reusable component is kept, and a token it needs is proposed to the Designer before it is created. Serves: PN-01. <!-- R-27 -->
- **R-05** The agent never changes a library component's own layout locally, and its report names where the fix belongs. Serves: PN-01. <!-- R-05 -->
- **R-06** Before a fix at section or page scale, the agent works on a clone and says which one is the original. Serves: PN-01. <!-- R-06 -->
- **R-20** Before an agreed design is handed off, and before a component is formalized, the agent audits the frames' structure and reports what it may not fix. Serves: SC-16, PN-01. <!-- R-20 -->

## Working in a sprint

- **R-22** A sprint keeps its trail: its options sit side by side, rejected ones stay labelled with a reason, and the accepted result sits at the far right. Serves: SC-16, PN-01. <!-- R-22 -->
- **R-35** A sprint tests one concern, and its frames differ from the baseline only in that concern. Serves: PN-01, SC-16. <!-- R-35 -->
- **R-28** Closing a sprint records whether its result reveals a reusable component or changes a flow. Serves: SC-16. <!-- R-28 -->

## Formalizing a component

- **R-07** A proposal to formalize a component into the design system waits for the Designer's decision before any design-system change. Serves: SC-16, PN-01. <!-- R-07 -->
- **R-24** Before a component is formalized, the agent says which side, Figma or the code, is newer for it. Serves: PN-02, SC-16. <!-- R-24 -->
- **R-26** When Figma is the stale side, it is updated from the code before the component is formalized. Serves: PN-02, SC-11. <!-- R-26 -->
- **R-25** A formalized component is reusable, has its tokens bound, and mirrors the product's code and `DESIGN.md`. Serves: SC-16, SC-11. <!-- R-25 -->

## Presenting work

- **R-30** On a project that has adopted the studio presentation standard, the chrome on a sprint page or a design-system page, meaning its labels, containers and section backgrounds, is built from the studio kit, and the project's own design is the only strong visual identity on the page. Serves: SC-14. <!-- R-30 -->
- **R-31** A project departs from the kit only by recording the exception in its `DESIGN.md` with the node and the reason. Serves: SC-14. <!-- R-31 -->

## Preparing for production and keeping the record

- **R-08** An accepted change that production does not yet match gets a row in `DESIGN-DEBT.md` with its Figma reference, its governing decision, its status and its evidence. Serves: SC-11. <!-- R-08 -->
- **R-09** A disagreement between Figma and production is raised with the Designer and is not resolved by the agent, and its row says which side is ahead. Serves: PN-02, SC-11. <!-- R-09 -->
- **R-10** A row leaves `DESIGN-DEBT.md` only when production matches, in the commit by whoever made it match, with the evidence in that commit. Serves: SC-11. <!-- R-10 -->
- **R-29** When the Designer asks, the agent compares the built result with the approved design and reports the differences without changing production. Serves: SC-15, SC-13. <!-- R-29 -->
- **R-11** A component whose production form differs structurally from the design has an entry in `FIGMA-TRANSLATION.md`, and no other component does. Serves: SC-11. <!-- R-11 -->
- **R-12** `DESIGN.md` is updated when an accepted visual change alters the system, in the format that `impeccable` reads. Serves: SC-11. <!-- R-12 -->

## Staying within its scope

- **R-13** The package works on a project that keeps no Compass record or other record system. Serves: SC-08. <!-- R-13 -->
- **R-14** A finding that implies a change of intent is handed back to whoever owns intent, and the package does not resolve it. Serves: SC-05. <!-- R-14 -->
- **R-33** The agent never edits the product's code, and a request to tune visuals in the code is pointed to the project's own tools. Serves: SC-13, SC-17. <!-- R-33 -->
- **R-15** The package does not restate Figma mechanics that the official Figma plugin's skills already cover. Serves: PN-03. <!-- R-15 -->
- **R-16** A resident stays in the package only if a fresh run on a real case does better with it than without it. Serves: PN-03. <!-- R-16 -->
- **R-17** When a project imports the package, only the spine loads at first, and the rest loads when the work calls for it. Serves: SC-12. <!-- R-17 -->

Closed 2026-10-23, when the in-place path left the scope: R-02 (naming the entry point among three), R-18 and R-23 (tuning in place). A sprint is the default, and formalizing starts only on the Designer's decision (R-07), so no separate choice of entry point remains.
