# Design Studio structure

This file says how Design Studio is organized: what each compartment is, how the compartments load, how they are named, and how a new resident is admitted. It is for people and agents working on this repo itself, and a project that imports Design Studio never loads it. Read it through once, then use the vocabulary table as a lookup.

The record in `.compass/` holds what Design Studio intends and what is in progress. Principal is the steward, and the Designer approves material changes.

## The shape

One spine loads first and is the only part at its level that loads anything. Each way into the work is a skill, which is a smaller spine for its own job. A skill pulls in the frameworks, standards, templates and tools it needs by route, and those parts load nothing themselves. The record, the journal and the research stay outside the run.

```
spine           the root entry file: what loads before the first move, the flow, the routes by kind of work
 ├─ skill       a whole job with its own steps, carried to a result
 │    ├─ framework   one judgment, as questions and quality bars
 │    ├─ standard    binding rules for a kind of work, with a test and an exception route
 │    ├─ template    the shape of one file or deliverable
 │    └─ tool        a script that produces what must be exact
 └─ (outside the run)  record · research · journal
```

## The vocabulary

| Compartment | What it is | The question it answers | Loads | Lives in |
|---|---|---|---|---|
| **Spine** | The root entry file. It holds the sequence and the routes, and restates nothing a loaded part says. | What loads first, and where does this kind of work go? | First, always | `AGENTS.md` |
| **Skill** | A whole job carried from start to a result. Its `SKILL.md` is a smaller spine. | How is this job done, in order, and where does it stop for the Designer? | When the spine routes to it, or by name | `skills/` |
| **Framework** | One judgment, as questions to resolve and quality bars. It fixes neither the output nor the tools. | How do I reason to this choice? | When a skill or the spine reaches that junction | `frameworks/` |
| **Standard** | Binding rules for a kind of work, each with a scope, a test and an exception route. A project adopts it by naming it in its `DESIGN.md`. | What must hold here? | When a skill or a project names it | `standards/` |
| **Template** | The required shape of one file or deliverable, with what each part is for and what not to add. | What shape must this take? | When a skill writes that thing | `templates/` |
| **Tool** | A script that produces what must be exact. It reports, or changes only what it is told. | What is the exact answer? | When a skill runs it | `tools/`, a skill's own `scripts/`, `bin/` |
| **Kit** | The published Figma library of presentation parts that a standard points to. It lives in Figma and not in this repo. | Which parts hold and label the work? | By subscription in a project's Figma file | Design Studio's Figma file |
| **Reference** | A how-to of this repo's own, such as tool set-up. | How do I set this up here? | By route from a skill | `references/` |
| **Shelf** | Other people's material worth returning to. It binds nothing. | What have others written on this? | By route, rarely | `library/` |
| **Record** | What is intended and in progress for Design Studio itself: product, campaigns, journal, research. | What is true and in progress here? | Never in a run. Read when working on this repo. | `.compass/` |

## How loading works

1. **Only the spine loads at first.** A project imports it through its own entry file. The spine names the direction check, the way in that the request calls for, and the other crafts, and it loads nothing else.
2. **A skill is a smaller spine.** It holds its own sequence and loads its frameworks, standards, templates and tools by route, under the same rules as the root. A skill never restates a standard's rule.
3. **A part that carries no whole job loads nothing.** A framework works on what is already loaded and names other material by concept and not by path. A standard, a template and a tool pull in nothing.
4. **Each junction is its own compartment.** A moment where judgment is handed to the agent gets a framework, so that a change of preference touches one file and no spine.
5. **A part that fires for one kind of project is its own skill.** It loads only there, and the spine does not carry it.

## Choosing a resident

1. Does the work end in a document or deliverable with a required structure, such as a deck, a benchmark, a video, a component or a translation record? It is a **template**.
2. Does it reason to a choice, such as positioning, audience, direction or which side is newer, with no fixed output or steps? It is a **framework**.
3. Is it a constraint a project selects and must satisfy, with a test and an exception route, such as a legibility floor or the stopping rules? It is a **standard**.
4. Is it steps you run, often against a tool, to carry a job through? It is a **skill**.
5. Must it be exact, such as a count or a list of nodes? It is a **tool**, and a skill runs it and does not write it.

If two compartments seem to fit, one resident is probably mis-filed, or two overlap. Raise it and do not pick arbitrarily. The admission checklist exists to catch overlap before it lands.

## Naming

- One word for each compartment, as in the table. A retired word is not used again in any file.
- A skill keeps the `figma-` prefix when it works only on Figma files, followed by a short verb for the job: `figma-sprint`, `figma-audit`, `figma-formalize`, `figma-pixel-fidelity`. A skill that is medium-neutral has no prefix, such as `tune-in-place`. The name `rtl` is grandfathered.
- A standard is named for what it governs. A template is named for the thing it shapes.
- A skill that fits one project type fires only there, because its description says so.

## Admitting a resident

Before a skill, framework, standard or template is added, whether new or vendored, answer these four in the resident's campaign quest in the record. An unanswered checklist is not an admission.

1. **Kind.** Which compartment is it, by "Choosing a resident"? Does it fit that kind's definition or is it forced? A skill that mostly guides a choice is a framework.
2. **Overlap.** Does an existing resident already do this or most of it, including the Figma plugin's own skills? If so, extend or point to the existing one. Add a separate resident only when it does something the existing one does not, and say what.
3. **Shape.** A skill is `skills/<name>/SKILL.md` with a `name` and a `description`. A template is a named spec, a single file or a folder with a `TEMPLATE.md`. A framework is one self-contained file. A standard is one self-contained file that names its scope, binding statement, validation and exception route.
4. **Client-content scan.** Search for client names, engagement names, operator paths and usernames, and, for design material, hardcoded private libraries, component keys and token dumps. The result is clean or scrubbed to neutral placeholders. This is a standing rule and not a one-time check.

A resident stays only if a fresh run on a real case does better with it than without it, and it leaves when a test shows no difference or when something the agent already has covers it. When the resident is a skill, update `skills/README.md`.

## Using a skill

When a `SKILL.md` says to apply its rules without re-deriving the logic each time, take that literally. Read the skill, run one inspection pass to classify the work, then start. Pause only for a surprise the skill does not address, and do not re-inspect what the skill already documents.

## Scope boundary

Design Studio holds design craft and the visual-design process: making and evaluating design artifacts, and reasoning through design questions. It does not hold a project's intent, per-project design decisions, personal Designer preferences, universal collaboration culture, or any client-identifying content.
