---
name: md-renderer
description: Design and build a markdown-driven HTML renderer — a pattern where a .md file is the editable content layer and a .html file is the renderer. Covers the markdown convention standard, parser design rules, and how to keep the content layer edit-safe.
version: 1.0.0
---

# MD Renderer
## Markdown-Driven HTML — Content/Renderer Separation

---

## Purpose

Establish a clean separation between **content** (a `.md` file, human-editable) and **rendering** (a `.html` file containing all layout and parser logic). The goal: any editor can modify content freely — adding sections, reordering items, changing text — without touching code and without risk of breaking the renderer.

This pattern applies wherever structured content needs to be maintained independently of how it's displayed: slide decks, product mockups, spec documents, benchmark reports.

---

## When to Use

- Building a custom HTML renderer for content that will be edited repeatedly
- Any deliverable where the operator maintains content separately from design
- When the same content structure will be reused across multiple projects or formats

---

## Core Design Principle

**The `.md` file must be edit-safe.**

An editor who knows markdown but has never read the renderer code should be able to:
- Add a new column by adding a new `###` block
- Edit any text field without worrying about reserved characters
- Reorder sections by moving markdown blocks
- Add or remove an image with standard `![](path)` syntax

If an editorial action requires knowing a parser rule, that rule is a design failure.

---

## The Markdown Convention

Use standard markdown constructs throughout. Their rendering semantics are defined by the HTML renderer, but the editorial action always has an obvious markdown interpretation.

| Markdown | Editorial meaning | Renderer maps to |
|---|---|---|
| `# Title` | Slide / screen / section title | Slide title — defines a new unit |
| `## Subtitle` | Supporting line under the title | Subtitle element |
| `### Label` | A repeating block unit | Column, step, or section — count determines layout |
| `![](path)` inside a `###` | Image for that block | Screenshot / image area for that column |
| `- item` or `* item` | A list of equal-weight items | Bullet list |
| `> text` | A highlighted or quoted statement | Pullquote / callout |
| Native GFM table | Structured comparison data | Table slide with header row styling |
| `---` | Slide / section boundary | Separator between top-level units |

### How `###` blocks scale

The renderer counts `###` blocks under a `#` slide and adjusts layout automatically:
- 2 blocks → 2-column layout
- 3 blocks → 3-column layout
- 4 blocks → 4-column landscape layout

Adding a new column means adding a new `###` block. No layout code changes needed.

### Image placement within a `###` block

The first `![](path)` inside a `###` block is the block's image. Everything else — before or after — is caption text. The editor doesn't need to know which line the image is on.

```markdown
### HSBC UK
![](../screenshots/hsbc-uk.jpg)
Money Trends: 19 spending categories, accessible directly from account overview
```

---

## Minimal `@` Directives

Reserve `@` directives for semantic anchors that have no markdown equivalent. Keep the list short — every directive added is a syntax rule the editor must learn.

Appropriate uses:

| Directive | Use for |
|---|---|
| `@footer` | A note or label anchored to the bottom of a slide |
| `@conclusion` | A closing statement that has distinct visual treatment |
| `@challengers` | A structured row of competitor chips (name + descriptor) |
| `@lines` | Cover slide meta-lines (client · date · project) |

Rules for `@` directives:
- Always single-value — never contain structured multi-part data
- Never use embedded inline delimiters (`|`, `//`) inside directive text
- One directive per line — no positional parsing

---

## Parser Design Rules

These govern how the `.html` renderer must be built to support the edit-safe principle.

**1. Infer slide type — never declare it**
Type is determined by what the slide contains, not by a label in the content. `###` blocks with images → screenshot columns. `###` blocks without images → section/summary. GFM table → table slide. Bullet list → content slide. No blocks → opener.

**2. Count `###` blocks to determine column count**
The renderer adapts. The editor just writes blocks.

**3. Never parse inline delimiters inside text fields**
Do not use `|` or `//` as data separators within a text value. Those characters appear naturally in prose. Use structural separators (new line, new `###`) instead.

**4. Avoid positional parsing**
If the meaning of a line changes based on whether it's the first or second line in a block, that's a hidden rule. The renderer must handle the image being before or after caption text, `@` directives in any order, and blank lines freely inserted between blocks.

**5. `none` means no image**
When a block intentionally has no image, use `![](none)` or omit the image entirely. The renderer treats both identically — showing a placeholder or nothing. Never require the editor to leave a positional blank.

**6. `## subtitle` must be the first line after `# title`**
The parser detects the subtitle by checking whether the slide body starts with `## `. If any content precedes it, it will not be recognised as a subtitle. This is a positional rule the editor cannot infer from the markdown alone — document it explicitly wherever this pattern is used.

**7. `@before-after` is the documented exception to rule 3**
This directive uses ` | ` and ` // ` as inline delimiters within each row. The exception is justified because the data is inherently pairwise-tabular and has no natural structural alternative. It must be listed as an explicit exception in any project that uses it — never leave an editor to discover it by trial and error.

**8. Type inference uses `some`, not `every`, for images**
A slide is typed as screenshots if *any* `###` block contains an image. Blocks without images become placeholder columns — not errors. This means a partially-illustrated slide degrades gracefully rather than breaking. Document this as intentional: omitting an image from a column is always safe.

---

## Slide Type Inference Reference

```
Has ### blocks with ![]() inside?         → screenshot columns (any block with image qualifies)
Has ### blocks, none with images?         → summary / section blocks
Has native GFM table?                     → table slide
Has bullet list / pullquote / paragraph?  → content slide
Has @lines?                               → cover slide
No content blocks?                        → opener (section divider)
```

---

## Applying to a New Project

1. **Stub the renderer first** — build `slidespec.html` (or equivalent) with type inference and the `###`-to-columns mapping before writing any content
2. **Write a minimal test `.md`** — one of each slide type — and verify the renderer handles all of them before the content author starts
3. **Document the `@` directives** in a comment at the top of the `.md` file — the full list, with one-line descriptions
4. **Never add a new delimiter rule** to an existing `.md` format without updating the renderer to be backward-compatible with old content

---

## Active Instances

| Project | File | Notes |
|---|---|---|
| Discount Benchmark | `projects/Discount/benchmark/presentation/SLIDESPEC.html` + `slides.md` | First implementation — fully migrated to `###` convention |
