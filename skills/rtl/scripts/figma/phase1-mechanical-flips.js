// Phase 1: Mechanical Flips (bidirectional)
// Paste into evaluate_script. Set TARGET_FRAME_ID, DIRECTION, and TRANSLATION_SCOPED
// before running. No AI judgment needed for the flips themselves — but font-unloadable
// text in the SOURCE script needs a scoping decision (see below).
//
// Skips instances that expose their own direction/language component property
// (those are handled via setProperties instead).
//
// FONT GOTCHA (found via production testing): setting textAlignHorizontal alone
// throws on an unloaded font (e.g. SimplerPro), just like setting .characters does.
// The naive fix — bridge to Inter, set alignment, restore the named style — works
// fine for LATIN text, but Hebrew/Arabic text sitting in Inter renders as INVISIBLE
// (Inter has no Hebrew/Arabic glyphs in the plugin's font set). Numerals in the same
// string still render, which produces the confusing symptom of "half the string
// vanished." Bridging must NOT be done blindly on source-script (Hebrew/Arabic) text.
//
// Correct handling, controlled by TRANSLATION_SCOPED:
// - TRANSLATION_SCOPED = true (Phase 5 / `translate` skill will run on this job):
//   defer alignment on source-script text with an unloaded font — log it, don't
//   bridge. Phase 5's write already handles alignment + the character rewrite to the
//   target language together in one bridge, which is safe because by then the text
//   is Latin-script and Inter renders it correctly. Nothing is left broken.
// - TRANSLATION_SCOPED = false (direction-only job, no Phase 5 coming): there is no
//   later step to fix this, so flag it for manual attention instead of silently
//   leaving it misaligned OR silently making it invisible by bridging. See the
//   Failure Protocol in references/figma.md.
//
// Latin-script text (already-translated nodes, or an English source on an
// English->RTL job) is unaffected by any of this — direct bridge-and-restore is
// safe for it and happens automatically.

const TARGET_FRAME_ID = ''; // Set to the target frame node ID before running
const DIRECTION = 'RTL_TO_LTR'; // or 'LTR_TO_RTL'
const TRANSLATION_SCOPED = true; // true if Phase 5 (translate skill) will run on this job

const toLTR = DIRECTION === 'RTL_TO_LTR';
const fromAlign = toLTR ? 'RIGHT' : 'LEFT';
const toAlign   = toLTR ? 'LEFT'  : 'RIGHT';
const fromAxis  = toLTR ? 'MAX'   : 'MIN';
const toAxis    = toLTR ? 'MIN'   : 'MAX';

const frame = figma.getNodeById(TARGET_FRAME_ID);
if (!frame) throw new Error(`Frame not found: ${TARGET_FRAME_ID}`);

let textNodes = 0, alignmentsFlipped = 0, alignBridged = 0, alignDeferredToPhase5 = 0,
    alignFlaggedNoPhase5 = [], axisFlipped = 0, paddingsSwapped = 0, constraintsFlipped = 0,
    skippedInstances = 0, errors = [];

const SKIP_PATTERN = /^[\d\s:,./]+$|^\d{1,2}:\d{2}$|^\p{Emoji}$/u;
const DIRECTION_PROP_KEYS = /^(direction|language|rtl\/ltr|rtl_ltr)$/i;
const SOURCE_SCRIPT = /[֐-׿؀-ۿ]/; // Hebrew + Arabic blocks

function hasOwnDirectionProperty(node) {
  if (node.type !== 'INSTANCE' || !node.componentProperties) return false;
  return Object.keys(node.componentProperties).some(k => DIRECTION_PROP_KEYS.test(k));
}

function isInsideAutoLayout(node) {
  const parent = node.parent;
  return parent && parent.type !== 'PAGE' && parent.layoutMode && parent.layoutMode !== 'NONE';
}

function flagForManualReview(node, reason) {
  try {
    node.strokes = [{ type: 'SOLID', color: { r: 1, g: 0, b: 0 } }];
    node.strokeWeight = 2;
    node.strokeAlign = 'OUTSIDE';
  } catch (e) {}
  alignFlaggedNoPhase5.push({ id: node.id, name: node.name, reason });
}

function fixAlignment(node) {
  try {
    node.textAlignHorizontal = toAlign;
    alignmentsFlipped++;
    return;
  } catch (e) {
    // Font not loaded. Is this node's current text in the source RTL script?
    if (SOURCE_SCRIPT.test(node.characters)) {
      if (TRANSLATION_SCOPED) {
        // Safe to defer — Phase 5 rewrites this exact node to the target language
        // and folds the alignment fix into that same (Latin-safe) bridge.
        alignDeferredToPhase5++;
      } else {
        // No Phase 5 coming — this can't be silently fixed. Bridging now would
        // make the text invisible (Inter can't render Hebrew/Arabic); leaving it
        // misaligned is at least visible and honest about the gap.
        flagForManualReview(node, 'Alignment could not be set: font unloadable, text is source-script, no translation phase scoped to fix it safely');
      }
      return;
    }
    // Latin-script text (already target-language, or source was always Latin) —
    // safe to bridge, Inter renders it fine.
    try {
      const sid = (node.textStyleId && node.textStyleId !== figma.mixed) ? node.textStyleId : '';
      let style = 'Regular';
      try { if (node.fontName !== figma.mixed && node.fontName.style === 'Bold') style = 'Bold'; } catch (e2) {}
      node.fontName = { family: 'Inter', style };
      node.textAlignHorizontal = toAlign;
      if (sid) node.textStyleId = sid;
      alignBridged++;
    } catch (e3) {
      errors.push({ id: node.id, err: String(e3) });
    }
  }
}

function processNode(node) {
  // Skip instances that manage their own direction — handle those via setProperties, not manual flips
  if (hasOwnDirectionProperty(node)) { skippedInstances++; return; }

  if (node.type === 'TEXT') {
    textNodes++;
    const content = node.characters.trim();
    if (!SKIP_PATTERN.test(content) && node.textAlignHorizontal === fromAlign) {
      fixAlignment(node);
    }
  }

  try {
    if (node.layoutMode === 'HORIZONTAL' && node.primaryAxisAlignItems === fromAxis) {
      node.primaryAxisAlignItems = toAxis;
      axisFlipped++;
    }
    if (node.layoutMode === 'VERTICAL' && node.counterAxisAlignItems === fromAxis) {
      node.counterAxisAlignItems = toAxis;
      axisFlipped++;
    }

    if (['FRAME', 'COMPONENT', 'INSTANCE'].includes(node.type) && 'paddingLeft' in node) {
      if (node.paddingLeft !== node.paddingRight) {
        const tmp = node.paddingLeft;
        node.paddingLeft = node.paddingRight;
        node.paddingRight = tmp;
        paddingsSwapped++;
      }
    }

    if (node.constraints && !isInsideAutoLayout(node)) {
      if (node.constraints.horizontal === 'MAX') {
        node.constraints = { ...node.constraints, horizontal: 'MIN' };
        constraintsFlipped++;
      } else if (node.constraints.horizontal === 'MIN') {
        node.constraints = { ...node.constraints, horizontal: 'MAX' };
        constraintsFlipped++;
      }
    }
  } catch (e) {
    errors.push({ id: node.id, err: String(e) });
  }

  if ('children' in node) {
    for (const child of node.children) processNode(child);
  }
}

processNode(frame);

console.log(`Phase 1 complete (${DIRECTION}, translation scoped: ${TRANSLATION_SCOPED}):
  Text nodes found:                    ${textNodes}
  Alignments flipped directly:         ${alignmentsFlipped}
  Alignments bridged (Latin-safe):     ${alignBridged}
  Alignments deferred to Phase 5:      ${alignDeferredToPhase5}
  Alignments flagged (no Phase 5):     ${alignFlaggedNoPhase5.length}
  Auto-layout axes flipped:            ${axisFlipped}
  Paddings swapped:                    ${paddingsSwapped}
  Constraints flipped:                 ${constraintsFlipped}
  Instances skipped (own direction property): ${skippedInstances}
  Errors:                              ${errors.length}`);
if (alignFlaggedNoPhase5.length > 0) console.log('Flagged for manual review:', JSON.stringify(alignFlaggedNoPhase5, null, 2));
if (errors.length > 0) console.log('Errors:', JSON.stringify(errors, null, 2));
