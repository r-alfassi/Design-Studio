# Design Studio — structure

How this resource is organized, so a reader can go from a project need to the
right resident, and so it stays legible as it grows.

Governed by `federation/RESOURCE.md`. Principal is the steward; the Designer
approves material changes. The admission discipline is in `CONVENTIONS.md`.

---

## The four kinds

Every normative resident is one of four kinds. They answer different questions
and are not interchangeable.

| Kind | Answers | Prescribes | Does **not** prescribe | Lives in |
|---|---|---|---|---|
| **Format** | "What shape must this deliverable take?" | the structure, layers, and gates of a named deliverable | how you think through the content, or the tool you use | `formats/` |
| **Framework** | "How do I reason through this design question and make an evidence-aware choice?" | a sequence of questions and quality bars | any deliverable shape, any procedure, any tool | `frameworks/` |
| **Standard** | "What reusable design constraint must this selected project satisfy?" | a stable constraint, its scope, validation, and explicit exception route | a project’s product decisions or an execution workflow | `standards/` |
| **Skill** | "How do I carry out this task?" | a workflow — steps, tool calls, checks | — | `skills/<name>/SKILL.md` |

Rules of thumb:

- If it ends in a **document with a required structure**, it's a format.
- If it's a **way of examining a question** — no fixed output, no fixed steps —
  it's a framework. A framework leaves the project free to choose its medium.
- If it is a **non-negotiable reusable constraint** with a stated validation
  and exception route, it is a standard. A project selects it explicitly; it
  never silently decides a project-specific product tradeoff.
- If it's **steps you execute**, often against a tool, it's a skill.

Borderlines resolve by what the resident *is at its core*, not what it also
touches. `checklist-design` is a skill (a review procedure) that *implements*
an evaluation framework (`library/heuristic-evaluation.md`) — the procedure is
the resident. `new-component`'s four-file standard is a deliverable shape, so
that part is a format; the "wire it into the mockup" steps are a thin skill.

## The meta/process tag

A few skills operate on *how design work is done* rather than producing a
design artifact:

- `skill-creator` — authors other skills
- `figma-conversion-skill-builder` — builds a screen-conversion skill by calibration
- `figma-production-loop` — governs a Figma→production iteration with promotion gates

These are still skills (steps you run). They are **tagged `meta`** in the
resident index so a reader looking for a craft procedure isn't misdirected.
`meta` is a tag, not a fifth directory.

## Supporting material (not a kind)

| Directory | Role |
|---|---|
| `references/` | this repo's own operational how-tos (tool setup, connection config) |
| `library/` | external, non-binding resources — a shelf, not a procedure; each owned by its original author |
| `skills-lock.json` | provenance + integrity for vendored third-party skills |
| `CONVENTIONS.md` | naming rules, the admission checklist, how skills are consumed |
| `skills/README.md` | the resident index — every skill with its tag and a one-line "reach for this when" |

A skill's own `references/` `scripts/` `assets/` are part of that skill only
when the `SKILL.md` names their role (per `RESOURCE.md`).

## Choosing a resident

1. Is the project producing a **named deliverable** with a required structure
   (a deck, a benchmark, a video, a mockup, a component)? → a **format**.
2. Does the project need to **reason to a choice** — positioning, audience,
   direction — before expression is settled? → a **framework**.
3. Does the project need to honor a named **cross-project design constraint**
   — such as a legibility floor — in its selected scope? → a **standard**.
4. Does the project need to **do a task** — build a screen, recreate a
   component, audit a frame, translate copy, run a preview server? → a
   **skill** (check `skills/README.md` for the right one; the Figma skills are
   a layered set — start at the `figma` router).

If two residents seem to fit, one is probably mis-filed or they overlap —
raise it rather than picking arbitrarily. Overlap is what the admission
checklist exists to catch before it lands.

## Scope boundary

Design Studio holds design **craft** — making and evaluating design artifacts,
and reasoning through design questions. It does not hold: cartridge-deployment
and project-governance method (that is Principal / federation territory —
see the archived Harness cartridge-lifecycle skills), personal Designer
preferences, universal collaboration culture, per-project design decisions, or
any client-identifying content.
