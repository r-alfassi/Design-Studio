# F-003 — Review Components and Flows when a sprint closes

- **Status:** closed 2026-08-30
- **Observed:** 2026-08-30, the production-sync structure was brought under
  sprint bands, but sprint closure did not yet require an explicit assessment
  of whether the accepted work should improve the shared component library or
  the product's Flows page.
- **Operating correction:** before closing a sprint, make and record two
  independent decisions: whether its result changes a reusable component,
  variant, or token; and whether it changes a user journey, state transition,
  entry point, or handoff. Update the relevant page when the answer is yes;
  otherwise record the reason that no promotion is needed.
- **Current application:** Sharon Sprint 02 requires both promotions. Its
  current S-02 frame has a single registered instance (the clear action) but
  hand-built, code-backed scheduling primitives for its header, selection
  banner, time slots, slot rows, and day groups. It also introduces the
  scheduling journey that must be represented in Flows.
- **Close when:** the next completed Sharon design sprint has a documented
  component decision and flow decision, with the relevant Figma pages updated
  when warranted and a hierarchy/visual review of every changed page.
- **Resolution:** Sprint 02 promoted seven registered Scheduling components
  into the Components page, upgraded Button with an editable Label property,
  replaced S-02's hand-built browser with the registered browser instance, and
  added the five-state `Scheduling — appointment commitment` journey to Flows.
  Both pages and S-02 passed hierarchy and visual review.
