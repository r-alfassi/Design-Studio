---
name: figma-ds-recreate
description: Recreate an existing UI component in Figma using real design system library instances and tokens — not loose frames. This skill should be used when asked to recreate, rebuild, or reproduce a UI component from an existing source, ensuring all elements are real library component instances bound to design system variables. For greenfield screen building from a visual spec (no existing component to match), use figma-build instead.
---

# Figma DS Recreate

**This skill is for reconstruction** — rebuilding an existing component with proper library linkage and token binding. For greenfield screen building from a visual spec, use `figma-build`.

Produce a design composed entirely of real library component instances and design system tokens. Never use loose frames with manual fonts, hardcoded colors, or raw numeric values.

---

## Phase 0: Audit — Always Run First

Before touching anything, run a full audit of the component and present the findings. Never proceed to Phase 1 without completing this phase and receiving operator confirmation.

### 0.1 Extract design context, variable definitions, and dimension bindings

Run all three calls in parallel on the target node — do not wait for any one before firing the others:

1. `get_design_context` — layout, fills, text styles, spacing
2. `get_variable_defs` — the official token set to cross-reference against
3. `use_figma` with `scripts/audit-bound-variables.js` — dimension binding check via `node.boundVariables`

If the node is a section, fan all three out across each top-level child frame in the same parallel batch.

**Why all three must run together:** `get_design_context` serializes all dimensions as raw pixels even when a variable is bound — flagging them as unlinked produces false positives. `node.boundVariables` is the only reliable signal for dimension binding. Running the script in the same batch eliminates the mid-audit pause and produces a complete, verified report in one pass.

Cross-reference `get_design_context` and `get_variable_defs`:
- Every value written as a raw number or hex (no `var()` wrapper) where a token equivalent exists is **unlinked**
- Every value where no token equivalent exists is also **unlinked** — note both cases separately
- Spacing scale gaps (values between tokens or beyond the largest token) are high priority
- Cross-breakpoint inconsistencies (same element, different value or linking status across size variants) are auto-layout mismatches
- Do **not** flag dimension values (`width`, `height`, `cornerRadius`, `padding`, `gap`) as unlinked from `get_design_context` output alone — use `audit-bound-variables.js` results for those

**`audit-bound-variables.js` notes:**
- Replace `NODE_ID` with the target node's ID before running
- The script skips remote library instance internals (owned by the library, out of scope)
- It only flags `FIXED`-sized dimensions — `FILL` and `HUG` don't need a bound variable
- `boundVariables.fills[i]` is a `VARIABLE_ALIAS {type, id}` object — presence of the key means bound, absence means unbound
- When individual corner variables (`topLeftRadius` etc.) are bound, the `cornerRadius` shorthand reads as a raw number but is not a real issue — the script handles this correctly

### 0.2 Produce the linked-instances report

Output the report in this exact format — it is the only format for this phase:

**Format rules:**
- One link per issue — never group multiple issues under a single link
- The Figma link and its inline annotation are on the same line, separated by ` — `
- Issues are grouped by category, not by node or variant
- When a fix requires comparing two nodes (e.g. a cross-breakpoint mismatch), show both links as a pair under the same heading
- Figma node link format: `https://www.figma.com/design/[FILE_KEY]/[FILE_NAME]?node-id=[NODE-ID]` where the node ID uses dashes (`1234-5678`, not `1234:5678`)

**Category order:**
1. Unlinked color fills
2. Unlinked spacing — has a token equivalent but not linked
3. Unlinked spacing — no token equivalent exists (flag as off-scale)
4. Unlinked radius
5. Auto-layout mismatches (cross-breakpoint pairs)

**Example structure:**

```
## A — Unlinked Color

[Horizontal Stepper — LG](…?node-id=…) — `bg: #f2f5ff` raw, no exact token match; closest is the nearest surface token (`#f0f4fc`)

---

## B — Unlinked Spacing (has token equivalent)

[Mobile Header](…?node-id=…) — `gap: 8px` raw, should be `spacing/2x`

---

## C — Unlinked Spacing (no token equivalent)

[Desktop Header](…?node-id=…) — `gap: 12px`, no `3x` on the scale; closest are `2x`=8 and `4x`=16

---

## D — Unlinked Radius

[Horizontal Stepper — LG](…?node-id=…) — step pills `border-radius: 12px`, not on the radius scale (drill into the step sublayers)

---

## E — Auto-Layout Mismatches

Step-content gap — compare these two:

[Progress bar with content — LG](…?node-id=…) — `gap: 8px` linked to `spacing/2x`
[Progress bar with content — MD](…?node-id=…) — `gap: 10px` raw, no token, inconsistent with LG
```

### 0.3 Gate — stop and propose

After the report, always stop and ask:

> These are the remaining issues. Would you like me to fix them?

Do not proceed to Phase 1 unless the operator confirms. The operator may confirm all, select specific categories, or stop at the report.

---

## Scope Boundary

This skill operates only within the current file. It reads from remote libraries but never writes to them.

- **In-file issues** (loose frames, unbound tokens, default names, local component fills): fix directly.
- **Remote library issues** (unbound fills or missing tokens in an external component's source): flag only — report the component name, library, and what needs fixing. Do not attempt to modify.
- **Local instances** (`mainComponent.remote === false`): acceptable when the component is under review or not yet ready to publish. Note in the report; do not treat as a blocking error or force-detach.

---

## Phase 1: Recreate — Only After Operator Confirmation

### Step 1: Inspect the Source Component

Examine the source component thoroughly before doing anything else.

- View the thumbnail image to understand the visual structure
- Use `evaluate_script` to walk the layer tree: names, types, sizes, hierarchy
- Record every **layer name** exactly — these must be matched in the output
- Record **nesting depth** — count wrapper levels, note what contains what
- Record **visibility state** of every layer — hidden layers must be recreated, not omitted
- Extract all text content, font families, font weights, and font sizes
- Note colors (fills on text, backgrounds, borders)
- Note full auto-layout spec per frame: `layoutMode`, primary/counter axis alignment, gap, padding, wrap behavior, sizing modes (`layoutSizingHorizontal`/`layoutSizingVertical`)
- Note structural patterns: how many items, what repeats, what's unique

Build a complete inventory of every element before searching for library components — missing one means hardcoding it later.

## Step 2: Search the Design System Libraries

**Check for a library index first.** This skill is library-agnostic — it expects a per-project library index file (`libraries/<library-name>.md`: component table, `library-key`, `rtl-native` flag) but ships none of its own. Populate `libraries/` once this studio has its own indexed design-system library. If the project points at an index (in its `protocol.md` or PRD), look up the component key directly and skip the live search.

Note the `rtl-native` flag from the index — you will need it in Step 5.

**If there is no index**, run a live search:
- Use `assistant_component_search` with multiple queries covering different naming conventions (e.g. "avatar", "circle image", "thumbnail" for the same element)
- Search broadly first, then narrow — components may have unexpected names
- Fallback chain: the project's primary library → an RTL-native atom library (for target-script atoms) → all subscribed libraries
- Filter out components prefixed with `⛔` or `🚧` (internal atoms, not for direct use)
- For each candidate, note the `assetId` and `libraryName`

Common mappings to check:
- Circular images → avatar component
- Link-style text with arrows → button-text component (text button hierarchy)
- Cards/containers → card component
- Navigation dots → carousel component
- Icons → icon components from the Icons library

**Subscription check:** Before importing any component, verify the library is enabled in the Figma file. If not subscribed, surface this before proceeding:
> ⚠ Library not subscribed. In Figma: Main menu → Libraries → find "[library-name]" → Add to file. Then re-run.

Build elements as plain frames only when no library component exists — this should be the exception.

## Step 3: Inspect Each Candidate Component

For every library component planned for use:

- Import the component set: `await figma.importComponentSetByKeyAsync(key)`
- List all variants and their properties (variant options, sizes, states)
- Identify the exact variant needed (e.g. `Hierarchy="text button"`, `icon="Left"`, `size="SM"`)
- Get the variant's component key for importing
- Check component property definitions (text props, boolean props, instance swap props)
- Identify which nested nodes hold overridable text content

Using the exact variant key is required to get the correct visual result — guessing the variant or using the default produces the wrong output.

## Step 4: Build the Layout Frame

Create the container structure using `evaluate_script`.

**Naming:** Give every frame a semantic name matching the source layer name (e.g. `"card-header"`, `"text-body"`). Never leave Figma default names (`"Frame 329375235"`, `"Rectangle 12"`).

**Hierarchy:** Match the source's nesting depth exactly — no extra wrapper frames for convenience. If the source has 3 nesting levels, the output has 3.

**Auto-layout:** For every frame, set the full auto-layout spec to match the source:
- `layoutMode` (HORIZONTAL / VERTICAL)
- `primaryAxisAlignItems` and `counterAxisAlignItems`
- `itemSpacing` (bound to a spacing variable — see Step 7)
- `paddingTop`, `paddingRight`, `paddingBottom`, `paddingLeft` (each bound to a spacing variable)
- `layoutWrap` if applicable

**Sizing modes:** Set `layoutSizingHorizontal` and `layoutSizingVertical` on every frame explicitly (FIXED / FILL / HUG) — never rely on defaults.

DO NOT hardcode corner radius — bind to variables (see Step 7).
DO NOT hardcode fill colors — bind to color variables.
Set text direction for RTL content if needed.

## Step 5: Instantiate Library Components

For each element, import and create real component instances:

```js
const component = await figma.importComponentByKeyAsync(variantKey);
const instance = component.createInstance();
instance.name = "layer-name-matching-source"; // always rename
parentFrame.appendChild(instance);
```

**Sizing modes:** After appending every instance, explicitly set both axes:
```js
instance.layoutSizingHorizontal = 'FILL'; // or 'FIXED' / 'HUG' — match the source
instance.layoutSizingVertical = 'HUG';
```

**Visibility:** When the source has a hidden layer, create it and set `visible = false` — never omit it entirely. Hidden layers must exist to maintain structural parity across variants.

```js
instance.visible = false; // preserve structure, toggle visibility
```

- Resize instances if the library component is smaller than needed (e.g. avatar from 40px to 130px)
- To swap an instance to a different variant: `instance.swapComponent(targetVariantComponent)`

**RTL check:** If the source library is not RTL-native, apply the RTL skill to instances before finalizing. If the library is RTL-native, spot-check alignment and direction — no active transformation needed in most cases.

To override text inside instances:
- Find the text nodes: `instance.findAllWithCriteria({ types: ['TEXT'] })`
- Load their fonts before changing characters
- Set `characters` to the desired content

## Step 6: Apply Text Styles (Not Manual Fonts)

Every text node created must use a library text style — never set `fontName`, `fontSize`, or `lineHeight` manually.

```js
const style = await figma.importStyleByKeyAsync(styleKey);
textNode.textStyleId = style.id;
await figma.loadFontAsync(style.fontName);
textNode.characters = "Your text";
```

Pick the style matching the size and weight from the source component. Use the project's design-system text-style catalog (from `get_variable_defs` / the library's published styles) to resolve the exact style key.

## Step 7: Bind All Spacing, Colors, and Radii to Variables

Every numeric or color value must be bound to a design system variable.

**Token fallback rule:** When no token matches the source value exactly, use the closest available token — never escape to a raw hardcoded number. Document the deviation in a comment if precision matters.

For spacing/padding:
```js
frame.setBoundVariable('paddingTop', variableId);
frame.setBoundVariable('itemSpacing', variableId);
```

For corner radius:
```js
frame.setBoundVariable('topLeftRadius', variableId);
// repeat for all four corners
```

For color fills:
```js
const colorVar = await figma.variables.getVariableByIdAsync(variableId);
frame.fills = [figma.variables.setBoundVariableForPaint(
  { type: 'SOLID', color: {r:1, g:1, b:1} },
  'color',
  colorVar
)];
```

Resolve variable IDs from `get_variable_defs` on the target file; bind to the token whose value matches (or is closest to) the source value.

## Step 8: Verify

Before reporting completion, check every item:

1. **Library subscription** — all libraries used are enabled in the Figma file
2. **Library instances** — `node.findAll(n => n.type === "INSTANCE")`: check `mainComponent.remote` on each
   - `remote === true` → linked to external library ✓
   - `remote === false` → file-local component. This is acceptable when the component is intentionally under review or not yet ready to publish. Do not force-detach or flag as a blocking error. Note it in the report.
3. **Text styles** — no text nodes have manual `fontName`/`fontSize` without a `textStyleId`
4. **Bound variables — frames and components** — all FRAME/COMPONENT nodes have `boundVariables` for padding, spacing, fills, and radii. Use `section.findAll(() => true)` for deep traversal rather than stopping at instance boundaries.
5. **Bound variables — fills on instances** — reading `fill.boundVariables?.color` on an INSTANCE node does not reflect bindings in the source component. Audit fills on instances using this approach:
   - Read `instance.fills` — if unbound, check `instance.mainComponent.fills`
   - If the source component fill IS bound: no action needed; the instance inherits it
   - If the source component fill is ALSO unbound and the component is **local** (file-local): fix the fill binding on the source component directly
   - If the source component fill is unbound and the component is **remote**: out of scope — note it and flag for the library owner to fix
6. **Layer names** — no node has a default Figma name (`Frame XXXXXXX`, `Rectangle N`, `Group N`); all names match the source layer names
7. **Hierarchy** — nesting depth matches the source; no extra wrapper frames introduced
8. **Auto-layout spec** — all frames have explicit `layoutMode`, alignment, and sizing modes set
9. **Visibility** — hidden elements are present and set to `visible = false`, not absent
10. **Sizing modes** — every frame and instance has explicit `layoutSizingHorizontal` and `layoutSizingVertical`
11. **Screenshot** — take `await node.screenshot()` and compare against source for visual accuracy
12. **Report** — count of remote library instances used; list any local instances and remote unbound fills as non-blocking notes

## Important: Do Not Use create_design or edit_design

The design agent (`create_design` / `edit_design`) produces visually correct designs but creates everything from scratch — plain frames, manual fonts, hardcoded colors. It does not import library components or bind variables.

To recreate components with real library linkage, always use `evaluate_script` with `importComponentByKeyAsync` and `importStyleByKeyAsync`.
