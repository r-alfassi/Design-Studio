# RTL ↔ LTR in Figma (and FigJam)

> Read [`SKILL.md`](../SKILL.md) first — this file assumes the Horizontal Mirror Principle and workflow phases defined there. Everything below is Figma-specific implementation: code, gotchas, and the checklist for this medium.

This reference is bidirectional — RTL→LTR and LTR→RTL use the same operations with the flip direction inverted. Confirm direction first (see SKILL.md).

This skill covers layout mirroring only. If the job also needs new-language copy, that's Phase 5 — see the `translate` skill (and its `references/figma.md` for font-safe write-back).

## Ready-to-run scripts

Paste-ready scripts live in [`../scripts/figma/`](../scripts/figma/) — set the `TARGET_FRAME_ID` (and `DIRECTION` where present) constant at the top of each and run via `evaluate_script`. Prefer these over re-deriving the logic inline each session — they carry fixes (component-property skip, variant detection) that are easy to drop if rewritten from scratch:

| Script | Phase | What it does |
|---|---|---|
| `phase1-mechanical-flips.js` | 1 | Flips text alignment, auto-layout axes, padding, constraints. Skips instances with their own direction/language component property. |
| `phase1b-find-absolute-children.js` | 1 | Surveys absolute-positioned children inside auto-layout frames; flags rotated ones separately (simple x-mirror is wrong for those) and suggests the matrix mirror — review required, no auto-apply. |
| `phase2a-find-horizontal-layouts.js` | 2 | Logs every HORIZONTAL auto-layout frame (with variant flag) for review before reordering. |
| `phase2b-auto-reverse-icon-rows.js` | 2 | Auto-reverses 2-child icon+content and `SPACE_BETWEEN` rows; flags ambiguous/variant rows instead of guessing. |
| `phase2c-reverse-wrap-grid.js` | 2 | Reverses a `WRAP` grid's children within each row (grouped by y-position), preserving row order — a different transform than the full-array reversal `phase2b` does. |
| `phase3-find-directional-icons.js` | 3 | Finds arrow/chevron/back-button candidates for the mirror-or-keep review. |

Phase 5 (translation) has no script here — see `translate/scripts/figma/`.

The sections below explain the gotchas behind each script and cover cases too structural/one-off for a generic script (`COMPONENT_SET` variants, batch-mutation scrambling, detaching).

---

## Phase 1 — Mechanical Flips

Flips `textAlignHorizontal`, `primaryAxisAlignItems`/`counterAxisAlignItems`, asymmetric padding, and non-auto-layout constraints in one pass. See `scripts/figma/phase1-mechanical-flips.js`.

Skip alignment flips on: timestamps (`HH:MM`), pure numerics, single emoji/icon characters, anything already `CENTER`.

Leave `SPACE_BETWEEN` frames' `primaryAxisAlignItems` alone — spacing recalculates automatically once children are reordered in Phase 2.

**Instances with their own direction property:** before flipping anything on an `INSTANCE`, check `componentProperties` for a `direction`/`Language`/`RTL/LTR`-style key. If present, the component manages its own layout — use `setProperties` instead of flipping its internals, and the script skips these automatically:

```js
const props = instance.componentProperties;
if (props['direction'] || props['RTL/LTR'] || props['Language']) {
  instance.resetOverrides();
  instance.setProperties({ direction: 'LTR' }); // or 'RTL', per target
}
```

Component names or variant values containing `RTL`, `LTR`, `Language`, or `Direction` are the signal to check for this before touching children directly. This check should stay generic (any instance exposing such a property) — do not hardcode a specific component's name into it; project-specific components belong in that project's own notes, not in this shared skill.

### Setting alignment alone can throw on an unloaded font — and the naive fix breaks Hebrew

Figma requires a loaded font to write `textAlignHorizontal`, not just to write `.characters`. On a file using a non-cloud-loadable font (SimplerPro, or similar), a pure alignment change throws exactly like a character write would — this surprises people because "I'm not touching the text" doesn't mean the font requirement goes away.

The obvious fix — bridge to Inter, set alignment, restore the named style, same pattern as translated text — **works for Latin text but breaks Hebrew/Arabic**: Inter has no Hebrew/Arabic glyphs in the plugin's font set, so bridged source-script text renders as **invisible**, not as tofu boxes. Numerals in the same string still render (they're Latin digits), which produces a confusing symptom: a string like "handled 120 requests" (in Hebrew) shows only "120" — the Hebrew words on either side vanish, and every property (`characters`, `visible`, `opacity`, `fills`) reads back completely normal, giving no hint anything's wrong.

**Correct handling** — check whether the node's current text is in the source script (Hebrew/Arabic) before bridging:

```js
const SOURCE_SCRIPT = /[֐-׿؀-ۿ]/; // Hebrew + Arabic Unicode blocks

function fixAlignment(node, toAlign, translationScoped) {
  try {
    node.textAlignHorizontal = toAlign;
  } catch (e) {
    if (SOURCE_SCRIPT.test(node.characters)) {
      if (translationScoped) {
        // Safe to defer — Phase 5 rewrites this node to the target language and
        // folds the alignment fix into that bridge, which is Latin-safe by then.
        return; // log as deferred
      }
      // No Phase 5 coming: bridging now would make the text invisible. Leaving it
      // misaligned is at least visible and honest — flag it instead (see Failure
      // Protocol below).
      return; // flag for manual review
    }
    // Latin-script text — bridging is safe, Inter renders it fine.
    const sid = (node.textStyleId && node.textStyleId !== figma.mixed) ? node.textStyleId : '';
    let style = 'Regular';
    try { if (node.fontName !== figma.mixed && node.fontName.style === 'Bold') style = 'Bold'; } catch (e2) {}
    node.fontName = { family: 'Inter', style };
    node.textAlignHorizontal = toAlign;
    if (sid) node.textStyleId = sid;
  }
}
```

This is why Phase 0's scoping question matters concretely, not just organizationally: **whether Phase 5 is coming determines whether an unloadable-font alignment fix can be deferred (safe) or must be flagged (no safe fix exists yet)**. `phase1-mechanical-flips.js` takes a `TRANSLATION_SCOPED` flag for exactly this — set it from whatever Phase 0 decided.

### Absolute-positioned children inside auto-layout frames are invisible to Phases 1 and 2

A child with `layoutPositioning: 'ABSOLUTE'` opts out of its parent's auto-layout algorithm entirely — it sits at literal `x`/`y` coordinates instead. This means **nothing else in this skill touches it**: flipping the parent's `primaryAxisAlignItems`/`counterAxisAlignItems` doesn't move it, and Phase 2's child-order reversal doesn't either (`insertChild` reorders the auto-layout flow; an absolute child isn't part of that flow to begin with). Found via production testing: a decorative "highlighter scribble" behind an icon stayed at its original RTL-era coordinates while the icon itself flipped to the other side during Phase 1/2, leaving the decoration floating in the wrong spot with no error or warning.

**Detect it:** scan for `node.layoutPositioning === 'ABSOLUTE'` where the parent has `layoutMode !== 'NONE'`.

**Check rotation before choosing a formula — this is not optional.** A rotated absolute node's `x`/`y`/`width`/`height` describe its *unrotated local* bounding box, not its true on-screen footprint. Mirroring position alone (`x = parent.width - x - width`) on a rotated node produces a plausible-looking but wrong result: the bounding box moves to a mathematically-mirrored spot, but the rotation is untouched, so a shape meant to decorate an icon ends up detached from it with a visible gap, not overlapping it. This exact bug shipped in production testing before being caught against a same-structure reference — the math looked reasonable and there was no error, just a wrong result.

```js
if (node.rotation === 0) {
  // Simple case — see the position-only formula below.
} else {
  // Rotated — must use the full matrix mirror. Do not use x/width alone.
}
```

**Case A — rotation is 0:** the simple position mirror is correct and sufficient:

```js
const newX = parent.width - node.x - node.width;
node.x = newX;
```

This is a straight linear reflection, so it correctly handles decorations that deliberately bleed off an edge (a common "highlighter" effect) — an element overflowing the right edge by 20px mirrors to overflowing the left edge by 20px, not to some clamped in-bounds position.

**Case B — rotation is non-zero, and the shape itself should visually mirror** (a decorative/organic mark like a hand-drawn highlighter scribble, where the whole composition — icon plus its decoration — is meant to read as reflected): mirror the full transform matrix, not just position. For `relativeTransform = [[a,b,tx],[c,d,ty]]` and parent width `W`:

```js
const [[a, b, tx], [c, d, ty]] = node.relativeTransform;
node.relativeTransform = [[-a, -b, W - tx], [c, d, ty]];
```

This flips position and orientation together in one atomic write — it correctly handles any rotation angle without needing to separately detect or negate the angle. **Compute this from the original, untouched, source-direction transform** — not incrementally from a copy that may have already been touched by an earlier (possibly wrong) fix attempt. If a same-structure reference in the source direction exists, read its `relativeTransform` directly rather than reconstructing one.

**Case C — rotation is non-zero, but the shape must keep its canonical orientation** (a non-directional icon or glyph that happens to be rotated for an unrelated reason — checkboxes, ×, brand marks, per Core Principle 4): reposition only, without flipping orientation. Use the rendered bounding box (`node.absoluteRenderBounds`, converted to parent-relative coordinates), not the raw unrotated `x`/`width`, since those don't represent the true on-screen footprint once rotation is involved. Leave `a`, `b`, `c`, `d` untouched; adjust only the translation so the rendered footprint lands in the mirrored spot.

**Case D — the node is a directional icon that's also absolutely positioned** (a rotated arrow or chevron): this needs both Phase 3's directional-icon mirror and Case B/C's positional handling. Coordinate between the two phases so the same node isn't mirrored twice — the full-matrix approach in Case B likely already produces the correct result for a directional icon, since it flips both position and orientation in the same operation Phase 3 would otherwise do separately.

**Not everything absolute needs mirroring at all** — check each one before applying any of the above:
- A decoration or icon clearly offset toward one side → mirror it (Case A/B/C per its rotation and type).
- Something already centered (the formula is a no-op here, but skip the write) — e.g. a horizontal drag-handle bar centered at the top of a sheet.
- A small interior shape whose overflow is roughly symmetric already (a background blob 1–2px wider than its container on each side) → no visible change either way, safe to skip.
- A fixed-position UI convention that's genuinely meant to stay put regardless of direction (e.g. a dismiss `×` pinned to a specific corner by design system convention, not by reading direction) → leave it.

**Verification is mandatory, not optional, for this category of fix.** Unlike most Phase 1 mechanical flips, a wrong absolute-position fix produces no error and no obviously-broken layout — it looks like a plausible design choice. Whenever a same-structure reference in the source direction exists, compare the fixed result against it side-by-side before considering the fix done. Don't rely on "the math checks out" alone.

---

### HUG-width nodes ignore `textAlignHorizontal`

When a text node is **HUG** width, it's sized exactly to its content — there's no internal space for alignment to visibly act on. Setting `textAlignHorizontal` on a HUG node inside a HORIZONTAL frame does nothing; position is controlled entirely by the **parent frame's** alignment properties, not the text node itself.

This matters most for VERTICAL auto-layout frames, where a HUG text node needs to actually shift left/right:

```js
for (const t of node.findAll(n => n.type === 'TEXT')) {
  const p = t.parent;
  if (!p || p.type !== 'FRAME' || p.layoutMode !== 'VERTICAL') continue;
  t.layoutSizingHorizontal = 'FILL';
  t.textAutoResize = 'HEIGHT';   // required alongside FILL, or text clips instead of wrapping
  t.textAlignHorizontal = targetAlign;
}
```

Do not apply this promotion to text nodes inside HORIZONTAL frames — there, the frame's own alignment properties already control position.

### The complementary case: FILL-width and multi-line text

For text nodes that are already **FILL** width, or that wrap across multiple lines, `textAlignHorizontal` *does* affect appearance — this is the case where setting it is both necessary and sufficient. Set it to the target direction's reading edge, but guard against overwriting text that's intentionally centered:

```js
const allText = node.findAll(n => n.type === 'TEXT');
for (const t of allText) {
  const p = t.parent;
  const isCenter = p && p.type === 'FRAME'
    && p.layoutMode === 'HORIZONTAL'
    && p.primaryAxisAlignItems === 'CENTER';
  t.textAlignHorizontal = isCenter ? 'CENTER' : targetAlign;
}
```

Without the `isCenter` guard, a bulk alignment pass will silently flatten deliberately-centered captions, empty states, and modals to the reading edge.

### VERTICAL auto-layout frames

Children in a `VERTICAL` frame are positioned horizontally by `counterAxisAlignItems`.

| Value | RTL | LTR |
|---|---|---|
| `'MIN'` | Wrong — lands left | Correct — left edge |
| `'CENTER'` | Keep if intentional | Keep if intentional |
| `'MAX'` | Correct — right edge | Wrong — lands right |

```js
for (const f of node.findAll(n => n.type === 'FRAME' && n.layoutMode === 'VERTICAL')) {
  if (f.counterAxisAlignItems === fromAxis) f.counterAxisAlignItems = toAxis;
}
```

---

## Phase 2 — Element Order Reversal

Figma renders children left-to-right on screen in array order — there is no native `dir` flip like HTML has. This means **the array itself must be reversed** when converting direction; alignment alone is not enough (this is the Horizontal Mirror Principle from SKILL.md, applied concretely).

**Automated heuristic — 2-child rows, small element + large content, plus `SPACE_BETWEEN` rows:** see `scripts/figma/phase2a-find-horizontal-layouts.js` (survey first) and `phase2b-auto-reverse-icon-rows.js` (apply). Run the survey first on anything you haven't seen the structure of yet — it flags variants and ambiguous rows before you touch them.

### Skipping a row's own decision must not skip its children

If a script explicitly decides to leave a specific row's own child order alone (e.g. a brand-logo-anchored header row that should never reverse), **that decision applies only to that row — it must still recurse into the row's children**, because a nested row inside it may need its own, independent reversal decision. A `return` placed before the recursive call — even when the intent is only "skip this row's own reversal" — silently skips the entire subtree. Found via production testing: a `[logo, Tabs, menu]` header row was correctly identified as brand-anchored and left unreversed, but the script's early-return also skipped the nested `Tabs` row entirely, leaving a "Chat"/"Search" toggle in its untouched source-direction order with no flag raised.

```js
// WRONG — skips the whole subtree, not just this row's own decision
function walk(node) {
  if (KEEP_AS_IS.has(node.id)) return;
  // ...decide/reverse this row...
  for (const c of node.children) walk(c);
}

// CORRECT — skip only this row's own reversal, still recurse
function walk(node) {
  if (!KEEP_AS_IS.has(node.id)) {
    // ...decide/reverse this row...
  }
  for (const c of node.children) walk(c);
}
```

### Hidden children make the size heuristic blind to real asymmetry

The small-element/large-content heuristic compares child *sizes* to guess which one is the icon. It doesn't check `visible`. A row can have two same-sized icon slots where only one is actually shown (a common pattern: a fixed icon-text-icon shape where one icon slot is a hidden spacer, present purely for layout symmetry) — the heuristic sees two "equal-size" children and treats the row as a symmetric bookend that doesn't need reversing, when it's functionally a single visible icon next to content and does need reversing, same as any other icon+content row. Found via production testing: a search field `[icon(hidden), text, icon(visible)]` kept its visible magnifying-glass icon at the reading-start edge of the *source* language after conversion, because the row was never reversed.

**Fix:** before applying the size heuristic, filter to only children where `visible !== false`. Evaluate symmetry/asymmetry on what's actually rendered, not on the full child list.

### Short source-language labels make the size heuristic blind, in a way that varies row-to-row within the same component

The size threshold (≤40x40 counts as "small") is tuned for icons, but a short enough text label falls under it too — and source-language length varies per row even when every row uses the *same* component. A checklist of profession names, day-of-week abbreviations, or short one-word labels ("Cash", "Bit") can have most rows render wide enough for the heuristic to tell icon from content correctly, while a few specific rows (whichever happen to have the shortest source-language text) render narrow enough that *both* children look "small," and the heuristic correctly flags those specific rows as ambiguous rather than guessing wrong.

**This is not a bug in the heuristic** — flagging ambiguous rows instead of guessing is exactly the intended behavior. **The bug is in how the flagged queue gets resolved.** Found via production testing: 13 out of 32 instances of the same `checkbox w text` component were flagged this way (their source-language labels — days of the week, short profession names — were short enough to trigger the blind spot). When resolving the flag, a *different*, non-flagged instance of the same component was checked (one whose label was long enough that the heuristic had already handled it correctly), concluded to need no change, and that conclusion was wrongly generalized to every instance sharing the same component name — leaving all 13 actually-flagged, actually-ambiguous rows unresolved and visibly inconsistent with their siblings.

**The fix, and the general rule this implies:** when resolving a flagged row, check the *specific flagged node* — its actual child IDs, actual current order — not a different instance that merely shares the same name or component. Two rows can share a name and still be in different states; "I checked one, they're probably all the same" is exactly the assumption that produces this bug. Once resolved, apply the decision to *only* the rows that were actually flagged with the same structure, verified individually or by explicit re-query (e.g. "find every `checkbox w text` row where the child order doesn't match the established convention"), not by name-match alone.

**Flag for manual review instead of auto-applying when:**
- 3+ children where a middle child is semantically fixed (e.g. a centered progress bar between back/skip)
- Children of similar size (can't distinguish icon vs. content by size alone)
- The row lives inside a `COMPONENT_SET` variant (see below — `insertChild` silently no-ops there)
- **A row you suspect might be a fixed-position exception** (see below) — flag it, do not resolve it by assumption

### The default for every row is reversal — "keep as-is" is a claim, not a safe fallback

It's tempting, on recognizing a familiar-looking row (a header with a profile icon and a menu icon, say), to reason "these icons are non-directional, so this row is probably fixed regardless of language" and move on without reversing it. **This is exactly backwards, and it produced a real bug in production:** a `[profile-icon, Tabs, menu-icon]` header was left unreversed on the reasoning that both icons were non-directional in shape — but shape-mirroring status (Core Principle 4) has no bearing on element order (Core Principle 3); those are answered by different phases. The row should have defaulted to reversal like any other, unless independently verified otherwise.

**"Keep as-is" requires the same evidence standard as "reverse it."** A row does not become a fixed-position exception because:
- it contains icons that are individually non-directional in shape (that's a Phase 3 property, irrelevant to Phase 2's question)
- the pattern "looks familiar" from other screens
- the current (unconverted) state happens to match the source reference — **this is not verification, it's circular**: comparing a node to its own untouched original only proves you haven't changed it yet, it says nothing about whether leaving it unchanged is correct

**What does count as verification:** a genuinely separate, designer-built reference in the *other* direction (not one you produced yourself by converting the same source) that shows the same component with the exceptional element genuinely fixed in place. If no such independent reference exists, flag the row for operator confirmation rather than resolving the question yourself by inference.

Also check `primaryAxisAlignItems`: if stuck at the "wrong" edge for the target direction, flip it so content groups from the correct edge.

For `SPACE_BETWEEN` rows in general (two groups at opposite edges): position 0 = trailing element for the target direction (typically action buttons in LTR), position 1 = leading element (typically primary content/label in LTR). Reverse this mapping for RTL.

### `WRAP` grids need a per-row reversal, not "leave alone" and not a full reversal

It's tempting to assume a wrapping grid's item order is just data order (a curated/priority sequence) and doesn't encode reading direction the way a single row does — this is **wrong**. RTL and LTR wrapping grids read in genuinely mirrored sequences per row, even though rows still stack top-to-bottom the same way in both directions.

Concretely, in a 2-per-row grid `[A(row1-left), B(row1-right), C(row2-left), D(row2-right)]`: RTL reads right-to-left within each row, so the reading sequence is `B, A, D, C` (B first, not A). Figma always renders array index 0 at the physical top-left position regardless of language — so if this array is carried unchanged into LTR, top-left (now the *first-read* position in LTR) still shows A, but A was the *second*-read item in the source. The reading sequence itself must be preserved; what flips is which physical position maps to "first."

**It is also not a full-array reversal.** Reversing `[A,B,C,D]` gives `[D,C,B,A]`, which is a different (also wrong) result. The correct transformation preserves row order (top-to-bottom) and reverses only *within* each row:

```js
function reverseWrapGridPerRow(row, itemsPerRow) {
  const children = [...row.children];
  const reordered = [];
  for (let i = 0; i < children.length; i += itemsPerRow) {
    const rowChunk = children.slice(i, i + itemsPerRow).reverse();
    reordered.push(...rowChunk);
  }
  reordered.forEach((child, i) => row.insertChild(i, child));
}
```

`itemsPerRow` isn't a property Figma exposes directly for a `WRAP` auto-layout frame — detect it by grouping children by `y` position (children with the same `y` are in the same row) before reversing.

**How to tell a `WRAP` grid from a `NO_WRAP` horizontal-scroll row that happens to have the same child count:** check `layoutWrap`. A `NO_WRAP` row whose children's total width exceeds the frame's width is a horizontal-scroll carousel — for that, a single full-array reversal is correct (it behaves like any other single row, just one the user scrolls through). A `WRAP` grid needs the per-row reversal above instead. Same child count and similar visual shape can hide which one you're dealing with — always check `layoutWrap` before deciding.

### Building a new row from scratch, RTL target

Append children in canvas left-to-right order, but design the sequence so the Hebrew first-read element is **appended last** (Figma renders array order left-to-right, so last-appended lands rightmost):

```
// Example: mortgage calculator track row
// Canvas append order:   [action] [payment] [rate] [margin] [amount] [track-name]
// Hebrew reading order:  track-name | amount | margin | rate | payment | action
// → append track-name last so it lands at the right (Hebrew first-read)
```

### `COMPONENT_SET` variant nodes: `insertChild` is silently blocked

When a node is a **variant** (direct child of a `COMPONENT_SET`), `insertChild` does **nothing** — no error, no reorder, just a silent no-op. This is a Plugin API restriction specific to variants.

**Detect it:** check `node.parent.type === 'COMPONENT_SET'` before attempting a reorder.

**Workaround:**

```js
if (variant.parent?.type === 'COMPONENT_SET') {
  variant.layoutMode = 'NONE';                 // 1. disable auto-layout so .x writes take effect
  const [first, second] = [variant.children[0], variant.children[1]];
  const originalX = first.x;
  first.x = second.x;
  second.x = originalX;                         // 2. swap positions manually
  variant.layoutMode = 'HORIZONTAL';            // 3. re-enable — Figma re-derives order from x
} else {
  variant.insertChild(0, variant.children[1]);  // regular FRAME — insertChild works normally
}
```

**Why the silent failure cascades:** if you assume the swap succeeded and then treat `variant.children[0]` as "the content frame," every downstream fix — alignment, badge anchoring, action-row reversal — silently runs on the wrong node. Always verify the reorder actually happened before building on top of it (next section).

### Identify frames by structure, not by index

After any reorder — or any operation whose success you can't guarantee (variant swaps, batch layout mutations) — never assume `children[0]` is the content frame:

```js
// WRONG — index assumption breaks silently if the reorder failed
const contentFrame = variant.children[0];

// CORRECT — find by structure
const contentFrame = variant.children.find(c => c.children?.length > 1);
const imageFrame   = variant.children.find(c => c !== contentFrame);
```

Apply this same defensive lookup after detaching an instance or cloning from an unfamiliar component, whenever the exact structure isn't already confirmed.

### Batch layout mutations can silently scramble child order

Figma's auto-layout engine can reorder nodes in the z-stack when layout properties (especially `counterAxisAlignItems`) are mutated across many nodes in a single loop. After batch Phase 1/2 fixes, verify the parent's child order against what's expected and restore it if scrambled:

```js
const expected = ['nodeId-title', 'nodeId-tag', 'nodeId-block' /* ...known correct order */];
const actual = parentFrame.children.map(c => c.id);
if (JSON.stringify(actual) !== JSON.stringify(expected)) {
  for (let i = 0; i < expected.length; i++) {
    const node = parentFrame.findOne(n => n.id === expected[i]);
    if (node) parentFrame.insertChild(i, node);
  }
}
```

---

## Phase 3 — Directional Icons

**This phase must actually be executed, every time — it is not implied by a clean Phase 1/2 run.** Mechanical alignment and element-order fixes say nothing about whether an icon's own shape still points the source-direction way. Found via production testing: a whole section's disclosure chevrons were left unflipped because Phase 3 was planned but never actually run — Phases 1 and 2 having gone cleanly created a false sense that the section was done.

Flip icons that imply a reading direction — arrows, chevrons, breadcrumb separators, carets — horizontally.

- Chevrons on a disclosure/expand affordance (a list row that navigates deeper, an accordion) point toward the reading-forward direction: **RTL→LTR**, `<` becomes `>`; **LTR→RTL**, `>` becomes `<`. Direction depends on which way the conversion runs — don't hardcode one mapping.
- `v` (expanded/down state) is not directional in this sense and stays as-is
- Arrows pointing left/right: flip
- Breadcrumb separators: flip

Do not flip: Close (×), plus (+), checkboxes, status indicators, brand logos, non-directional decorative icons.

```js
icon.rescale(-1, 1); // preferred — horizontal mirror
// or, if rescale is unavailable on the node type:
icon.relativeTransform[0][0] *= -1;
```

**Property-based detection (rotation, name keywords) is a rough filter — it is not sufficient on its own, and a clean scan is not proof there's nothing to fix.** A real directional icon can have `rotation === 0` on its wrapper frame and a fully generic name like `icons 24px` — its direction is baked into which vector artwork was used, not into a property any script can read. `scripts/figma/phase3-find-directional-icons.js` checks VECTOR/INSTANCE rotation *at the icon-wrapper level only* (not recursed into every internal path — internal construction geometry like star points or a symmetric `×`'s crossed rectangles naturally has non-zero rotation and produces overwhelming noise if checked directly) and uses word-boundary keyword matching (a naive substring match on `back` also matches inside `feedback`, producing hundreds of false positives on any screen with rating chips). Even with both fixes, **screenshotting representative list rows, nav headers, and expand/disclosure affordances directly is mandatory**, not optional, alongside running the script.

---

## Phase 4 — Structural Verification

Screenshot the mirrored frame **before any translation happens** — text is still source-language here, deliberately, so a layout bug and a translation bug are never debugged at the same time. Confirm:

- Text alignment matches the target direction (no stray nodes still on the old edge)
- Every reordered row has its elements on the correct side — this is where a missed Phase 2 row shows up most visibly (an avatar or icon on the wrong side)
- Directional icons point the correct way; non-directional icons are untouched
- `COMPONENT_SET` variants that needed the layout-off/`.x`-swap workaround actually reordered (re-check — see "Identify frames by structure" above)
- Child order wasn't scrambled by the batch Phase 1/2 passes (re-verify against the expected sequence if in doubt)

Report what changed and flag anything still needing manual review, before moving on to Phase 5.

---

## Phase 5 — Translation

Only if Phase 0 scoped this job as including translation. Not this skill's job to execute — run the `translate` skill now, last, against the frame just verified in Phase 4. See its `references/figma.md` for extraction, font-safe write-back (the Inter-bridge pattern for non-loadable fonts like SimplerPro), font selection for the target script, and overflow checking.

`translate`'s own overflow check is this job's final content-level verification — there's no Phase 6 here to re-check after it.

If Phase 0 scoped this job as direction-only, this phase doesn't apply — the job is done as of Phase 4.

---

## Detaching Instances (only when explicitly approved)

Detaching is forbidden by default (see SKILL.md guardrails) — this section only applies once the operator has explicitly approved it for a specific job.

Detach **top-down** — parent before children. Detaching a parent reassigns new IDs to all its children; a bottom-up pass will throw "node not found" on those now-stale IDs. Detach fully before any child reordering — Figma blocks `insertChild` inside live instances.

```js
async function detachTopDown(node) {
  if (node.type === 'INSTANCE') {
    node = node.detachInstance();
  }
  if ('children' in node) {
    for (const child of [...node.children]) {
      await detachTopDown(child);
    }
  }
}
await detachTopDown(rootNode);
```

---

## Failure Protocol (Figma specifics)

When a step cannot be completed:

1. Apply a **red stroke** to the affected frame:
```js
frame.strokes = [{ type: 'SOLID', color: { r: 1, g: 0, b: 0 } }];
frame.strokeWeight = 3;
frame.strokeAlign = 'OUTSIDE';
```

2. Add an **annotation text node** — as a sibling, never inside the frame's auto-layout flow:

```js
// Option A — sibling on canvas, outside the frame
const note = figma.createText();
await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
note.characters = 'ISSUE: <description>';
note.x = frame.x + frame.width + 16;
note.y = frame.y;
note.fills = [{ type: 'SOLID', color: { r: 1, g: 0, b: 0 } }];
figma.currentPage.appendChild(note);

// Option B — absolute-positioned child inside the frame (does not enter auto-layout flow)
const note2 = figma.createText();
await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
note2.characters = 'ISSUE: <description>';
note2.layoutPositioning = 'ABSOLUTE';
note2.x = 8; note2.y = 8;
note2.fills = [{ type: 'SOLID', color: { r: 1, g: 0, b: 0 } }];
frame.appendChild(note2);
```

3. Do not attempt further workarounds once flagged — let the operator decide.

---

## Complete Operations Reference

| # | Phase | Operation | RTL→LTR | LTR→RTL | Auto or Judgment |
|---|---|---|---|---|---|
| 1 | 1 | Text alignment | RIGHT → LEFT | LEFT → RIGHT | Auto |
| 2 | 1 | HORIZONTAL frame `primaryAxisAlignItems` | MAX → MIN | MIN → MAX | Auto |
| 3 | 1 | VERTICAL frame `counterAxisAlignItems` | MAX → MIN | MIN → MAX | Auto |
| 4 | 1 | Padding swap | left ↔ right | left ↔ right | Auto |
| 5 | 1 | Horizontal constraints | MAX ↔ MIN | MAX ↔ MIN | Auto |
| 6 | 1 | HUG-width text in VERTICAL frames | Promote to FILL + set align | Promote to FILL + set align | Auto |
| 7 | 1 | FILL-width / multi-line text alignment | Set RIGHT → LEFT (unless centered) | Set LEFT → RIGHT (unless centered) | Auto |
| 8 | 1 | Absolute-positioned children in auto-layout frames | Mirror x across parent width, where genuinely offset | Mirror x across parent width, where genuinely offset | Judgment |
| 9 | 2 | **Element order (single/`NO_WRAP` horizontal rows)** | **Full-array reverse** | **Full-array reverse** | Auto heuristic + judgment |
| 10 | 2 | **Element order (`WRAP` grids)** | **Reverse within each row, row order preserved** | **Reverse within each row, row order preserved** | Judgment |
| 11 | 3 | Directional icons | Mirror | Mirror | Judgment |
| 12 | — | Tab / default-selection order | Primary → left | Primary → right | Judgment |

Translation and font operations live in the `translate` skill's own operations reference, not here.

---

## Checklist

- [ ] **Job scope confirmed at Phase 0**: direction change, translation, or both — asked explicitly, not assumed
- [ ] Direction confirmed (RTL→LTR or LTR→RTL) before starting
- [ ] Component instances checked for a `direction`/`Language`/`RTL/LTR` property before manual edits
- [ ] Text alignment flipped (exceptions: timestamps, numerics, center-aligned)
- [ ] Alignment on unloadable-font, source-script text handled correctly: deferred to Phase 5 if translation is scoped in, flagged (not bridged) if not — never blindly bridged to Inter, which renders Hebrew/Arabic invisible
- [ ] Absolute-positioned children inside auto-layout frames surveyed (`phase1b`) and reviewed individually — mirrored where genuinely offset, left alone where centered/symmetric/fixed-by-convention
- [ ] Any rotated absolute-positioned child fixed via the matrix mirror or rendered-bounds reposition (Case B/C/D) — never the simple x/width formula, which is wrong for rotated nodes
- [ ] Any absolute-position fix verified against a same-structure reference in the source direction, where one exists — this category of bug produces no error and looks plausible even when wrong
- [ ] HORIZONTAL frames: `primaryAxisAlignItems` flipped where semantic
- [ ] VERTICAL frames: `counterAxisAlignItems` flipped where semantic (`MAX` for RTL, `MIN` for LTR, unless center)
- [ ] HUG-width text in VERTICAL frames promoted to FILL + `textAutoResize: HEIGHT`
- [ ] Asymmetric padding swapped
- [ ] Horizontal constraints flipped for non-auto-layout nodes
- [ ] **Every horizontal row's child order decided** — reversed, kept, or flagged — this is the step most often missed
- [ ] Every "keep as-is" row decision backed by independent verification (a separate designer-built reference), not by icon shape/directionality, "looks familiar," or comparing the node to its own untouched original — if no such evidence exists, it's flagged, not resolved
- [ ] Row size/symmetry judgments (auto or manual) made on **visible** children only — a hidden spacer icon can make a functionally-asymmetric row look like a symmetric bookend if raw child count/size is used instead
- [ ] Every flagged row resolved by checking **that specific node**, not a same-named/same-component sibling assumed to be representative — short source-language text can make some instances of an otherwise-identical component get flagged while others don't; resolve each flagged one, then re-query for any others sharing its actual (not assumed) structure
- [ ] Any "keep this row as-is" decision (e.g. brand-logo-anchored) still recursed into that row's children — a skip must apply only to the row's own reversal, never to its subtree
- [ ] `WRAP` grids identified separately from `NO_WRAP` scroll rows (check `layoutWrap` — same child count and shape can hide which one it is) and reversed within each row (not left alone, not full-array reversed)
- [ ] `COMPONENT_SET` variants handled via layout-off + manual `.x`, not `insertChild`
- [ ] Frames re-identified by structure (not index) after any reorder
- [ ] Child order re-verified after batch mutations (not scrambled)
- [ ] **Phase 3 actually executed for every frame** — not assumed unnecessary because Phases 1-2 went cleanly; those are independent checks
- [ ] Directional icons mirrored; non-directional icons left alone — verified by screenshotting actual list rows, nav headers, and expand/disclosure affordances, not by property-scan results alone (a directional icon can have `rotation === 0` and a generic name)
- [ ] Action buttons sit at the trailing edge for the target direction (left for LTR, right for RTL)
- [ ] No unapproved detaching; no unprompted master-component edits
- [ ] **Phase 4 structural verification passed — on source-language text — before translation starts**
- [ ] If job scope includes translation: `translate` skill run last, as Phase 5, only after Phase 4 passed clean
- [ ] Remaining issues flagged with red stroke + annotation, not silently left
