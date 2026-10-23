---
description: When and why the Designer comes to Design Studio for visual work, in order, and what they expect at each step.
follows: [audience.md, requirements.md]
---

# Journeys

This file says what a person does with the product, in order, and what they expect at each step. It holds intent, and the code is compared against it.

Source: the Designer's answers in the grilling session of 2026-10-21. Open: a draft awaiting the Designer's reading of the wording.

## Iterating in Figma and handing off

The Designer has a project whose direction is stated, and wants to do most of the design iterations in Figma, where the whole picture is visible, where they can point at what needs attention, and where they can make tweaks themselves. Once they agree, the agent takes it from there and makes it real in the product.

1. Asks for the project's design to be laid out in Figma. Expects the agent to find the stated direction first and to stop and ask where it is when there is none, and to offer a `DESIGN.md` when the project has none.
2. Sees the current state captured in Figma. Expects the whole picture readable in one place before anything changes.
3. Asks for changes. Expects the agent to work in a marked sprint area that leaves a trail, to show options side by side, and never to touch what is already approved.
4. Points at what needs attention and tweaks by hand. Expects each hand edit to be treated as the new truth and never overwritten.
5. Says it is agreed. Expects the agent to audit the frames' structure first and to report, and not fix locally, anything a library component owns.
6. Expects every agreed change that production does not yet match to be listed as a row in `DESIGN-DEBT.md`, with a translation record only for a component whose production form differs structurally, and nothing built before this point.
7. Hands the work to production, which is the project's own work and not Design Studio's. Later, when asked, sees the built result compared with the approved design. Expects a report of the differences, nothing moved, and a row to close only when production matches, in the commit by whoever made it match, with the evidence there.

## Tuning a project in place

The Designer wants a project's visuals fine-tuned while seeing the change live in the running product, and Figma would only get in the way.

1. Names the surface and what feels off. Expects the agent to read `DESIGN.md` and the stated direction first, and to stop and ask where the direction is when there is none.
2. Sees the agent work on a branch and show the change running. Expects nothing to reach the main line before approval.
3. Reacts and asks for more changes. Expects a short loop on the same branch, with each change visible as it is made.
4. Approves by merging. Expects `DESIGN.md` to be updated if the system changed and no debt row, because the design is the code, so the trail is the project's own history.

## Formalizing a component into the design system

A sprint has ended in the Designer's decision to formalize a component, or the Figma file has gone stale beside the code.

1. Decides that a component should be formalized. Expects the agent to say which side is newer for that component.
2. Expects the agent to audit the source frame's structure first.
3. Sees the component in the design system as reusable, with its tokens bound, and mirroring what the product has in code and `DESIGN.md`. Expects a stale Figma component to be updated from the code first.
4. Expects a component born in a sprint, and so ahead of the code, to get a debt row that says which direction it runs.
5. Expects `DESIGN.md` to be updated if the system changed.
