# Figma to Android Views guidance

This adapter guides an implementation contract. It is not a code generator and
does not cover Jetpack Compose.

## Translation principles

- Preserve the component's **structural intent**, not its raw node count. A
  Figma frame may map to several Android Views, several frames may map to one
  semantic container, and a purely editorial Figma frame may have no runtime
  counterpart.
- Record every material container mapping in the project contract. The mapping
  must name the production owner, its parent/child role, and any deliberate
  difference.
- Use Android density-independent units for dimensions. Preserve token meaning,
  padding, gap, alignment, sizing behavior, overflow, and state boundaries
  before chasing visual pixel parity.
- In Figma, use nested Auto Layout frames to represent normal container flow.
  Absolute positioning is reserved for a named semantic overlay; it must map
  to an intentional Android layering mechanism, not conceal a missing
  container relationship.
- Prefer the smallest Android layout mechanism that preserves the invariant;
  do not introduce a wrapper only to mimic Figma's layer count.

## Container and sizing map

| Figma construction | Android Views interpretation |
|---|---|
| Vertical auto-layout | Usually a `LinearLayout` with vertical orientation, or an existing project container that preserves ordered flow, padding, and gap. |
| Horizontal auto-layout | Usually a horizontal `LinearLayout`; use weights or constraints only when the fill behavior requires them. |
| FILL | `MATCH_PARENT`, weight, or a constraint determined by the parent. State the chosen mechanism in the contract. |
| HUG | `WRAP_CONTENT`, subject to Android text measurement and minimum touch-target rules. |
| Fixed size | Explicit dp only when the production surface truly needs a fixed dimension. |
| Overlapping/absolute layer | `FrameLayout` or another overlay mechanism only when layering is semantic (scrim, swipe affordance, badge), not as a shortcut around normal flow. |
| Variant | A named production state or branch. Do not collapse materially different states into an undocumented boolean. |

## Required difference checks

Before declaring parity, account for Android font metrics, system insets,
touch-target requirements, RTL layout direction, accessibility semantics,
dynamic content, and runtime-only states. These are implementation differences
when they affect the result; they are not reasons to silently edit Figma or
misrepresent the contract.

## Quality check

Can the contract trace each material container's parent/child role, layout
rule, state boundary, and deliberate difference without implying false
one-frame/one-view parity?
