---
name: strategic-deck
description: "Govern the production of structured knowledge artifacts — decks, reports, proposals, frameworks — using a layered document model. Use when a project produces a client-facing or stakeholder-facing structured deliverable that requires argument-level decisions to be locked before execution begins. Instantiates the universal layered deliverable governance in .harness/02_PRD.md §16 for the deck format."
---

# Format: Strategic Deck
## Structured Knowledge Artifact Production

This format governs any project producing a structured knowledge artifact — a deck, a report, a proposal, a framework. It defines the cartridge structure, layer model, governance rules, and AI behavior for this type of work.

It instantiates the universal principles in `.harness/02_PRD.md §16`. Those principles govern; this file provides the deck-specific mechanics.

---

## Structure

A strategic deck initiative lives in its own folder within a governed project. The initiative folder is flat — all layer files at the root, no governance subdirectory.

```
[project]/
├── .harness/              ← project-level governance (shared across initiatives)
│   ├── README.md
│   └── PROJECT.md
├── resources/             ← shared, project-level input material
└── [initiative]/          ← one folder per initiative
    ├── README.md          ← layer map for this initiative
    └── resources/         ← initiative-specific input material
```

### Initiative folder contents

| Artifact | Role |
|---|---|
| `README.md` | Layer map — file names, statuses, build tool, language notes |
| Layer files | Named to fit the project (see File Naming Reference below) |
| `resources/` | Input material specific to this initiative |

### README.md — Layer Map
The initiative README orients the folder: what each file is, what layer it holds, what its status is. File names are chosen per project — the README records the mapping.

### resources/ — Input Material
Holds two types of artifacts:

- **`author.md`** — the author's tacit knowledge, framings, and perspective. Populated before drafting the Rationale; archived once Layer 2 is complete.
- **Knowledge artifacts** — external sources: reading notes, research summaries, source audits. Named `[SourceName]_ReadingNotes.md`.

Shared input material that spans multiple initiatives lives at `[project]/resources/` instead.

---

## The Layer Model

Every deck project produces documents across multiple levels of abstraction. The core model has three layers; projects that produce client-facing content in a language other than the working language, or that require visual validation before build, will expand to five or six layers.

| Layer | Name | Language | File type | Role |
|---|---|---|---|---|
| 1 | Brief | English | `.md` | **Anchor layer** — consensus-gated |
| 2 | Rationale | English | `.md` | Argument structure and narrative logic |
| 2.5 | Content Normalization *(conditional)* | Client language | `.md` | Language adaptation; vocabulary lock |
| 3 | Design Conventions *(conditional)* | English | `.md` | Visual grammar before build |
| 3.5 | Slide Spec *(conditional)* | Client language + English | `.html` | Layout validation before execution |
| 4 | Execution | Client language | `.pptx` | The actual deliverable |

Layers 2.5, 3, and 3.5 are optional for simple projects but become essential when: the client-facing language differs from the working language; a brand system with specific constraints applies; or visual layout validation is needed before committing to a full build.

For full layer specifications, see `layers/`. Files are numbered in working order: `01_brief.md` through `06_execution.md`.

---

## Deck-Specific Governance Rules

### Positional commitments belong in the brief, not just in the rationale

If a sequencing or framing decision reflects a genuine intellectual position — not just a design preference — it belongs in the brief. A decision that lives only in the rationale is vulnerable to drift.

### The brief is the only layer that is consensus-gated

The rationale and execution can be updated by the project lead without formal consensus. The brief cannot. This is what makes the brief trustworthy as a north star.

---

## AI Behavior in This Format

These rules extend and specialize the universal behavior defined in `.harness/02_PRD.md §16.4`.

**The operator speaks freely; the AI routes.** The operator makes notes about any aspect of the deck — a strategic concern, a content adjustment, a copy preference, a design call — without naming a layer. The AI identifies the correct layer, fetches it, makes the targeted edit, and checks whether downstream layers are now stale. Layer navigation is never the operator's job.

**Identify the layer before producing output.** Before writing anything, name which layer the output belongs to and confirm it is consistent with the layers above.

**Flag positional drift explicitly.** If a request to update the execution or rationale implies a change to the brief, name it: *"This change implies a shift in our positional commitment to X — should we update the brief before proceeding?"*

**Do not produce execution-layer output without a rationale.** If asked to write slides before a rationale exists, propose building the rationale first. The exception is rapid prototyping clearly labeled as exploratory.

**Capture working session decisions at the right layer.** Distinguish between: execution decisions (stay in the rationale), positional commitments (go in the brief), and open questions (go in the brief's open questions section until resolved).

**Brief integrity.** Layer 1 records the client ask — it must not be editorialised with strategic framing, rationale, or studio argument. If a positioning idea or creative direction emerges during brief work, hold it for Layer 2. The brief is only accurate as long as it contains only what the client asked for.

**Avoid "not just X, Y" constructions.** This is a recognizable AI writing pattern that signals unnatural phrasing to a native reader. If contrast is needed, restructure to lead with the positive claim directly — use "X and Y" or reorder the sentence so the affirmative version is the main clause.

**When working on content or slide copy, load `craft/writing.md`.** The writing standards there govern how individual slides are written. Load it when the task is content normalization, slide copy review, or title work.

---

## File Conventions

- All internal working documents are written in **English**, in **Markdown** — with one exception: the Content Normalization layer (2.5) is written in the client-facing language by design.
- DOCX and PPTX are produced only when explicitly requested for client-facing or formal deliverable purposes.
- Each layer has its own file. Layers are never merged.
- The slide spec is a derived artifact — never edited in place.

### File Naming Reference

Names are proposed, not enforced. Choose names that fit the project — record the mapping in `README.md`.

| Layer | Proposed name | Notes |
|---|---|---|
| 1 — Brief | `BRIEF.md` | |
| 2 — Rationale | `RATIONALE.md` | |
| 2.5 — Content Normalization | `CONTENT_[LanguageCode].md` | Written in client language |
| 3 — Design Conventions | `DESIGN.md` | |
| 3.5 — Slide Spec | `SLIDESPEC.html` | |
| 4 — Execution | Project-specific | e.g. `Deck.pptx` |
| Author input | `resources/author.md` | |
| Knowledge artifacts | `resources/[SourceName]_ReadingNotes.md` | |

---

## Revision Log Protocol

Every Layer 1 and Layer 2 document carries a revision log at the bottom:

| Version | Date | What changed | Triggered by |
|---|---|---|---|
| v1.0 | [date] | Foundation commit | Working session |

"Triggered by" records whether the change came from a client conversation, an internal working session, new research, or a decision to resolve an open question. This makes the document's evolution legible to anyone resuming the project.

---

## Format History

This format was developed through practice, not theory. It should be treated as a living document — update it when the practice reveals something the protocol did not anticipate.

| Version | Date | What changed |
|---|---|---|
| v1.0 | June 2026 | Foundation commit. Original three-layer model (Brief, Rationale, Execution). |
| v1.1 | June 2026 | Expanded to six-layer model: added Layer 2.5 (Content Normalization), Layer 3 (Design Conventions), Layer 3.5 (Slide Spec HTML). Language rule documented. |
| v1.2 | June 2026 | Extracted from `Layered_Document_Governance_Protocol.md` into Harness `formats/` directory. Universal governance principles promoted to `HARNESS.md §19`. Deck-specific mechanics retained here. |
| v1.3 | June 2026 | Added "operator speaks freely; AI routes" principle to AI Behavior section. Reinforces `HARNESS.md §19.4` addition — layer navigation is never the operator's job. |
| v1.4 | June 2026 | Enriched Layer 3.5 (Slide Spec) with three-function model (layout validation / review artifact / build source of truth), editing rule (upstream-first for argument changes, direct-edit OK for execution-layer changes), pilot-first rule for Spec→PPTX transition, and Chrome Headless PDF generation note. Promoted from client project practice. |
| v1.5 | June 2026 | Added `resources/` directory to Cartridge Structure. Introduced `author.md` as a named artifact for the author's tacit knowledge, alongside existing knowledge artifacts. Renamed Knowledge Artifacts section to Resources. Updated File Naming Reference. Promoted from CTX Knowledge Share project practice. |
| v1.6 | 2026-06-28 | Updated references from `HARNESS.md §19` to `.harness/02_PRD.md §16` — universal layered governance principles promoted to product intent artifact as part of governance consolidation. |
| v1.7 | 2026-07-20 | Added Slide Writing Standards section: presenter-first title standard, content slide formula (title → hero → 3 bullets), and bullet distinctness rule. Added AI writing pattern note ("not just X, Y") to AI Behavior section. Promoted from a client proposal deck working session. |
| v1.8 | 2026-07-20 | Restructured from single file to directory. Layer descriptions extracted to `layers/`. Slide Writing Standards extracted to `craft/writing.md`. FORMAT.md retained as lean entry point. |
| v1.9 | 2026-07-20 | Renamed from "layered-deck" to "strategic-deck". Layer files numbered in working order (`01_brief.md` through `06_execution.md`). |
| v2.0 | 2026-08-03 | Restructured around initiative-level flat model. `.harness/` removed from initiative scope — governance lives at project level only. `02_INTENT.md` and `03_LAYERS.md` removed from cartridge; superseded by `README.md` at initiative root. File naming reference updated to proposed names (not enforced). Shared vs initiative-specific resources distinction introduced. |
| v2.1 | 2026-08-06 | Added Subtitle Standard to craft/writing.md: subtitle carries explanatory load when title is short or abstract. Added two new Patterns to Avoid: bottom conclusions (restating title/subtitle in the body's footer) and universalizing shortcuts (claims of universal truth without evidence). Added "For Research-Based Decks" section to layers/02_rationale.md: interpretive lens must precede evidence. Promoted from a benchmark presentation review. |

---

## Resources

Projects maintain a `resources/` directory at the project root for input material that feeds the Brief and Rationale.

### Author Input

`author.md` captures the author's own tacit knowledge — framings, examples, opinions, and perspective on the topic. It is the primary input when the deck's content lives in the author's head rather than in existing documents. Populate it before drafting the Rationale, loosely anchored to the arc already established in the Brief. Archive or retain for reference once Layer 2 is complete.

To populate `author.md` or any other document from tacit knowledge, run `skills/gather.md`.

### Knowledge Artifacts

External sources — reading notes, research summaries, source audits — that inform the Brief and Rationale but do not govern them. Each artifact should include:
- A clear statement of what the source is and its validation status
- A distinction between what can be used freely (frames, concepts) and what requires verification before citation (statistics, specific claims)
- Links to primary sources where available
