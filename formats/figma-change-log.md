# Format: Figma Change Log

## Purpose

Records accepted Figma deltas that may later need translation to production.
It is a referential bridge, not a second product history, release changelog,
or place to restate rationale owned by a project decision record.

## Project instance

Create one project-owned instance named `FIGMA-CHANGELOG.md`. Keep it beside
the project's existing design authority unless its own Figma artifacts have
genuinely accumulated into a dedicated, established location.

Each entry records only:

```markdown
## YYYY-MM-DD - Short change name

- **Figma:** URL and named node(s); current version or revision if available.
- **Delta:** One concise description of the visual/construction change.
- **Governing decision:** Link to the exact DESIGN.md section, product decision,
  or work item that authorizes it; write `proposal` when none exists yet.
- **Production surface:** The affected screen/component/container, if known.
- **Contract and evidence:** Link to the corresponding translation-contract row
  and any implementation or device-verification evidence.
- **Status:** Exploring, accepted for translation, implemented, verified, or
  superseded.
```

Do not copy the product rationale, runtime behavior, or release history into
an entry. A Figma discovery that would change a governing design decision is a
proposal until that decision is updated. No entry means no claimed Figma to
production parity.

## Quality check

Can a reader locate the exact Figma delta, its governing decision, its affected
production surface, and its evidence without treating this log as another
source of truth?
