// Phase 1b: Find Absolute-Positioned Children Inside Auto-Layout Frames
// Paste into evaluate_script. Set TARGET_FRAME_ID before running.
//
// A child with layoutPositioning === 'ABSOLUTE' opts out of the parent's auto-layout
// algorithm — it sits at literal x/y instead. Nothing else in Phase 1 or Phase 2
// touches it: flipping the parent's alignment properties doesn't move it, and
// child-order reversal doesn't either.
//
// This script only SURVEYS — it does NOT apply any change automatically. Every
// hit needs a judgment call, and which fix applies depends critically on rotation:
//
// - rotation === 0: simple position mirror is correct — see "position-only fix"
//   in the report below.
// - rotation !== 0: the simple x/width formula is WRONG. A rotated node's x/y/
//   width/height describe its UNROTATED LOCAL bounding box, not its true on-screen
//   footprint. Found via production testing: mirroring position alone on a rotated
//   decorative element produced a plausible-looking but wrong result — the shape
//   ended up detached from the icon it was meant to decorate, with no error and no
//   obviously-broken layout to signal the mistake.
//
// For rotated nodes, decide which case applies (see references/figma.md
// "Absolute-positioned children" for the full explanation and code for each):
//   Case B — decorative/organic shape that should visually mirror (a hand-drawn
//            accent) -> mirror the full relativeTransform matrix
//   Case C — non-directional icon/glyph that must keep its canonical shape but
//            happens to be rotated -> reposition only, using rendered bounds,
//            leave the rotation/orientation components untouched
//   Case D — a directional icon that's also absolutely positioned -> coordinate
//            with Phase 3's icon-mirror handling, don't double-mirror
//
// VERIFICATION IS MANDATORY for anything this script flags as rotated. A wrong
// fix here produces no error — compare against a same-structure reference in the
// source direction before considering it done.

const TARGET_FRAME_ID = ''; // Set to the target frame node ID before running

const frame = figma.getNodeById(TARGET_FRAME_ID);
if (!frame) throw new Error(`Frame not found: ${TARGET_FRAME_ID}`);

const results = [];

function walk(node) {
  if (node.parent && node.layoutPositioning === 'ABSOLUTE' && node.parent.layoutMode && node.parent.layoutMode !== 'NONE') {
    const parent = node.parent;
    const isRotated = Math.abs(node.rotation) > 0.01;
    const suggestedNewX = isRotated ? null : (parent.width - node.x - node.width);
    const delta = isRotated ? null : Math.abs(suggestedNewX - node.x);

    const entry = {
      id: node.id, name: node.name,
      rotation: node.rotation,
      currentX: node.x, currentY: node.y,
      width: Math.round(node.width * 100) / 100, height: Math.round(node.height * 100) / 100,
      parentId: parent.id, parentName: parent.name, parentWidth: parent.width,
    };

    if (isRotated) {
      entry.rotated = true;
      entry.warning = 'ROTATED — do not use x/width mirror formula. See Cases B/C/D in references/figma.md. Verify against a source-direction reference before applying any fix.';
      entry.relativeTransform = node.relativeTransform;
      entry.suggestedMatrixMirror = (() => {
        const [[a, b, tx], [c, d, ty]] = node.relativeTransform;
        return [[-a, -b, parent.width - tx], [c, d, ty]];
      })();
    } else {
      entry.rotated = false;
      entry.suggestedNewX = suggestedNewX;
      entry.delta = Math.round(delta * 100) / 100;
      entry.likelyNeedsMirror = delta > 2;
    }

    results.push(entry);
  }
  if (node.children) for (const c of node.children) walk(c);
}
walk(frame);

const rotated = results.filter(r => r.rotated);
const nonRotatedNeedsReview = results.filter(r => !r.rotated && r.likelyNeedsMirror);
const nonRotatedProbablyFine = results.filter(r => !r.rotated && !r.likelyNeedsMirror);

console.log(`Phase 1b survey complete:
  Total absolute-in-auto-layout children found: ${results.length}
  ROTATED (need Case B/C/D judgment, do not use simple formula): ${rotated.length}
  Non-rotated, likely need mirroring (delta > 2px):               ${nonRotatedNeedsReview.length}
  Non-rotated, probably already symmetric (delta <= 2px):         ${nonRotatedProbablyFine.length}`);
if (rotated.length > 0) console.log('ROTATED — review individually, verify against reference:', JSON.stringify(rotated, null, 2));
if (nonRotatedNeedsReview.length > 0) console.log('Non-rotated, needs review:', JSON.stringify(nonRotatedNeedsReview, null, 2));
