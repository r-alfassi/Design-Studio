// clean-captured-frames.js — turn a captured right-to-left page into a Flows-page frame
// Paste into use_figma. Set the parameters below before running.
// Writes to the captured frames only. The capture arrives with its rows in browser order, so this
// reverses them and removes the capture noise. See skills/rtl/references/figma.md for the reasons.
//
// What it does to each frame:
//  - removes the hidden toast, which the capture records as an empty small frame
//  - reverses the flow children of every horizontal row and swaps start and end alignment
//  - leaves padding and text alignment alone, since the capture records the computed physical values
//  - leaves absolutely placed children where the capture put them, because a popup is placed from the
//    browser's own measurements and mirroring it moves it off its anchor (MIRROR_ABSOLUTE turns this on,
//    for a decoration that is placed relative to its container)
//  - end-aligns the column that holds a hug-width tab strip, found by the labels in TAB_LABELS
//  - moves a popup to the top layer of the frame at its browser position (POPUPS)
//  - moves a visible toast to the bottom centre of the frame, where the app fixes it to the window (TOASTS)
//  - names the frame
// Then take a screenshot of each frame next to a browser screenshot of the same state and compare.

const PAGE_INDEX = 0;                  // Page that holds the captures (0 is the first page)
const FRAMES = [
  // { id: '113:2', name: '3 · Pill menu open' },
];
const POPUPS = [
  // { id: '113:220', x: 906, y: 1154 },   // node id of the menu, and its position in the frame, read from the browser screenshot
];
const TOASTS = [
  // '116:408',                            // node ids of a toast that is meant to be visible in its state
];
const TAB_LABELS = [
  // 'Kitchen',                            // a label that appears in the strip of hug-width tabs
];
const MIRROR_ABSOLUTE = false;
const RTL = true;                     // false for a left-to-right product: the rows are already in reading order, so only the noise is cleaned

await figma.setCurrentPageAsync(figma.root.children[PAGE_INDEX]);
const report = [];
const top = (n) => { let r = n; while (r.parent && r.parent.type !== 'PAGE') r = r.parent; return r; };

for (const f of FRAMES) {
  const root = await figma.getNodeByIdAsync(f.id);
  if (!root || root.type !== 'FRAME') { report.push({ id: f.id, error: 'not a frame' }); continue; }
  let toast = 0, reversed = 0, flipped = 0, abs = 0, strips = 0;
  for (const c of [...root.children]) if (c.type === 'FRAME' && c.children.length === 0 && c.width <= 60 && c.height <= 30) { c.remove(); toast++; }
  if (RTL) for (const h of root.findAll((n) => n.type === 'FRAME' && n.layoutMode === 'HORIZONTAL')) {
    const flow = [...h.children].filter((c) => c.layoutPositioning !== 'ABSOLUTE');
    if (flow.length > 1) { flow.reverse().forEach((c, k) => h.insertChild(k, c)); reversed++; }
    if (h.primaryAxisAlignItems === 'MIN') { h.primaryAxisAlignItems = 'MAX'; flipped++; }
    else if (h.primaryAxisAlignItems === 'MAX') { h.primaryAxisAlignItems = 'MIN'; flipped++; }
  }
  if (MIRROR_ABSOLUTE) for (const p of [root, ...root.findAll((n) => 'children' in n)]) for (const c of p.children || []) if (c.layoutPositioning === 'ABSOLUTE') { c.x = p.width - c.x - c.width; abs++; }
  if (RTL && TAB_LABELS.length) for (const t of root.findAll((n) => n.type === 'TEXT' && TAB_LABELS.includes(n.characters))) {
    const strip = t.parent && t.parent.parent, host = strip && strip.parent;
    if (strip && strip.layoutMode === 'HORIZONTAL' && host && host.layoutMode === 'VERTICAL' && host.counterAxisAlignItems === 'MIN') { host.counterAxisAlignItems = 'MAX'; strips++; }
  }
  root.name = f.name;
  report.push({ id: f.id, name: f.name, size: [Math.round(root.width), Math.round(root.height)], toast, reversed, flipped, abs, strips });
}

for (const p of POPUPS) {
  const n = await figma.getNodeByIdAsync(p.id);
  if (!n) { report.push({ id: p.id, error: 'popup not found' }); continue; }
  const root = top(n), body = root.children.find((c) => c.name === 'Body') || root;
  body.appendChild(n); n.layoutPositioning = 'ABSOLUTE';
  const rb = root.absoluteBoundingBox, bb = body.absoluteBoundingBox;
  n.x = p.x - (bb.x - rb.x); n.y = p.y - (bb.y - rb.y);
  report.push({ popup: p.id, parent: n.parent.name, x: p.x, y: p.y });
}

for (const id of TOASTS) {
  const t = await figma.getNodeByIdAsync(id);
  if (!t) { report.push({ id, error: 'toast not found' }); continue; }
  const r = t.parent;
  t.y = r.height - 30 - t.height; t.x = (r.width - t.width) / 2;
  report.push({ toast: id, y: Math.round(t.y) });
}
return report;
