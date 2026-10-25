#!/usr/bin/env node
// capture-states.js — drive a running web product into named states, check them, and submit each one
// to Figma's capture. Reads and serves a scratch copy of the product's page; it never edits the product.
//
//   node tools/capture-states.cjs pages   manifest.json [--shots]   write one scratch page per state; --shots also saves a browser screenshot of each
//   node tools/capture-states.cjs capture manifest.json ids.json    open each page in a fresh browser profile so it submits its capture
//
// manifest.json
//   { "source": "path/to/index.html",      the product's page (read only)
//     "out": "path/to/scratch-folder",     where pages, profiles and screenshots go
//     "port": 3101,
//     "width": 1536, "height": 1500,
//     "reset": "localStorage.clear();",    runs first in every state, so no state leaks into the next
//     "seed": "…",                         JavaScript shared by every state: builds the data and renders
//     "states": [ { "name": "j2-02-pill-menu", "run": "…" } ] }   JavaScript for that state, run after the seed
//
// ids.json   { "j2-02-pill-menu": "<capture id>" }   one single-use id per state, from generate_figma_design
//
// Why it is built this way (each was a failure once):
//  - the script goes before the file's LAST closing body tag; an earlier one can sit inside a JavaScript string
//  - every state gets its own browser profile, or stored data leaks from one state to the next
//  - the capture needs a normal browser window; a headless one did not submit
//  - a state that fails inside the page writes the error into the page title, which --shots reports

const fs = require('fs'), path = require('path'), http = require('http');
const { spawn, spawnSync } = require('child_process');
// The page server shares this process, so a browser run must not block it.
const run = (cmd, args) => new Promise((r) => { let o = ''; const p = spawn(cmd, args, { stdio: ['ignore', 'pipe', 'ignore'] }); p.stdout.on('data', (d) => (o += d)); p.on('close', () => r(o)); });

const [mode, manifestPath, idsPath] = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const flags = process.argv.slice(2).filter((a) => a.startsWith('--'));
if (!['pages', 'capture'].includes(mode) || !manifestPath) { console.error(fs.readFileSync(__filename, 'utf8').split('\n').slice(1, 12).join('\n').replace(/^\/\/ ?/gm, '')); process.exit(1); }

const base = path.dirname(path.resolve(manifestPath));
const m = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const abs = (p) => path.resolve(base, p);
const out = abs(m.out || 'capture-scratch');
const port = m.port || 3101, W = m.width || 1536, H = m.height || 1500;
fs.mkdirSync(out, { recursive: true });

function chromePath() {
  const c = [process.env.CHROME, 'C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium'].filter(Boolean);
  const f = c.find((p) => fs.existsSync(p));
  if (!f) throw new Error('Chrome not found. Set the CHROME environment variable.');
  return f;
}

function writePages() {
  const src = fs.readFileSync(abs(m.source), 'utf8');
  const i = src.lastIndexOf('</body>');
  if (i < 0) throw new Error('No closing body tag in the source page.');
  for (const s of m.states) {
    const code = `\ntry{${m.reset || ''}\n${m.seed || ''}\n${s.run || ''}\n}catch(e){document.title='STATE ERROR '+e.message}\n`;
    const page = src.slice(0, i) + `<script src="https://mcp.figma.com/mcp/html-to-design/capture.js" async></script>\n<script>${code}</script>\n` + src.slice(i);
    fs.writeFileSync(path.join(out, s.name + '.html'), page);
  }
}

function serve() {
  const srv = http.createServer((req, res) => {
    const f = path.join(out, decodeURIComponent(req.url.split('?')[0].split('#')[0]));
    if (!f.startsWith(out) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { 'Content-Type': f.endsWith('.html') ? 'text/html; charset=utf-8' : 'application/octet-stream' });
    fs.createReadStream(f).pipe(res);
  });
  return new Promise((r) => srv.listen(port, '127.0.0.1', () => r(srv)));
}

// A new profile folder per browser run, so nothing is left to clear and no earlier window can hold it.
let runNo = 0;
const fresh = (name) => path.join(out, 'profiles', `${Date.now().toString(36)}-${runNo++}-${name}`);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  writePages();
  const srv = await serve();
  const chrome = chromePath();
  try {
    if (mode === 'pages') {
      if (flags.includes('--shots')) for (const s of m.states) {
        const shot = path.join(out, `shot-${s.name}.png`);
        const dom = await run(chrome, ['--headless=new', '--disable-gpu', `--user-data-dir=${fresh('shot-' + s.name)}`, `--window-size=${W},${H}`, '--virtual-time-budget=5000', '--dump-dom', `http://127.0.0.1:${port}/${s.name}.html`]);
        const err = /<title>(STATE ERROR[^<]*)<\/title>/.exec(dom || '');
        await run(chrome, ['--headless=new', '--disable-gpu', `--user-data-dir=${fresh('shot-' + s.name)}`, `--window-size=${W},${H}`, '--virtual-time-budget=5000', `--screenshot=${shot}`, `http://127.0.0.1:${port}/${s.name}.html`]);
        console.log(`${s.name}: ${err ? err[1] : 'ok'} → ${shot}`);
      }
      else console.log(`${m.states.length} pages written to ${out}`);
    } else {
      const ids = JSON.parse(fs.readFileSync(path.resolve(idsPath), 'utf8'));
      for (const s of m.states) {
        const id = ids[s.name];
        if (!id) { console.log(`${s.name}: no capture id, skipped`); continue; }
        const ep = encodeURIComponent(`https://mcp.figma.com/mcp/capture/${id}/submit?bindVariables=true`);
        const url = `http://127.0.0.1:${port}/${s.name}.html#figmacapture=${id}&figmaendpoint=${ep}&figmadelay=${s.delay || 3500}`;
        const p = spawn(chrome, [`--user-data-dir=${fresh(s.name)}`, '--no-first-run', `--window-size=${W},${H}`, url], { stdio: 'ignore' });
        await sleep(s.wait || 16000);
        if (process.platform === 'win32') spawnSync('taskkill', ['/F', '/T', '/PID', String(p.pid)]); else p.kill('SIGKILL');
        console.log(`${s.name}: opened, closed after ${(s.wait || 16000) / 1000}s. Poll its capture id to confirm.`);
      }
    }
  } finally { srv.close(); try { fs.rmSync(path.join(out, 'profiles'), { recursive: true, force: true }); } catch (e) { /* a browser may still be closing; the folder is scratch */ } }
})().catch((e) => { console.error(e.message); process.exit(1); });
