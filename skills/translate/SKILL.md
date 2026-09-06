---
name: translate
description: Translate text content between languages while preserving tone, register, and approximate length. Medium-agnostic principles here; routes to Figma implementation (font-safe write-back, overflow checking) in references/. Use whenever asked to translate or localize copy — independent of whether a layout-direction change (RTL/LTR) is also needed.
version: 1.0.0
---

# Translate — Content Localization

## Purpose

Translate text content from one language to another, preserving tone/register and approximating source length so it doesn't overflow its container. Covers medium-agnostic principles and workflow here; tool-specific write-back mechanics live in `references/`.

## When to Use

- Translating copy in a design file, document, or codebase from one language to another
- Localizing an existing screen for a new market
- Reviewing existing translations for tone, register, or length problems

This is a standalone concern from layout direction. Translating Hebrew→English often accompanies an RTL→LTR conversion (see the `rtl` skill), but the two are independent: you can translate into a same-direction language (English→French) with no layout change, or change layout direction with no new copy (re-flowing an existing English screen into RTL for an Arabic market before translation is even ready).

If a job needs both, do the layout mirroring first (via the `rtl` skill), then translate last, then do one final verification pass covering both — see `rtl/SKILL.md`'s workflow for how the two compose.

This skill's references split along two independent axes — pick both that apply to the job:

## Tool-Specific References (medium — how to write the translation back safely)

- **Figma** → `references/figma.md`
- **HTML / React** → not yet written; extend when the need arises (string extraction differs by framework, but the domain references below carry over unchanged)

## Content-Domain References (domain — what makes the translation itself good)

- **UI microcopy** (buttons, labels, chat, onboarding, notifications) → `references/ui-microcopy.md`
- Other domains (marketing copy, legal/compliance text, documentation) — not yet written; add a new domain reference when the need arises rather than overloading `ui-microcopy.md` with conventions that don't apply to UI strings

A typical job (translating a Figma UI screen) loads both: `figma.md` for the write-back mechanics, `ui-microcopy.md` for what a good translation looks like in that domain.

---

## Core Principles

These apply across every domain; domain references add the concrete, situational depth on top.

### 1. Preserve tone and register

Casual copy stays casual; formal labels stay concise and formal. Don't flatten a playful chat message into a stiff literal translation, and don't embellish a terse label into a sentence. See `references/ui-microcopy.md` for the UI-specific depth on this.

### 2. Approximate source length

Target-language text that's much longer or shorter than the source risks overflow or awkward whitespace in fixed-width containers. Where a natural equivalent doesn't fit, prefer a shorter phrasing over a literal one — and flag rather than force an overlong string into a container that can't hold it. See `references/ui-microcopy.md` for the UI-specific depth on this.

### 3. Some content never translates

Numbers, currency amounts, phone numbers, dates, URLs, code, and proper nouns generally stay as-is (proper nouns may transliterate rather than translate — e.g. a person's name). Timestamps and single icon/emoji characters are not translation targets at all.

### 4. Maintain a translation glossary for a recurring project

For any project with more than a handful of screens, keep a running glossary of already-decided translations for common UI terms (Save, Cancel, Delete, Search, etc.) and product-specific terms (feature names, role names). Reuse it — do not re-derive the same term differently across screens. Store it in the project's own notes, not in this skill (this skill stays project-agnostic).

---

## Workflow — execute in order

### Phase 1: Extract

Pull every translatable text node/string from the target scope, with a stable identifier for writing back later.

### Phase 2: Build the translation

For each string:
1. Translate maintaining tone/register (Core Principle 1)
2. Check against the project's glossary (Core Principle 4) for previously-decided terms
3. Approximate source length (Core Principle 2); prefer a shorter natural phrasing if the literal translation would overflow
4. Skip non-translatable content (Core Principle 3) — do not write over numbers, codes, timestamps, or icon glyphs

### Phase 3: Write back

Write the translated strings back using the medium's safe write procedure (see the tool-specific reference — this is where font-loading and encoding gotchas live).

### Phase 4: Overflow check

After writing, check every translated node/element against its container's constraints. Flag (don't silently leave) any node where the new text visibly overflows, wraps unexpectedly, or clips.

---

## Guardrails

1. If the same shared text (a component instance, a repeated string, a shared copy block) appears in multiple places being translated in one batch, translate the shared source once and let instances inherit it — don't translate each occurrence independently, which risks divergence.
2. Don't guess at ambiguous source strings (truncated text, placeholder-looking content) — flag and ask rather than inventing a plausible-sounding translation.
3. Don't overwrite a string that's already in the target language (partial re-runs on a mixed-language file should be idempotent — check before writing).

## Failure protocol

When a string can't be safely translated or written back (ambiguous source meaning, a write that fails and has no safe fallback):

1. Flag it visibly in the medium (a marked frame in Figma, a TODO/comment in code).
2. Note what's blocking it.
3. Don't guess past it — leave it for the operator.
