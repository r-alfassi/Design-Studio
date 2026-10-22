// inspect.js — Structural audit inspection script
// Paste into use_figma. Set TARGET_FRAME_ID before running.
// Returns a structured report the model uses to classify issues in Phase 2.
// Read-only — makes no changes to the file. Returns no screenshot: take one
// separately with get_screenshot.

const TARGET_FRAME_ID = ''; // Set to the target frame node ID before running
const MAX_TREE_DEPTH = 2;   // Depth of the returned tree. Issues always come from the whole subtree.
const TOL = 1;              // Pixel tolerance for every bounds and size comparison

const frame = await figma.getNodeByIdAsync(TARGET_FRAME_ID);
if (!frame) throw new Error(`Frame not found: ${TARGET_FRAME_ID}`);

const hasVisible = (paints) =>
  Array.isArray(paints) && paints.some((p) => p.visible !== false && (p.opacity === undefined || p.opacity > 0));

function analyzeNode(node, parent, depth) {
  const parentWidth = parent ? parent.width : null;
  const parentHeight = parent ? parent.height : null;
  const parentLayoutMode = parent ? parent.layoutMode ?? null : null;
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
  const isAbsoluteChild = parentIsAutoLayout && node.layoutPositioning === 'ABSOLUTE';

  // Which edges of the parent this node extends past, beyond the tolerance.
  const overhangs = [];
  if (parentWidth !== null) {
    if (node.x < -TOL) overhangs.push(`starts ${-node.x}px before the parent's left edge`);
    if (node.y < -TOL) overhangs.push(`starts ${-node.y}px above the parent's top edge`);
    if (node.x + node.width > parentWidth + TOL) overhangs.push(`ends ${node.x + node.width - parentWidth}px past the parent's right edge`);
    if (node.y + node.height > parentHeight + TOL) overhangs.push(`ends ${node.y + node.height - parentHeight}px past the parent's bottom edge`);
  }

  // Overflow: reported only for children that take part in the layout. An
  // ignore-auto-layout (ABSOLUTE) child that overhangs may be deliberate, so it
  // is reported once, under hard-pinned-position, with its overhang attached.
  if (!isAbsoluteChild && overhangs.length) {
    result.issues.push({ type: 'overflow-container', detail: overhangs.join('; ') });
  }

  // Hard-pinned position: an "ignore auto layout" (ABSOLUTE) child inside an
  // auto-layout parent, still on Figma's default MIN/MIN constraints. Figma's own
  // recommended pattern for pinning a child to an edge is ABSOLUTE + a matching
  // constraint (e.g. vertical:'MAX' to pin to the bottom) — a child left on default
  // constraints has no declared relationship to any edge, so its position is a bare
  // coordinate that won't track anything if the parent resizes. A child that already
  // has non-default constraints is presumed deliberately anchored — do not flag it.
  if (isAbsoluteChild && 'constraints' in node) {
    const c = node.constraints || {};
    const isDefaultConstraints = c.horizontal === 'MIN' && c.vertical === 'MIN';
    if (isDefaultConstraints) {
      const issue = {
        type: 'hard-pinned-position',
        detail: `ignore-auto-layout child at (${node.x}, ${node.y}) with default MIN/MIN constraints — no declared relationship to any edge`,
      };
      if (overhangs.length) issue.overhangs = overhangs;
      result.issues.push(issue);
    }
    result.constraints = { horizontal: c.horizontal, vertical: c.vertical };
  }

  if (!('children' in node)) return result;

  const children = node.children;

  // Empty frame: a frame with no children, nothing visible of its own, and
  // no stroke or effect. Likely capture debris. Report it; never delete it.
  if (
    node.type === 'FRAME' &&
    children.length === 0 &&
    !hasVisible(node.fills) &&
    !hasVisible(node.strokes) &&
    !(node.effects && node.effects.some((e) => e.visible !== false))
  ) {
    result.issues.push({ type: 'empty-frame', detail: 'no children, no visible fill, stroke or effect' });
  }

  // Redundant wrappers: a single-child frame with the child's size that adds
  // nothing of its own — no fill, stroke, effect, padding or clipping.
  if (
    children.length === 1 &&
    node.type === 'FRAME' &&
    children[0].type === 'FRAME' &&
    Math.abs(children[0].width - node.width) <= TOL &&
    Math.abs(children[0].height - node.height) <= TOL &&
    !hasVisible(node.fills) &&
    !hasVisible(node.strokes) &&
    !(node.effects && node.effects.some((e) => e.visible !== false)) &&
    !node.clipsContent &&
    !(node.paddingLeft || node.paddingRight || node.paddingTop || node.paddingBottom)
  ) {
    const issue = { type: 'redundant-wrappers', detail: `single child "${children[0].name}" (${children[0].width}x${children[0].height}) matches parent dims and the wrapper adds no fill, stroke, effect, padding or clipping` };
    if (/:(transform|margin)$/.test(node.name)) issue.note = 'name suggests a web-capture leftover; check for a rotation or transform before flattening';
    result.issues.push(issue);
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
    result.children.push(analyzeNode(child, node, depth + 1));
  }

  return result;
}

const report = analyzeNode(frame, null, 0);

// Flatten issue list for quick summary
function collectIssues(node, acc = []) {
  for (const issue of node.issues) {
    acc.push({ id: node.id, name: node.name, type: node.type, depth: node.depth, ...issue });
  }
  for (const child of node.children) collectIssues(child, acc);
  return acc;
}

// Issues come from the whole subtree, collected before the tree is trimmed.
const allIssues = collectIssues(report);

// Return a tree only to MAX_TREE_DEPTH, so a large frame stays readable.
function trim(node) {
  const { children, ...rest } = node;
  if (node.depth >= MAX_TREE_DEPTH) return { ...rest, childCount: children.length };
  return { ...rest, children: children.map(trim) };
}

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
  tree: trim(report),
};
