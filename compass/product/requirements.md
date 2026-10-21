---
description: The outcomes the Designer and project agents can observe when Design Studio guides visual design work, each tied to the scope lines and principles it serves.
follows: [scope.md, constraints.md, principles.md]
---

# Requirements

This file says what outcomes someone using the product can observe, each as one testable statement with an ID and the principles, limits and scope lines it serves. It states what and why, and leaves how to the standards and scripts.

Source: the Designer's answers in the grilling session of 2026-10-21 on the single visual-design package. Open: a draft awaiting the Designer's reading of the wording.

## Starting the work

- **R-01** When a project states no direction, the agent asks where it is and stops before doing visual work. Serves: SC-05. <!-- R-01 -->
- **R-02** The agent names the entry point it chose for the work: a sprint, formalizing the design system, or tuning in place. Serves: SC-10. <!-- R-02 -->
- **R-03** A project without a `DESIGN.md` is offered one before visual work starts. Serves: SC-11. <!-- R-03 -->

## Where the agent stops

- **R-04** In a marked sprint area in Figma the agent works without asking, and before it changes anything approved it stops and asks. Serves: PN-01, SC-09. <!-- R-04 -->
- **R-18** When tuning in place, the agent makes its changes on a branch, and they reach the main line only when the Designer approves. Serves: PN-01, SC-10. <!-- R-18 -->
- **R-19** A change the Designer makes by hand in Figma is never overwritten by the agent. Serves: PN-01. <!-- R-19 -->
- **R-20** Before an agreed design is handed off, and before a component is formalized, the agent audits the frames' structure and reports what it may not fix. Serves: SC-10, PN-01. <!-- R-20 -->
- **R-05** The agent never changes a library component's own layout locally, and its report names where the fix belongs. Serves: PN-01. <!-- R-05 -->
- **R-06** Before a fix at section or page scale, the agent works on a clone and says which one is the original. Serves: PN-01. <!-- R-06 -->
- **R-07** A proposal to formalize a component into the design system waits for the Designer's decision before any design-system change. Serves: SC-10, PN-01. <!-- R-07 -->

## Keeping the record

- **R-08** An accepted change that production does not yet match gets a row in `DESIGN-DEBT.md` with its Figma reference, its governing decision, its status and its evidence. Serves: SC-11. <!-- R-08 -->
- **R-09** A disagreement between Figma and production is raised with the Designer and is not resolved by the agent, and its row says which side is ahead. Serves: PN-02, SC-11. <!-- R-09 -->
- **R-10** A row leaves `DESIGN-DEBT.md` when production matches, and the commit that closes it carries the evidence. Serves: SC-11. <!-- R-10 -->
- **R-11** A component whose production form differs structurally from the design has an entry in `FIGMA-TRANSLATION.md`, and no other component does. Serves: SC-11. <!-- R-11 -->
- **R-12** `DESIGN.md` is updated when an accepted visual change alters the system, in the format that `impeccable` reads. Serves: SC-11. <!-- R-12 -->

## Staying within its scope

- **R-13** The package works on a project that keeps no Compass record or other record system. Serves: SC-08. <!-- R-13 -->
- **R-14** A finding that implies a change of intent is handed back to whoever owns intent, and the package does not resolve it. Serves: SC-05. <!-- R-14 -->
- **R-15** The package does not restate Figma mechanics that the official Figma plugin's skills already cover. Serves: PN-03. <!-- R-15 -->
- **R-16** A resident stays in the package only if a fresh run on a real case does better with it than without it. Serves: PN-03. <!-- R-16 -->
- **R-17** When a project imports the package, only the spine loads at first, and the rest loads when the work calls for it. Serves: SC-12. <!-- R-17 -->

Open: what marks the end of work on the in-place path, and how the agent picks an entry point. The Designer has not settled either.
