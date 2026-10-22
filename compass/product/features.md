---
description: The features that deliver Design Studio's requirements for visual work, drawn from the journeys and from what the Figma production loop already does.
follows: [requirements.md, journeys.md]
---

# Features

This file says which features deliver the requirements. Each feature names the requirements it satisfies, so a requirement no feature satisfies can be seen. The parts that realize a feature are named in the system file.

Source: derived from the three journeys, with the practice that the Figma production loop and the other skills already show from real use. Open: a draft awaiting the Designer's reading.

## Find the direction first

Looks for the project's stated direction before any visual work, and stops and asks where it is when there is none.

- Satisfies: R-01, R-14

## Say which way in

Names the way in that the work calls for: a sprint, formalizing the design system, or tuning in place.

- Satisfies: R-02

## Keep the project's style document

Offers a `DESIGN.md` when a project has none, reads it first, and updates it when an accepted change alters the system.

- Satisfies: R-03, R-12

## Capture the current state in Figma

Puts the product as it stands into one Figma area before anything changes, so the whole picture can be read at once.

- Satisfies: R-21

## Sprint pages that leave a trail

Keeps each sprint as a named section with its direction summary, options side by side, rejected branches labelled, and the accepted result at the far right, and checks that every frame sits inside its section.

- Satisfies: R-04, R-22, R-28

## Present work with the studio's containers

Builds sprint pages and design-system pages from one quiet kit of labels, containers and section backgrounds, and records any departure from it.

- Satisfies: R-30, R-31

## Never overwrite the Designer's hand

Reads the Figma file before writing, keeps every change the Designer made, and proposes a token for a hand change that needs one before creating it.

- Satisfies: R-19, R-27

## Audit before relying on a frame

Checks a frame's structure and its variable bindings before handoff or formalizing, works on a clone for larger fixes, and reports what a library component owns without fixing it locally.

- Satisfies: R-05, R-06, R-20

## Dry run before removal

Lists exactly what a change would remove, with the evidence, and waits for the Designer before removing it.

- Satisfies: R-04

## Hand off agreed work as design debt

Opens a `DESIGN-DEBT.md` row for each agreed change that production does not yet match, with a translation record only where production differs structurally, raises any disagreement with its direction, and states the rule for closing a row, which whoever implements follows.

- Satisfies: R-08, R-09, R-10, R-11

## Review the built result against the design

When the Designer asks, compares the built screen with the approved design and reports the differences, and moves nothing.

- Satisfies: R-29

## Tune in place on a branch

Makes visual changes on a branch of the project, shows each one running, and brings them in only when the Designer approves.

- Satisfies: R-18, R-23

## Formalize a component

Says which side is newer, updates a stale Figma component from the code first, builds a reusable component with its tokens bound, and waits for the Designer's decision to formalize.

- Satisfies: R-07, R-24, R-25, R-26

## Keep only what earns its place

Tests each resident against a fresh run without it, and leaves out anything the Figma plugin's skills already cover.

- Satisfies: R-15, R-16

## Load by kind of work

Loads only a small spine at first and the rest when the work calls for it, with no record system assumed.

- Satisfies: R-13, R-17

Open: practices the Figma production loop already shows that no requirement names. They are the pixel-raster fidelity gate used on a pixel-art project, and the Android Views adapter. The sprint operating board was withdrawn on 2026-10-22. Each should pass the fresh-run test (R-16) or leave.
