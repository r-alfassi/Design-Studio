# F-007 - Keep the game design apart from the sprint layout

- **Status:** open
- **Observed:** 2026-10-20, applying the Design Studio components to a project's sprint page of twenty sprints. Three conflations showed:
  - A frame inside a sprint section acted as the sprint's own parent. One frame held the sprint's title, its question and every step, so the section was only a shell. The steps could not carry their own state label, the summary could not be the component, and a containment check saw one frame and not the steps. Seven sprints did this.
  - A step frame carried presentation chrome around the design: a dark background, a rounded border, and its own title and caption. The studio frame card then added a second header and border on top. Forty-three steps did this, and a reader could not tell the design from the layout.
  - Explanatory boards mixed annotation text, design pieces and a dark background in one frame. About thirty-five did this.
- **Operating correction:**
  - The sprint section is the direct parent of the sprint's steps. A sequence frame that holds the steps is unpacked.
  - A step is a studio frame card: a header with the state label and the frame's name, then the design. The design is the game's own frame, component instance or raster, and nothing else. Notes, titles and captions are text in the card, and the presentation background is dropped.
  - A direction summary is the library component. Where an old summary has no text for a field, the field says it is not stated and the Designer provides it. A sprint with no summary gets a placeholder box.
  - Do a page in this order: section backgrounds and names; frame cards and state labels; direction summaries; unpack sequence frames; strip chrome from image tests; separate notes from design in explanatory boards; restack the sections and check that every frame sits inside its section with no overlap.
  - Take the state of a frame from its name where it says one. Otherwise a baseline, source, evidence or reference is Current, and a numbered step is Proposal. The Designer corrects any that are wrong.
- **Open question:** how an explanatory board that mixes annotation with several design pieces is best separated, and whether the studio method needs a card variant for it.
- **Close when:** a project page of at least five sprints has been arranged this way, with a read-back that every step is a direct child of its sprint section and carries a state label, and the Designer has confirmed that a reader can tell the design from the layout without opening the layer panel.
