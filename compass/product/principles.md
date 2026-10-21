---
description: Explore freely and approve deliberately, no fixed authority between design and production, and a resident earns its place by beating none.
follows: [scope.md, constraints.md]
---

# Principles

This file says what the product favours when its goals pull against each other, each with its reason and a case. It settles the conflicts that scope and constraints leave open.

- **Explore freely, approve deliberately.** Where nothing is approved yet, the agent works without asking: in a marked sprint area in Figma, or on a branch in code. It stops for the Designer before anything approved changes: the approved design, `DESIGN.md`, a library component, production, or a deletion. It gives up speed on approved ground, because the Designer's yes is what makes something approved. The opposite is to stop before every visual change, so the Designer sees everything before it exists; a studio that is never surprised could choose that. <!-- PN-01 -->

  *In practice:* A mechanical fix inside a sprint frame runs. A change to a library component's own layout is reported with its source named and not applied.

- **No fixed authority between design and production.** When Figma and production disagree on how something looks, the disagreement goes to the Designer with its direction, because either side may be ahead. It gives up one simple rule. The opposite is a fixed winner, Figma or code, which is simpler and loses tuned work on one of the two paths. <!-- PN-02 -->

  *In practice:* A row in `DESIGN-DEBT.md` says whether production is behind Figma or Figma is behind the code.

- **A resident earns its place by beating none.** A resident stays only if a fresh run on a real case does better with it than without it. It leaves when a test shows no difference or when something the agent already has covers it. It gives up cheap admission, since every new resident passes a test first. The opposite is to review a resident once and let it stay, which is cheap to admit and leaves a cluttered repo. <!-- PN-03 -->

  *In practice:* The three retired Figma skills overlapped the official plugin's skills, and none had been invoked.
