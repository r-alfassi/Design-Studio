# Layer 5 — Motion

**What it is:** The video generation layer. Camera patterns, transition directives, and motion vocabulary for Runway / Kling. Written only after all keyframe images are confirmed.

**What it does not do:** Describe visual style, color, lighting, or image quality. The confirmed images contain all of that. Restating it in motion prompts adds noise and can cause the engine to reinterpret the look.

**The test:** Does every cut between confirmed frames have a transition directive? Is the Motion Only Rule applied to every prompt that uses a reference image?

**Governance:** No motion directive is written for a transition until both endpoint images are confirmed in the storyboard.

**Motion Only Rule:** When a generated image is provided as a reference frame, describe only the movement — not the visual style. The engine reads the image.

**Keyframe Interpolation:** Place two images as start and end frames. Write a motion prompt describing only what happens between them. Use when both endpoints are confirmed.

**Starting point:** `formats/video/craft/motion.md` contains the reusable motion vocabulary — principles, camera patterns, and motion/time effects — that apply to any project. Copy it into the project and add project-specific transition directives.

**File naming:** `MOTION.md`
