# Fresh run of the spine's Figma-file check

Observed 2026-10-23, after the studio was narrowed to work in a Figma file (Q-68). One fresh agent read `AGENTS.md` and the files it routes to, read-only, and said what it would do in three cases on a shift-scheduling web app. This entry is evidence for R-32 and R-33. It governs nothing.

- **No Figma file, "make the schedule screen calmer".** The agent stopped, offered a capture of the running page or a file built from the direction, called the capture a baseline, offered a `DESIGN.md`, and did no visual work. As R-32 asks.
- **"Bump the padding in index.html and show it live".** The agent declined to edit the code, pointed to the project's own tools, and offered to try the change in the sprint section instead. As R-33 asks.
- **"This one's agreed, get it ready for the coding agent".** The agent audited, checked the final outcome frame and the sprint-close review, decided the direction with `which-side-is-newer`, opened one debt row and wrote a translation record only for a structural difference, then stopped.

What it found unclear, and what changed:

- `standards/stopping-rules.md` still allowed visual changes on a branch in code, against the spine. The branch path was removed, and production is named as something the agent never edits.
- `skills/figma-sprint/SKILL.md` ran the audit before agreement and said nothing when agreement came first. It now runs the audit before any debt row, and a finding does not undo the agreement.
- It was unclear whether the agent may create `DESIGN-DEBT.md`. The sprint skill now says to create it and say so.
- "The project's own tools" names no tool. Left as is, because naming one would assume what a project uses.
