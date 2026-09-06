# Motion Vocabulary — Starter
## Reusable patterns for Runway / Kling generation

Copy this file to `MOTION.md` in the project folder. The Principles, Camera Patterns, and Motion/Time Effects sections below are project-agnostic — keep them as-is. Add project-specific transition directives under the Transitions section.

---

## Principles

### Motion Only (Reference Image Rule)
When using a generated image as a reference frame or keyframe, describe only the movement — not the visual style. The model can see the light, color, grain, and depth of field in the image. Restating them adds noise and can cause the model to reinterpret the look rather than preserve it.
> Apply to: any Runway / Kling prompt where an image is provided as input.

### Keyframe Interpolation
Place two images as start and end frames. Write a motion prompt describing only what happens between them. The model generates the movement; the images anchor the composition and look at both ends. Use when you know exactly where a shot starts and where it lands — the motion is the unknown.
> Apply to: any transition with a confirmed start image and a confirmed end image.

---

## Camera Patterns

### Handheld Witness
Subtle, organic micro-movements — as if the camera is held by a person, not mounted on a tripod. The camera breathes. Adds a documentary, present-tense feel. Use for human-scale moments where stillness would feel too clinical.
> *"The camera has a slight handheld quality — subtle, organic micro-movements, as if held by a person, not mounted on a tripod."*

### Static Observer
Camera does not move. The subject does all the work. Use when the motion is in the subject and camera drift would compete with it.
> *"The camera holds still throughout."*

### Steady Pull Back
Smooth, continuous outward movement — no jitter, no drift. Used to accommodate a growing or expanding subject without losing it from frame. The camera is the calm constant; the subject changes.
> *"The camera pulls back slowly and steadily — smooth, continuous outward movement."*

### Slow Push In
Smooth, continuous forward movement toward the subject. Used for revelatory moments — closing in on detail, descending toward a base, arriving at the focal point.
> *"The camera moves slowly forward — smooth, continuous, unhurried."*

### Descend Through Earth
Camera pushes downward through a surface in a slow, continuous motion. The surface becomes a cross-section as the camera descends.
> *"Camera slowly pushes down through the surface. Starting at the top, the camera descends — layers become visible as the camera moves deeper."*

---

## Motion / Time Effects

### Botanical Time-Lapse
A jittery, frame-by-frame quality — as if each frame was captured one day apart at the same time of day. The light stays constant. Only the plant shifts between frames: leaves adjust position, branches extend, growth accumulates. Not smooth CG — alive and slightly unpredictable.
> *"The growth has a slightly jittery, frame-by-frame quality — like a real time-lapse where each frame was captured one day apart, always at the same light. The light is consistent throughout. Only the plant shifts between frames."*

### Botanical Sequence (Orange Tree)
The correct growth order for an orange tree time-lapse: bare branches → leaves unfurling → white blossoms covering the canopy → blossoms falling → small green fruit developing → fruit swelling and ripening to orange.
> *"White blossoms appear across the canopy before the fruit — small, delicate, briefly covering the tree. Then the blossoms give way to small green fruit, which slowly swell and ripen to full orange."*

### Practiced Human Motion
A worker performing a habitual, skilled task — unhurried and deliberate. The motion is slow and practiced, not performative.
> *"Slow, deliberate movement — unhurried and practiced."*

---

## Transitions

*(Project-specific. Add one entry per cut between confirmed frames. Format: start frame → end frame, technique, camera pattern, duration, prompt.)*

---

## Global Rules

*(Fill in project-specific constants — light, film quality, DOF, setting. These should match base.json.)*

- Light: [time of day and color temperature — hold this across all shots]
- Film quality: cinematic [lens]mm feel, subtle grain, not hyper-clean digital
- Depth of field: shallow — subject sharp, background soft
- Setting: [the one world this video lives in]
