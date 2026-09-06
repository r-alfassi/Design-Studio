# Environment Reference

## Chromium Headless Shell

`verify.cjs` uses Playwright's own managed browser — no explicit path needed.
Install it once per machine:
```powershell
npx playwright install chromium
```

Only override the binary if the managed one won't launch (locked-down machine,
shared corporate install). Pass it via env var rather than editing the script:
```powershell
$env:CHROMIUM_PATH = "C:/path/to/chrome-headless-shell.exe"; node verify.cjs
```
Playwright stores its managed browsers under `%LOCALAPPDATA%/ms-playwright/`;
the `chromium_headless_shell-*` directory name carries a version number that
changes on update.

## Local HTTP Server

- **Port**: 7654
- **Why needed**: The presentation uses `fetch()` to load `.md` data files — `file://` URLs block cross-origin fetches

**Starting the server** (PowerShell, from the presentation directory):
```powershell
Start-Job { Set-Location "<absolute path to the presentation directory>"; node serve.cjs }
```
Use `Start-Job`, not `Start-Process` — `Start-Process` does not reliably bind the port in this environment.

**Server script** (`serve.cjs` in the presentation directory):
```javascript
const http = require('http');
const fs   = require('fs');
const path = require('path');
// ... static file server on PORT 7654
```
The `.cjs` extension is required because `package.json` has `"type": "module"`.

## Known Gotchas

### Script extension must be `.cjs`
The presentations directory has `"type": "module"` in `package.json`. Node will reject a `.js` test script with a syntax error on `require()`. Always write test scripts as `.cjs`.

### `inputRevealed` state
The chat input area starts locked. The attachment chip and send button are not rendered until `revealInput()` is called. When navigating to a beat that shows an attachment chip, call:
```javascript
await page.evaluate(() => { if (typeof revealInput === 'function') revealInput(); });
await page.waitForTimeout(400);
```
before looking for `.attachment-chip`.

### Beat indexing
The presentation's internal `beat` variable is 0-indexed. Calling `nextBeat()` N times from the initial load state reaches beat index N (i.e. what the UI labels as beat N+1 if 1-based). Verify the beat number by checking `beat` in the evaluate block:
```javascript
const b = await page.evaluate(() => beat);
console.log('Current beat:', b);
```

### Page load timing
`waitForTimeout(2500)` after `goto()` is required for the `fetch()` calls to complete and the presentation to initialize. Reducing this may result in missing chat data or empty panels.

### `revealInput` vs. `inputRevealed`
`revealInput()` is the function to call. `inputRevealed` is the boolean state variable. Check the state with:
```javascript
const revealed = await page.evaluate(() => inputRevealed);
```
