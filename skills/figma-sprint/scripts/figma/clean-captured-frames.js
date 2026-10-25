// clean-captured-frames.js — turn a captured page into a Flows-page frame
// Paste into use_figma. Set the parameters below before running.
// Writes to the captured frames only. See skills/rtl/references/figma.md for the reasons behind each step.
//
// What it does to each frame:
//  - removes the hidden toast, which the capture records as an empty small frame
//  - for a right-to-left product (RTL): reverses the flow children of every horizontal row and swaps start and end
//    alignment, mirrors the columns of every grid (the capture turns a table into a grid), and end-aligns the column that holds a hug-width tab strip found by the labels in TAB_LABELS
//  - leaves padding and text alignment alone, since the capture records the computed physical values
//  - leaves absolutely placed children where the capture put them, because a popup is placed from the
//    browser's own measurements and mirroring it moves it off its anchor (MIRROR_ABSOLUTE turns this on,
//    for a decoration that is placed relative to its container)
//  - raises every popup to the top layer of the frame, so the table or list under it does not draw over it, and places it
//    where the browser put it when BOXES gives that: the runner writes each popup's rectangle beside its screenshot
//    (shot-<state>-popups.json), because a capture can place a popup off its anchor, differently from one capture version to the next
//  - moves a visible toast (a small, dark, rounded, absolutely placed box with text) to the bottom centre of the
//    frame, where the app fixes it to the window
//  - names the frame
// Then take a screenshot of each frame next to a browser screenshot of the same state and compare.

const PAGE_INDEX = 0;                  // Page that holds the captures (0 is the first page)
const FRAMES = [
  // { id: '113:2', name: '3 · Pill menu open' },
];
const RTL = true;                      // false for a left-to-right product: the rows are already in reading order
const TAB_LABELS = [
  // 'Kitchen',                        // a label that appears in a strip of hug-width tabs, for a right-to-left product
];
const BOXES = [
  // { frame: '2 · Pill menu open', text: 'Swap employee', x: 905, y: 1154 },   // from shot-<state>-popups.json
];
const MIRROR_ABSOLUTE = false;

await figma.setCurrentPageAsync(figma.root.children[PAGE_INDEX]);
const report = [];
const lum = (p) => p && p.type === 'SOLID' ? 0.2126 * p.color.r + 0.7152 * p.color.g + 0.0722 * p.color.b : 1;

for (const f of FRAMES) {
  const root = await figma.getNodeByIdAsync(f.id);
  if (!root || root.type !== 'FRAME') { report.push({ id: f.id, error: 'not a frame' }); continue; }
  let toast = 0, reversed = 0, flipped = 0, abs = 0, strips = 0, popups = 0, toasts = 0, grids = 0;
  for (const c of [...root.children]) if (c.type === 'FRAME' && c.children.length === 0 && c.width <= 60 && c.height <= 30) { c.remove(); toast++; }
  if (RTL) for (const h of root.findAll((n) => n.type === 'FRAME' && n.layoutMode === 'HORIZONTAL')) {
    const flow = [...h.children].filter((c) => c.layoutPositioning !== 'ABSOLUTE');
    if (flow.length > 1) { flow.reverse().forEach((c, k) => h.insertChild(k, c)); reversed++; }
    if (h.primaryAxisAlignItems === 'MIN') { h.primaryAxisAlignItems = 'MAX'; flipped++; }
    else if (h.primaryAxisAlignItems === 'MAX') { h.primaryAxisAlignItems = 'MIN'; flipped++; }
  }
  // A grid keeps its cells in browser order, so its columns are mirrored: the column sizes are reversed, and each cell moves to
  // the mirrored column. A cell cannot move onto an occupied one, so every cell first goes to a temporary column past the end.
  if (RTL) for (const g of root.findAll((n) => n.type === 'FRAME' && n.layoutMode === 'GRID')) {
    const cols = g.gridColumnCount, sizes = JSON.parse(JSON.stringify(g.gridColumnSizes)).reverse();
    const plan = g.children.filter((c) => c.layoutPositioning !== 'ABSOLUTE').map((c) => ({ c, row: c.gridRowAnchorIndex, col: c.gridColumnAnchorIndex, span: c.gridColumnSpan || 1 }));
    g.gridColumnCount = 2 * cols;
    for (const q of plan) q.c.setGridChildPosition(q.row, q.col + cols);
    for (const q of plan) q.c.setGridChildPosition(q.row, cols - 1 - q.col - (q.span - 1));
    g.gridColumnCount = cols; g.gridColumnSizes = sizes; grids++;
  }
  if (MIRROR_ABSOLUTE) for (const p of [root, ...root.findAll((n) => 'children' in n)]) for (const c of p.children || []) if (c.layoutPositioning === 'ABSOLUTE') { c.x = p.width - c.x - c.width; abs++; }
  if (RTL && TAB_LABELS.length) for (const t of root.findAll((n) => n.type === 'TEXT' && TAB_LABELS.includes(n.characters))) {
    const strip = t.parent && t.parent.parent, host = strip && strip.parent;
    if (strip && strip.layoutMode === 'HORIZONTAL' && host && host.layoutMode === 'VERTICAL' && host.counterAxisAlignItems === 'MIN') { host.counterAxisAlignItems = 'MAX'; strips++; }
  }
  // Popups and toasts: every absolutely placed frame below the root.
  const body = root.children.find((c) => c.name === 'Body') || root;
  const rb = root.absoluteBoundingBox;
  for (const n of root.findAll((x) => x.type === 'FRAME' && x.layoutPositioning === 'ABSOLUTE')) {
    const isToast = n.height <= 60 && n.cornerRadius >= 20 && lum(n.fills[0]) < 0.25 && n.findAll((t) => t.type === 'TEXT').length > 0;
    const b = n.absoluteBoundingBox;
    if (n.parent !== body) { body.appendChild(n); n.layoutPositioning = 'ABSOLUTE'; const bb = body.absoluteBoundingBox; n.x = b.x - bb.x; n.y = b.y - bb.y; }
    if (isToast) { n.y = body.height - 30 - n.height; n.x = (body.width - n.width) / 2; toasts++; }
    else {
      const spot = BOXES.find((q) => q.frame === f.name && n.findAll((t) => t.type === 'TEXT').some((t) => t.characters.includes(q.text)));
      if (spot) { const bb = body.absoluteBoundingBox, rr = root.absoluteBoundingBox; n.x = spot.x - (bb.x - rr.x); n.y = spot.y - (bb.y - rr.y); }
      popups++;
    }
  }
  root.name = f.name;
  report.push({ id: f.id, name: f.name, size: [Math.round(root.width), Math.round(root.height)], toast, reversed, flipped, abs, strips, grids, popups, toasts });
}
return report;
