# Video Format
## Short-Form Cinematic Video — Governance Protocol

Use this format for producing a short cinematic video (typically 30–90 seconds) driven by a visual metaphor and a narrated business story.

---

## Production Hierarchy

Every video governed by this format follows a strict linear hierarchy. No stage begins until the previous one is confirmed.

```
NARRATIVE.md  →  CONCEPT.md  →  SCRIPT.md  →  FRAMES.md  →  MOTION.md  →  Video generation
```

| Stage | Artifact | What gets decided |
|---|---|---|
| Narrative | `NARRATIVE.md` | The plain business story — no creative device |
| Concept | `CONCEPT.md` | Metaphor, semantic field, visual world |
| Script | `SCRIPT.md` | Frame-by-frame VO + visual brief |
| Visuals | `visuals/FRAMES.md` | Image generation specs — base grammar + per-shot prompts |
| Motion | `MOTION.md` | Camera patterns, transition directives |
| Generation | Runway / Kling prompts | Per-transition video prompt |

**Rule:** no layer begins until the previous one is confirmed by the operator. Each layer is a gate, not a draft.

---

## The Layers

### Narrative
The plain story — what we want to say, with no creative device applied. Written in plain language as if explaining to a colleague. No metaphor, no semantic field, no visual thinking yet.

**Decisions made here:** business context, relationship arc, what we're arguing for, what the audience needs to leave believing.

**Done when:** the story can be stated in 3–5 sentences and a client would recognize it as accurate.

**Artifact:** `NARRATIVE.md` — kept brief. If it needs visual language to be understood, it has not been separated from the concept yet.

---

### Concept
Where the metaphor and semantic field enter. The creative translation of the narrative: why this image, this world, this arc — and how it maps onto the business story beat by beat.

**Decisions made here:** the metaphor, the visual world, how each narrative beat maps to a visual moment, what the emotional arc feels like.

**Done when:** every narrative beat has a visual equivalent that can be explained without showing an image. A skeptic could follow the logic of why this metaphor was chosen.

**Artifact:** `CONCEPT.md` — the bridge document. Contains: the metaphor stated plainly, the semantic field (what objects/actions/settings belong to this world), and the beat-by-beat mapping from narrative to visual.

**Gate:** the concept must be confirmed before the script is written. Over-specifying before the client has reacted closes down the discussion — present it at the level of a productive conversation, not a finished spec.

---

### Script
The production document. Frame-by-frame structure with VO and visual brief per frame. Built on the confirmed concept — the concept is now expressed as specific frames, specific lines, specific timings.

**Decisions made here:** number of frames, timing per frame, exact VO lines, visual intent per frame.

**The key rule:** the visual track and VO track are written separately and operate independently. They meet in meaning, not in description. The image carries the metaphor; the VO carries the business story. Neither explains the other.

**Done when:** every frame has a confirmed VO line (or deliberate silence) and a visual brief. Timing adds to the target duration.

**Artifact:** `SCRIPT.md`

---

### Visuals
The image generation layer. Translates the script's visual briefs into concrete generation specs.

**Decisions made here:** composition, framing, subject, mood, cinematic style, per-shot prompt. Confirmed images collected in the storyboard.

**Done when:** every frame in the script has at least one confirmed image in `storyboard.html`.

**Artifacts:** `visuals/FRAMES.md` (base grammar + per-shot specs), `storyboard.html` (review surface)

---

### Motion
The video generation layer. Written only after images are confirmed. Translates the storyboard into movement directives for Runway / Kling.

**Decisions made here:** camera patterns, transition techniques, duration per shot, subject motion.

**Done when:** every cut between confirmed frames has a directive in `MOTION.md`.

**Artifact:** `MOTION.md`

---

## File Structure

```
formats/video/
├── FORMAT.md             # This file — the governing protocol
├── layers/               # Layer definitions — what each stage is and how to run it
│   ├── 01_narrative.md
│   ├── 02_concept.md
│   ├── 03_script.md
│   ├── 04_visuals.md
│   └── 05_motion.md
└── craft/                # Starter templates — copy into a new project
    ├── base.json         # Style primitives starter
    └── motion.md         # Motion vocabulary starter (principles + camera patterns)
```

**Project file structure** (what gets deployed):

```
project/
├── NARRATIVE.md          # Plain business story — no creative device
├── CONCEPT.md            # Metaphor, semantic field, beat-by-beat mapping
├── SCRIPT.md             # Frame-by-frame VO + visual brief
├── MOTION.md             # Camera patterns and transition directives (from craft/motion.md)
├── storyboard.html       # Visual grid of all confirmed frames
└── visuals/
    ├── FRAMES.md         # Base visual grammar + per-shot prompt specs (from craft/FRAMES.md)
    └── [shot images]     # Named by shot ID (F01S01.jpg, F02S01.jpg, etc.)
```

---

## The Image Spec System

All image generation is governed by a single file: `visuals/FRAMES.md`. It holds the base visual grammar and every per-shot spec in one place, using a two-part structure that preserves consistency without duplication.

### How It Works

The base and the shots live in the same file, disassembled. Nothing is pre-concatenated. When a prompt is needed for generation, it is assembled on demand in the conversation — base + shot combined at that moment.

**Rule:** if a parameter belongs to all shots, it lives in the base section only. Shot specs contain only what is unique to that shot.

---

### File Structure: `FRAMES.md`

The file opens with a plain-language description of the visual world, followed by the base JSON block. Each shot follows the same pattern: plain-language brief first, frame-specific JSON below.

```
# [Project] — Frames

[One or two sentences describing the visual world — the human reads this to orient.]

## Base — Shared Visual Grammar

[Plain-language brief of the visual world]

[Base JSON block — style, lighting, color, world, camera, mood, exclude]

## Shots

### Beat [N]

#### S[id] — [Label]

[One or two sentences — what you see, what it feels like. The human reads this before the spec.]

[Frame-specific JSON block — composition, subject, action, depth_of_field, mood, any special fields]
```

Start from `formats/video/craft/FRAMES.md`.

---

### Base JSON — Style Primitives

Core fields:

```json
{
  "style": { "medium", "rendering", "reference", "grain", "finish" },
  "lighting": { "time_of_day", "quality", "direction", "temperature", "shadows" },
  "color_palette": { "dominant", "secondary", "accent", "sky", "avoid" },
  "world": { "setting", "continuity" },
  "camera": { "depth_of_field", "aspect_ratio", "movement", "lens_feel" },
  "mood": "...",
  "exclude": ["..."]
}
```

Choose a cinematic reference and hold to it across every shot. The base is set once and inherited by all shots — edit it to change the visual world globally.

---

### Per-Shot JSON — Frame-Specific Spec

Core fields:

```json
{
  "id": "F01S01",
  "beat": 1,
  "composition": { "framing", "angle", "subject_placement" },
  "subject": { "primary", "secondary", "setting" },
  "action": "...",
  "depth_of_field": { "focus", "background" },
  "mood": "...",
  "continuity": "...",
  "generation": "..."
}
```

**Shot ID convention:** `F[frame]S[shot]` — both parts two-digit zero-padded, e.g. `F04S02`, `F04S03`, `F04S04`. Frame = the script frame (01–08); shot = the individual generated image within that frame. Fixed-width so IDs sort correctly and read the same length everywhere. Multiple shots per frame capture different moments or angles within the same narrative beat.

**`continuity` field:** reference to another shot this one must structurally match (same tree proportions, same framing, etc.).

**`generation` field:** instruction for how to produce this shot — scratch, reference image, continuity pull from an existing shot, or model instruction.

---

## The Storyboard

`storyboard.html` is the visual review surface. Every confirmed frame image lives here — no placeholder text. Update it each time a new image is confirmed. The storyboard is the ground truth for what has been generated and approved.

---

## MOTION.md — Motion Directive System

`MOTION.md` stores reusable motion vocabulary and per-transition directives. Structure:

```
## Principles       — rules that apply to any prompt using reference images
## Camera Patterns  — named, reusable camera movements
## Motion / Time Effects — botanical time-lapse, practiced human motion, etc.
## Transitions      — per-transition directives (start frame → end frame)
## Global Rules     — light, film quality, DOF, setting constants
```

**Motion Only Rule** (principle): when a generated image is provided as a reference frame, describe only the movement — not the visual style. The model reads the image; restating style adds noise and can cause reinterpretation.

**Keyframe Interpolation** (technique): place two images as start and end frames. Write a motion prompt describing only what happens between them. Use when both endpoints are confirmed and the motion is the unknown.

---

## Quality Gates

### Visual Continuity
Every shot that will be interpolated with an adjacent shot must share structural anatomy with it. For organic subjects: trunk thickness, root flare, bark texture, scaffold branch angles. **Technique:** paste both images into the generator and ask it to correct one to match the other — keeping everything else identical — before running video generation.

### Botanical Accuracy
For plant/tree subjects:
- Offshoots emerge from dormant buds on the bark — never from the center of an exposed cut face.
- Time-lapse growth sequence: bare branches → leaves → white blossoms → blossoms fall → green fruit → ripe fruit.
- Pruning scale: match branch diameter to the tool used (4–6cm for hand loppers, larger for saw work).

### Continuity Instruction Technique
To get a closer or adjusted version of a confirmed image: paste the existing image + a single-change instruction. Do not regenerate from a new prompt — that resets composition, lighting, and all style details.

### Quality Enhancement Pass
Images generated without a JSON spec may lack film grain and cinematic feel. Bring them up by passing them into the generator with a `preserve` + `enhance` JSON: lock composition, framing, and content; apply cinematic photography quality, film grain, and shallow DOF.

---

## Voice / VO Production

Character-driven VO works better than generic narrator. Define:
- **Voice character**: regional accent (kept subtle), pace, register, age, class trajectory
- **Tone**: confident, unhurried, earned — not performed
- **Pronunciation notes**: include phonetic respelling for proper nouns and brand names that voice generators mispronounce (e.g. "ah-dah-MAH" not "ah-DAH-mah")

Structure the VO prompt to include: character description, emotional register, pacing guidance, and the full VO text with any phonetic notes inline.

---

## Video Generation

**Engines:** Runway and Kling (via Runway interface or direct).

**Prompt structure per transition:**
1. Reference the start and end images (keyframe interpolation)
2. Describe only the movement — not the visual style
3. Name the camera pattern (from MOTION.md) and duration
4. Add any subject-specific motion (plant growth, tool movement, etc.)

**Duration:** Never include `duration` in motion prompts or motion directive specs. Duration is set by the operator in the Runway / Kling interface — it belongs to the generation UI, not the prompt text. The guidance below is for the operator's reference only.

- Seed / root shots: 3–4 seconds
- Growth time-lapses: 5–10 seconds depending on arc length
- Human action shots: 2–3 seconds
- Structural transitions (tree-to-root): 3–4 seconds

**Engine notes:**
- Runway excels at smooth camera moves and keyframe interpolation
- Kling engine (via Runway) handles organic motion well — botanical time-lapse, handheld feel
- For botanical time-lapse: explicitly request jittery, frame-by-frame quality — "each frame captured one day apart." Do not ask for smooth.

---

## Working Discipline

- **Discuss → confirm → write.** For script frames: propose the VO line and visual brief for each frame verbally, wait for confirmation, then write. Never advance to the next frame until the current one is confirmed. For image prompts: describe what a shot will look like before writing the JSON. Never write a prompt the operator hasn't confirmed. The principle is the same — conversation first, file second.
- **One change at a time.** When iterating on a generated image, change one element per pass. Changing multiple things in one pass makes it impossible to know what caused a regression.
- **Images first, motion second.** All keyframe images must be confirmed before writing motion directives.
- **Name everything.** Every shot gets an ID, a label, and a storyboard cell. Nothing confirmed lives only in conversation context.
- **No format lock.** The visual track and VO track operate independently — they meet in meaning, not in description. Neither explains the other.
