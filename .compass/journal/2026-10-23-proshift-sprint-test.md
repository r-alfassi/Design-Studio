# First test of the narrowed studio on ProShift

Observed 2026-10-23 on ProShift (a Hebrew, right-to-left scheduling app), after the studio was narrowed to work in a Figma file (Q-68). The Designer set the test as: can the studio run the design workflow they envisioned. This entry is evidence for R-21, R-32 and R-34, for the frame card and for the `rtl` and sprint skills. It governs nothing.

What worked: the spine found the stated direction, found the project's Figma file, offered a `DESIGN.md` and waited. The sprint was scoped to the three open points on the schedule screen. The kit's direction summary and placeholder box imported by key into a file that had not added the library.

What it found:

- **The frame card could not hold a design.** Its slot was an ordinary frame, and the Plugin API refuses to add children inside an instance. The slot was replaced with a native slot (`component.createSlot()`, not `figma.createSlot()`). It needs the Designer's republish before another file sees it.
- **The capture of a right-to-left page is mirrored.** The captured frames are horizontal auto-layout in DOM order, left to right, so the logo, step 1, the table's label column and the title are on the wrong side. The browser render of the same page is correct. The agent copied the capture's order into two proposals and described the left-to-right days as v8's behaviour, which was wrong. Fixed by reversing rows and swapping start and end alignment on a clone, and both proposals were mirrored the same way. The lesson now sits in the sprint skill and the `rtl` skill's Figma reference. R-34 was added.
- **A hidden `position: fixed` toast is captured as an empty frame**, which showed as a dark pill in the middle of the page.
- **`DESIGN.md` missed four colors** that v8 hardcodes (the amber tint, its ink, its rule, and the dark step-number fill). They are in the Figma tokens and should be added to `DESIGN.md`.
- **A script that sets `FILL` before a node has a parent fails** and leaves half-built nodes on the page. The retry removes page-level orphans first.
