# Design Studio

This file says what Design Studio loads and when, for a project that imports it. Design Studio holds the visual-design process, which happens in a Figma file, and the craft it draws on. It does not define a project's intent, it does not assume the project keeps its record in any particular system, and it never edits the product's code.

## Whenever visual work starts

1. Find the project's stated direction, in whatever form it keeps one. If it states none, ask where it is and stop.
2. Find the Figma file the work happens in. If there is none, offer to start one, from a capture of the running product or from the direction, and do no visual work until the Designer answers. A capture is a baseline and not an approved design. A request to tune visuals directly in the product's code is not Design Studio's work: say so and point to the project's own tools.
3. Read the project's `DESIGN.md`. If it has none, offer to create one before visual work starts.
4. Load `standards/stopping-rules.md`. Work freely where nothing is approved, and stop for the Designer before changing anything approved.

## By kind of work

- Iterating a design in Figma until it is agreed, and handing it off: follow `skills/figma-sprint/SKILL.md`. This is the default for a design the Designer has not yet accepted.
- Formalizing a component into the design system, once the Designer has decided to: follow `skills/figma-formalize/SKILL.md`. Before formalizing, or when Figma and the code disagree, decide which is ahead with `frameworks/which-side-is-newer.md`.
- Auditing a Figma frame: follow `skills/figma-audit/SKILL.md`.
- A Figma file with pixel-art or raster assets: follow `skills/figma-pixel-fidelity/SKILL.md`.
- Presenting sprints or a design system in Figma: load `standards/studio-presentation.md`.
- Mobile screens: load `standards/mobile-design.md`.
- Preparing agreed work for production: load `templates/design-debt.md`, and for a component that differs structurally in production, `templates/figma-implementation-contract.md`.
- Any other craft, such as brand, decks, video, mirroring a layout, translating copy or reviewing a design: find it in `skills/README.md`, `frameworks/` or `templates/`.
