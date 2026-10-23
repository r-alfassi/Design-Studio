---
description: How Design Studio's visual-design package works inside: a spine that routes by kind of work to three ways in, shared stopping rules, record templates, and scripts, with the parts that realize each feature.
follows: [constraints.md, principles.md, features.md]
---

# System

This file says how the product works inside, what it is built with and which parts realize each feature, which someone using it cannot observe. Where it disagrees with the purpose, audience, scope or principles, they win.

Source: derived from the features on 2026-10-21. Open: a draft. Most of the package does not exist yet, so a feature that no existing part realizes says "none yet", and the planned parts are described under "How it works".

## Built with

- **Markdown files.** The spine, the standards and the templates are plain text, so any agent tool can read them and a diff shows every change.
- **`SKILL.md` procedures.** Each way in is a procedure that an agent follows, and it can be found by name through the junctions that `bin/link-skills.ps1` makes for Claude Code and Codex.
- **JavaScript scripts run through the Figma plugin's `use_figma` tool.** An exact check, such as an audit or a reconcile, comes from a script and not from an agent's reading.
- **An installable package.** The repo is installed into a project and imported through the project's `AGENTS.md`, the way Compass is.
- **The official Figma plugin and `impeccable`.** The package calls the plugin's skills for every Figma write and reads and writes `DESIGN.md` in the format `impeccable` uses. It restates neither.

## How it works

A request for visual work reaches the spine, an `AGENTS.md` that holds the sequence and loads nothing else at first.

1. **The spine checks the direction.** It looks for the project's stated direction and stops and asks where it is when there is none. It then names the way in that the request calls for.
2. **Three ways in carry the whole job.** Each is a procedure with its own folder. Sprints work in Figma in a marked area that leaves a trail. Formalizing works on a component in the design system. Tuning in place works on a branch of the project's code.
3. **Shared stopping rules are standards, not part of any way in.** What counts as approved, the clone-before-fix rule, the library-component rule, the conflict route and the reconcile-before-writing rule each sit in one short standard that every way in points to, so a change of preference edits one file.
4. **Scripts do what must be exact.** The structure audit, the variable-binding audit, the reconcile and the fix scripts return facts the agent reads, and they never write on their own.
5. **Records are plain files in the project.** `DESIGN.md` holds the style, `DESIGN-DEBT.md` holds where production and the approved design disagree, and `FIGMA-TRANSLATION.md` holds the mapping for a component whose production form differs structurally. Templates in the package give their shapes. Intent is never written here.
6. **Other crafts load on demand.** Brand, mobile, decks, video, `rtl` and translation stay as residents that the spine points to when that kind of work starts.

## Parts

### Find the direction first

Realized by: none yet

### Say which way in

Realized by: none yet

### Keep the project's style document

Realized by: none yet

### Capture the current state in Figma

Realized by: none yet

### Sprint pages that leave a trail

Realized by: `skills/figma-sprint/SKILL.md`

### Present work with the studio's containers

Realized by: `standards/studio-presentation.md`

### Never overwrite the Designer's hand

Realized by: `skills/figma-sprint/SKILL.md`, `skills/figma-sprint/scripts/reconcile-figma-scope.js`

### Audit before relying on a frame

Realized by: `skills/figma-audit/SKILL.md`, `skills/figma-audit/scripts/figma/audit-bound-variables.js`

### Dry run before removal

Realized by: `skills/figma-sprint/SKILL.md`

### Hand off agreed work as design debt

Realized by: `templates/figma-implementation-contract.md`

### Review the built result against the design

Realized by: none yet

### Tune in place on a branch

Realized by: none yet

### Formalize a component

Realized by: `skills/figma-formalize/SKILL.md`

### Keep only what earns its place

Realized by: `CONVENTIONS.md`

### Load by kind of work

Realized by: `bin/link-skills.ps1`

## What was ruled out

- **A package made only for Figma.** Projects tuned in place, in code, would have no way in, and the Designer holds that the studio is responsible for design in any medium.
- **A fixed winner between Figma and code.** One of the two paths would lose work silently.
- **A separate change log file.** The need was a status across design and production, which `DESIGN-DEBT.md` serves, and a per-change log duplicated its status line.
- **Intent and flow layers inside Design Studio.** A PRD file and an HTML flow chart would have Design Studio defining intent, which the scope rules out.
- **A sprint practice in code.** The sprint is a Figma practice whose trail is its section system, and a branch carries the equivalent in code.
- **Moving work into production.** The implementation, the release and the promotion gate belong to the project, and the loop's last two steps leave the package. This follows from the scope line SC-13.
- **Putting the translation record in `DESIGN.md` or in `impeccable`'s sidecar.** A tool that can regenerate those files could remove it.

The repo's root `AGENTS.md` becomes the package spine, decided by the Designer on 2026-10-21. Today it describes Design Studio for the people working on it and imports Compass, and a project that imports the package would pull all of that in, including a Compass import it may not use. So the maintenance rules and the Compass import move to a separate file for work on this repo. Open: where that file lives, because Codex reads only `AGENTS.md` at a repo root.
