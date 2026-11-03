// Phase 4 (built from scratch in RTL): read-only audit of a Hebrew/Arabic frame.
// Paste into use_figma. Set TARGET_FRAME_ID before running. Changes nothing.
//
// Why this exists: a screen built directly in right-to-left (not converted from
// left-to-right) has no source frame to compare with, and the conversion
// scripts do not run on it. These are the mistakes found on built-from-scratch
// Hebrew screens (ProShift 2026-10-23, Comuna role screens 2026-11-03). Each
// one looks like a plausible design choice in a downscaled screenshot, so a
// clean run of this script AND a look at 1:1 crops are both required.
//
// Findings:
//   cross-axis-left   A vertical auto-layout frame packs hug-width children to
//                     the left (counterAxisAlignItems MIN). In RTL a stack such
//                     as name over role, label over value, or a title with a
//                     subtitle must be packed to the right (MAX). A frame whose
//                     children all fill its width is not reported.
//   text-left         Text containing Hebrew/Arabic is left-aligned.
//   row-packs-left    A horizontal auto-layout row that fills its parent and
//                     packs from the left (primaryAxisAlignItems MIN) with more
//                     than one child. In RTL it should pack from the right (MAX)
//                     or space its children between.
//   bare-ratio        A ratio or range such as "3 / 4" or "2–6" stands without a
//                     left-to-right isolate (U+2066 ... U+2069), so a right-to-
//                     left line shows it reversed ("4 / 3").
//   leading-meta      Text that explains the review and not the product (starts
//                     with a review word) sits inside the product frame. Meta
//                     belongs in a sibling label outside the frame. Heuristic:
//                     edit META_WORDS for the project's language.

const TARGET_FRAME_ID = ''; // set before running

const META_WORDS = /^(תצוגה:|הצעה \d|ספרינט|בסיס להשוואה|Proposal|Sprint|Baseline)/;
const HE_AR = /[֐-׿؀-ۿ]/;
const RATIO = /^\s*\d+(?:[.,]\d+)?\s*[\/–-]\s*\d+(?:[.,]\d+)?\s*$/;
const LRI = '⁦';

const root = figma.getNodeById(TARGET_FRAME_ID);
if (!root) throw new Error('Frame not found: ' + TARGET_FRAME_ID);

const findings = [];
const add = (kind, node, note) => findings.push({ kind, id: node.id, name: node.name, note: note || '' });

const hugChild = (c) =>
  (c.type === 'TEXT' && c.textAutoResize === 'WIDTH_AND_HEIGHT') ||
  (c.layoutSizingHorizontal === 'HUG');

for (const n of [root, ...root.findAll(() => true)]) {
  if (n.type === 'TEXT') {
    const s = n.characters;
    if (HE_AR.test(s) && n.textAlignHorizontal === 'LEFT') add('text-left', n, s.slice(0, 30));
    if (RATIO.test(s) && !s.includes(LRI)) add('bare-ratio', n, s);
    if (META_WORDS.test(s.trim())) add('leading-meta', n, s.slice(0, 40));
    continue;
  }
  if (!('layoutMode' in n)) continue;
  if (n.layoutMode === 'VERTICAL' && n.counterAxisAlignItems === 'MIN' && n !== root) {
    const hugs = n.children.filter(hugChild);
    if (hugs.length) add('cross-axis-left', n, 'hug-width: ' + hugs.map((c) => (c.characters || c.name).slice(0, 14)).join(' | '));
  }
  if (
    n.layoutMode === 'HORIZONTAL' &&
    n.children.length > 1 &&
    n.primaryAxisAlignItems === 'MIN' &&
    n.layoutSizingHorizontal === 'FILL'
  ) add('row-packs-left', n, n.children.length + ' children');
}

const byKind = {};
for (const f of findings) (byKind[f.kind] = byKind[f.kind] || []).push(f);
return {
  frame: root.name,
  total: findings.length,
  counts: Object.fromEntries(Object.entries(byKind).map(([k, v]) => [k, v.length])),
  findings: findings.slice(0, 60),
};
