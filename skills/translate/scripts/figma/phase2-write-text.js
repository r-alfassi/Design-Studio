// Phase 3: Write Translated Text (font-bridge aware)
// Paste into evaluate_script after translation is done.
// Fill TRANSLATIONS, then run.
//
// Unlike a naive loadFontAsync-per-node approach, this handles files that use a
// font the plugin cannot load (e.g. a proprietary font like SimplerPro): it tries
// a direct write first, and only bridges through Inter if the direct write throws.
// This avoids corrupting fonts on nodes that never needed the bridge.
//
// TARGET_ALIGN is optional — leave it null for a translation-only job with no
// layout-direction change. If this translation is paired with an RTL<->LTR
// conversion (see the `rtl` skill), set it to 'LEFT' or 'RIGHT' so the alignment
// flip happens in the same write (before the named style is restored) rather than
// as a separate pass — see rtl/references/figma.md for why the ordering matters.

const TRANSLATIONS = [
  // { id: '123:456', characters: 'Translated text here' },
];
const TARGET_ALIGN = null; // null = don't touch alignment; or 'LEFT' / 'RIGHT'

async function writeTranslations() {
  await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
  await figma.loadFontAsync({ family: 'Inter', style: 'Bold' });
  await figma.loadFontAsync({ family: 'Inter', style: 'Medium' });

  let directWrites = 0, bridged = 0, bridgedNoStyleNodes = [], overflowed = [], errors = [];

  for (const { id, characters } of TRANSLATIONS) {
    const node = figma.getNodeById(id);
    if (!node || node.type !== 'TEXT') continue;

    const sid = (node.textStyleId && node.textStyleId !== figma.mixed) ? node.textStyleId : '';

    try {
      // Try the node's current font first — works for any file whose fonts ARE loadable
      const segments = node.getStyledTextSegments(['fontName']);
      const uniqueFonts = [...new Map(segments.map(s => [
        `${s.fontName.family}:${s.fontName.style}`, s.fontName
      ])).values()];
      await Promise.all(uniqueFonts.map(f => figma.loadFontAsync(f).catch(() => { throw new Error('unloadable'); })));

      node.characters = characters;
      if (TARGET_ALIGN) node.textAlignHorizontal = TARGET_ALIGN;
      directWrites++;
    } catch (e) {
      // Bridge through Inter, then restore the named style if one exists
      try {
        let style = 'Regular';
        try { if (node.fontName !== figma.mixed && node.fontName.style === 'Bold') style = 'Bold'; } catch (e2) {}

        node.fontName = { family: 'Inter', style };
        node.characters = characters;
        if (TARGET_ALIGN) node.textAlignHorizontal = TARGET_ALIGN; // before restoring style

        if (sid) { node.textStyleId = sid; bridged++; }
        else { bridgedNoStyleNodes.push({ id: node.id, name: node.name }); }
      } catch (e3) {
        errors.push({ id, err: String(e3) });
        continue;
      }
    }

    // Flag overflow: fixed-size node where new text no longer fits
    if (node.textAutoResize === 'NONE') {
      const bounds = node.absoluteBoundingBox;
      if (bounds && node.height > bounds.height + 2) {
        overflowed.push({ id: node.id, name: node.name, text: characters });
      }
    }
  }

  console.log(`Phase 3 complete:
  Direct writes:            ${directWrites}
  Bridged via Inter (style restored): ${bridged}
  Bridged via Inter (no named style — left in Inter, flag for review): ${bridgedNoStyleNodes.length}
  Errors:                   ${errors.length}`);
  if (bridgedNoStyleNodes.length > 0) console.log('Nodes left in Inter — check manually:', JSON.stringify(bridgedNoStyleNodes, null, 2));
  if (overflowed.length > 0) console.log('Overflow detected:', JSON.stringify(overflowed, null, 2));
  if (errors.length > 0) console.log('Errors:', JSON.stringify(errors, null, 2));
}

writeTranslations();
