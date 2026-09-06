---
name: new-component
description: "Build a reusable UI component as a self-contained four-file package (CSS/JS/preview/spec) and wire it into its host mockup. For vanilla HTML/CSS/JS mockup projects. Use when a UI element appears in more than one mockup, an inline implementation is complex enough to isolate, or a new screen element is built from scratch. The required shape is the product-component format; this skill is the procedure."
---

# new-component

Produce a component in the **`product-component`** shape (see
`formats/product-component.md` for the four-file standard, the four
non-negotiables, and the `spec.md` section list) and wire it into the host
mockup.

Targets **vanilla HTML/CSS/JS mockup projects**. Do not apply to framework
projects (React, Vue) without adaptation.

---

## Before starting

Read the most mature existing component in the project as a reference
implementation — its `preview.html` and `spec.md` set the bar.

## Procedure

1. **Determine placement** (per the format's placement table — domain-specific
   vs shared). Placement is structural and hard to change later; ask if unsure.
2. **Create the directory** `{target-path}/components/{name}/`.
3. **Write `{name}.css`** — file-level comment, `:root` block with only the
   tokens used, rules grouped by visual area, no logic.
4. **Write `{name}.js`** — one `render{Name}(config)`, destructure at top,
   `innerHTML` + `appendChild` for HTML, `addEventListener` for events, return
   a handle, no globals.
5. **Write `preview.html`** — load CSS/JS by the host's relative paths,
   auto-render with realistic data, redeclare any host classes it depends on,
   add variant toggles.
6. **Write `spec.md`** — the required sections in order (see the format).
   Design Rationale is the section that matters — capture *why* each decision
   was made.
7. **Wire into the host mockup**
   - `<link rel="stylesheet" href=".../components/{name}/{name}.css">` in `<head>`
   - `<script src=".../components/{name}/{name}.js"></script>` in `<body>`, before the main script
   - Initialize: `const handle = render{Name}({ … })`
   - Update trigger handlers to use the handle: `el.onclick = () => handle.open({ … })`
   - Remove the inline CSS/HTML/JS the component now owns
   - Delete any interim preview files created outside the component directory

## Related

- `formats/product-component.md` — the required shape this produces
- `render-html` — run after the component is complete to produce a
  dependency-free snapshot for sharing or embedding
