# F-008 - List the nodes before any bulk removal in a shared Figma file

- **Status:** open; distilled into the skill on 2026-10-20, to close when the condition below is evidenced
- **Observed:** 2026-10-20. A step to turn "text-only boards" into card text removed five real design frames. They were a layout skeleton, two HUD territory frames and two HUD type candidates. The filter counted a frame as text only when it held text and nested frames that held text. The text in those frames was the game's own interface labels, so the filter read design as annotation. The frames were recovered by restoring a version, and the restore went back further than intended, which cost a rebuild of the day's work.
- **Operating correction:**
  - Before any removal of more than one node, return the exact list of nodes it would remove, with the evidence that each holds only what has already been moved or copied. Show the list to the Designer, and remove nothing until it is confirmed.
  - A node is annotation only when every child is a text node and nothing is nested. Text inside a frame is not enough, because interface text is design.
  - A removal inside a scripted move runs only after the script has checked that what is left in the container is exactly what it expected, and it stops with an error if anything else remains.
  - Before relying on a restore, check what the restored file holds: the nodes meant to come back, and the work that should have been kept.
- **Close when:** the next bulk change to a project's Figma file shows a listed dry run to the Designer before it removes anything, and no node that holds design is removed.
