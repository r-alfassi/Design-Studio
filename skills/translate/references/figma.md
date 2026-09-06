# Translate — Figma Implementation

> Read [`SKILL.md`](../SKILL.md) first — this file assumes the workflow phases defined there. Everything below is Figma-specific: extraction, font-safe write-back, and overflow detection.

---

## Ready-to-run scripts

Paste-ready scripts live in [`../scripts/figma/`](../scripts/figma/):

| Script | Phase | What it does |
|---|---|---|
| `phase1-extract-text.js` | 1 | Extracts all TEXT node `{id, characters}` for translation. |
| `phase2-write-text.js` | 3 | Writes translations back — direct write first, Inter-bridge fallback with named-style restore, overflow flagging. |

(Phase 2 of this skill — building the translation — is AI judgment work with no script; see `SKILL.md`.)

---

## Phase 1: Extract

```js
function collect(node, results) {
  if (node.type === 'TEXT') {
    results.push({ id: node.id, characters: node.characters });
  }
  if ('children' in node) {
    for (const child of node.children) collect(child, results);
  }
}
```

See `scripts/figma/phase1-extract-text.js` for the paste-ready version.

---

## Phase 3: Write back — font-safe

Figma files often use a font the plugin cannot load (a proprietary font like SimplerPro, or any font not available in the cloud font library). Writing translated text naively — assuming every font loads — throws and aborts the batch partway through.

**Procedure:**

1. Try the node's own font first — this covers the common case where fonts in the file *are* loadable:
```js
const segments = node.getStyledTextSegments(['fontName']);
const uniqueFonts = [...new Map(segments.map(s => [
  `${s.fontName.family}:${s.fontName.style}`, s.fontName
])).values()];
await Promise.all(uniqueFonts.map(f => figma.loadFontAsync(f)));
node.characters = translation;
```

2. If that throws, bridge through Inter and restore the named text style afterward:
```js
const sid = (node.textStyleId && node.textStyleId !== figma.mixed) ? node.textStyleId : '';
let style = 'Regular';
try { if (node.fontName !== figma.mixed && node.fontName.style === 'Bold') style = 'Bold'; } catch (e) {}

node.fontName = { family: 'Inter', style };
node.characters = translation;
if (sid) node.textStyleId = sid; // restores the original font via named style
```

3. If the node has no named text style to restore to, it stays in Inter — log it, don't silently leave it unflagged.
4. **Never pre-load Inter onto every node as a blanket workaround.** Only bridge nodes that actually fail on direct write — blanket conversion corrupts fonts on nodes that didn't need it and creates needless manual cleanup.

If this translation is paired with a layout-direction change (RTL↔LTR) via the `rtl` skill, set `textAlignHorizontal` *before* restoring the named style in step 2 — once the named style is reapplied, the node may be back on a font that isn't loaded this session, and further property writes will throw. See `rtl/references/figma.md` for the alignment-flip side of that write.

See `scripts/figma/phase2-write-text.js` for the full paste-ready version with error tracking.

### Choosing a target-language font

**For new screens in a language the file doesn't already support** (e.g. adding Hebrew to a Latin-only file): check what's already loaded before picking a default.

```js
const available = await figma.listAvailableFontsAsync();
// Example for Hebrew — swap the candidate list for the target language's common web fonts
const hebrewFonts = available.filter(f =>
  ['Rubik', 'IBM Plex Sans Hebrew', 'Noto Sans Hebrew', 'Frank Ruhl Libre'].includes(f.fontName.family)
);
const family = hebrewFonts[0]?.fontName.family ?? 'Rubik'; // Rubik: solid default for Hebrew — full Unicode coverage, correct optical weight
```

For an existing project file, prefer whatever Hebrew (or other target-script) font is already loaded over introducing a new one — switching fonts breaks the file's visual system. Only default to a fresh choice (like Rubik for Hebrew) when the file has no existing support for that script at all.

When applying to existing text, preserve the original weight — map the source style to the nearest equivalent rather than resetting everything to Regular.

### Cloning a frame with non-loadable fonts before appending

Normalize fonts on the clone *before* it enters the page tree, to avoid write failures on attach:

```js
const clone = sourceFrame.clone();
for (const t of clone.findAll(n => n.type === 'TEXT')) {
  try {
    const fn = t.fontName === figma.mixed ? null : t.fontName;
    if (!fn || fn.family !== 'Inter') {
      const style = fn
        ? (fn.style.toLowerCase().includes('semi') ? 'Semi Bold'
           : fn.style.toLowerCase().includes('bold') ? 'Bold'
           : 'Regular')
        : 'Regular';
      t.fontName = { family: 'Inter', style };
    }
  } catch (e) {
    try { t.fontName = { family: 'Inter', style: 'Regular' }; } catch (_) {}
  }
}
figma.currentPage.appendChild(clone);
```

---

## Phase 4: Overflow check

```js
if (node.textAutoResize === 'NONE') {
  const bounds = node.absoluteBoundingBox;
  if (bounds && node.height > bounds.height + 2) {
    // flag: translated text no longer fits the fixed-size node
  }
}
```

`phase2-write-text.js` runs this check automatically as part of the write pass and reports overflowed nodes in its summary.

---

## Checklist

- [ ] All TEXT nodes extracted with stable IDs
- [ ] Translations preserve tone/register; checked against the project glossary where one exists
- [ ] Length approximated — no gratuitous overflow risk from an unnecessarily long translation
- [ ] Non-translatable content skipped (numbers, codes, timestamps, icon glyphs)
- [ ] Direct write attempted first; Inter bridge only where it failed; named style restored where possible
- [ ] Nodes left in Inter (no named style to restore to) logged, not silently dropped
- [ ] Font choice for the target script confirmed against what the file already loads before introducing a new one
- [ ] Overflow check run on every written node; overflows flagged
- [ ] Shared/repeated text translated once at the source, not per-instance
