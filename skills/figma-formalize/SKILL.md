---
name: figma-formalize
description: Formalize a component, or a set of captured frames, into a design system in Figma: reusable components with their tokens bound, built from frames and not moved. Use when a sprint has ended in the Designer's decision to formalize a component, or when the Figma file has gone stale beside the code.
metadata:
  takes: "the designer's decision to formalize, source frames, the project's direction, the designer's yes"
  hands_on: "a first component, an updated DESIGN.md, a design debt row"
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
   Step: side_newer · kind: judgment · takes: the designer's decision to formalize, the project's direction, source frames · hands on: the newer side
2. **Audit the source frame.** Run `figma-audit` on it and report its findings. Anything a library component owns is reported and never fixed locally. A fix beyond the mechanical ones waits for the Designer.
   Step: audit_source · kind: judgment · takes: source frames, the newer side · hands on: audit findings
3. **Extract tokens, read-only.** From the source frames list every color (fills, text and strokes, counted), type style (family, weight, size, letter spacing), spacing and padding value, corner radius, stroke weight and shadow. Separate what sits on a scale from what is off it, and from capture leftovers: fallback fonts, 0.8px strokes from rem conversion, `:margin` paddings, decimal sizes.
   Step: extract_tokens · kind: judgment · takes: source frames, the newer side · hands on: token inventory
4. **Propose, and stop.** Show the Designer the token proposal. For each off-scale value, propose the nearest step and say why. Never snap, drop or keep an off-scale value silently, because the Designer's yes decides it. Use the project's own names. Without them, use `color/<group>/<step>`, `space/<n>`, `radius/<n>`, text styles `<role>/<size>` and effects `shadow/<name>`, with one numeric pattern across spacing and radius.
   Step: propose · kind: owner · takes: audit findings, token inventory · hands on: an approved token proposal
5. **Create the foundations.** On the design-system page they sit in a Primitives section above the Components section. After the yes, create the variable collections (primitives, then semantic), text styles and effect styles. Set every variable's scopes explicitly. Build them in a foundations area beside the frames, and leave the raw frames untouched as the baseline.
   Step: create_foundations · kind: judgment · takes: an approved token proposal · hands on: foundations
6. **Classify and map consumption.** Sort them into atoms, molecules and organisms by structure and repeat count, matching frames by size, fill and child count. Check what is grouped against a screenshot, since imported layer names are not reliable. Split by platform or role only when the product has several. When the components are meant to assemble a screen or flow, make a short map of each repeated screen role, its intended source component, and the states or properties it needs. Name a missing source as a gap; do not fill it by cloning an exploratory screen and then call the result component-driven.
   Step: classify · kind: judgment · takes: source frames, foundations · hands on: a component map
7. **Prove composition, then build one component first.** Before using a kit preview or other slot to contain a project component, follow the feasibility gate in `standards/studio-presentation.md`: test the exact nested child in a temporary instance and read it back. If it does not persist as an editable child, leave the slot unused and hidden. The Component container's **Show preview slot** property is false by default; turn it on only for a successful, intentional, editable preview. Create the component from a copy of the frame, with auto layout, bound tokens, variants for its states, a meaningful name and a description. Look at it, then build the rest of the set. If a component set has more than one visible variant, set its source to horizontal or vertical auto layout and size its documentation group so every variant is readable; never leave variant components overlapped at the same origin. A main component cannot sit inside an instance, so each component gets its own vertical auto-layout frame in its layer's section, styled from kit variables as one card, holding an unframed Component container above its main component. The container is the reusable description card; do not detach or replace it. Define one usable specimen width for the group, and make both the container and the source component's outer bounds fill it; the variants inside the source may retain their natural size and alignment. The page is divided into sections by layer (atoms, molecules, organisms), as `standards/studio-presentation.md` requires. Do not keep a second page of components, because two places compete, and a loose pile of components is not finished.
   Step: build_first · kind: judgment · takes: a component map, foundations · hands on: a first component

An intrinsic-size source whose outer bounds are part of what its instances consume keeps its natural bounds and is centered in the specimen column. Record that classification in the component's description; do not stretch its source merely to satisfy the specimen-width rule.
8. **Replace frames with instances only where approved.** Swapping a frame for an instance changes an approved design, so it waits for the Designer. Before a change that touches more than one screen, list exactly what will change. Keep the sprint's frames as labelled history.
   Step: replace_frames · kind: owner · takes: a first component, a component map, the designer's yes · hands on: frames replaced by instances
9. **Check the formalized component.** A component passes when all of these hold:
   - every instance points at its main component, with none missing;
   - fills, radii, spacing and text use variables or styles, and nothing is a raw value except a value the Designer approved;
   - no layer keeps a default name such as `Frame 123` or `Rectangle 4`;
   - the hierarchy matches the source, and every frame has explicit auto layout and sizing;
   - hidden layers are kept and set to hidden;
   - its tokens agree with `DESIGN.md`, and it mirrors the product's code;
   - its typeface and available weights match the project's established sources;
   - its documentation group has one unframed Component container and this source as siblings, with matching usable specimen widths; and
   - a screenshot matches the original.
   Step: check · kind: check-judgment · takes: a first component, frames replaced by instances, foundations · hands on: a check result
10. **Record it.** Update `DESIGN.md` if the system changed, in the format `impeccable` reads. If the component is ahead of the code, add a `DESIGN-DEBT.md` row that says which direction it runs.
   Step: record · kind: judgment · takes: a check result · hands on: an updated DESIGN.md, a design debt row

## Rules that run through every step

- **The Designer's hand is kept.** Before writing, read what is in the file. Keep every change the Designer made, and propose a token for a hand change that needs one before creating it.
- **Right-to-left sources.** Build in the source's layout direction and with its fonts. Check mirrored variants with the `rtl` skill. Emoji used as icons stay as they are, and are reported for the Designer to decide. When the Designer approves replacing them, take icons from a library in the file first, found by `search_design_system`. A library that exposes only the icons its own components use is no icon set. Otherwise import the SVGs of an open icon set, record its name, version and license in the component's description, and bind the stroke or fill to a token.
- **States come from the stylesheet as well as the capture.** A capture shows only the states its sample data triggers. Read the code's rules for hover, focus, invalid, locked and warning states before listing a component's variants, and add any color they use. Found on ProShift, where the orange preference-warning cell and its two colors appeared in the CSS and in no captured frame.
- **A shared text property overrides every variant's own text.** Setting one `TEXT` property on a variant set gives all variants its default. Where variants differ in their text, keep each variant's own fixed text and set it per instance.
- **A main component cannot contain a main component.** The parts of a component that are not components themselves, such as a circle behind a number, are plain frames. Compose larger parts from instances.
- **Content areas that will hold other content are slots**, and a component is checked with a temporary instance that accepts a child before it is relied on. A kit documentation slot that cannot accept the intended project source stays empty and hidden; an unpopulated documentation slot is also hidden by default. It is never a reason to detach, rasterize, or duplicate the source.
- **No invention.** Do not fill a gap with a made-up token or content. Name the gap.
