---
description: Design Studio maintains reusable design craft and guides visual design work in any medium from a stated direction to an approved design, as a package a project imports; it does not hold client context, define a project's intent, assume any particular record system, hold project decisions or implementation authority, or take an active agent role.
follows: [audience.md]
---

# Scope

This file says what the product does and does not do, each with its reason, so a proposal can be checked against one place. Limits that come from outside belong in the constraints file, and how it works inside belongs in the system file.

## What it does

- **Maintain reusable design procedures, formats, frameworks, standards, references, and external library pointers.** Projects need a stable place to return to for transferable craft. <!-- SC-01 -->
- **Classify and index each resident by its purpose.** A project can select the smallest relevant material rather than treating the resource as universal context. <!-- SC-02 -->
- **Let a project cite or apply selected material on demand.** Reusable craft helps a case without replacing that project's own product and implementation records. <!-- SC-03 -->
- **Guide visual design work in any medium, from a stated direction to an approved design.** Design Studio is responsible for design and visual interfaces. Figma is one tool it uses, for collaboration and for formalizing the design system, and a project that never enters Figma can still have its visuals tuned in place. <!-- SC-09 -->
- **Offer three ways into the work: sprints for collaborating, formalizing the design system, and tuning a project's visuals in place.** The same decision points and records serve all three, and a sprint can end in the Designer's decision to formalize a component. <!-- SC-10 -->
- **Keep a project's visual documentation and its open design debt.** `DESIGN.md` is the project's style document, in the format that `impeccable` reads. `DESIGN-DEBT.md` lists only where production and the approved design disagree, and a translation record exists only for components whose production form differs structurally. None of them holds intent. <!-- SC-11 -->
- **Install as a package that a project imports through its `AGENTS.md`, and that loads by kind of work.** Visual work is only part of a project's life, so only a small spine loads at first. <!-- SC-12 -->

## What it does not do

- **Hold client-identifying content, live client data, private component-library indexes, or private token dumps.** Reusable material must remain safe to carry between projects. <!-- SC-04 -->
- **Make a project's design, product, or implementation decision, or define its intent.** The project record and its owner hold that authority. When a project states no direction, Design Studio asks where it is and stops. When visual work shows that the direction itself needs to change, Design Studio hands the question back to whoever owns intent. <!-- SC-05 -->
- **Act as an active agent, a deployment method, or a project-governance system.** Design Studio is a resource that a project reads and applies. <!-- SC-06 -->
- **Assume that a project keeps its record in any particular system, Compass included.** A project states its direction in whatever form it keeps one, and a reusable procedure that named one system would stop working on projects that use another. <!-- SC-08 -->
- **Hold personal Designer preferences or universal collaboration culture.** Those subjects have their own homes and would make reusable craft falsely universal. <!-- SC-07 -->

Open: the `product-design` format still has layers for intent and flow, with a PRD file and an HTML flow chart, and so has Design Studio holding a project's intent. That conflicts with the second line above and needs revising. It also still assumes the retired `.harness/` folder.
