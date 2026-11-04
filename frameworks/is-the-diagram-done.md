---
name: is-the-diagram-done
description: Decides whether a diagram an agent drew on a FigJam board is where the Designer asked for it, readable and intact, by checking what the diagram tool's reply does not say. Use before drawing a diagram on a board, and again before telling the Designer it is done.
---

# Is the diagram done

This covers one judgment: whether a diagram drawn on a board is where the Designer asked for it, readable, and intact. It ends when the agent has looked at the render and can say what it saw, or has told the Designer what is wrong with it. It runs on the board and the tools already loaded, and it fixes no output and no layout.

**Before drawing**

1. **Find where it will land.** List the board's pages and read the page the Designer named. A diagram tool that takes a file and no page writes to the first page, to the right of what is already there. Say where the diagram will go, and move it only by a method that has been tried on a throwaway node first. Do not rely on a skill's statement that a board has one page.
2. **Choose a layout the layout engine keeps.** Use one flow direction for the whole diagram. A direction set for one section can be dropped when edges cross sections. Keep a loop inside a section to one step back. Point a back-reference at a duplicate of its target, and not across the diagram.
3. **Expect the diagram's width and where the next one starts.** Each new diagram starts where the last one ended. Estimate how wide the new one will be, and if it may reach the next diagram, decide where to put it before drawing.

**After drawing**

4. **Look at the render and not at the reply.** The tool's reply says it succeeded and does not say the diagram reads. Render the board and compare its size with what is expected. A render taken at the moment of a write can show the old state, so when the size is not what is expected, render again before judging.
5. **Read each diagram as its reader would.** Follow the flow from its start. A section that reads against the direction, an arrow that runs along another, a line through a label and a node hidden under another are each a fault, even when every node and edge is present.
6. **Compare bounds with neighbours.** Read each new section's position and size and compare them with the nearest. Overlap is found from the numbers more reliably than by eye.
7. **After moving anything by script, check the connectors.** A connector attached to a node moved by script can keep its old route, and comparing the ids of its endpoints does not show it. Check connector sizes and render again. Do not shift attached nodes after they are placed.
8. **Stop after two attempts at one diagram.** Before a third, change the structure of the diagram and not its wording or spacing, or tell the Designer what keeps failing.

If a check cannot be run, such as a board that cannot be rendered, say which one, and do not call the diagram done.

*Do:* "The board renders 6,300 px wide on the second render, and the first had shown the old state. The new diagram ends 200 px before the next section starts, and its flow reads left to right."
*Don't:* "The tool returned a link, so it is done."
