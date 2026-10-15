// Read-only helper for a Figma use_figma call.
// Caller must declare: const ROOT_NODE_IDS = ["component-set-id", ...];
// It intentionally does not mutate Figma. Use only for source pixel/raster
// component families, not for decorative documentation wrappers.

if (typeof ROOT_NODE_IDS === "undefined" || !Array.isArray(ROOT_NODE_IDS)) {
  throw new Error("Declare ROOT_NODE_IDS as an array of exact source component-set IDs.");
}

const auditedRoots = [];
const violations = [];

for (const rootId of ROOT_NODE_IDS) {
  const root = await figma.getNodeByIdAsync(rootId);
  if (!root || !("findAll" in root)) {
    violations.push({ rootId, reason: "Source root was not found or cannot contain descendants." });
    continue;
  }

  const candidates = [root, ...root.findAll(node =>
    node.type === "COMPONENT" ||
    node.type === "COMPONENT_SET" ||
    node.type === "RECTANGLE" ||
    node.type === "FRAME"
  )];

  auditedRoots.push({ id: root.id, name: root.name, type: root.type });
  for (const node of candidates) {
    const radius = "cornerRadius" in node && typeof node.cornerRadius === "number"
      ? node.cornerRadius
      : null;
    const effectCount = "effects" in node ? node.effects.length : 0;
    if ((radius !== null && radius !== 0) || effectCount > 0) {
      violations.push({
        rootId: root.id,
        id: node.id,
        type: node.type,
        name: node.name,
        cornerRadius: radius,
        effectCount
      });
    }
  }
}

return {
  auditedRoots,
  violations,
  pass: violations.length === 0
};
