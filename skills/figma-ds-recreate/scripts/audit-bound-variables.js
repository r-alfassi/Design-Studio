// Audit a Figma node and its descendants for unbound dimensions, spacing, radius, and fills.
// Run via evaluate_script in the Figma plugin context.
// Replace NODE_ID with the target node's ID (e.g. "26:1133").

const rootId = "NODE_ID";

async function auditBoundVariables(rootId) {
  const root = await figma.getNodeByIdAsync(rootId);
  if (!root) return [{ error: "Node not found" }];

  const issues = [];

  function toHex(color) {
    return '#' + ['r','g','b'].map(c =>
      Math.round(color[c] * 255).toString(16).padStart(2,'0')
    ).join('');
  }

  function checkNode(node, skipChildren) {
    if (skipChildren) return;
    const bv = node.boundVariables || {};
    const row = { id: node.id, name: node.name, type: node.type, issues: [] };

    // Width / Height — only flag FIXED sizing
    if ('layoutSizingHorizontal' in node && node.layoutSizingHorizontal === 'FIXED' && !bv.width)
      row.issues.push(`width: ${Math.round(node.width)}px — unbound`);
    if ('layoutSizingVertical' in node && node.layoutSizingVertical === 'FIXED' && !bv.height)
      row.issues.push(`height: ${Math.round(node.height)}px — unbound`);

    // Padding & gap
    for (const p of ['paddingTop','paddingRight','paddingBottom','paddingLeft','itemSpacing','counterAxisSpacing']) {
      if (p in node && node[p] > 0 && !bv[p])
        row.issues.push(`${p}: ${node[p]}px — unbound`);
    }

    // Corner radius — skip shorthand flag if any individual corner is already bound
    const cornerProps = ['topLeftRadius','topRightRadius','bottomLeftRadius','bottomRightRadius'];
    const anyCornerBound = cornerProps.some(p => bv[p]);
    if ('cornerRadius' in node && typeof node.cornerRadius === 'number' && node.cornerRadius > 0 && !bv.cornerRadius && !anyCornerBound)
      row.issues.push(`cornerRadius: ${node.cornerRadius}px — unbound`);
    for (const p of cornerProps) {
      if (p in node && node[p] > 0 && !bv[p])
        row.issues.push(`${p}: ${node[p]}px — unbound`);
    }

    // Fills — boundVariables.fills[i] is a VARIABLE_ALIAS {type,id} object, not {color}
    if (Array.isArray(node.fills)) {
      node.fills.forEach((fill, i) => {
        if (fill.type === 'SOLID' && !bv.fills?.[i])
          row.issues.push(`fill[${i}]: ${toHex(fill.color)} — unbound`);
      });
    }

    if (row.issues.length) issues.push(row);

    if ('children' in node) {
      // Don't recurse into remote instance internals — they're owned by the library
      const isRemote = node.type === 'INSTANCE' && node.mainComponent?.remote === true;
      for (const child of node.children) checkNode(child, isRemote);
    }
  }

  checkNode(root, false);
  return issues.length ? issues : [{ message: "No unbound values found" }];
}

auditBoundVariables(rootId).then(r => console.log(JSON.stringify(r, null, 2)));
