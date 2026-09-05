// Phase 2b: Auto-Reverse Icon+Content Rows
// Paste into evaluate_script. Set TARGET_FRAME_ID before running.
// Handles the common case: a HORIZONTAL frame with exactly 2 VISIBLE children
// where one is a small icon (<=40x40) and the other is larger content. Moves the
// icon to index 0 (the "first-read" position for the target direction).
//
// Also handles SPACE_BETWEEN 2-child rows (always swap).
//
// IMPORTANT: counts and size comparisons use only children with visible !== false.
// A row can have two same-sized icon slots where only one is actually shown (a
// fixed icon-text-icon shape with a hidden spacer icon for layout symmetry) —
// counting/sizing against the raw child list misreads this as a symmetric
// 3-child row needing manual review, when it's functionally a 2-child icon+
// content row that should just be auto-reversed like any other. Found via
// production testing: a search field [icon(hidden), text, icon(visible)] was
// flagged instead of auto-fixed, and the flagged review then wrongly assumed
// bookend symmetry without checking visibility — leaving the visible icon on
// the wrong (source-direction) side after "resolving" the flag.
//
// This is the SAME operation for both directions — reversing an array is its own
// inverse. Run it once per row; do not run it twice, or it un-reverses.
//
// Skips COMPONENT_SET variants — insertChild silently no-ops there. See
// references/figma.md "COMPONENT_SET Variant Nodes" for the manual workaround.
//
// Rows this script does NOT touch (flagged in the log instead) need manual
// review: 3+ VISIBLE children, or two VISIBLE children of similar size where
// icon vs. content can't be told apart by size alone.

const TARGET_FRAME_ID = ''; // Set to the target frame node ID before running

const frame = figma.getNodeById(TARGET_FRAME_ID);
if (!frame) throw new Error(`Frame not found: ${TARGET_FRAME_ID}`);

let flipped = 0;
const flaggedForReview = [];

function isSmall(n) { return n.width <= 40 && n.height <= 40; }
function isVisible(n) { return n.visible !== false; }

function walk(node) {
  if (node.layoutMode === 'HORIZONTAL' && node.children) {
    const isVariant = node.parent && node.parent.type === 'COMPONENT_SET';
    const visibleChildren = node.children.filter(isVisible);

    if (isVariant && visibleChildren.length === 2) {
      flaggedForReview.push({ id: node.id, name: node.name, reason: 'COMPONENT_SET variant — insertChild blocked, needs manual x-swap workaround' });
    } else if (visibleChildren.length === 2) {
      const [a, b] = visibleChildren;
      if (node.primaryAxisAlignItems === 'SPACE_BETWEEN') {
        node.insertChild(0, b);
        flipped++;
      } else {
        const aSmall = isSmall(a), bSmall = isSmall(b);
        if (aSmall !== bSmall) {
          node.insertChild(0, aSmall ? a : b);
          flipped++;
        } else {
          flaggedForReview.push({ id: node.id, name: node.name, reason: 'similar-size 2-visible-child row — cannot tell icon from content by size' });
        }
      }
    } else if (visibleChildren.length >= 3) {
      flaggedForReview.push({ id: node.id, name: node.name, reason: `${visibleChildren.length} visible children (${node.children.length} total) — review for a semantically fixed middle element before reversing` });
    }
    // visibleChildren.length <= 1: nothing to reorder, skip silently
  }
  if (node.children) for (const c of node.children) walk(c);
}

walk(frame);

console.log(`Phase 2b complete:
  Rows auto-reversed: ${flipped}
  Rows flagged for manual review: ${flaggedForReview.length}`);
if (flaggedForReview.length > 0) console.log(JSON.stringify(flaggedForReview, null, 2));
