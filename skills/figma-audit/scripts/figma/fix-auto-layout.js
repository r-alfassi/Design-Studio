// fix-auto-layout.js — Convert a plain frame to auto-layout
// Paste into use_figma. Set parameters before running.
// Run inspect.js first to confirm child order and current gaps before converting.
//
// TWO SHAPES OF THIS FIX:
//
// 1. Simple stack (default) — DERIVE_SPACING infers one itemSpacing value from the gap
//    between the first two children and applies it uniformly. Fine for genuine stacks
//    where every gap is meant to be equal.
//
// 2. Fixed-viewport frame with a pinned trailing child (e.g. a screen frame: header,
//    content, footer — where the footer must stay pinned near the frame's far edge
//    regardless of content height) — set WRAP_RANGE. A single uniform itemSpacing is
//    WRONG here: it applies the same gap everywhere, which drags the footer away from
//    its pinned position the moment the derived spacing doesn't match the actual
//    header-to-footer gap. This happened for real — converting a 3-child screen frame
//    (header / card / footer, gaps of 84px and 327px) with uniform derived spacing would
//    have pulled the footer up by ~250px.
//
//    The fix: wrap the children between the leading and trailing fixed elements into a
//    new frame, then give that wrapper `layoutSizingVertical/Horizontal = 'FILL'`. In a
//    FIXED-height auto-layout parent, a FILL child absorbs exactly the leftover space —
//    same mechanism as a CSS flexbox spacer with `flex: 1`. The trailing child then lands
//    at (parent height − its own height) by construction, not by a hardcoded number.
//    WRAP_RANGE = [startIndex, endIndex] (inclusive, in NODE_ID's current child order) —
//    the children to group into that flexible wrapper. Typically this is everything
//    except the first (header) and last (footer) child.

const TARGET_FRAME_ID = '';    // Outermost frame (for screenshot)
const NODE_ID = '';            // The frame to convert to auto-layout

const DIRECTION = 'VERTICAL'; // 'VERTICAL' or 'HORIZONTAL'
const DERIVE_SPACING = true;  // true: infer itemSpacing from gap between first two children (post-wrap)
const FIXED_SPACING = 0;      // used only when DERIVE_SPACING = false

const PADDING_TOP = 0;
const PADDING_BOTTOM = 0;
const PADDING_LEFT = 0;
const PADDING_RIGHT = 0;

// --- Flexible-spacer mode (fixed-viewport frames with a pinned trailing child) ---
const WRAP_RANGE = null;              // e.g. [1, 1] to wrap just the middle child; null = simple stack mode
const WRAP_SPACER_NAME = 'Flexible content';
const WRAP_PADDING_TOP = 0;
const WRAP_PADDING_BOTTOM = 0;
const WRAP_ITEM_SPACING = 0;
const WRAP_PRIMARY_AXIS_ALIGN = 'MIN';   // how the wrapped content aligns within the leftover space
const WRAP_COUNTER_AXIS_ALIGN = 'MIN';

const frame = await figma.getNodeByIdAsync(TARGET_FRAME_ID);
if (!frame) throw new Error(`Frame not found: ${TARGET_FRAME_ID}`);

const node = await figma.getNodeByIdAsync(NODE_ID);
if (!node) throw new Error(`Node not found: ${NODE_ID}`);
if (node.type !== 'FRAME') throw new Error(`Node is not a FRAME: ${node.type}`);

const origWidth = node.width;
const origHeight = node.height;

let spacer = null;
if (WRAP_RANGE) {
  const [start, end] = WRAP_RANGE;
  const toWrap = node.children.slice(start, end + 1);
  if (toWrap.length === 0) throw new Error('WRAP_RANGE selected no children');

  spacer = figma.createFrame();
  spacer.name = WRAP_SPACER_NAME;
  spacer.fills = []; // createFrame() defaults to a solid white fill — always clear it unless a fill is actually wanted
  node.insertChild(start, spacer);
  for (const child of toWrap) {
    spacer.appendChild(child);
  }
  spacer.layoutMode = DIRECTION;
  spacer.paddingTop = WRAP_PADDING_TOP;
  spacer.paddingBottom = WRAP_PADDING_BOTTOM;
  spacer.itemSpacing = WRAP_ITEM_SPACING;
  spacer.primaryAxisSizingMode = 'FIXED';
  spacer.counterAxisSizingMode = 'FIXED';
  spacer.primaryAxisAlignItems = WRAP_PRIMARY_AXIS_ALIGN;
  spacer.counterAxisAlignItems = WRAP_COUNTER_AXIS_ALIGN;
}

// Derive spacing from current child positions (post-wrap, if applicable)
let spacing = FIXED_SPACING;
if (DERIVE_SPACING && node.children.length >= 2) {
  const a = node.children[0];
  const b = node.children[1];
  if (DIRECTION === 'VERTICAL') {
    spacing = Math.max(0, Math.round(b.y - (a.y + a.height)));
  } else {
    spacing = Math.max(0, Math.round(b.x - (a.x + a.width)));
  }
}

node.layoutMode = DIRECTION;

if (spacer) {
  // Fixed-viewport mode: the frame keeps its explicit dimensions — FILL only makes
  // sense on the spacer if its parent has a definite (not hugged) size to distribute.
  node.resize(origWidth, origHeight);
  node.primaryAxisSizingMode = 'FIXED';
  node.counterAxisSizingMode = 'FIXED';
} else {
  node.primaryAxisSizingMode = 'AUTO';
  node.counterAxisSizingMode = 'AUTO';
}

node.itemSpacing = spacing;
node.paddingTop = PADDING_TOP;
node.paddingBottom = PADDING_BOTTOM;
node.paddingLeft = PADDING_LEFT;
node.paddingRight = PADDING_RIGHT;
node.primaryAxisAlignItems = 'MIN';
node.counterAxisAlignItems = 'MIN';

if (spacer) {
  spacer.layoutSizingHorizontal = 'FILL';
  spacer.layoutSizingVertical = 'FILL';
}

const screenshot = await frame.screenshot();

return {
  nodeId: NODE_ID,
  direction: DIRECTION,
  derivedSpacing: spacing,
  spacerId: spacer ? spacer.id : null,
  screenshot,
};
