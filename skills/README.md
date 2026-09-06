# Skills — resident index

Every skill, its tag, and when to reach for it. See `../STRUCTURE.md` for what a
skill is versus a format or framework, and `../CONVENTIONS.md` for the admission
checklist.

**Tags:** `craft` — produces or modifies a design artifact · `meta` — operates
on how design work is done, not on an artifact.

> Living index — updated on every admission (`CONVENTIONS.md` step 5). Q-63
> unit 2 (done): `ux-expert` → `frameworks/`, `new-component` split into the
> `product-component` format + this build skill, `render-html` packaged,
> cartridge-lifecycle skills archived. Unit 3 (pending): the Figma-cluster
> layered restructure — the rows below still reflect the flat set.

---

## Figma (craft)

A layered set — for a Figma task, start here and pick the leaf.

| Skill | Reach for it when… |
|---|---|
| `figma-build` | building **new** screens from scratch via the Plugin API (greenfield; no existing component to match) |
| `figma-ds-recreate` | **recreating** an existing component with real design-system library instances + bound tokens |
| `figma-borrow` | you need **one library atom** located, subscribed, and instanced |
| `figma-design-system` | organizing a whole Figma file **into** an atomic design system (scaffold, tokens, variables) |
| `figma-audit-structure` | auditing a frame for **layout/structure** problems (overflow, wrappers, missing auto-layout, hard pins) and fixing authorized findings |
| `figma-roundtrip` | moving a component **between HTML/CSS and Figma** in either direction |
| `figjam` | working on a **FigJam board** (whiteboard) — pages, grouping, sections |

## Web / HTML (craft)

| Skill | Reach for it when… |
|---|---|
| `rtl` | mirroring a screen's layout direction (RTL↔LTR) for Hebrew/Arabic, or reviewing RTL compliance |
| `new-component` | building a reusable UI component to the `product-component` format (see `../formats/product-component.md` for the shape) and wiring it into its host mockup |
| `render-html` | producing a fully self-contained single HTML file |
| `md-renderer` | building a markdown-driven HTML renderer (`.md` content layer + `.html` renderer) |
| `preview-server` | serving a project's HTML mockups with an auto-generated index |
| `screenshot-verify` | confirming a visual change to an HTML presentation actually landed, via headless screenshot |

## Content (craft)

| Skill | Reach for it when… |
|---|---|
| `translate` | translating/localizing copy while holding tone, register, and length (routes to Figma write-back) |
| `transcript-ingestion` | pulling decisions, questions, and rules out of meeting transcripts into a governed project |
| `pptx-to-context-md` | converting a `.pptx` into layout-aware Markdown an agent will reason over |

## Review (craft)

| Skill | Reach for it when… |
|---|---|
| `checklist-design` | reviewing a UI against published design checklists — audit (item-by-item) or critique (quick peer feedback) |

For a psychology-grounded UX critique (the 30 Laws of UX), see the
**`../frameworks/ux-expert.md`** framework — it's a decision lens, not a
procedure, so it lives with the frameworks.

## Image generation (craft)

| Skill | Reach for it when… |
|---|---|
| `brandkit` | generating premium brand-guideline boards, logo systems, identity decks (vendored, MIT) |
| `design-taste-frontend` | shipping a landing page / portfolio / redesign that doesn't look templated (vendored, MIT) |

## Meta

| Skill | Reach for it when… |
|---|---|
| `skill-creator` | authoring or revising a skill |
| `figma-conversion-skill-builder` | building a repeatable screen-conversion skill (desktop→mobile, DS→DS, LTR→RTL) by calibration |
| `figma-production-loop` | running a contracted Figma→production iteration with a change log and promotion gates |

---

*The Harness cartridge-lifecycle skills (`adopt`, `deploy`, `promote`, `prune`,
`migrate`, `wrapup`, `assess`, `gather`) were archived 2026-09-06 to
`principal/archive/harness-cartridge-skills/` — cartridge deployment is
Principal / federation method, not design craft.*
