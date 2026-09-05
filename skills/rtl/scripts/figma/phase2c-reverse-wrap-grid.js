// Phase 2c: Reverse a WRAP Grid Per-Row (not a full-array reversal)
// Paste into evaluate_script. Set TARGET_ROW_ID before running.
//
// A WRAP auto-layout grid's reading sequence mirrors per row between RTL and LTR
// (RTL reads right-to-left within each row; row order top-to-bottom is unchanged
// in both directions). Leaving the array untouched puts the wrong item in each
// position; a full-array reversal is ALSO wrong (it collapses row order too).
// The correct fix: group children into rows by y-position, reverse each row's
// chunk internally, keep row order intact.
//
// Use this ONLY for layoutWrap === 'WRAP' frames. A layoutWrap === 'NO_WRAP' row
// whose content overflows its width is a horizontal-scroll carousel, not a grid —
// that needs a normal single full-array reversal instead (see
// phase2b-auto-reverse-icon-rows.js), not this script.

const TARGET_ROW_ID = ''; // Set to the WRAP grid's node ID before running

const row = figma.getNodeById(TARGET_ROW_ID);
if (!row) throw new Error(`Row not found: ${TARGET_ROW_ID}`);
if (row.layoutWrap !== 'WRAP') {
  throw new Error(`Node ${TARGET_ROW_ID} has layoutWrap="${row.layoutWrap}", not "WRAP". ` +
    `If this is a horizontal-scroll carousel (NO_WRAP, content wider than the frame), use phase2b's full-array reversal instead — this script is for WRAP grids only.`);
}

// Group children into rows by y-position
const children = [...row.children];
const rows = [];
let currentRow = [];
let currentY = null;
for (const child of children) {
  if (currentY === null || Math.abs(child.y - currentY) < 1) {
    currentRow.push(child);
    currentY = child.y;
  } else {
    rows.push(currentRow);
    currentRow = [child];
    currentY = child.y;
  }
}
if (currentRow.length) rows.push(currentRow);

// Reverse within each row, keep row order, flatten, re-apply order
const reordered = rows.flatMap(r => [...r].reverse());
reordered.forEach((child, i) => row.insertChild(i, child));

console.log(`Phase 2c complete: ${rows.length} row(s) detected (sizes: ${rows.map(r => r.length).join(', ')}), reversed within each row, row order preserved.`);
