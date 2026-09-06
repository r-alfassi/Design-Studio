---
name: pptx-to-context-md
description: Converts a .pptx into a layout-aware Markdown file built for AI context, not human skimming — preserves reading order, column/row layout, titles, tables, chart data, and connector relationships instead of flattening a slide into a blob of text. Use this whenever a .pptx needs to be turned into text an agent will reason over (RAG ingestion, feeding slide content into a prompt, summarizing a deck, answering questions about a deck's content), or whenever the user asks to convert, extract, or "read" a PowerPoint into markdown/text/context. Runs on plain Node/TypeScript — no PowerPoint, no Python, no python-pptx required.
---

# PPTX → context-ready Markdown

## Why this exists (read before changing the approach)

A slide's meaning lives partly in its **spatial layout** — a title vs. a body
bullet vs. a callout box, two columns being compared side by side, a table
with a connector pointing at a risk note. Two common approaches lose that:

- **Naive text dump** (e.g. `markitdown`, or reading runs in raw XML z-order):
  flattens everything into a blob, loses reading order, loses which text was
  the title, drops tables/charts or leaves them as noise.
- **Full-fidelity parsing / rendering to images for vision analysis**: keeps
  the meaning but is slow and heavyweight — impractical when you need this
  for many decks or as a step in an agentic pipeline.

This skill's script (`scripts/pptx-to-md.ts`) sits in between: it walks the
PPTX's XML shape tree directly (a `.pptx` is just a zip of XML — no OOXML
rendering engine needed), and produces markdown where:

- **Reading order is computed from shape position** (top-to-bottom row bands,
  left-to-right within a row), not XML document order, which is z-order and
  frequently wrong for reading.
- **Every element is tagged with a role**: `[Title]` (rendered as the slide's
  heading), `[Left column]` / `[Right column]` / `[Middle column]` for
  multi-column layouts, `[Table]`, `[Chart type: ...]`, `[Connector: shape A
  -> shape B]`, `[Image: alt text]`, `[Group]`.
- **Tables and charts become structured data** (markdown tables), not dropped
  or captioned.
- **Spatial relationships are stated as words**, never raw coordinates —
  coordinates are meaningless to both a human and a model; "left column" or
  "connected to the table" is not.

## Running it

```bash
cd scripts && npm install   # first time only — installs adm-zip, fast-xml-parser, tsx
npx tsx pptx-to-md.ts /path/to/deck.pptx /path/to/output.md
```

Omit the output path to print to stdout instead of writing a file.

No Python, no PowerPoint installation, no `python-pptx` — just Node.

## Output format

```markdown
# deck_filename

## Slide 4: Q3 Regional Performance

**Layout:** multi-column

- [Left column] North America
  Grew 12% YoY, driven by enterprise deals...
- [Right column] EMEA
  Declined 3% due to currency headwinds...

[Table, Right column]
| Region | Revenue | YoY |
| --- | --- | --- |
| North America | $4.2M | +12% |
| EMEA | $2.1M | -3% |

[Connector: the table -> EMEA decline flagged as key risk for Q4 planning]

**Speaker notes:** ...
```

One `## Slide N: <title>` heading per slide. The title text is promoted out
of the body and used as the heading — either because it's an actual title
placeholder, or (fallback, since many decks use plain text boxes instead of
placeholders) because it's the topmost, largest-font text shape on the slide.

## When reading the output as an agent

- Bullets nested under a tag (`- [Left column] ...`) belong to that
  spatial/semantic group — don't treat items from different columns as
  sequential related points unless the text itself says so.
- `[Connector: A -> B]` means the deck literally drew an arrow/line between
  those two elements — treat it as an asserted relationship, not a
  formatting detail.
- A `[Group]` block's children are extracted from the group's own local
  coordinate space, so their internal order reflects the group's internal
  layout but the group itself is positioned as one unit on the slide (see
  Known limitations).

## Known limitations (don't silently over-trust these)

- **Groups**: child shape coordinates inside a `<p:grpSp>` are in the group's
  own local coordinate space, not the slide's. This script does not apply the
  affine transform to recover each child's absolute slide position — group
  contents are extracted in their internal XML order, not re-sorted by
  position. Good enough for "here's what's inside this group," not precise
  enough to claim exact reading order across group boundaries.
- **Freeform arrows used as visual connectors**: PowerPoint has two ways to
  draw an arrow — a real connector (`<p:cxnSp>`, glued to two shapes, IDs
  resolved to shape labels automatically) and a plain arrow-shaped autoshape
  dropped on the slide with no glue to anything. The script flags the latter
  as `[Connector / line shape]` with position only — it cannot infer which
  two shapes it's meant to relate without glue data. Treat these as a hint to
  look at what's nearby, not an asserted A→B relationship.
- **SmartArt and embedded OLE objects** (uri other than `.../table` or
  `.../chart`) are noted as `[Embedded object: unsupported type — not
  extracted]` rather than parsed. SmartArt in particular stores its real
  content in a separate `diagram` data part this script doesn't read yet.
- **Combo charts / secondary axes**: the script reads the first chart-type
  node found in `plotArea` and assumes every series shares the first series'
  categories. A combo chart (e.g. bar + line on separate axes) will only
  surface correctly if both series share the same category axis.
- **Column detection is a heuristic**, not layout-engine-accurate: it bands
  shapes into rows using vertical-overlap tolerance (>40%) and only labels
  Left/Middle/Right when a row has exactly 2 or 3 non-overlapping shapes.
  Dense or overlapping layouts may not get column labels — they'll still
  appear in position-sorted order, just without the explicit tag.

If you hit a deck where one of these limitations actually matters, don't
patch around it by hand — fix the extraction logic in `pptx-to-md.ts` and
re-run against `scripts/make_test_deck.js`'s fixture (or a real problem deck)
to confirm the fix generalizes.

## Files

- `scripts/pptx-to-md.ts` — the extractor. Single file, organized top-to-bottom:
  XML parsing setup → slide order/size → shape extraction by kind (text,
  table, chart, picture, connector, group) → reading-order sort + column
  labeling → markdown rendering.
- `scripts/make_test_deck.js` — generates a small fixture deck (title+bullets,
  two-column, table+callout+connector, chart) using `pptxgenjs`. Useful for
  regression-checking changes to the extractor without needing a real deck.
- `scripts/package.json` — pins `adm-zip`, `fast-xml-parser`, `typescript`,
  `tsx`, `@types/node` (and `pptxgenjs` as a devDependency, only needed to
  regenerate the test fixture).
