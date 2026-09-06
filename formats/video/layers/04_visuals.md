# Layer 4 — Visuals

**What it is:** The image generation layer. Translates the script's visual briefs into concrete generation specs. Every confirmed image lives in the storyboard.

**What it does not do:** Describe camera movement, video transitions, or motion technique. Those belong to the Motion layer.

**The test:** Does every frame in the script have at least one confirmed image in `storyboard.html`? Does the base section of `FRAMES.md` define a cinematic reference that holds across all shots?

**Governance:** Images must exist before motion directives are written. The storyboard is the ground truth — if it is not in the storyboard, it is not confirmed.

**Prompting technique:** Two-part prompting — base + shot, assembled on demand. The base visual grammar lives at the top of `FRAMES.md` as a JSON block. Each shot has its own frame-specific JSON block below. When a prompt is needed for generation, it is assembled in the conversation — base combined with the shot spec at that moment. Nothing is pre-concatenated in the file. Base content must never be restated inside a shot spec.

**File structure:** Each section in `FRAMES.md` follows the same pattern: a plain-language brief first (one or two sentences — what you see, what it feels like), then the JSON spec. This applies to both the base section and every shot.

**Working rules:**
- Describe a shot before writing its JSON spec. Never write a prompt the operator hasn't confirmed.
- One change at a time when iterating. Multiple changes in one pass make regressions impossible to diagnose.
- Use the continuity instruction technique for adjustments: paste the existing image + a single-change instruction. Do not regenerate from a new prompt.
- Before video interpolation between adjacent shots: verify structural anatomy matches (trunk, root flare, branch angles, etc.) and correct if needed.

**Artifacts:**
- `visuals/FRAMES.md` — base visual grammar + per-shot generation specs. Start from `formats/video/craft/FRAMES.md`.
- `storyboard.html` — visual review surface; all confirmed images displayed here

**File naming:** `visuals/FRAMES.md`, `storyboard.html`
