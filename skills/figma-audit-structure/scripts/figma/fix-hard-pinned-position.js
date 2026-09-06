// fix-hard-pinned-position.js — Resolve an ignore-auto-layout child left on default constraints
// Paste into use_figma. Set parameters before running. Run inspect.js first.
//
// Figma's own recommended pattern for pinning a child to an edge inside an auto-layout
// frame is: keep it "Ignore auto layout" (layoutPositioning: 'ABSOLUTE') and give it the
// matching `constraints` (e.g. vertical: 'MAX' to pin to the bottom, or 'STRETCH' for
// left+right) so it tracks that edge as the parent resizes. See Figma's Guide to auto
// layout, and references/auto-layout-best-practices.md in this skill.
//
// This is the LIGHTWEIGHT fix for a single-edge relationship — no tree restructuring,
// no new frames. Use the heavier flex-spacer fix (fix-auto-layout.js, WRAP_RANGE)
// instead when the element actually needs to participate in a dynamic distribution of
// leftover space among multiple flexible siblings (e.g. a middle content block that
// must grow/shrink between a fixed header and a fixed footer) — a single edge-pin via
// constraints doesn't cover that case.

const TARGET_FRAME_ID = ''; // Outermost frame (for screenshot)
const NODE_ID = '';         // The hard-pinned node (must have layoutPositioning: 'ABSOLUTE')

// Figma ConstraintType per axis: 'MIN' | 'MAX' | 'CENTER' | 'STRETCH' | 'SCALE'
// Pick the constraint that matches the node's apparent intended anchor —
// e.g. a badge pinned above/overlapping content near the top of its parent: vertical:'MIN'
// (deliberately, to distinguish from the unset default — see note below);
// a footer-adjacent element meant to track the bottom edge: vertical:'MAX'.
const HORIZONTAL = 'MIN';
const VERTICAL = 'MIN';

const frame = await figma.getNodeByIdAsync(TARGET_FRAME_ID);
if (!frame) throw new Error(`Frame not found: ${TARGET_FRAME_ID}`);

const node = await figma.getNodeByIdAsync(NODE_ID);
if (!node) throw new Error(`Node not found: ${NODE_ID}`);

if (node.layoutPositioning !== 'ABSOLUTE') {
  throw new Error(
    `Node is not set to "Ignore auto layout" (layoutPositioning is "${node.layoutPositioning}", not 'ABSOLUTE'). ` +
    `Constraints only take effect on nodes ignoring the auto-layout flow — if this node should ` +
    `instead flex with leftover space, use fix-auto-layout.js's WRAP_RANGE technique.`
  );
}

const before = { ...node.constraints };
node.constraints = { horizontal: HORIZONTAL, vertical: VERTICAL };
const after = { ...node.constraints };

const screenshot = await frame.screenshot();

return { nodeId: NODE_ID, before, after, screenshot };
