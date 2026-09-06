# [Project] — Frames
## Visual Prompt System

Two-part prompting. The base lives here disassembled. Each shot holds only its frame-specific spec. Assembly happens on demand in the conversation — base + shot combined when a prompt is needed for generation.

---

## Base — Shared Visual Grammar

[One or two sentences describing the visual world — the human reads this to orient before the JSON.]

```json
{
  "style": {
    "medium": "photorealistic photography",
    "rendering": "cinematic [lens]mm film photography, natural light",
    "reference": "[Director — Film Title]. [One-line tone description.]",
    "grain": "subtle [lens]mm film grain",
    "finish": "not hyper-clean digital — slightly organic, film-like"
  },
  "lighting": {
    "time_of_day": "[golden hour / overcast / blue hour — choose one and hold it]",
    "quality": "warm, soft, directional",
    "direction": "[raking from the side / filtering from above / etc.]",
    "temperature": "[warm amber / cool silver / etc. — never change mid-project]",
    "shadows": "soft and long — never harsh"
  },
  "color_palette": {
    "dominant": "[primary color family]",
    "secondary": "[supporting tones]",
    "accent": "[used only for the key subject or change moment]",
    "sky": "[note if sky should be minimal or avoided]",
    "avoid": "[list the tones and elements to exclude]"
  },
  "world": {
    "setting": "[the one world this video lives in — establish it and hold it]",
    "continuity": "every shot belongs to the same world, same time of day"
  },
  "camera": {
    "depth_of_field": "shallow — subject sharp, background soft",
    "aspect_ratio": "16:9",
    "movement": "static frame",
    "lens_feel": "[telephoto compression / wide / etc.]"
  },
  "mood": "[one phrase — the emotional register that holds across the whole video]",
  "exclude": [
    "[element to exclude]",
    "logos or brand marks",
    "text overlays",
    "[environment type to exclude]"
  ]
}
```

---

## Shots

---

### Beat 1

#### F01S01 — [Label]

[One or two sentences — what you see, what it feels like. The human reads this before the spec.]

```json
{
  "id": "F01S01",
  "beat": 1,
  "composition": {
    "framing": "[extreme macro / close-up / medium / wide]",
    "angle": "[above / eye level / low / etc.]",
    "subject_placement": "[centered / left / etc.]"
  },
  "subject": {
    "primary": "[main subject — specific and concrete]",
    "secondary": "[supporting element]",
    "setting": "[where in the world this takes place]"
  },
  "action": "[what is happening — or 'still' if nothing moves]",
  "depth_of_field": {
    "focus": "[what is sharp]",
    "background": "[how the background renders]"
  },
  "mood": "[emotional register of this specific shot]"
}
```

---

#### F01S02 — [Label]

[Plain-language brief.]

```json
{
  "id": "F01S02",
  "beat": 1,
  "composition": {},
  "subject": {},
  "action": "",
  "depth_of_field": {},
  "mood": "",
  "continuity": "[reference to another shot this must structurally match, if any]",
  "generation": "[scratch / reference image: [source] / continuity pull from [shot id]]"
}
```
