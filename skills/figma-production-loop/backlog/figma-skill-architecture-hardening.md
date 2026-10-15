# F-004 — Harden the Figma production loop with modular runbook and regression evidence

- **Status:** open
- **Observed:** Karma Warrior's direct-edit reconciliation exposed the need for
  a durable change-detection and tokenization route. A review of
  `base44-home-assignment/launch-content/` showed several proven skill-design
  patterns worth adapting: a thin orchestrator with one loading authority,
  focused craft modules, a visible shared read before consequential work,
  stable templates, and preserved stress-test evidence that turns observed
  failures into concrete checks.
- **Intent:** adopt the transferable architecture without forcing Figma work
  into a linear content-production workflow. Figma remains stateful and
  contract-bounded; the existing scoped-mutation and promotion gates remain
  authoritative.
- **Proposed initiative:**
  1. Keep `SKILL.md` as the sole routing and loading authority; move dense,
     reusable procedures into focused references without allowing those
     references to load or route one another.
  2. Add a stable reconciliation-record template: scope, prior authority,
     detected Figma delta, classification, affected consumers, token decision,
     accepted next action, and updated ledger IDs.
  3. Add a concise current-authority/change brief before a material Figma
     mutation. Use it only for reusable-rule, topology, or design-decision
     changes — not routine local nudges.
  4. Add small regression cases for high-risk behavior: a direct user component
     edit, a lost variable binding, a missing token, a sprint-frame containment
     failure, and copied anatomy where an assembly should use instances.
  5. Preserve each test's input boundary, expected result, observed result, and
     resulting skill correction. Convert a repeated failure into a detection
     check, template, or helper rather than another general principle.
- **Source boundary:** keep project-specific visual rules, tokens, and source
  frames in their project. Promote only portable operating rules into Design
  Studio. Preserve user-authored Figma current authority; do not auto-revert a
  reconciled change.
- **Evidence:** Base44's `launch-content/README.md`, `SKILL.md`, rebrief and
  launch-set templates, `EDITORIAL-LOG.md`, and production-pack stress tests;
  Karma Warrior's `HUD / Metric Cell` direct `space/4` → `0` edit and the
  subsequent scoped reconciliation/tokenization proposal.
- **Close when:** the loop has the modular references and reconciliation-record
  template, at least the five named regression cases have been executed and
  captured, and one test demonstrates that a user edit is detected, preserved,
  classified, and either rebound to an accepted token or retained as a pending
  proposal without overwriting Figma.
