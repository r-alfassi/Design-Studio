---
name: screenshot-verify
description: This skill should be used when visual changes to an HTML presentation need to be verified by screenshot — after applying CSS fixes, layout changes, or new chat content. It drives a headless Chromium browser to a specific beat/state via Playwright, captures screenshots to the session scratchpad, and optionally inspects computed styles. Use this after any visual change to an HTML presentation file to confirm the change is actually visible before reporting completion.
---

# Screenshot Verify

## Purpose

Automate visual verification of HTML presentation changes. Navigate to a specific beat and application state, screenshot it, and optionally check computed styles — without requiring a browser to be opened manually.

## When to use

- After applying CSS or JavaScript fixes to an HTML presentation
- When verifying a fix in both English and Hebrew (RTL) modes
- When checking a specific beat, interaction state, or view mode (e.g. storyboard grid vs. list)
- Before reporting any visual change as complete

## Procedure

### 1. Ensure the local server is running

The presentation uses `fetch()` to load its `.md` data files and cannot run from `file://`. A local HTTP server must be running on the configured port. See `references/environment.md` for setup.

### 2. Write a test script to the session scratchpad

Use `scripts/verify.cjs` as the template. Copy it to the session scratchpad and adapt the top-level configuration block:

- `OUT` — set to the current session scratchpad path
- `PORT` / `FILE` — match the running server and target HTML file
- `BEATS` — number of `nextBeat()` calls to reach the target beat
- Uncomment `toggleLang()` to test Hebrew/RTL mode
- Uncomment `revealInput()` if the chat input area needs to be unlocked first
- Uncomment or extend the computed style inspection block for CSS verification

### 3. Run the script

```powershell
node <scratchpad-path>/verify.cjs
```

Run from the presentation directory (or use an absolute path) with the server already running.

### 4. Read and inspect the screenshots

Use the Read tool on the output `.png` files to visually confirm the change. Screenshots are written to `OUT` with filenames set in the script.

### 5. Add computed style checks for CSS issues

When a CSS rule's effect is ambiguous — especially after a specificity battle — add a `page.evaluate()` block that calls `getComputedStyle(el)` and logs resolved values (e.g. `textAlign`, `paddingLeft`). This exposes what the browser actually applied, independent of what the stylesheet says.

## When not to run automatically

Never initiate a screenshot verification run without explicit instruction. After applying a change, propose it — offer the beat number, the view mode, and what will be checked — and wait for confirmation before running. The correct pattern is:

> "Want me to screenshot beat 15 in both EN and HE to confirm the formatting?"

Not silently running the script as part of applying the fix. The exception is when the user has explicitly requested verification in the same message that requested the change (e.g. "fix X and verify it").

## Notes

- Scripts must use `.cjs` extension; the presentations directory has `"type": "module"` in `package.json` which breaks `.js` scripts
- The session scratchpad path changes every session — always set `OUT` fresh
- To verify both EN and HE in one run, use two sequential `shoot(lang, filename)` calls as shown in the template
- Beat indexing: calling `nextBeat()` N times from the initial state reaches beat N
- The attachment chip in the chat input is only visible after `revealInput()` is called — see `references/environment.md`
