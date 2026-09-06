// inspect.js — Structural audit inspection script
// Paste into use_figma. Set TARGET_FRAME_ID before running.
// Returns a structured report the model uses to classify issues in Phase 2.
// Read-only — makes no changes to the file.

const TARGET_FRAME_ID = ''; // Set to the target frame node ID before running

const frame = await figma.getNodeByIdAsync(TARGET_FRAME_ID);
if (!frame) throw new Error(`Frame not found: ${TARGET_FRAME_ID}`);

function analyzeNode(node, parentWidth, parentHeight, parentLayoutMode, depth) {
  const result = {
    id: node.id,
    name: node.name,
    type: node.type,
    depth,
    x: node.x,
    y: node.y,
    width: node.width,
    height: node.height,
    layoutMode: node.layoutMode ?? null,
    layoutPositioning: node.layoutPositioning ?? null,
    issues: [],
    children: [],
  };

  const parentIsAutoLayout = parentLayoutMode && parentLayoutMode !== 'NONE';

  // Overflow: negative offset or exceeds parent bounds
  if (parentWidth !== null) {
    if (node.x < 0) result.issues.push({ type: 'overflow-container', detail: `negative x: ${node.x}` });
    if (node.y < 0) result.issues.push({ type: 'overflow-container', detail: `negative y: ${node.y}` });
    if (node.width > parentWidth + 1) result.issues.push({ type: 'overflow-container', detail: `width ${node.width} > parent ${parentWidth}` });
    if (node.height > parentHeight + 1) result.issues.push({ type: 'overflow-container', detail: `height ${node.height} > parent ${parentHeight}` });
  }

  // Hard-pinned position: an "ignore auto layout" (ABSOLUTE) child inside an
  // auto-layout parent, still on Figma's default MIN/MIN constraints. Figma's own
  // recommended pattern for pinning a child to an edge is ABSOLUTE + a matching
  // constraint (e.g. vertical:'MAX' to pin to the bottom) — a child left on default
  // constraints has no declared relationship to any edge, so its position is a bare
  // coordinate that won't track anything if the parent resizes. A child that already
  // has non-default constraints is presumed deliberately anchored — do not flag it.
  if (parentIsAutoLayout && node.layoutPositioning === 'ABSOLUTE' && 'constraints' in node) {
    const c = node.constraints || {};
    const isDefaultConstraints = c.horizontal === 'MIN' && c.vertical === 'MIN';
    if (isDefaultConstraints) {
      result.issues.push({
        type: 'hard-pinned-position',
        detail: `ignore-auto-layout child at (${node.x}, ${node.y}) with default MIN/MIN constraints — no declared relationship to any edge`,
      });
    }
    result.constraints = { horizontal: c.horizontal, vertical: c.vertical };
  }

  if (!('children' in node)) return result;

  const children = node.children;

  // Redundant wrappers: single-child frame of same dimensions, no layout purpose
  if (
    children.length === 1 &&
    node.type === 'FRAME' &&
    children[0].type === 'FRAME' &&
    Math.abs(children[0].width - node.width) < 2 &&
    Math.abs(children[0].height - node.height) < 2
  ) {
    result.issues.push({ type: 'redundant-wrappers', detail: `single child "${children[0].name}" (${children[0].width}x${children[0].height}) matches parent dims` });
  }

  // No auto-layout: frame with 2+ children using absolute positioning
  if (
    node.type === 'FRAME' &&
    (!node.layoutMode || node.layoutMode === 'NONE') &&
    children.length >= 2
  ) {
    result.issues.push({ type: 'no-auto-layout', detail: `${children.length} children, no layoutMode` });
  }

  for (const child of children) {
    result.children.push(analyzeNode(child, node.width, node.height, node.layoutMode ?? null, depth + 1));
  }

  return result;
}

const report = analyzeNode(frame, null, null, null, 0);

// Flatten issue list for quick summary
function collectIssues(node, acc = []) {
  for (const issue of node.issues) {
    acc.push({ id: node.id, name: node.name, type: node.type, depth: node.depth, ...issue });
  }
  for (const child of node.children) collectIssues(child, acc);
  return acc;
}

const allIssues = collectIssues(report);

// Component Guardrail: annotate each issue's node with component ownership, so
// Phase 2 classification can route it to Component-owned instead of Mechanical/Judgment.
async function annotateComponentOwnership(issues) {
  for (const issue of issues) {
    const n = await figma.getNodeByIdAsync(issue.id);
    if (!n) continue;
    if (n.type === 'COMPONENT' || n.type === 'COMPONENT_SET') {
      issue.componentOwned = true;
      issue.componentOwnedReason = `Node itself is a ${n.type}`;
      continue;
    }
    if (n.type === 'INSTANCE') {
      const main = await n.getMainComponentAsync();
      if (main && main.remote) {
        issue.componentOwned = true;
        issue.componentOwnedReason = `INSTANCE of remote/library component "${main.name}"`;
        continue;
      }
    }
    // Check ancestors for a remote INSTANCE
    let p = n.parent;
    while (p) {
      if (p.type === 'INSTANCE') {
        const main = await p.getMainComponentAsync();
        if (main && main.remote) {
          issue.componentOwned = true;
          issue.componentOwnedReason = `Descendant of INSTANCE "${p.name}" (remote/library component "${main.name}")`;
        }
        break;
      }
      p = p.parent;
    }
  }
}
await annotateComponentOwnership(allIssues);

return {
  frame: { id: frame.id, name: frame.name, width: frame.width, height: frame.height },
  issueCount: allIssues.length,
  issues: allIssues,
  tree: report,
};
