---
name: figma-pixel-fidelity
description: Check that a Figma component family showing pixel-art or other raster source artwork never has its silhouette softened by its preview structure, such as rounded corners or effects. Use only on a project whose Figma file presents pixel-art or raster assets, such as a pixel-art game's interface. Do not use for ordinary vector interface work.
---

# Pixel fidelity in Figma

This skill is for one situation: a Figma component family that presents pixel or other raster source artwork. Figma's default preview treatment can round or soften the edge of such an asset, and the asset is then no longer what was drawn. The skill checks for that and reports it. It never fires on ordinary vector interface work.

A project that uses it adopts it in its `DESIGN.md`, as with the other standards and skills that fit one kind of project.

## What must hold

- The component set, every variant root, and every immediate raster host have a zero corner radius and no effects.
- Zero radius here is the asset's own geometry, not a radius token. The rule stops Figma's preview from rounding or softening a pixel edge. It does not forbid a pixel-art chamfer that is drawn into the raster itself.
- A decorative frame, mask, shadow or rounded wrapper is never a source primitive. If documentation needs one, it sits outside the source family and is named as presentation-only, in the sense of `standards/studio-presentation.md`.

## Steps

1. **Name the source families.** Find the exact component-set IDs of the raster families to check. If it is unclear which components are source artwork and which are documentation around them, ask the Designer.
2. **Run the audit, read-only.** In one `use_figma` call, declare `ROOT_NODE_IDS` with those IDs and run `scripts/audit-pixel-raster-fidelity.js`. Load `figma-use` first. The script returns the audited roots, every violation with its node, radius and effect count, and a pass flag. It never writes.
3. **Report.** Give the Designer the violations, each with its node and what is wrong. Do not fix anything yet.
4. **Correct only what the audit names.** After the Designer's yes, change only the exact nodes the audit returned, since a change to an approved component is theirs to approve. Do not clean up the neighbours.
5. **Re-run and look.** Run the audit again, then inspect one representative preview at native size, with no scaling, and confirm the edges are crisp.

## Origin

This came from a pixel-art game project's Figma file, where preview structure had softened asset edges. It has not been tested against having no skill, and the Designer chose to keep it on the strength of that use.
