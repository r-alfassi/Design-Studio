// Phase 3: Find Directional Icon Candidates
// Paste into evaluate_script. Set TARGET_FRAME_ID before running.
// Logs nodes likely to be directional (arrows, chevrons, back buttons) for
// manual review — screenshot each and decide mirror vs. keep (see SKILL.md
// Core Principle 4 and references/figma.md "Directional Icons").
//
// THIS SCRIPT IS A ROUGH FILTER, NOT A SUBSTITUTE FOR VISUAL REVIEW.
// Found via production testing: a real directional-icon bug (a list row's
// disclosure chevron, still pointing the source-direction way after
// conversion) had rotation=0 on its wrapper frame and a fully generic name
// ("icons 24px") — the glyph's direction was baked into which vector artwork
// was used, not a rotation value or a name keyword. Neither of this script's
// heuristics would have caught it; it was only found by looking at a rendered
// screenshot of an actual list/navigation row. Always screenshot representative
// list rows, nav headers, and disclosure/expand affordances as part of Phase 3
// — do not treat a clean run of this script as proof there are no directional
// icon issues.
//
// Also: do not skip Phase 3 because Phases 1-2 looked clean. They are
// independent checks — mechanical alignment and element-order fixes say
// nothing about whether an icon's shape still points the wrong way.

const TARGET_FRAME_ID = ''; // Set to the target frame node ID before running

// Word-boundary matching — a naive substring match on "back" also matches
// inside unrelated words like "feedback", producing hundreds of false
// positives on any screen with rating/review chips.
const DIRECTIONAL_KEYWORDS = /\b(back|arrow|chevron|next|prev|forward|caret)\b/i;
const HEADER_KEYWORDS = /header|navbar|nav.?bar|toolbar|top.?bar|breadcrumb/i;
// Icon-wrapper naming convention in this file — check rotation at this level,
// not on every internal VECTOR descendant (see note below).
const ICON_WRAPPER_NAME = /^icons?(\s|\d|$)/i;

const frame = figma.getNodeById(TARGET_FRAME_ID);
if (!frame) throw new Error(`Frame not found: ${TARGET_FRAME_ID}`);

const results = [];

function isInHeader(node) {
  let n = node.parent;
  while (n && n.type !== 'PAGE') {
    if (HEADER_KEYWORDS.test(n.name)) return true;
    n = n.parent;
  }
  return false;
}

function collect(node, insideIconWrapper) {
  const isIconWrapper = ICON_WRAPPER_NAME.test(node.name) || node.type === 'INSTANCE';
  const keywordMatch = DIRECTIONAL_KEYWORDS.test(node.name);

  // Only check rotation at the icon-wrapper level (or on named-directional
  // nodes) — recursing rotation checks into every internal vector path of a
  // hand-drawn icon (star points, facial features, an X made of two crossed
  // rectangles) produces overwhelming noise with no useful signal. A rotated
  // internal path is normal icon construction, not evidence of a directional
  // glyph.
  const checkRotation = !insideIconWrapper && (isIconWrapper || keywordMatch);
  const isRotated = checkRotation && (node.type === 'VECTOR' || node.type === 'INSTANCE' || node.type === 'FRAME') && Math.abs(node.rotation) > 0.01;

  if (keywordMatch || isRotated) {
    results.push({
      id: node.id,
      name: node.name,
      type: node.type,
      rotation: node.rotation,
      inHeader: isInHeader(node),
      matchedBy: keywordMatch ? 'keyword' : 'rotation',
    });
  }

  if ('children' in node) {
    // Once inside an icon wrapper, stop treating descendants as independent
    // rotation-check candidates — still recurse (a keyword match could be
    // nested deeper), just don't re-trigger the rotation heuristic per-vector.
    for (const child of node.children) collect(child, insideIconWrapper || isIconWrapper);
  }
}

collect(frame, false);
console.log(`Found ${results.length} directional icon candidate(s) — remember to also screenshot list rows and nav headers directly, this script alone is not sufficient:`);
console.log(JSON.stringify(results, null, 2));
