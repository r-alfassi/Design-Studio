---
name: figma-design-system
description: Organize an existing Figma file into a structured design system using atomic design layers (Foundations, Atoms, Molecules, Organisms, Templates). Generates scaffold, extracts tokens, creates variables, and migrates components.
---

# Figma Design System

A phased workflow for restructuring an existing Figma file into a layered design system. Assumes the atomic design framework (Primitives → Atoms → Molecules → Organisms → Templates) and a vertical section-based canvas layout.

## When to use

- Reorganizing an existing file with components into a formal design system
- Setting up a new design system page from existing UI work
- Auditing and structuring components that have grown organically

## Pre-flight: Decision Gates

Before starting, ask the user:

1. **Where do components currently live?** (which pages/sections contain the source components)
2. **Multi-platform split?** Does the product serve multiple user roles or platforms? If yes, ask for the role names (e.g., "Admin/User", "Fixer/Client"). This determines whether Molecules and Organisms sections need sub-columns per platform.
3. **Naming language** — Are component names in English, another language, or mixed? This affects classification.
4. **Scope** — Full system (tokens + components) or components-only? If full, we extract and create variables. If components-only, we organize without token extraction.

## Phase 1: Generate Scaffold

Create Figma sections stacked vertically on the target page:

- **01 — Foundations / Primitives** — Sub-frames for: Colors, Typography, Spacing Scale, Border Radius, Elevation/Shadows, Grid Definitions, Icon Guidelines
- **02 — Atoms** — Empty section for smallest components
- **03 — Molecules** — If multi-platform: create side-by-side sub-frames (Common / [Role A] / [Role B]). If single-platform: flat section.
- **04 — Organisms** — Same sub-frame structure as Molecules
- **05 — Templates** (optional) — For full-screen layout patterns

Section width: ~3600px. Sections use dashed-border placeholder frames with labels. Color-code platform sub-frames for scannability.

## Phase 2: Extract Tokens (Foundations)

Audit all component sections the user identified. Extract:

- **Colors** — Every unique solid fill and stroke color. Group into: Brand/Primary, Accent, Neutrals, Semantic (error/warning/success/info). Display as labeled swatches.
- **Typography** — All font families, weights, and sizes used. Organize as a type scale from largest to smallest with role labels (Display, Heading, Body, Caption).
- **Spacing** — All auto-layout itemSpacing, padding values. Filter to a clean 4px-based scale.
- **Border Radius** — All unique corner radius values. Filter to meaningful steps.
- **Elevation** — All drop shadows and blurs. Name by intensity (sm/md/lg).

Populate the Foundations section with visual documentation of these values.

## Phase 3: Create Variables

Create a "Primitives" Variable Collection with:

- **Color variables** — One per swatch, named `color/[group]/[scale]` (e.g., `color/purple/500`)
- **Spacing variables** — Named `spacing/[size]` (xs, sm, md, base, lg, xl, 2xl, 3xl)
- **Radius variables** — Named `radius/[size]` (none, sm, md, lg, xl, 2xl, full)

Bind each Foundation swatch/shape to its corresponding variable using `setBoundVariableForPaint` (for colors) and `setBoundVariable` (for radius/spacing).

## Phase 4: Classify Components

Audit all COMPONENT_SET and standalone COMPONENT nodes in the source sections. Classify each as:

- **Atom** — Cannot be broken down further (buttons, inputs, toggles, checkboxes, icons, avatars, badges, tags, dividers, individual indicators)
- **Molecule** — Combination of 2+ atoms into a functional group (form fields, search bars, nav items, tab bars, chat bubbles, date pickers, notifications)
- **Organism** — Self-contained interface section built from molecules (headers, navigation bars, cards, forms, modals, steppers, list sections)

Classification signals:
- Small size + single purpose → Atom
- Contains instances of other components → Molecule or Organism
- Would make sense as a full "section" of a screen → Organism
- Has a "platform/role" variant property → goes in Common (adapts via variant)

If multi-platform: also classify each Molecule/Organism as Common, [Role A], or [Role B] based on:
- Has platform-switching variant property → Common
- Name contains a role name → that role's column
- Used in both platform screens → Common
- Used exclusively in one platform's screens → that role's column

## Phase 5: Migrate Components

For each classified component:

1. **Test first** — Move ONE component to validate that instance connections survive (check `inst.mainComponent.parent` for all instances of that component across the file).
2. **Move in batches** — `section.appendChild(componentSet)` preserves all instance references within the same file.
3. **Position** — Stack components vertically within their target section/sub-frame with consistent spacing.
4. **Verify** — After each batch, count all INSTANCE nodes on the page and confirm zero have a null or removed `mainComponent`.

## Phase 6: Validate

Final checks:
- All instances across the file still reference their main components ✅
- Foundations swatches are bound to variables ✅
- Source sections are empty (or contain only deprecated/unused items) ✅
- Section heights accommodate their content ✅

## Key Rules

- **Never edit source files/sections** — only move components out of them
- **Moving within the same file preserves all instance connections** — instances track by internal ID, not canvas position
- **Tokens before components** — always extract and create variables before organizing components
- **Atoms are platform-agnostic** — platform splits only apply at Molecule level and above
- **Components with a platform-switching variant property are "Common"** — they serve both sides from one source of truth
- **Skip deprecated components** — anything marked "Not used" or deprecated stays in an archive section
