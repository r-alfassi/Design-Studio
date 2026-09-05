// Phase 2a: Find Horizontal Auto-Layout Frames
// Paste into evaluate_script. Set TARGET_FRAME_ID before running.
// Logs all HORIZONTAL auto-layout frames for review — use this to decide which
// rows the auto-heuristic (phase2b) can safely handle vs. which need manual review
// (3+ children with a semantically fixed middle element, similar-size siblings, etc).

const TARGET_FRAME_ID = ''; // Set to the target frame node ID before running

const frame = figma.getNodeById(TARGET_FRAME_ID);
if (!frame) throw new Error(`Frame not found: ${TARGET_FRAME_ID}`);

const results = [];

function collect(node) {
  if (['FRAME', 'COMPONENT', 'INSTANCE'].includes(node.type) && node.layoutMode === 'HORIZONTAL') {
    results.push({
      id: node.id,
      name: node.name,
      primaryAxisAlignItems: node.primaryAxisAlignItems,
      isVariant: node.parent && node.parent.type === 'COMPONENT_SET',
      children: node.children.map(c => ({ id: c.id, name: c.name, type: c.type, w: Math.round(c.width), h: Math.round(c.height) })),
    });
  }
  if ('children' in node) {
    for (const child of node.children) collect(child);
  }
}

collect(frame);
console.log(`Found ${results.length} horizontal auto-layout frame(s):`);
console.log(JSON.stringify(results, null, 2));
