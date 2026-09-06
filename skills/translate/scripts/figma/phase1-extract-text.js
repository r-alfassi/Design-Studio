// Phase 1: Extract Text Nodes
// Paste into evaluate_script. Set TARGET_FRAME_ID before running.
// Returns { id, characters } for all TEXT nodes. Feed to Claude for translation,
// then use phase2-write-text.js to write the results back.

const TARGET_FRAME_ID = ''; // Set to the target frame node ID before running

const frame = figma.getNodeById(TARGET_FRAME_ID);
if (!frame) throw new Error(`Frame not found: ${TARGET_FRAME_ID}`);

const results = [];

function collect(node) {
  if (node.type === 'TEXT') {
    results.push({ id: node.id, characters: node.characters });
  }
  if ('children' in node) {
    for (const child of node.children) collect(child);
  }
}

collect(frame);
console.log(JSON.stringify(results, null, 2));
