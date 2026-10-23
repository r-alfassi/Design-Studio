---
name: product-component
description: "The required shape of a reusable UI component in a vanilla HTML/CSS/JS mockup project — a self-contained four-file package (CSS, JS, preview, spec). Use when a UI element is extracted for reuse or independent editing. The build procedure is the new-component skill; this is the standard it produces."
---

# Format: Product Component

The deliverable shape for a reusable UI component in a **mockup-first project
using vanilla HTML/CSS/JS**. Not for framework projects (React, Vue) without
adaptation. The `new-component` skill is the procedure that produces this
shape; `render-html` produces a dependency-free snapshot of a finished one.

---

## The four-file package

Every component is a directory containing exactly four files:

| File | Role |
|---|---|
| `{name}.css` | All styles. Opens with a file-level comment (name, description, host project, layer). Includes a `:root` block with only the tokens this component uses. Rules grouped by visual area with `/* ── SECTION ── */` comments. No logic. |
| `{name}.js` | One `render{Name}(config)` function. Destructures `config` at the top. Injects HTML via `innerHTML` + `appendChild` — never CSS. Wires events via `addEventListener` — never `onclick="…"` in template strings. Returns a handle object (`{ open, close }`, `{ update }`, …). No `window.*` globals. |
| `preview.html` | Standalone harness. Loads CSS + JS by the same relative paths the host mockup uses. Auto-opens / auto-renders on load with realistic data (real names, amounts, dates — no foo/bar). Redeclares any host CSS classes it depends on in a `<style>` block. Toggle controls if the component has variants. |
| `spec.md` | See required sections below. |

## The four non-negotiables

What makes a component a component:

1. CSS is always a separate file — never injected as a JS string
2. JS exposes exactly one render function per component
3. The render function returns a handle — not globals
4. No `onclick="…"` attributes in HTML template strings

## `spec.md` — required sections, in order

| Section | Content |
|---|---|
| Purpose & Scope | What it is, what it is not, when to use, when not to use |
| Design Rationale | One subsection per non-obvious decision — lead with the decision, then why. **The most important section** — without it, solved problems get re-litigated. |
| Config API | Property tables for `render{Name}(config)` and every sub-object — type, required/optional, default, description |
| Usage | File-path convention, init snippet, common call patterns |
| Variants | Table: variant → how to achieve |
| Open Questions | Checklist of unresolved design decisions — a silently resolved decision is a future regression |
| Document History | Version / date / change table |

## Placement

| Scope | Path |
|---|---|
| Domain-specific | `{Domain}/{Area}/components/{name}/` |
| Shared across domains | `components/{name}/` |

Placement is structural and hard to change later — confirm before creating.

## The contract

`preview.html` is both a dev tool and a living contract: if it breaks, the
component is broken; if it renders correctly, the component is correct.
