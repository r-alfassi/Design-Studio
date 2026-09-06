// fix-flatten-wrappers.js — Collapse redundant nested wrapper frames (auto-layout aware)
// Paste into use_figma. Set TARGET_FRAME_ID and WRAPPER_IDS before running.
// WRAPPER_IDS: array of frame IDs to remove, OUTERMOST FIRST — e.g. ['7769:115104', '7769:115105'].
// Innermost wrapper is processed first internally to avoid double-reparenting.
// Run inspect.js first to identify the IDs.
//
// AUTO-LAYOUT GOTCHA: if the wrapper chain being removed is itself auto-layout (common —
// a redundant wrapper is often a HUG frame with a single child of identical dimensions),
// the survivor (the parent left holding the reparented children) may ALSO be auto-layout
// with its OWN itemSpacing/padding. Blindly reparenting and copying x/y does nothing in
// that case — the surviving auto-layout frame's properties silently override the visual
// gap the removed wrapper was actually producing. This happened for real: a 59px-tall
// wrapper chain collapsed into a survivor with itemSpacing:40 grew to 84px, cascading a
// +25px height change up through its own auto-layout parent. No error was thrown — it
// only surfaced on a diff against a reference frame.
//
// This script captures the *effective* spacing (and padding) from the innermost removed
// wrapper before removing anything, and reconciles the survivor's itemSpacing/padding to
// match after the collapse — so the visual gap between the real content children is
// preserved regardless of what the survivor's own auto-layout properties happened to be.

const TARGET_FRAME_ID = ''; // Outermost frame being audited (for verification screenshot)
const WRAPPER_IDS = []; // e.g. ['7769:115104', '7769:115105'] — outermost redundant wrapper first

const frame = await figma.getNodeByIdAsync(TARGET_FRAME_ID);
if (!frame) throw new Error(`Frame not found: ${TARGET_FRAME_ID}`);

const removedIds = [];
const reparentedIds = [];
const errors = [];

// Capture the innermost wrapper's effective spacing/padding BEFORE removing anything —
// this is what actually produced the visible gap between the real content children.
const innermostId = WRAPPER_IDS[WRAPPER_IDS.length - 1];
const innermost = await figma.getNodeByIdAsync(innermostId);
let capturedSpacing = null;
let capturedPadding = null;

if (innermost) {
  const innermostIsAutoLayout = innermost.layoutMode && innermost.layoutMode !== 'NONE';
  if (innermostIsAutoLayout) {
    capturedSpacing = innermost.itemSpacing;
    capturedPadding = {
      top: innermost.paddingTop,
      bottom: innermost.paddingBottom,
      left: innermost.paddingLeft,
      right: innermost.paddingRight,
    };
  } else if (innermost.children.length >= 2) {
    // NONE-layout wrapper: derive spacing from actual child gaps (vertical assumption —
    // adjust to horizontal if the survivor's layoutMode is HORIZONTAL)
    const sorted = [...innermost.children].sort((a, b) => a.y - b.y);
    capturedSpacing = Math.max(0, Math.round(sorted[1].y - (sorted[0].y + sorted[0].height)));
  }
}

// Process innermost first (reverse order) to avoid reparenting into a node about to be removed
for (const wrapperId of [...WRAPPER_IDS].reverse()) {
  const wrapper = await figma.getNodeByIdAsync(wrapperId);
  if (!wrapper) { errors.push({ id: wrapperId, err: 'Node not found' }); continue; }
  if (wrapper.type !== 'FRAME') { errors.push({ id: wrapperId, err: 'Not a FRAME — skipped' }); continue; }

  const parent = wrapper.parent;
  if (!parent) { errors.push({ id: wrapperId, err: 'No parent — skipped' }); continue; }

  const parentIsAutoLayout = parent.layoutMode && parent.layoutMode !== 'NONE';
  const wrapperIndex = parent.children.indexOf(wrapper);
  const children = [...wrapper.children];

  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    // Manual x/y only matters if the surviving parent is NOT auto-layout — an
    // auto-layout parent recomputes position from itemSpacing/padding regardless,
    // so setting x/y on it is a harmless no-op, not a real fix.
    const absX = wrapper.x + child.x;
    const absY = wrapper.y + child.y;
    parent.insertChild(wrapperIndex + i, child);
    if (!parentIsAutoLayout) {
      child.x = absX;
      child.y = absY;
    }
    reparentedIds.push(child.id);
  }

  wrapper.remove();
  removedIds.push(wrapperId);
}

// Reconcile the survivor's own layout properties with the effective spacing/padding
// that was actually producing the pre-flatten visual result.
let survivorNode = null;
if (reparentedIds.length > 0) {
  const firstChild = await figma.getNodeByIdAsync(reparentedIds[0]);
  survivorNode = firstChild ? firstChild.parent : null;
}

const spacingReconciled = { checked: false, applied: false, before: null, after: null };
const paddingReconciled = { checked: false, applied: false, before: null, after: null };

if (survivorNode && survivorNode.layoutMode && survivorNode.layoutMode !== 'NONE') {
  if (capturedSpacing !== null) {
    spacingReconciled.checked = true;
    spacingReconciled.before = survivorNode.itemSpacing;
    if (survivorNode.itemSpacing !== capturedSpacing) {
      survivorNode.itemSpacing = capturedSpacing;
      spacingReconciled.applied = true;
    }
    spacingReconciled.after = survivorNode.itemSpacing;
  }
  if (capturedPadding !== null) {
    paddingReconciled.checked = true;
    paddingReconciled.before = {
      top: survivorNode.paddingTop, bottom: survivorNode.paddingBottom,
      left: survivorNode.paddingLeft, right: survivorNode.paddingRight,
    };
    const mismatched =
      survivorNode.paddingTop !== capturedPadding.top ||
      survivorNode.paddingBottom !== capturedPadding.bottom ||
      survivorNode.paddingLeft !== capturedPadding.left ||
      survivorNode.paddingRight !== capturedPadding.right;
    if (mismatched) {
      survivorNode.paddingTop = capturedPadding.top;
      survivorNode.paddingBottom = capturedPadding.bottom;
      survivorNode.paddingLeft = capturedPadding.left;
      survivorNode.paddingRight = capturedPadding.right;
      paddingReconciled.applied = true;
    }
    paddingReconciled.after = {
      top: survivorNode.paddingTop, bottom: survivorNode.paddingBottom,
      left: survivorNode.paddingLeft, right: survivorNode.paddingRight,
    };
  }
}

const screenshot = await frame.screenshot();

return {
  removedWrappers: removedIds,
  reparentedChildren: reparentedIds,
  survivorId: survivorNode ? survivorNode.id : null,
  spacingReconciled,
  paddingReconciled,
  errors,
  screenshot,
};
