# Fresh run of the structure audit, with and without the skill

Observed 2026-10-22 on one frame of the ProShift baseline in Figma, "2 · Stations" (188 nodes, depth 17, a raw capture of a web page). This entry is evidence for Q-68 task 2 and for PN-03. It governs nothing. Read it when the work touches the audit skill or the fresh-run test.

## What was run

Two fresh agents audited the same frame, read-only, and each returned a report. One followed `skills/figma-audit-structure/SKILL.md` through its inspect and classify phases. The other had no skill and was told not to read Design Studio. A separate read of the frame gave a rough count of the real problems: 1 multi-child frame without auto layout, 2 same-size wrapper frames, 10 absolutely positioned nodes, and 4 children outside their parent's bounds. One run each, so there is no measure of variance.

## What each found

- **Without the skill:** 8 findings from about 6 tool calls. It found the stray empty pill (7:219), the 10 absolutely positioned nodes, the one frame without auto layout, 7 empty frames, the generic layer names (35 "Text", 22 "Button"), and that nothing is a component. It named no specific wrapper frame, only "flatten the redundant wrappers", and it sorted nothing into mechanical or judgment findings.
- **With the skill:** 20 raw entries on 17 nodes from about 12 tool calls, of which about 8 were actionable. It named both same-size wrappers by id and traced them to a web `transform`, found the same 10 absolute nodes and the one frame without auto layout, and gave each finding a layer, a severity and a proposed fix. It classified 4 sub-pixel offsets as noise and 2 label badges as deliberate overhangs on its own.

## What the skill got wrong, as reported by the run that followed it

- The overflow check never tests whether a child extends past its parent's far edge, so it missed 7:40, and it gives negative offsets no tolerance, which produced four false positives at y = -0.3.
- It has no exemption for a deliberate overhang, and its default fix would have been wrong for the label badges.
- A node can be flagged twice, as overflow and as hard-pinned, with no rule for which wins.
- The redundant-wrapper check flagged a padded progress track as a wrapper, because it ignores clipping, padding and fills.
- `inspect.js` returns the whole tree, which is too large to read on a 189-node frame, and returns no screenshot, although the skill says it does.
- The skill does not say how to choose normal or dev mode for an audit-only run, and its normal mode says to skip the report.
- It has no rule for RTL, for empty frames, or for raw capture frames, where web-transform wrappers are common.

## Reading

The skill was more exact on the problems its taxonomy names, and it gave the layered gating the other run lacked. It was noisier and cost about twice the tool calls. The run without it covered layer names, missing components and empty frames, which the taxonomy does not hold. Those may belong to the formalize branch. Inference: the skill earns its place only after its script and rules are fixed. The Designer decides.

## Rerun after the fixes

Run the same day on the same frame, by a fresh agent that read the fixed skill (commit `f0847d3`). One run, so again no measure of variance.

- **Counts.** 13 raw entries on 13 distinct nodes, against 20 on 17 before: 2 redundant wrappers, 10 hard-pinned, 1 without auto layout. No overflow, no empty-frame and no progress-track false positive. About 8 were actionable, as before, and 4 were noise or deliberate (two rotation artifacts, two label badges). Cost: about 11 tool calls, against 12.
- **What improved.** The sub-pixel overflow noise is gone, the padded progress track is no longer a wrapper, and the report named the two caret wrappers with a caution a no-skill run would not have given: each wraps a child rotated -180 degrees that makes the caret point up, so flattening it blindly would flip the glyph.
- **What the run found still wrong.** The wrapper test ignores the child's rotation and only prints a note. The overhang check reads x and y as the visual bounds, so a rotated node looks as if it overhangs its parent. A visible empty node (the stray dark pill, 7:219) has no class of its own, and the report format offers only Fix, Skip or Mark as intentional, with no "needs the operator's answer". The tree trimmed to depth 2 shows almost nothing on a capture whose issues sit at depths 13 to 15. The dated notes at the end of `SKILL.md` read as a log and not as rules.
- **Reading.** The fixes cut the noise and kept every real finding. Inference: with four small follow-ups, the skill beats having none on exactness and gating, at roughly twice the tool calls. The Designer decides.
