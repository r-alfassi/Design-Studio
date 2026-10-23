# Design Studio structure: proposal

This document proposes how Design Studio's compartments are named, what each one holds, and how they load. It is for the Designer to react to, and it replaces `STRUCTURE.md` only if the Designer accepts it. Read it through once, then use the vocabulary table as a lookup. Everything here is a proposal unless a line says the Designer decided it.

It rests on three sources. The Blueprint principles supply the shape: one spine, branches that are smaller spines, a compartment for each junction, routes and not copies, only what earns its place, a check by use, and exact things from tools. Compass and Principal supply the words and the construction rules, because both already name the same compartments. The sessions of 2026-10-21 to 2026-10-23 supply the requirements the structure has to meet (`compass/product/requirements.md`).

## The shape

One spine loads first and is the only part that loads anything. Each way into the work is a skill, which is a smaller spine for its own job. A skill pulls in the frameworks, standards, templates and tools it needs by route, and those leaves load nothing. The record, the journal and the research stay outside the run.

```
spine           the root entry file: what loads before the first move, the flow, the routes by kind of work
 ├─ skill       a whole job from start to a result, with its own sequence
 │    ├─ framework   one judgment, as questions and quality bars
 │    ├─ standard    binding rules for a kind of work, with a test and an exception route
 │    ├─ template    the shape of one file or deliverable
 │    └─ tool        a script that produces what must be exact
 └─ (outside the run)  record · research · journal
```

## The vocabulary

One word for each compartment. The right column says what it is called today.

| Compartment | What it is | The question it answers | Loads | Called today |
|---|---|---|---|---|
| **Spine** | The root entry file. It holds the sequence and the routes and restates nothing a loaded part says. | What loads first, and where does this kind of work go? | First, always | `AGENTS.md` (the maintenance guide, to be moved out) |
| **Skill** | A whole job carried from start to a result. Its `SKILL.md` is a smaller spine. | How is this job done, in order, and where does it stop for the Designer? | When the spine routes to it, or by name | skill; also "branch", "route", "way in", "contained procedure" |
| **Framework** | One judgment, as questions to resolve and quality bars. It fixes neither the output nor the tools. | How do I reason to this choice? | When a skill or the spine reaches that junction | framework |
| **Standard** | Binding rules for a kind of work, each with a scope, a test and an exception route. A project adopts it by name in its `DESIGN.md`. | What must hold here? | When a skill or a project names it | standard |
| **Template** | The required shape of one file or deliverable, with what each part is for and what not to add. | What shape must this take? | When a skill writes that thing | format; "contract format"; "translation record format" |
| **Tool** | A script that produces what must be exact and reports, or changes only what it is told. | What is the exact answer? | When a skill runs it | scripts in skill folders; `bin/`; `tools/` |
| **Kit** | The published Figma library of presentation parts that a standard points to. It lives in Figma and not in this repo. | Which parts hold and label the work? | By subscription in a project's Figma file | studio kit, Components page |
| **Reference** | A how-to of this repo's own, such as tool set-up. | How do I set this up here? | By route from a skill | `references/` |
| **Shelf** | Other people's material worth returning to. It binds nothing. | What have others written on this? | By route, rarely | `library/` |
| **Record** | What is intended and in progress for Design Studio itself: product, campaigns, journal, research. | What is true and in progress here? | Never in a run. Read when working on this repo. | `compass/` |

## How loading works

1. **Only the spine loads at first.** A project imports it through its own entry file. The spine names the direction check, the way in that the request calls for, and the other crafts, and it loads nothing else. Blueprint principle 1.
2. **A skill is a smaller spine.** It holds its own sequence and loads its frameworks, standards, templates and tools by route, under the same principles as the root. A skill never restates a standard's rule. Blueprint principles 1 and 3.
3. **A leaf loads nothing.** A framework works on what is already loaded and names other material by concept and not by path. A standard, a template and a tool pull in nothing. Blueprint principle 1.
4. **Each junction is its own compartment.** A moment where judgment is handed to the agent gets a framework, so that a change of preference touches one file and no spine. Blueprint principle 2.
5. **A part that fires for one kind of project is its own skill.** It loads only there, and the spine does not carry it. The pixel-art skill is the case.

## Where each present resident goes

This is the migration map. Nothing moves until the Designer accepts the proposal.

| Today | Becomes | Note |
|---|---|---|
| root `AGENTS.md` | the spine | the maintenance rules and the Compass import move to a separate file |
| `STRUCTURE.md`, `CONVENTIONS.md` | one file for people working on this repo | admission checklist and naming rules |
| `skills/figma-production-loop` | the sprint skill, plus the handoff steps | loses the promotion gate and the production steps |
| `skills/figma-audit-structure` | the audit skill | joins the variable-binding check of `figma-ds-recreate` |
| `skills/figma-design-system` | the formalize skill | already rewritten |
| `skills/figma-ds-recreate` | folded into the audit skill | Phase 0 only |
| `skills/figma-pixel-fidelity` | stays a skill that fires only on pixel-art projects | |
| tune in place | a new skill | not written yet |
| `formats/*` | templates | the contract format and the debt and translation shapes first |
| `standards/mobile-design.md`, `standards/studio-presentation.md` | standards | unchanged |
| the stopping rules, the conflict route, "keep the Designer's hand" | new standards | now spread through skills |
| `frameworks/*` | frameworks | add the junction frameworks below |
| `references/`, `library/` | unchanged | |
| `compass/` | the record | unchanged |

## Proposed junction frameworks

Each is a judgment the agent now makes inside a skill or by habit. Giving each a framework applies Blueprint principle 2. Each is a proposal and none is written.

- **Which way in:** sprint, formalize or tune in place, from the request. This is also the open question from the entry-point discussion.
- **Which side is newer:** Figma or the code, for a component, which decides the direction on a debt row.
- **What counts as approved:** the line between exploring and changing what the Designer has approved.
- **How to propose a token:** what to do with an off-scale value, by snapping, keeping or asking.

## Naming rules

- Name a skill for the activity it performs, in the form of an action, such as formalizing a component.
- Keep the `figma-` prefix only on a skill that works on Figma files alone. A skill that is medium-neutral, such as tuning in place, has no prefix.
- One word for each compartment, as in the table above. A retired word is not used again in any file. Search the record for the old words when this is accepted.
- A standard is named for what it governs. A template is named for the thing it shapes.

## What this adds to the principles

Three points in this work are evidence for Blueprint and Compass, and the Designer decides whether to record them there:

- Principle 4, only what earns its place: a fresh run showed that a mapping table and several principles in the Android guidance added nothing a cold agent lacked, and that one list in it did.
- Principle 5, check by using: five fresh runs on real frames and screens decided what stayed, what was fixed and what left.
- Routes, not copies: the operating board was a second source of status beside the record, and it had already gone stale.

## Decisions for the Designer

1. Whether the one word "template" replaces "format" for the shapes of files and deliverables.
2. Whether the ways in are named as skills for an activity, with `figma-` kept only on Figma-only skills.
3. Which of the four junction frameworks to write, if any.
4. Where the maintenance file lives, since Codex reads only an entry file at a repo root.
5. Whether the proposal replaces `STRUCTURE.md` as it stands.
