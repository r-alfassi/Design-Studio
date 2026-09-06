# Gotcha catalogue — template and standard

This is a template for the `references/figma.md` (or similarly-named) file that every screen-conversion skill built via this meta-skill should have. It is not itself a gotcha list — it's the standard to write one against. A mature screen-conversion skill's own `references/figma.md`, once it has accumulated ~15-20 real entries, is the worked example to follow.

## Why this file exists separately from SKILL.md

`SKILL.md` should stay readable as a procedure — a phase's prose mentions a gotcha exists and cross-references it by number, but doesn't carry the full symptom/cause/fix writeup inline. That detail lives here, where it can grow without bloating the thing someone reads top-to-bottom to understand the procedure's shape.

## Entry format

```
### G<n> — <one-line summary of the failure, phrased as what goes wrong, not the fix>

<What actually happens — the concrete, observable symptom. Include what the wrong
state looks like (a number, an error message, a rendered artifact) so a future
reader can pattern-match against it without having re-derived the underlying
cause themselves.>

**Fix:** <the concrete correction, stated as an instruction, not just a description
of what "correct" looks like.>
```

Optional but valuable when applicable:
- **Why it's easy to miss**: screenshots, coincidental-looking-correct values, and silent no-ops (a property assignment that doesn't error but also doesn't take effect) are the recurring shapes of "easy to miss" in this domain — name which one applies.
- **How many instances it hit**: a gotcha found on one in thirty screens reads differently from one found on twenty-one in thirty. If you have the count, include it — it tells a future reader how seriously to weight re-checking for it.
- **Related gotchas**: cross-reference by number if two entries are variations of the same underlying mistake (e.g. an axis-naming confusion that recurs in three different specific contexts) — don't just duplicate the explanation three times.

## What counts as gotcha-worthy (add an entry) vs. not (just fix it and move on)

Add an entry when:
- The mistake could plausibly recur — a naming convention that varies per-instance, an axis or property that's easy to confuse with its sibling, an ordering dependency between two operations, a case where "looks correct" and "is correct" diverge.
- It cost real debugging time to find, even if the fix itself is one line.
- It's specific to this component/pattern/design-system convention, not a one-off typo in a single script.

Don't add an entry for a plain coding mistake with no recurrence risk (a typo, a wrong variable name) — that's just a bug, not a gotcha. The catalogue is for durable knowledge about the *domain*, not a changelog of every mistake made while building it.

## Numbering and lifecycle

- Number sequentially as found; don't renumber existing entries to make room for a new one found later (append it at the current highest number, even if it fits topically near an earlier entry) — cross-references from `SKILL.md` and other entries point at these numbers, and silently renumbering breaks them.
- If a later finding fully supersedes an earlier entry (the earlier one was based on a misdiagnosis), don't delete the old entry — mark it corrected, explain what was actually true, and keep both visible. The desktop-to-mobile catalogue has a real example of this (a height asymmetry first attributed to "legitimate component behavior," later found to be the same stale-sizing-mode bug as another entry, corrected in place with the wrong diagnosis kept for context).
- A gotcha found during production/batch use (not just calibration) belongs in the same catalogue, at the next number — there's no separate "production issues" list. The catalogue doesn't distinguish where a gotcha was found, only what it is.

## A checklist, derived from the catalogue

Once the catalogue has enough entries to be worth summarizing, add a `## Checklist` section at the bottom of the same file, grouped by phase, with one line per gotcha that's actionable as a yes/no check (`- [ ] <check>, phrased so a "no" means go read gotcha G<n>`). Not every entry needs a checklist line — some are context/explanation only. The checklist is a fast pre-flight scan before calling a phase done; the full entries are what you read when the checklist item fails.
