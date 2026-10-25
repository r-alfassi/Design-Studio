// build-journey-section.js — lay one journey on a Flows page as a kit section
// Paste into use_figma. Set the parameters below before running.
// Creates one section: a kit Section header, a row of kit Frame cards (each holding a captured frame and
// labelled Current), and optional kit Callouts. It moves the listed frames into the cards and places the
// section under everything else on the page. Nothing else is touched.
// Read standards/studio-presentation.md and the Flows page note in SKILL.md first.
//
// The kit components come from the studio library, which the file must subscribe to. Their keys are read from an
// instance in a file that already uses the kit: the main component's key, or the component set's key for a Callout.

const FLOWS_PAGE = 'Flows';
const KEYS = {                 // keys of the studio kit components, published 2026-10-23
  frameCard: '',               // Frame card (a component)
  sectionHeader: '',           // Section header (a component)
  callout: '',                 // Callout (a component set), or '' for no callouts
  sectionFillVariable: '',     // key of the kit variable surface/canvas, which fills a section
};
const RTL = false;             // true: step 1 sits at the right end
const GAP = 80;
const JOURNEY = {
  name: '',                    // section name, for example "Schedule · working with a week's schedule"
  title: '',                   // header title
  status: 'CURRENT · 2026-01-01',
  description: '',             // one or two sentences, and a note of what could not be captured
  steps: [
    // { id: '113:2' }                                   a captured, cleaned frame; its name is the card's frame name
    // { cloneOf: '111:1196', name: '1 · First draft' }  a copy of an existing card, for a state that repeats an earlier journey
  ],
  callouts: [
    // { at: 0, body: '…', kind: 'Notice' }              under the step with this index; state only what the screens show
  ],
};

let page = figma.root.children.find((p) => p.name === FLOWS_PAGE);
if (!page) throw new Error(`Page not found: ${FLOWS_PAGE}`);
await figma.setCurrentPageAsync(page);

const card = await figma.importComponentByKeyAsync(KEYS.frameCard);
const header = await figma.importComponentByKeyAsync(KEYS.sectionHeader);
const calloutSet = KEYS.callout ? await figma.importComponentSetByKeyAsync(KEYS.callout) : null;
const prop = (node, prefix) => Object.keys(node.componentProperties).find((k) => k.startsWith(prefix));

let bottom = 0;
for (const c of page.children) bottom = Math.max(bottom, c.y + c.height);

const sec = figma.createSection();
sec.name = JOURNEY.name;
sec.x = 0; sec.y = bottom + 200;
if (KEYS.sectionFillVariable) {
  const v = await figma.variables.importVariableByKeyAsync(KEYS.sectionFillVariable);
  sec.fills = [figma.variables.setBoundVariableForPaint({ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }, 'color', v)];
}
sec.resizeWithoutConstraints(1000, 1000);

const hdr = header.createInstance(); sec.appendChild(hdr);
hdr.x = 80; hdr.y = 60;
hdr.setProperties({ [prop(hdr, 'Title')]: JOURNEY.title, [prop(hdr, 'Status')]: JOURNEY.status, [prop(hdr, 'Description')]: JOURNEY.description });

const cards = [];
for (const s of JOURNEY.steps) {
  let c, name;
  if (s.cloneOf) {
    const src = await figma.getNodeByIdAsync(s.cloneOf);
    c = src.clone(); sec.appendChild(c);
    const slot = c.findOne((x) => x.type === 'SLOT'); if (slot.children[0]) slot.children[0].name = s.name;
    name = s.name;
  } else {
    const frame = await figma.getNodeByIdAsync(s.id);
    if (!frame) throw new Error(`Frame not found: ${s.id}`);
    c = card.createInstance(); sec.appendChild(c);
    const slot = c.findOne((x) => x.type === 'SLOT');
    for (const k of [...slot.children]) k.remove();
    slot.appendChild(frame);
    if (s.name) frame.name = s.name;
    name = frame.name;
  }
  c.setProperties({ [prop(c, 'Frame name')]: name });
  cards.push(c);
}

// Cards hug their frame, so place them by their own widths, in reading order.
const total = cards.reduce((a, c) => a + c.width, 0) + GAP * (cards.length - 1);
const W = Math.max(2 * 80 + total, 80 + 640 + 80);
let maxH = 0, cursor = RTL ? W - 80 : 80;
for (const c of cards) {
  c.x = RTL ? cursor - c.width : cursor; c.y = 200;
  cursor = RTL ? cursor - c.width - GAP : cursor + c.width + GAP;
  maxH = Math.max(maxH, c.height);
}

const callouts = [];
if (calloutSet) for (const k of JOURNEY.callouts) {
  const inst = (calloutSet.children.find((v) => v.name === `Kind=${k.kind || 'Notice'}`) || calloutSet.defaultVariant).createInstance();
  sec.appendChild(inst);
  inst.setProperties({ [prop(inst, 'Body')]: k.body });
  inst.x = cards[k.at].x; inst.y = 200 + maxH + 40;
  inst.resize(Math.max(cards[k.at].width, 360), inst.height);
  inst.layoutSizingVertical = 'HUG';   // resize makes the height fixed, and the text would spill out of the box
  callouts.push(inst.id);
}
sec.resizeWithoutConstraints(W, 200 + maxH + 40 + (callouts.length ? 80 + 80 : 80));
return { section: sec.id, width: W, height: sec.height, cards: cards.map((c) => `${c.id} ${Math.round(c.width)}x${Math.round(c.height)}`), callouts };
