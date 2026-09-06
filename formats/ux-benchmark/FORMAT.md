---
name: ux-benchmark
description: "Govern UX/UI competitive benchmark research — the evidence-gathering phase that precedes design or deck work. Use when a project needs to answer 'what does the market do?' through app screenshots, feature analysis, and visual comparison across competing products. Produces a visual HTML evidence base, not a deck or mockup."
---

# Format: UX/UI Benchmark Research
## Visual Evidence-Gathering for Competitive Analysis

This format governs the research phase of UX/UI benchmark studies. The deliverable is a visual HTML evidence base — not a deck and not a mockup. It is the phase that answers "what does the market do?" before design or strategic work begins.

It is distinct from:
- **Strategic Deck** — which governs argument construction and delivery
- **Product Design** — which governs interface artifact production

Both of those formats assume you already know what you're building. This format governs the work that informs that decision.

---

## Folder Structure

Each benchmark initiative lives under a domain subfolder. One domain, one subfolder.

```
[project]/
└── benchmark/
    ├── resources/
    │   ├── benchmark_prompt_template.md   ← shared generalist template — never edited directly
    │   └── prompt_[domain].md             ← staging area before domain folder is created
    └── [domain]/                          ← e.g. checking-account/, deposits/, onboarding/
        ├── prompt.md                      ← filled research brief for this domain
        ├── research.md                    ← full markdown research record
        ├── research.html                  ← visual HTML evidence base (the primary deliverable)
        └── screenshots/                   ← all downloaded images, locally named
```

The shared template lives at `benchmark/resources/benchmark_prompt_template.md` and is never edited. When a domain begins, a filled copy is created and eventually moved into the domain subfolder as `prompt.md`.

---

## The Research Prompt

The prompt is the research brief. It defines scope before any research begins. A generalist template with named placeholders (`[LIKE_THIS]`) is filled per domain.

Prompt sections:
- **Bank / product list** — the primary targets for the study
- **Domain focus** — the specific capability area (e.g. cash flow intelligence, savings, onboarding)
- **Focus areas** — the specific UX questions to answer (e.g. how is the forecast displayed? how are anomalies explained?)
- **Per-bank screen list** — which screens to find per bank
- **Per-screen analysis** — what to explain for each screen (visible content, user actions, complexity level, insight type)
- **Additional players** — 6–8 fintechs or banks with innovative UX in this domain
- **Standard deliverables** — comparison table, screen inventory, design opportunities

The prompt is locked before research begins. It is the scope anchor.

---

## Source Hierarchy

Sources are used in this order. Move to the next only when the current is exhausted.

| Priority | Source | Notes |
|---|---|---|
| 1 | **Mobbin** | Preferred — real indexed app screenshots. Use `search_screens`, `search_flows`, `search_sections`. Try multiple query formulations per bank. |
| 2 | **Official bank website** | Fetch the page and extract `<img>` src / srcset / data-src alongside feature text in the same pass. Never fetch for text only — always extract images too. |
| 3 | **Google Play Store CDN** | `play-lh.googleusercontent.com` URLs are directly downloadable even when the Play Store page is JS-rendered and unfetchable. Requires user to right-click → Copy image address in browser. |
| 4 | **App Store / third-party listings** | Same principle — direct CDN asset URLs, not page fetches. |
| 5 | **User-provided direct URLs** | Operator right-clicks an image in their browser and pastes the asset URL. The most reliable fallback when sites block automated access. |
| 6 | **Images dropped into chat** | Visible and captionable by Claude, but not saveable to disk. Must be accompanied by a direct URL to download. Note the gap explicitly if only chat images are available. |

**Screenshot exclusion rule:** Images that are illustrative-only (empty UI shells, promotional artwork, pre-2020 outdated mockups) are excluded. They add noise rather than evidence. When in doubt, view before deciding.

**Source credibility rule:** A source must be epistemic — it must be a page where a skeptical reader can verify the claim being made about a feature. Distribution channels do not qualify. They confirm an app exists; they do not document how a feature works.

| Valid source | Not valid |
|---|---|
| Feature page on the bank's own site | Google Play / App Store listing |
| Bank newsroom announcement | Brand homepage |
| Finextra / The Financial Brand / press coverage | CDN image URL |
| Research report or analyst note | Any page the feature is not described on |

---

## Screenshot Acquisition Pipeline

### 1 — Find URLs

For bank websites: fetch the feature page, extract all `<img>` src paths, prepend the domain, and download. Do this in the same pass as text research — never revisit just for images.

For blocked sites (WAF/CDN protection): the entire domain may be blocked regardless of URL path. Try: Play Store listing, App Store listing, innovation blog subdomain (`brand.com/blog` vs `brand.es`). If all are blocked, ask the operator to paste direct asset URLs from their browser.

For JS-rendered pages (Play Store, App Store): the page HTML returns only the SPA shell. Do not attempt to fetch the listing page. Instead, ask the operator to open the store listing in their browser, right-click any screenshot, and paste the direct CDN URL.

### 2 — Download

```powershell
$resp = Invoke-WebRequest -Uri $url -UseBasicParsing -MaximumRedirection 10
[System.IO.File]::WriteAllBytes($path, $resp.Content)
```

Name files descriptively: `[bank]-[screen].jpg` — e.g. `hsbc-uk-balance-forecast.jpg`, `bbva-coach.jpg`.

**WebP constraint:** `System.Drawing` does not support WebP. For Google CDN URLs, append `-rj` to the size parameter to force JPEG: `=w1080-h2340-rw` → `=w1080-h2340-rw-rj`.

### 3 — Crop

Remove marketing backgrounds (Play Store / App Store header text) while keeping any in-app decorative background.

**Auto-detect phone frame boundary:**
```powershell
Add-Type -AssemblyName System.Drawing
$bmp = [System.Drawing.Bitmap]::new($path)
$phoneTop = -1
for ($y = 150; $y -lt $bmp.Height; $y++) {
  $light = 0
  for ($x = 0; $x -lt $bmp.Width; $x++) {
    $px = $bmp.GetPixel($x, $y)
    if ($px.R -gt 230 -and $px.G -gt 230 -and $px.B -gt 230) { $light++ }
  }
  if ($light / $bmp.Width -gt 0.65) { $phoneTop = $y; break }
}
```

Start scan at row 150 to skip any white text in the header. Add 8–10px breathing room above the detected boundary. Verify the crop on one image visually before batching.

**For uniform images** (same source, same layout — e.g. all screenshots from one bank's website): scan one image to detect bounds, apply identical crop to all.

**For variable images** (different header heights — e.g. Play Store listings with different text lengths): detect per-image.

### 4 — Verify

Read one cropped image with the Read tool before saving the batch. Check that the marketing text is gone and the phone frame edge is not clipped.

---

## Evidence Discipline

This is the most important section. Getting this wrong produces a report that looks researched but isn't.

### The decoupling principle

**Feature analysis (text) and visual evidence (screenshots) are separate layers.** They are never merged into a single card where the image is decorative and the text ignores it.

Two valid patterns:

**Option A — Decouple (default for primary banks)**
Feature cards hold text research sourced from web copy. A separate scrollable evidence strip below the card row holds the screenshots with functional captions. No coupling between a specific card and a specific image. Use when: images are marketing/landscape format, limited readable UI, or sourced from the bank's website rather than raw app screens.

**Option B — Embed (for raw app screenshots)**
A screenshot lives inside its feature card with a clearly labelled "What's visible" section — a one-line reading of what is literally visible in the image. Use when: images are raw phone-resolution app screenshots with dense, readable UI content (e.g. Mobbin screenshots for additional players).

### The caption rule

Captions explain the design decision visible in the screenshot. They answer: *what does this tell us about how this product approaches the problem?*

They do not transcribe labels, list UI elements, or describe what is written on screen.

| Wrong | Right |
|---|---|
| "Nav: Visible, Blue, Menú. Cuenta Principal 2.300,10€. Recent: CINESA −12,50€..." | "Spending analysis is one tap from the primary balance — 'Ver análisis de gasto' sits immediately below recent transactions. Category icons on each transaction confirm auto-categorization is visible at the account level before the user opens analytics." |
| "Coach financiero screen. Tu objetivo. Progress bar. Llevas 110,00€." | "Progress is framed emotionally ('Ánimo, estás a medio camino') not just numerically — reducing anxiety around shortfall. The goal is decomposed into contributing behaviors, not just a total. The pencil icon confirms the target is user-editable." |

### Screenshot validation

Before placing a screenshot, verify it illustrates the specific claim it is placed next to — not just that it is from the correct bank. A screenshot from the right source but showing the wrong feature is more misleading than no screenshot at all: it creates the appearance of evidence while contradicting the claim.

**The test:** State the claim in the caption. Look at the screenshot. Does the image show the user doing or seeing the thing the claim describes? If not, use a placeholder.

A common failure mode: a bank has multiple features, screenshots are filed by bank name, and the first available screenshot is placed without checking which feature it actually shows. The fix is to name files descriptively (`bank-feature.jpg`) and verify the match before placing.

---

## HTML Report Structure

The HTML file is the primary deliverable. It is a self-contained local file — all images are downloaded locally to `screenshots/`, no external dependencies.

**Why local, not an Artifact:** Claude.ai Artifacts enforce a strict CSP that blocks external image URLs including Mobbin short URLs. The HTML file must be served locally so screenshots load.

### Standard sections

| Section | Purpose |
|---|---|
| Report header | Title, subtitle, bank count, data sources, date, screenshot coverage tag |
| Alert banner | Screenshot coverage status across all banks — updated incrementally as images are added |
| Primary banks | One block per bank: chip, meta line with live source links, feature badges, feature cards, evidence strip |
| Additional players | One block per player: why-included box, phone frames + observation bullets |
| Comparison table | Primary banks × key dimensions, ✓ / — / ~ notation |
| Screen inventory | Strong / Partial / None per bank per screen type |
| Design opportunities | Grid: opportunity, best example, analytical note |

### Feature cards

Each card: category label, screen name, description, complexity badge.

Complexity badges: `Simple` (gray) / `Advanced` (blue) / `Innovative` (green).

Text content sourced from web research, not from image captions.

### Evidence strip (Option A)

Below the feature card row. Horizontally scrollable. Header includes a live source link.

Each image item: the image, then a functional caption (see caption rule above).

### Phone frames (Option B / additional players)

CSS-only phone frame: dark rounded rectangle, `aspect-ratio: 390/844`, `object-fit: cover`, `object-position: top`. Source pill (Mobbin / bank name) below each frame.

### Dashed placeholder

For screens where no image is available:
```html
<div class="ph">
  <div class="ph-icon">📱</div>
  <div class="ph-title">No reliable public screenshot found</div>
</div>
```

### Source links

Every source reference in a meta line or evidence strip header must be a live hyperlink — not plain text. This is the primary navigation aid for anyone verifying the research.

---

## Additional Players Model

6–8 players per domain. Mobbin-indexed preferred. Selection criterion: innovative UX in the specific focus area that primary banks do not show.

Each block contains:
- **Why-included box** — one paragraph explaining what this player contributes that primary banks don't demonstrate. Written before looking at screenshots.
- **Phone frames** — 2–3 Mobbin screenshots in the phone frame CSS
- **Observation bullets** — specific findings, with starred bullets (`★`) for standout patterns

The additional players section is the benchmark ceiling. It shows what's possible, not just what exists.

---

## Coverage Tracking

Two artifacts track evidence completeness:

**Alert banner** — top of the HTML file. States per bank whether screenshots are: confirmed Mobbin / official website / store listing / not found. Updated every time a new screenshot set is added. The HTML is self-documenting about its own evidence quality.

**Screen inventory table** — at the end of the primary banks section. Rows = screen types from the research prompt. Columns = primary banks. Values: `Strong` (feature well-documented with mechanistic detail) / `Partial` (feature confirmed, UI/UX unclear) / `None` (not found in public sources).

---

## Technical Constraints

| Constraint | Detail |
|---|---|
| **Mobbin CSP** | Mobbin image URLs (`mobbin.com/api/mcp/short/...`) do not load inside Claude Artifacts. Always produce a local HTML file. |
| **System.Drawing + WebP** | `System.Drawing` cannot decode WebP files. For Google CDN URLs, append `-rj` to the URL size parameter to request JPEG. |
| **WAF-blocked sites** | Some bank domains (e.g. bbva.es) block all automated requests regardless of URL path. Confirmed by trying multiple paths. Workaround: user pastes direct asset URLs, or use store listings. |
| **JS-rendered store pages** | Play Store and App Store listing pages return only an SPA shell to WebFetch. Images require direct CDN URLs from the operator's browser. |
| **Chat-dropped images** | Images attached to a chat message are visible and captionable by Claude but cannot be written to disk. A direct URL is required to download. Flag this explicitly when it happens. |
| **Python (Windows Store stub)** | The Python alias in `WindowsApps` is a store redirect stub, not a real runtime. `python -m pip` will fail. Use System.Drawing + URL format tricks instead. |

---

## AI Behavior in This Format

**Always fetch images in the same pass as text.** When fetching any bank page, extract `<img>` src/srcset/data-src alongside feature text. Never revisit a page just for images.

**View before deciding.** Download candidate screenshots to the scratchpad and read them before saving to the project. A 2016 illustrated mockup and a real app screenshot look different to a human — verify.

**Verify crop on one image before batching.** Use the Read tool on the first cropped output. Crop errors compounded across 20 images are much harder to fix than a single check.

**Apply the caption rule without prompting.** Every evidence strip caption must explain design decisions, not describe screen content. If a caption is only describing what's written on screen, rewrite it.

**Apply Option A by default for primary banks.** Do not embed screenshots inside feature cards unless the images are raw app UI with dense readable content. When in doubt, decouple.

**Update the alert banner and screen inventory incrementally.** Every time a new set of screenshots is added, update both. The HTML should always reflect its actual evidence state.

**Source links must be live.** Any URL referenced in a meta line or evidence strip header must be wrapped in an `<a>` tag. Plain-text URLs are not acceptable.

**Keep research.md as the complete analytical record.** The HTML is the visual delivery surface; the markdown is the full research record with all findings, sources, and dates. Both are maintained.

---

## Format History

| Version | Date | What changed |
|---|---|---|
| v1.0 | 2026-08-03 | Created from a checking-account benchmark study. Methodology, source hierarchy, screenshot pipeline, evidence discipline, and HTML structure extracted from working practice. |
| v1.1 | 2026-08-06 | Added screenshot validation rule to Evidence Discipline: verify claim-image match, not just bank attribution. Added source credibility rule to Source Hierarchy: sources must be epistemic (feature pages, newsroom, press) not distributional (app stores, brand homepages). Promoted from a benchmark presentation review. |
