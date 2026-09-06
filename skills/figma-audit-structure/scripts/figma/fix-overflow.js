// fix-overflow.js — Correct overflowing child frames (negative offsets, oversized dimensions)
// Paste into use_figma. Set parameters before running.
// Run inspect.js first to identify the offending node IDs.
//
// Three modes (set one):
//   MODE = 'FILL'        — RECOMMENDED DEFAULT. The overflowing node adopts its parent's
//                          width/height declaratively via layoutSizingHorizontal/Vertical
//                          = 'FILL', instead of being resized/repositioned with hardcoded
//                          numbers. Requires the node's parent to already be auto-layout
//                          (convert it first with fix-auto-layout.js if it isn't).
//   MODE = 'REPOSITION'  — corrects x/y offset only (node is right size, wrong position)
//   MODE = 'RESIZE'      — corrects width/height to match parent (removes overflow)
//
// WHY FILL IS THE DEFAULT, NOT RESIZE: a real case surfaced that "wider than parent with
// a negative offset" is almost always a centering hack that happened to line up with a
// grandparent's width, not a declared design decision — nothing in the tree records that
// relationship, so it silently breaks the moment any ancestor width changes. Naively
// RESIZE-ing the container to fit its parent doesn't fix that: children (esp. text) sized
// for the wider frame will clip. The validated fix is FILL sizing on the node (so it
// truly adopts its actual parent's width) plus centered alignment on both the node and
// any text children that were using oversized fixed widths to fake centering — this
// reproduces the same visual result through the layout system instead of coordinates,
// and it degrades gracefully if the parent's width ever changes.
// Reserve RESIZE/REPOSITION for cases where the parent isn't (and can't be) auto-layout.

const TARGET_FRAME_ID = '';  // Outermost frame (for screenshot)
const NODE_ID = '';          // The overflowing child node ID
const MODE = 'FILL';         // 'FILL' | 'REPOSITION' | 'RESIZE'

// --- FILL mode params ---
const FILL_HORIZONTAL = true;   // set layoutSizingHorizontal = 'FILL'
const FILL_VERTICAL = false;    // set layoutSizingVertical = 'FILL'
const PARENT_COUNTER_AXIS_ALIGN_CENTER = true; // set parent.counterAxisAlignItems = 'CENTER'
// Text (or other) children that were using oversized fixed widths to fake centering —
// these get layoutSizingHorizontal = 'FILL' and textAlignHorizontal = 'CENTER' (text only).
const FILL_CHILD_IDS = []; // e.g. ['7974:130613', '7974:130614']

// --- REPOSITION / RESIZE mode params ---
const NEW_X = null;
const NEW_Y = null;
const NEW_WIDTH = null;
const NEW_HEIGHT = null;
const PADDING_H = 0;

const frame = await figma.getNodeByIdAsync(TARGET_FRAME_ID);
if (!frame) throw new Error(`Frame not found: ${TARGET_FRAME_ID}`);

const node = await figma.getNodeByIdAsync(NODE_ID);
if (!node) throw new Error(`Node not found: ${NODE_ID}`);

const before = { x: node.x, y: node.y, width: node.width, height: node.height };
let result = { nodeId: NODE_ID, mode: MODE, before };

if (MODE === 'FILL') {
  const parent = node.parent;
  if (!parent || !parent.layoutMode || parent.layoutMode === 'NONE') {
    throw new Error(
      `Node's parent (${parent ? parent.id : 'none'}) is not auto-layout. ` +
      `FILL requires an auto-layout parent — convert it first with fix-auto-layout.js.`
    );
  }

  if (FILL_HORIZONTAL) node.layoutSizingHorizontal = 'FILL';
  if (FILL_VERTICAL) node.layoutSizingVertical = 'FILL';
  if (PARENT_COUNTER_AXIS_ALIGN_CENTER) parent.counterAxisAlignItems = 'CENTER';

  const fixedChildren = [];
  for (const childId of FILL_CHILD_IDS) {
    const child = await figma.getNodeByIdAsync(childId);
    if (!child) { result.errors = result.errors || []; result.errors.push({ id: childId, err: 'Not found' }); continue; }
    if (child.type === 'TEXT') {
      const segments = child.getStyledTextSegments(['fontName']);
      for (const seg of segments) await figma.loadFontAsync(seg.fontName);
      child.textAlignHorizontal = 'CENTER';
    }
    child.layoutSizingHorizontal = 'FILL';
    fixedChildren.push(child.id);
  }

  result.after = { x: node.x, y: node.y, width: node.width, height: node.height };
  result.fixedChildren = fixedChildren;
} else if (MODE === 'RESIZE' || MODE === 'REPOSITION') {
  if (NEW_WIDTH !== null || NEW_HEIGHT !== null) {
    const w = NEW_WIDTH !== null ? NEW_WIDTH : node.width;
    const h = NEW_HEIGHT !== null ? NEW_HEIGHT : node.height;
    node.resize(w, h);
  }
  if (NEW_X !== null) node.x = NEW_X + PADDING_H;
  if (NEW_Y !== null) node.y = NEW_Y;
  result.after = { x: node.x, y: node.y, width: node.width, height: node.height };
} else {
  throw new Error(`Unknown MODE: ${MODE}`);
}

result.screenshot = await frame.screenshot();
return result;
