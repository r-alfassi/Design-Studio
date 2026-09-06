# Translate — UI Microcopy Domain

> Read [`SKILL.md`](../SKILL.md) first — this file assumes the Core Principles and workflow defined there. Everything below is specific to the **UI microcopy** content domain: buttons, labels, form fields, chat messages, onboarding copy, notifications, error/empty states — the short, high-frequency strings that make up a product's interface.

This is a domain reference, not a medium reference — it applies the same way whether the UI lives in Figma, HTML, or React. Pair it with the relevant medium reference (`references/figma.md`, etc.) for the actual write-back mechanics.

---

## Principle 1: Match/approximate character count

UI containers are fixed-width far more often than free-flowing prose is. A button, a chip, a nav label, a table header — these have a size set by the source-language string, and the target-language translation inherits that size whether it fits or not.

**Guidelines:**

- Compare translated length to source length. As a rough guide, more than ~30–40% longer than the source is a real overflow risk in a fixed-width UI element; free-flowing paragraph text (a description, a long chat message) has much more headroom.
- Where a literal translation would overflow, prefer a **shorter natural equivalent** over a literal one. "I didn't receive a code" → "Didn't get it?" is a legitimate translation choice for a tight resend-link row, not a corruption of meaning.
- Never force an overlong literal translation into a container that can't hold it "because it's the most accurate word-for-word rendering." Flag it instead — a translation that clips or wraps unexpectedly is a worse user experience than a slightly-looser paraphrase.
- Some languages are systematically longer or shorter than others for equivalent meaning (German and Finnish tend to run long; Hebrew and Chinese tend to run short relative to English). Budget for this direction of drift rather than being surprised by it on every string.
- Numerals, dates, and codes (see `SKILL.md` Core Principle 3) don't count toward this — they don't translate at all, so their length is fixed regardless of target language.

**Check after writing, not just before**: predicting overflow from string length alone is unreliable across fonts and scripts (character width varies). Always verify the actual rendered result — this is `SKILL.md`'s Phase 4 (overflow check), not optional.

---

## Principle 2: Match/approximate tone of voice and register

UI copy has a deliberate voice — casual and playful in a consumer chat app, terse and neutral in an enterprise settings panel, warm and reassuring in an onboarding flow. Translation must preserve *that specific voice*, not just the literal meaning.

**Guidelines:**

- Identify the source's register before translating a single string: is this casual/conversational, neutral/functional, or formal/technical? Hold that register consistently across the whole screen — a screen shouldn't drift from casual to stiff halfway through just because different strings were translated independently.
- Casual chat copy translates to casual chat copy, even when a more literal rendering would be grammatically "more correct." "We're the most accepting out there! Vent all your frustrations on us" earns a translation that sounds like a person talking, not a translated legal disclaimer.
- Concise UI labels stay concise. Don't expand "Next" into "Proceed to the Next Step" because the target language's literal equivalent happens to be longer — find the target language's own idiomatic short form instead (this is Principle 1 and Principle 2 working together).
- Watch for register drift introduced by machine-literal translation patterns: overly formal connectives, unnecessarily complete sentences where the source used a fragment, or overly polite phrasing where the source was blunt/direct.
- When in doubt about a project's established voice, check the project's translation glossary (`SKILL.md` Core Principle 4) and any already-translated screens in the same flow — consistency with prior decisions usually outranks a "more accurate" alternative phrasing for one string in isolation.

---

## Checklist

- [ ] Register identified for this screen/flow before translating (casual / neutral / formal)
- [ ] Register held consistent across all strings on the screen — no drift
- [ ] Each translation approximates source length; large deviations flagged, not forced
- [ ] Overlong literal translations replaced with shorter natural equivalents where a container can't hold the literal version
- [ ] Rendered result checked post-write (not just predicted from string length)
- [ ] Consistent with the project's glossary and prior screens in the same flow, where one exists
