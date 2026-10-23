# `scripts/figma/` — conventions and template

Standard for the `scripts/figma/*.js` files a produced screen-conversion skill should ship. A completed screen-conversion skill's own `scripts/figma/` is the worked example to follow (one file per phase, plus split audit/fix helpers for the judgment and verification phases).

## Why these exist as separate files at all

`SKILL.md` states what each phase does and why. These files are the actual, tested `use_figma` code that does it — written once, correctly, with the gotchas already designed around, so a future run pastes and parameterizes rather than re-deriving the same logic from memory. **This is the whole point**: a live run re-introducing an already-solved gotcha because a script wasn't consulted is a real, recurring failure mode this convention exists to prevent, not a hypothetical one.

## File-naming and granularity

- One file per phase where the phase is mechanical and deterministic (`phase1-<name>.js`, `phase2-<name>.js`, ...).
- The judgment phase is different in kind — there's no single script that *makes* the judgment call, since that's the point of the phase. Instead, ship a **diagnostic/audit helper** (reports fit, flags candidates, doesn't decide) and, once a specific case is resolved and confirmed to recur, a **named fixer for that specific resolved pattern** — see desktop-to-mobile's `phase5-fit-check-and-convert.js` for the shape: a report always runs; a `CONVERT` flag gates whether the actual mutation happens, so the same script serves both "help me decide" and "apply the decision" without being two files.
- The verification phase gets its own audit script, separate from any phase's fix script, and it should check **every axis / every leaf**, not just what the last bug happened to be about (see the meta-skill's Phase 4).

## Required header comment, every file

```js
// Phase <n>: <name>
// Paste into use_figma. Set <PARAM_NAME> (and any others) before running.
//
// <1-3 sentences: what this does and, critically, WHY it's structured this way —
// name the specific gotcha(s) this script's ordering/structure defends against,
// by number, e.g. "resize() before setting AUTO, not after — gotcha G8".
// A script with no rationale in its header will get "simplified" by someone
// who doesn't know why the ordering matters, and the bug it defends against
// will come back.
```

## Parameterization

- Every ID a script needs is a `const SOME_ID = '';` at the top, never inlined into the body — this is what makes "adapt for the current screen" a one-line edit instead of a re-read of the whole script.
- State in the header, or as a `MODE`-style constant, whether the script assumes **incremental mode** (it calls `.clone()` itself) or **one-shot mode** (it expects to be handed an already-existing working-copy ID and mutates it directly). If a script is written for incremental mode by default (most are, since that's how they get authored during calibration), say explicitly in the header what to delete/change to run it in one-shot mode instead — don't make the reader work that out.

## Defensive patterns to bake in, not leave to the caller

- **Never pre-fetch multiple nodes and then perform structural mutations (detach, in particular) on them in sequence within one script**, if any of those mutations can invalidate a *different* node's previously-captured reference. Re-discover the next target fresh, by traversal, after each such mutation — this is expensive to relearn per-domain but cheap to bake into the script once.
- **Disambiguate by an actual distinguishing property (`visible`, a specific attribute value), never by taking the first name match**, whenever a name is known to repeat within a subtree (a toggle-pair, a numbered-suffix sibling). If the produced skill's own gotcha catalogue documents a repeating-name case, the corresponding script must already handle it — a script that requires the caller to remember a catalogue entry every time defeats the purpose of having a script.
- **Wrap independent per-screen work in `try`/`catch` when a script is written to process more than one screen in a loop** (a batch-mode script), so one screen's failure doesn't silently roll back or block every other screen in the same call. Collect and return a results array with per-item success/error, not a single pass/fail for the whole run.
- **Fix immediately, not deferred to a later pass**, when a phase's own fix necessarily creates a follow-on need (a sizing-mode correction after a structural change, a dependent-position recompute after a height change). A script that does the primary fix and leaves the follow-on for "a later audit" is asking for the exact bug the audit phase exists to catch.

## What NOT to script

Don't try to write a script for the judgment phase's actual decision-making (which layout fix is correct for this specific row) — that defeats the purpose of separating mechanical from judgment (see `SKILL.md` Phase 3). Script the *diagnosis* (does this fit, by how much, is this a known-resolved pattern) and the *mechanical application* of a decision once made; never script "decide this automatically" for content that hasn't been proven to always resolve the same way.
