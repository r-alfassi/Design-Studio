# Resource authority — Design Studio

Design Studio is a governed resource for reusable cross-project design craft. It
is not an active authority or a federation member: it does not return a
judgment, assent, or speak. Principal reads selected material and attributes
any resulting case application as Principal's interpretation.

Federation classification and verification are recorded only in the federation
registry. This document declares the resource's owned material and how it is
maintained; it does not assert a current registration state.

---

## Scope and epistemic status

The resource holds design craft that can travel between projects without
carrying client-identifying content or replacing each project's own product,
design, or implementation decisions.

| Artifact set | Status | What it governs or supports |
| --- | --- | --- |
| `README.md`, this declaration, and `federation/PRODUCT.md` | Normative governance | Resource scope, boundaries, and durable product definition. |
| `STRUCTURE.md` | Normative | How the resource is organized: the format / framework / standard / skill distinction, the `meta` tag, and how a reader chooses a resident. |
| `CONVENTIONS.md` | Normative | Admission checklist, naming rules, and how residents are consumed — not design-craft doctrine. |
| `skills/README.md` | Navigation | The resident index — every skill with its tag and a one-line "reach for it when". Not doctrine; a wayfinding aid, kept current on every admission. |
| `formats/` | Normative format specifications | The required shape of a named design deliverable when that format is selected. |
| `frameworks/` | Normative thinking frameworks | Reusable methods for examining a design question and making explicit, evidence-aware choices; they do not prescribe a deliverable shape or execution procedure. |
| `standards/` | Normative cross-project design constraints | Stable, explicitly adopted constraints with scope, validation, and an exception route; they do not replace project product decisions or a procedure. |
| `skills/` | Normative procedures | Reusable design and design-governance workflows. A skill's own references, scripts, mappings, and assets are part of that procedure only when the skill names their role. A vendored third-party skill keeps its upstream `LICENSE` alongside its `SKILL.md`. |
| `skills-lock.json` | Evidence — provenance record | Source, pinned upstream ref, license, and content hash for each third-party skill vendored into `skills/`. Not doctrine; the integrity trail for the admission path. |
| `references/` | Evidence | Operational guidance that may support a bounded inference; it is not normative merely because of location. |
| Unclaimed skill-local scripts, mappings, and assets | Tool or implementation support | Non-source material; it has no normative force unless an enclosing normative procedure declares its role. |
| `library/` | External evidence | Attributed, non-binding resources owned by their original authors. Design Studio stewards only its pointer and short application notes. |
| `federation/WORK.md` and repository history | Evidence | Operational state, provenance, and change history; never design-craft doctrine. |

No category makes a source universally applicable. A project adopts or cites an
exact selected artifact for its own case. Nothing here replaces a project's
own Design, Product, System, or implementation authority.

---

## Stewardship and material change

Principal is the resource steward and the identified interpreter. Principal
stewards the declaration, index, resource boundary, lifecycle, and local
copies of Design Studio-authored procedures, formats, frameworks, standards, and supporting material.
The original author remains steward of every external library source; Principal
does not claim authority over that source.

The Designer approves a material change before it takes effect: a change to
the resource boundary or source classification; adoption, retirement, or
material alteration of a reusable normative procedure, format, framework, or standard; a change to
the interpreter or application path; or an exception to the client-content
boundary. Principal may make a faithful mechanical repair, navigation repair,
or clearly non-material correction and records the evidence that caused it.

---

## Maintenance lifecycle

**Admission.** A proposed resident identifies its source, provenance or
license where applicable, owner, epistemic status, intended use, and reason it
belongs here. It is admitted only after the client-content boundary is checked.
An external source enters `library/` as evidence unless the Designer approves
its adoption into a named normative artifact.

**Correction and freshness.** A live use that exposes ambiguity, inapplicable
guidance, source drift, or a missing category is recorded in the resource Work
record. Principal corrects or marks the affected local artifact, and seeks the
Designer's approval where the change is material. Before applying an external
library resident, Principal checks its stated source is still reachable and
names any resulting confidence limit.

**Deprecation.** When a source is no longer usable, relevant, or safe to
recommend, Principal removes it from normal selection and records the reason
and replacement or absence. Historical provenance may remain, but it is not
presented as current guidance.

Changes to this declaration or another declared artifact boundary are
reconciled with the federation registry for revalidation.

---

## Access and interpretation path

For a project design question, Principal first reads `README.md`, then selects
the smallest relevant artifact from `formats/`, `frameworks/`, `standards/`, `skills/`, `references/`, or
`library/`. Principal reads that artifact on demand, identifies its status and
provenance, and returns a bounded application to the project. If no relevant
resident exists, Principal records the absence before external research rather
than implying the resource supplied guidance.

Citation is the current delivery model. Design Studio material is not loaded
automatically into every session, and this declaration does not authorize a
shared skill-installation or pull mechanism. Such a mechanism requires its own
adoption decision and tested access path.

The first availability assessment must exercise this path on a real design
case and verify both that the selected material was discoverable and that its
status was preserved in the resulting application.

---

## Boundaries

Design Studio does not hold personal Designer preferences, universal
collaboration culture, per-project design decisions, live client data, or
client-identifying content. It does not infer current project requirements from
its archive. It may inform a project; it cannot decide for one.
