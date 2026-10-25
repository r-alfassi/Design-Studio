#!/usr/bin/env node
// capture-states.cjs — drive a running web product into named states, check them, and submit each one
// to Figma's capture. It never edits the product.
//
//   node tools/capture-states.cjs pages   manifest.json [--shots]   prepare every state; --shots also saves a browser screenshot of each and reports a state that fails; --serve keeps the pages up for a manual look
//   node tools/capture-states.cjs capture manifest.json ids.json    open each state in a fresh browser profile so it submits its capture
//
// Two ways to reach the product, chosen by the manifest:
//   "source"  a single HTML page with its script inline. A scratch copy per state is written and served.
//   "target"  a product that serves its own pages (a framework dev server). A proxy in front of it adds the
//             capture script and the state's actions to the page it asks for, and passes everything else through.
//
// manifest.json
//   { "source": "path/to/index.html",        the product's page (read only), or
//     "target": "http://localhost:3210",     the running product. Use the host name the product allows; a dev server may refuse 127.0.0.1
//     "out": "path/to/scratch-folder",       where pages, profiles and screenshots go
//     "port": 3101,                          where this tool listens
//     "width": 1536, "height": 1500,         the browser window, which is the device width in the capture
//     "reset": "localStorage.clear();",      runs first in every state, so no state leaks into the next
//     "seed": "…",                           JavaScript shared by every state
//     "hide": ["nextjs-portal"],             selectors to hide in every state: a dev server's own overlay is not part of the product
//     "prepare": [ { "method": "POST", "path": "/api/x", "body": {} } ],   calls to the product's own API, before every state (target only)
//     "states": [ { "name": "01-home", "path": "/play", "prepare": [], "run": "await __wait('nav'); …", "delay": 6000 } ] }
//
// "run" is async JavaScript run in the page after the seed. Two helpers exist: await __wait(selector, ms) waits for an element,
// and await __sleep(ms) pauses. The capture fires after "delay" ms (3500 for a source page, 6000 for a target), so a state's
// actions have to finish before then.
//
// ids.json   { "01-home": "<capture id>" }   one single-use id per state, from generate_figma_design
//
// Why it is built this way (each was a failure once):
//  - the script goes before the file's LAST closing body tag; an earlier one can sit inside a JavaScript string
//  - every state gets its own browser profile, or stored data leaks from one state to the next
//  - the capture needs a normal browser window; a headless one did not submit
//  - a state that fails inside the page writes the error into the page title, which --shots reports with the page's own errors
//  - the page server shares this process, so browser runs are asynchronous and never block it
//  - screenshots run in real time through the browser's debugging port and wait for the state to finish; a fixed
//    virtual-time wait ran the clock past a page's own network calls
//  - a framework dev server may serve its scripts only to its own host name (localhost, not 127.0.0.1)

const fs = require('fs'), path = require('path'), http = require('http');
const net = require('net');
const { spawn, spawnSync } = require('child_process');

const [mode, manifestPath, idsPath] = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const flags = process.argv.slice(2).filter((a) => a.startsWith('--'));
if (!['pages', 'capture'].includes(mode) || !manifestPath) {
  console.error(fs.readFileSync(__filename, 'utf8').split('\n').slice(1, 28).join('\n').replace(/^\/\/ ?/gm, ''));
  process.exit(1);
}

const base = path.dirname(path.resolve(manifestPath));
const m = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const abs = (p) => path.resolve(base, p);
const out = abs(m.out || 'capture-scratch');
const port = m.port || 3101, W = m.width || 1536, H = m.height || 1500;
const proxied = !!m.target;
const defaultDelay = proxied ? 6000 : 3500;
fs.mkdirSync(out, { recursive: true });

function chromePath() {
  const c = [process.env.CHROME, 'C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium'].filter(Boolean);
  const f = c.find((p) => fs.existsSync(p));
  if (!f) throw new Error('Chrome not found. Set the CHROME environment variable.');
  return f;
}

const CAPTURE = '<script src="https://mcp.figma.com/mcp/html-to-design/capture.js" async></script>';
function injection(s) {
  const code = '(async()=>{const __sleep=(ms)=>new Promise(r=>setTimeout(r,ms));window.__sleep=__sleep;' +
    'window.__wait=async(sel,ms=10000)=>{const t=Date.now();while(Date.now()-t<ms){const e=document.querySelector(sel);if(e)return e;await __sleep(100);}throw new Error("Timed out waiting for "+sel);};' +
    `try{${m.reset || ''}\n${m.seed || ''}\n${s.run || ''}\n}catch(e){document.title='STATE ERROR '+e.message}finally{window.__stateDone=true}})();`;
  return `${CAPTURE}\n<script>${code}</script>\n`;
}
const withScripts = (html, s) => {
  const i = html.lastIndexOf('</body>');
  if (i < 0) throw new Error('No closing body tag in the page.');
  return html.slice(0, i) + injection(s) + html.slice(i);
};

function writePages() {
  const src = fs.readFileSync(abs(m.source), 'utf8');
  for (const s of m.states) fs.writeFileSync(path.join(out, s.name + '.html'), withScripts(src, s));
}

const api = async (c) => {
  const r = await fetch(m.target + c.path, { method: c.method || 'GET', headers: { 'content-type': 'application/json' }, body: c.body ? JSON.stringify(c.body) : undefined });
  if (!r.ok) throw new Error(`${c.method || 'GET'} ${c.path} returned ${r.status}`);
};
const prepare = async (s) => { for (const c of [...(m.prepare || []), ...(s.prepare || [])]) await api(c); };

function serve() {
  const target = proxied ? new URL(m.target) : null;
  const srv = http.createServer((req, res) => {
    if (!proxied) {
      const f = path.join(out, decodeURIComponent(req.url.split('?')[0].split('#')[0]));
      if (!f.startsWith(out) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end(); }
      res.writeHead(200, { 'Content-Type': f.endsWith('.html') ? 'text/html; charset=utf-8' : 'application/octet-stream' });
      return fs.createReadStream(f).pipe(res);
    }
    const u = new URL(req.url, 'http://x');
    const state = m.states.find((s) => s.name === u.searchParams.get('__state'));
    u.searchParams.delete('__state');
    const headers = { ...req.headers, host: target.host, 'accept-encoding': 'identity' };
    const up = http.request({ hostname: target.hostname, port: target.port, path: u.pathname + u.search, method: req.method, headers }, (r) => {
      const html = state && /text\/html/.test(r.headers['content-type'] || '');
      if (!html) { res.writeHead(r.statusCode, r.headers); return r.pipe(res); }
      let body = ''; r.setEncoding('utf8'); r.on('data', (d) => (body += d));
      r.on('end', () => { const h = { ...r.headers }; delete h['content-length']; res.writeHead(r.statusCode, h); res.end(withScripts(body, state)); });
    });
    up.on('error', (e) => { res.writeHead(502); res.end('Proxy error: ' + e.message); });
    req.pipe(up);
  });
  // A dev server keeps a websocket open for live reload, and the page can stall without it, so upgrades pass straight through.
  if (proxied) srv.on('upgrade', (req, socket, head) => {
    const up = net.connect(Number(target.port) || 80, target.hostname, () => {
      const lines = [`${req.method} ${req.url} HTTP/1.1`, ...Object.entries({ ...req.headers, host: target.host }).map(([k, v]) => `${k}: ${v}`), '', ''];
      up.write(lines.join(String.fromCharCode(13, 10))); if (head && head.length) up.write(head);
      socket.pipe(up); up.pipe(socket);
    });
    up.on('error', () => socket.destroy()); socket.on('error', () => up.destroy());
  });
  return new Promise((r) => srv.listen(port, () => r(srv)));
}

// The URL of a state as the browser opens it.
const stateUrl = (s) => proxied
  ? `http://localhost:${port}${s.path || '/'}${(s.path || '/').includes('?') ? '&' : '?'}__state=${encodeURIComponent(s.name)}`
  : `http://localhost:${port}/${s.name}.html`;

// A new profile folder per browser run, so nothing is left to clear and no earlier window can hold it.
let runNo = 0;
const fresh = (name) => path.join(out, 'profiles', `${Date.now().toString(36)}-${runNo++}-${name}`);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Opens a state in a headless browser in real time, waits until its actions have finished, and saves a full-height screenshot.
// Returns the error the state raised with the page's own errors, or ''.
// With a url and holdMs it opens that url instead (a state with its capture hash), holds the page open for holdMs so the
// capture can submit, and saves no screenshot. The device width is then the real width in the manifest, not a window's minimum.
async function shoot(chrome, s, file, url, holdMs) {
  const dport = 9300 + (runNo % 500);
  const proc = spawn(chrome, ['--headless=new', '--disable-gpu', `--remote-debugging-port=${dport}`, `--user-data-dir=${fresh('shot-' + s.name)}`, `--window-size=${W},${H}`, 'about:blank'], { stdio: 'ignore' });
  try {
    let list;
    for (let i = 0; i < 50 && !list; i++) { try { list = await (await fetch(`http://127.0.0.1:${dport}/json/list`)).json(); } catch (e) { await sleep(200); } }
    const tab = list && list.find((t) => t.type === 'page');
    if (!tab) throw new Error('Browser did not start.');
    const ws = new WebSocket(tab.webSocketDebuggerUrl);
    await new Promise((r, j) => { ws.onopen = r; ws.onerror = j; });
    let n = 0; const pending = new Map(); const problems = [];
    ws.onmessage = (e) => {
      const d = JSON.parse(e.data);
      if (d.id && pending.has(d.id)) { pending.get(d.id)(d.result || {}); pending.delete(d.id); }
      else if (d.method === 'Runtime.exceptionThrown') problems.push('exception: ' + String(d.params.exceptionDetails.exception?.description || d.params.exceptionDetails.text).split('\n')[0]);
      else if (d.method === 'Log.entryAdded' && d.params.entry.level === 'error') problems.push('console: ' + d.params.entry.text + ' ' + (d.params.entry.url || ''));
    };
    const send = (method, params = {}) => new Promise((r) => { const id = ++n; pending.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
    const evalJs = async (expr) => (await send('Runtime.evaluate', { expression: expr, returnByValue: true })).result?.value;
    await send('Runtime.enable'); await send('Log.enable');
    await send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 1, mobile: false });
    await send('Page.navigate', { url: url || stateUrl(s) });
    let done = false;
    for (let i = 0; i < 100 && !done; i++) { await sleep(300); done = await evalJs('window.__stateDone === true'); }
    if (holdMs) { await sleep(holdMs); ws.close(); return done ? '' : 'STATE ERROR the state did not finish within 30s'; }
    await sleep(s.settle || 800);
    const title = (await evalJs('document.title')) || '';
    const err = done ? (title.startsWith('STATE ERROR') ? title : '') : 'STATE ERROR the state did not finish within 30s';
    const h = Math.min(Math.max(H, (await evalJs('document.documentElement.scrollHeight')) || H), 8000);
    const img = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: { x: 0, y: 0, width: W, height: h, scale: 1 } });
    fs.writeFileSync(file, Buffer.from(img.data, 'base64'));
    ws.close();
    return err ? `${err}${problems.length ? ' [' + problems.slice(0, 3).join('; ') + ']' : ''}` : '';
  } finally {
    if (process.platform === 'win32') spawnSync('taskkill', ['/F', '/T', '/PID', String(proc.pid)]); else proc.kill('SIGKILL');
  }
}

(async () => {
  if (!proxied) writePages();
  const srv = await serve();
  const chrome = chromePath();
  try {
    if (mode === 'pages') {
      if (flags.includes('--shots')) for (const s of m.states) {
        await prepare(s);
        const shot = path.join(out, `shot-${s.name}.png`);
        const err = await shoot(chrome, s, shot);
        console.log(`${s.name}: ${err || 'ok'} → ${shot}`);
      }
      else {
        console.log(proxied ? `${m.states.length} states ready at http://localhost:${port}` : `${m.states.length} pages written to ${out}`);
        if (flags.includes('--serve')) { console.log('Serving. Press Ctrl+C to stop.'); await new Promise(() => {}); }
      }
    } else {
      const ids = JSON.parse(fs.readFileSync(path.resolve(idsPath), 'utf8'));
      for (const s of m.states) {
        const id = ids[s.name];
        if (!id) { console.log(`${s.name}: no capture id, skipped`); continue; }
        await prepare(s);
        const ep = encodeURIComponent(`https://mcp.figma.com/mcp/capture/${id}/submit?bindVariables=true`);
        const url = `${stateUrl(s)}#figmacapture=${id}&figmaendpoint=${ep}&figmadelay=${s.delay || defaultDelay}`;
        if (m.headed) {
          const p = spawn(chrome, [`--user-data-dir=${fresh(s.name)}`, '--no-first-run', `--window-size=${W},${H}`, url], { stdio: 'ignore' });
          await sleep(s.wait || (proxied ? 20000 : 16000));
          if (process.platform === 'win32') spawnSync('taskkill', ['/F', '/T', '/PID', String(p.pid)]); else p.kill('SIGKILL');
          console.log(`${s.name}: opened in a window and closed. Poll its capture id to confirm.`);
        } else {
          const err = await shoot(chrome, s, null, url, (s.delay || defaultDelay) + 9000);
          console.log(`${s.name}: ${err || 'opened and closed'}. Poll its capture id to confirm.`);
        }
      }
    }
  } finally {
    srv.close();
    try { fs.rmSync(path.join(out, 'profiles'), { recursive: true, force: true }); } catch (e) { /* a browser may still be closing; the folder is scratch */ }
  }
})().catch((e) => { console.error(e.message); process.exit(1); });
