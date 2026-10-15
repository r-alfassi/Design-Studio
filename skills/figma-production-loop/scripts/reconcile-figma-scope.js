/**
 * Read-only helper for a scoped Figma reconciliation preflight.
 *
 * Embed in a `use_figma` call after exactly one `await figma.setCurrentPageAsync(page)`.
 * Replace TARGET_NODE_IDS with node IDs from the current task's state ledger.
 * Never mutate nodes in this helper.
 */

const TARGET_NODE_IDS = [
  // "123:456",
];

const summarizePaint = (paint) => {
  if (!paint) return null;
  const color = paint.color
    ? { r: paint.color.r, g: paint.color.g, b: paint.color.b, a: paint.opacity ?? 1 }
    : null;
  const bound = paint.boundVariables?.color;
  return {
    type: paint.type,
    visible: paint.visible ?? true,
    opacity: paint.opacity ?? 1,
    color,
    variableId: bound?.id ?? null,
  };
};

const summarizeNode = (node) => {
  const base = {
    id: node.id,
    name: node.name,
    type: node.type,
    parent: node.parent ? { id: node.parent.id, name: node.parent.name, type: node.parent.type } : null,
    x: node.x,
    y: node.y,
    width: node.width,
    height: node.height,
    visible: node.visible,
    boundVariables: node.boundVariables ?? {},
  };

  if ("layoutMode" in node) {
    base.autoLayout = {
      layoutMode: node.layoutMode,
      primaryAxisSizingMode: node.primaryAxisSizingMode,
      counterAxisSizingMode: node.counterAxisSizingMode,
      primaryAxisAlignItems: node.primaryAxisAlignItems,
      counterAxisAlignItems: node.counterAxisAlignItems,
      itemSpacing: node.itemSpacing,
      paddingTop: node.paddingTop,
      paddingRight: node.paddingRight,
      paddingBottom: node.paddingBottom,
      paddingLeft: node.paddingLeft,
    };
  }
  if ("fills" in node && Array.isArray(node.fills)) base.fills = node.fills.map(summarizePaint);
  if ("strokes" in node && Array.isArray(node.strokes)) base.strokes = node.strokes.map(summarizePaint);
  if ("cornerRadius" in node) base.cornerRadius = node.cornerRadius;
  if (node.type === "TEXT") {
    base.text = {
      characters: node.characters,
      textStyleId: node.textStyleId,
      fontSize: node.fontSize,
      letterSpacing: node.letterSpacing,
    };
  }
  if (node.type === "COMPONENT_SET" || (node.type === "COMPONENT" && node.parent?.type !== "COMPONENT_SET")) {
    base.componentProperties = node.componentPropertyDefinitions;
    base.description = node.description;
  }
  if (node.type === "INSTANCE") {
    base.componentProperties = node.componentProperties;
    base.mainComponentId = node.mainComponent?.id ?? null;
  }
  if ("children" in node) base.children = node.children.map(summarizeNode);
  return base;
};

const found = [];
const missing = [];
for (const id of TARGET_NODE_IDS) {
  const node = await figma.getNodeByIdAsync(id);
  if (node) found.push(summarizeNode(node));
  else missing.push(id);
}

return {
  generatedAt: new Date().toISOString(),
  scope: TARGET_NODE_IDS,
  missing,
  nodes: found,
  instruction: "Compare this read-only Figma snapshot to the local state ledger. Figma differences are authoritative; do not mutate until reconciled."
};
