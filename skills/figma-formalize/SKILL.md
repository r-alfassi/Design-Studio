---
name: figma-formalize
description: Formalize a component, or a set of captured frames, into a design system in Figma: reusable components with their tokens bound, built from frames and not moved. Use when a sprint has ended in the Designer's decision to formalize a component, or when the Figma file has gone stale beside the code.
---

# Formalize a component into the design system

This is Design Studio's formalize route. It turns frames into reusable components with variables, text styles and effect styles bound, and it leaves the design's trail intact. It never defines a project's intent and it never moves work into production.

## Before anything

1. **The Designer has decided.** A proposal to formalize a component waits for the Designer's yes before any design-system change is made. Without it, only analyze and propose.
2. **A direction is stated.** If the project states none, ask where it is and stop.
3. **Load the plugin's skills.** Load `figma-use` before any `use_figma` call, and `figma-generate-design` for building. This skill does not restate their mechanics.
4. **Read `DESIGN.md` first**, if the project has one. Its token names and scale names win over the defaults below.

## Steps

1. **Say which side is newer.** Follow `frameworks/which-side-is-newer.md` and tell the Designer the direction. If Figma is the stale side, update it from the code first, and only then formalize. If the component was born in a sprint and is ahead of the code, go on, and give it a design-debt row with its direction at the end.
2. **Audit the source frame.** Run `figma-audit` on it and report its findings. Anything a library component owns is reported and never fixed locally. A fix beyond the mechanical ones waits for the Designer.
3. **Extract tokens, read-only.** From the source frames list every color (fills, text and strokes, counted), type style (family, weight, size, letter spacing), spacing and padding value, corner radius, stroke weight and shadow. Separate what sits on a scale from what is off it, and from capture leftovers: fallback fonts, 0.8px strokes from rem conversion, `:margin` paddings, decimal sizes.
4. **Propose, and stop.** Show the Designer the token proposal. For each off-scale value, propose the nearest step and say why. Never snap, drop or keep an off-scale value silently, because the Designer's yes decides it. Use the project's own names. Without them, use `color/<group>/<step>`, `space/<n>`, `radius/<n>`, text styles `<role>/<size>` and effects `shadow/<name>`, with one numeric pattern across spacing and radius.
5. **Create the foundations.** After the yes, create the variable collections (primitives, then semantic), text styles and effect styles. Set every variable's scopes explicitly. Build them in a foundations area beside the frames, and leave the raw frames untouched as the baseline.
6. **Classify the components.** Sort them into atoms, molecules and organisms by structure and repeat count, matching frames by size, fill and child count. Check what is grouped against a screenshot, since imported layer names are not reliable. Split by platform or role only when the product has several.
7. **Build one component first.** Create it from a copy of the frame, as a component, with auto layout, bound tokens, variants for its states, a meaningful name and a description. Look at it, then build the rest of the set. A main component cannot sit inside an instance, so main components stay at page level beside the documentation sections, and a component container's preview holds instances of its variants.
8. **Replace frames with instances only where approved.** Swapping a frame for an instance changes an approved design, so it waits for the Designer. Before a change that touches more than one screen, list exactly what will change. Keep the sprint's frames as labelled history.
9. **Check the formalized component.** A component passes when all of these hold:
   - every instance points at its main component, with none missing;
   - fills, radii, spacing and text use variables or styles, and nothing is a raw value except a value the Designer approved;
   - no layer keeps a default name such as `Frame 123` or `Rectangle 4`;
   - the hierarchy matches the source, and every frame has explicit auto layout and sizing;
   - hidden layers are kept and set to hidden;
   - its tokens agree with `DESIGN.md`, and it mirrors the product's code;
   - a screenshot matches the original.
10. **Record it.** Update `DESIGN.md` if the system changed, in the format `impeccable` reads. If the component is ahead of the code, add a `DESIGN-DEBT.md` row that says which direction it runs.

## Rules that run through every step

- **The Designer's hand is kept.** Before writing, read what is in the file. Keep every change the Designer made, and propose a token for a hand change that needs one before creating it.
- **Right-to-left sources.** Build in the source's layout direction and with its fonts. Check mirrored variants with the `rtl` skill. Emoji used as icons stay as they are, and are reported for the Designer to decide. When the Designer approves replacing them, take icons from a library in the file first, found by `search_design_system`. A library that exposes only the icons its own components use is no icon set. Otherwise import the SVGs of an open icon set, record its name, version and license in the component's description, and bind the stroke or fill to a token.
- **No invention.** Do not fill a gap with a made-up token or content. Name the gap.
