// check-presentation-chrome.js — read-only check for standards/studio-presentation.md
// Paste into use_figma. Set the parameters below before running.
// Reports where the presentation chrome of a page does not come from the studio kit.
// It reports and never writes, moves or deletes anything.
//
// The rule it checks: on a sprint page or a design-system page, every direct child of a
// section is an instance of a studio kit component, and each section's own fill uses a
// studio kit variable. A project's design belongs inside a kit frame card or container,
// not directly in a section.

const PAGE_NAME = '';                 // Name of the page to check
const KIT_COMPONENT_NAMES = [         // Names of the kit's components or component sets
  'State label', 'Placeholder box', 'Sprint direction summary',
  'Frame card', 'Section header', 'Component container', 'Callout', 'Token tile',
];
const KIT_VARIABLE_COLLECTION_PREFIX = 'Studio'; // Kit variable collections start with this

const page = figma.root.children.find((p) => p.name === PAGE_NAME);
if (!page) throw new Error(`Page not found: ${PAGE_NAME}`);
await figma.setCurrentPageAsync(page);

const kitNames = KIT_COMPONENT_NAMES.map((n) => n.toLowerCase());
const isKitName = (name) => kitNames.includes(String(name).toLowerCase());

async function kitCollectionIds() {
  const ids = new Set();
  const collections = await figma.variables.getLocalVariableCollectionsAsync();
  for (const c of collections) if (c.name.startsWith(KIT_VARIABLE_COLLECTION_PREFIX)) for (const id of c.variableIds) ids.add(id);
  return ids;
}
const kitVariableIds = await kitCollectionIds();

async function variableIsKit(alias) {
  if (!alias || !alias.id) return false;
  if (kitVariableIds.has(alias.id)) return true;
  const v = await figma.variables.getVariableByIdAsync(alias.id);
  if (!v) return false;
  const coll = await figma.variables.getVariableCollectionByIdAsync(v.variableCollectionId);
  return !!coll && coll.name.startsWith(KIT_VARIABLE_COLLECTION_PREFIX);
}

const findings = [];
let sectionsChecked = 0, childrenChecked = 0;

for (const section of page.findAllWithCriteria({ types: ['SECTION'] })) {
  sectionsChecked++;
  // The section's own fill must come from a kit variable.
  const fills = (section.fills === figma.mixed ? [] : section.fills).filter((f) => f.visible !== false);
  if (fills.length) {
    const alias = section.boundVariables && section.boundVariables.fills && section.boundVariables.fills[0];
    if (!(await variableIsKit(alias))) {
      findings.push({ sectionId: section.id, sectionName: section.name, nodeId: section.id, nodeName: section.name, type: 'SECTION', reason: 'section fill does not use a kit variable' });
    }
  }
  // An auto-layout frame groups a container with the component it documents. It may have a fill, a stroke and a radius only when each is bound to a kit variable, and no effect. Its children count as the section's own.
  const bv = (n) => n.boundVariables || {};
  const isGroup = async (n) => {
    if (n.type !== 'FRAME' || !n.layoutMode || n.layoutMode === 'NONE') return false;
    if (n.effects && n.effects.some((e) => e.visible !== false)) return false;
    const visFills = Array.isArray(n.fills) ? n.fills.filter((f) => f.visible !== false) : [];
    if (visFills.length && !(await variableIsKit(bv(n).fills && bv(n).fills[0]))) return false;
    if (Array.isArray(n.strokes) && n.strokes.length && !(await variableIsKit(bv(n).strokes && bv(n).strokes[0]))) return false;
    if (typeof n.cornerRadius === 'number' && n.cornerRadius > 0 && !(await variableIsKit(bv(n).topLeftRadius))) return false;
    return true;
  };
  const members = [];
  const gather = async (nodes) => { for (const n of nodes) { if ((await isGroup(n)) && n.children.length) { childrenChecked++; await gather(n.children); } else members.push(n); } };
  await gather(section.children);
  // Names of the components that containers in this section document. A main component of that name may sit beside its container.
  const documented = new Set();
  for (const c of members) {
    if (c.type !== 'INSTANCE') continue;
    const m = await c.getMainComponentAsync();
    if (m && m.name === 'Component container') {
      const nameKey = Object.keys(c.componentProperties).find((k) => k.startsWith('Name'));
      if (nameKey) documented.add(String(c.componentProperties[nameKey].value).toLowerCase());
    }
  }
  for (const child of members) {
    childrenChecked++;
    if (child.type === 'SECTION') continue; // a nested section is checked as a section
    if ((child.type === 'COMPONENT_SET' || child.type === 'COMPONENT') && documented.has(child.name.toLowerCase())) continue; // the documented component itself
    if (child.type === 'INSTANCE') {
      const main = await child.getMainComponentAsync();
      const set = main && main.parent && main.parent.type === 'COMPONENT_SET' ? main.parent : main;
      if (set && isKitName(set.name)) continue;
      findings.push({ sectionId: section.id, sectionName: section.name, nodeId: child.id, nodeName: child.name, type: 'INSTANCE', reason: `instance of a non-kit component "${set ? set.name : 'unknown'}"` });
    } else {
      const looksLikeKit = isKitName(child.name);
      findings.push({ sectionId: section.id, sectionName: section.name, nodeId: child.id, nodeName: child.name, type: child.type, reason: looksLikeKit ? 'named like a kit component but not an instance (detached copy)' : 'not an instance of a kit component' });
    }
  }
}

const byReason = {};
for (const f of findings) byReason[f.reason.replace(/"[^"]*"/, '"…"')] = (byReason[f.reason.replace(/"[^"]*"/, '"…"')] || 0) + 1;
return { page: page.name, sectionsChecked, childrenChecked, findingCount: findings.length, byReason, findings: findings.slice(0, 60) };
