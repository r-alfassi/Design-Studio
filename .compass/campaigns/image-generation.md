# Image-generation workflow adoption

State: Seed.

Tier: next.

## Vision

Design Studio has an image-generation workflow that agrees with its video deliverable model, so that generated visual work does not depend on a retired prompt-file structure.

## Quest Q-61 — adopt and reconcile image generation

State: Seed.

Deferred: 2026-09-06 from Q-59's batch.

Problem: the `image-gen` skill from the Workspace_0 branch is a two-part JSON prompting workflow for cinematic image generation coupled to the `video` format. It assumes `visuals/base.json` and `visuals/frames.json`. The video format merged those into `FRAMES.md`, confirmed during the Adama work on 2026-09-06. Adopting the skill unchanged would add a workflow that points to a structure the format no longer uses.

Outcome: `image-gen` is adopted into `skills/`, with its base and shot-prompt loading reconciled to the video format's current per-shot specification model. The remaining decision is whether that model stays as `FRAMES.md` alone or restores a separate base-prompt file.

Done when: concrete before the first task.
