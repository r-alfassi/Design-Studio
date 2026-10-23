# Figma auto-layout best practices — research notes

Research pass checking this skill's taxonomy and fix scripts against Figma's own
documentation and community consensus. Load this when a new scenario doesn't cleanly
match the taxonomy, or when a fix's correctness is uncertain — it's the "why" behind
several of the skill's rules, and the source patterns for techniques not yet in the
taxonomy.

---

## Confirmed alignments

**`figma.createFrame()` defaults to a white fill.** Officially documented: a new frame
has "white background, width and height both at 100." Confirms the skill's rule that any
programmatically created frame needs `fills = []` set explicitly unless a fill is
actually wanted — this isn't a quirk of one file, it's the documented default.
[createFrame — Plugin API](https://www.figma.com/plugin-docs/api/properties/figma-createframe/)

**Fill container is child-of-auto-layout only.** "Fill Container can only be applied to
child objects of auto layout frames" — not available for top-level frames. This is
exactly the precondition `fix-overflow.js` checks before attempting `MODE: 'FILL'` (throw
if the parent isn't auto-layout).
[Guide to auto layout](https://help.figma.com/hc/en-us/articles/360040451373-Guide-to-auto-layout)

**Instance override restrictions are documented, not a one-off bug.** "You can't override
position of any layers within the component, including items in an auto layout frame...
you'd need to either make the changes in the main component or detach the instance."
Confirms the Component Guardrail's premise: some properties (e.g. `layoutPositioning`)
are locked on instances by design, and the error we hit
(`"This property cannot be overridden in an instance"`) is expected behavior, not a bug
to route around. Figma itself offers "detach the instance" as an escape hatch — this
skill deliberately does **not** take that option, because detaching breaks the
design-system link. That's a considered stricter policy, not a factual contradiction.
[Figma Forum — can't override position of absolute positioned element within an instance](https://forum.figma.com/ask-the-community-7/can-t-override-position-of-absolute-positioned-element-within-a-component-instance-30517)

**The spacer-frame-with-FILL technique is a recognized pattern**, not something this
skill invented: "Add a spacer frame between elements and set it to fill the
container... useful when you need different gaps between items instead of one
consistent gap." This is the basis for `fix-auto-layout.js`'s `WRAP_RANGE` mode.
[How to use space between in a Figma auto layout — Delasign](https://www.delasign.com/blog/figma-auto-layout-space-between/)

---

## Gap found and promoted: constraints, not just position, decide `hard-pinned-position`

Figma's documented pattern for pinning a child to an edge inside an auto-layout frame is:

> Enable "Ignore auto layout" (`layoutPositioning: 'ABSOLUTE'`) **and** set its
> `constraints` (e.g. Bottom, or Left+Right) so it tracks that edge as the parent
> resizes.

This is a first-class, blessed pattern — not just an escape hatch for "I need manual
control." [Guide to auto layout](https://help.figma.com/hc/en-us/articles/360040451373-Guide-to-auto-layout),
[Auto Layout and Constraints in Figma — Medium](https://medium.com/@devwebdesigning/auto-layout-and-constraints-in-figma-a-clear-and-simple-guide-8808c2a3e7e7)

Before this research pass, `inspect.js` only checked raw x/y + `layoutPositioning` for
`hard-pinned-position` — never `constraints`. That meant a node that's `ABSOLUTE` with
*deliberately set* constraints (a genuinely, correctly anchored element) would be flagged
exactly the same as one left on Figma's default `MIN`/`MIN` constraints with no real
relationship to any edge. The first case is correct design; the second is the actual
defect. `inspect.js` now checks `constraints` and only flags nodes still on default
`MIN`/`MIN` — see the `hard-pinned-position` taxonomy row for the current detection
signal.

This also means there are now **two valid fixes**, not one, depending on what the
element actually needs:

| Situation | Fix | Script |
|---|---|---|
| Single-edge relationship (e.g. a badge that should track the bottom, a panel that should stick to a side) | Keep `layoutPositioning: 'ABSOLUTE'`, set the matching `constraints` | `fix-hard-pinned-position.js` |
| Needs to participate in *dynamic* distribution of leftover space among multiple flexible siblings (e.g. content that must grow/shrink between a fixed header and a fixed footer) | Bring into the auto-layout flow via a FILL flex-spacer | `fix-auto-layout.js` (`WRAP_RANGE`) |

Constraints alone can't reproduce the flex-spacer's behavior (absorbing whatever space is
left after fixed-size siblings) — it only tracks a fixed offset from an edge. Don't
reach for the heavier restructuring fix when a constraint change is enough, and don't
expect a constraint change to solve a problem that's actually about distributing leftover
space.

---

## Other things worth knowing (not yet promoted into the taxonomy)

- **`space-between` / spacing mode `Auto`** is Figma's built-in mechanism for spreading
  *all* children across the full axis with equal (or auto) gaps — this is what the
  original "Destination" root frame used between just header+footer before a middle
  child existed. It's the right tool for exactly 2 flow children that should sit at
  opposite ends; it stops being appropriate the moment a 3rd flow child needs a
  *different* gap on each side, which is exactly when the spacer-with-FILL technique
  takes over. Worth stating explicitly if a future audit is deciding between the two.
- **Redundant-wrapper detection could be broadened.** The community's own heuristic
  (via the "Auto Layout Cleaner" plugin) flags wrapper frames with "no fills, no
  padding, no effects" as clutter — a different signal than this skill's
  identical-dimensions check. The two are complementary; a future taxonomy pass could
  combine both signals to catch more cases (e.g. a wrapper that's slightly larger than
  its single child due to padding, which today's dimension-match check would miss).
- **Auto layout terminology shifted in 2025**: "auto layout direction" is now "auto
  layout flow," following the introduction of grid layout. Not functionally relevant to
  this skill yet, but worth knowing if a newer Figma UI screenshot uses different labels
  than older reference material.

## Sources

- [Guide to auto layout – Figma Help Center](https://help.figma.com/hc/en-us/articles/360040451373-Guide-to-auto-layout)
- [FD4B: Auto layout fundamentals – Figma Help Center](https://help.figma.com/hc/en-us/articles/31351261703063-FD4B-Auto-layout-fundamentals)
- [createFrame – Figma Plugin API docs](https://www.figma.com/plugin-docs/api/properties/figma-createframe/)
- [layoutPositioning – Figma Plugin API docs](https://www.figma.com/plugin-docs/api/properties/nodes-layoutpositioning/)
- [Can't override position of absolute positioned element within a component instance – Figma Forum](https://forum.figma.com/ask-the-community-7/can-t-override-position-of-absolute-positioned-element-within-a-component-instance-30517)
- [How to use space between in a Figma auto layout – Delasign](https://www.delasign.com/blog/figma-auto-layout-space-between/)
- [Absolute Position with Horizontal Fill – Figma Forum](https://forum.figma.com/ask-the-community-7/absolute-position-with-horizontal-fill-22548)
- [Auto Layout and Constraints in Figma — A Clear and Simple Guide – Medium](https://medium.com/@devwebdesigning/auto-layout-and-constraints-in-figma-a-clear-and-simple-guide-8808c2a3e7e7)
- [Auto Layout Cleaner plugin – Figma Community](https://www.figma.com/community/plugin/1608984541189092337/auto-layout-cleaner)
