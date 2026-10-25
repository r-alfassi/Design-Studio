// build-journey-section.js — lay one journey on a Flows page as a kit section
// Paste into use_figma. Set the parameters below before running.
// Creates one section: a kit Section header, a row of kit Frame cards (each holding a captured frame and
// labelled Current), and optional kit Callouts. It moves the listed frames into the cards and places the
// section under everything else on the page. Nothing else is touched.
// Read standards/studio-presentation.md and the Flows page note in SKILL.md first.

const FLOWS_PAGE = 'Flows';
const CARD_SOURCE = '';        // id of an existing Frame card instance on the page; its component is reused and its section is the template
const CALLOUT_SOURCE = '';     // id of an existing Callout instance on the page, or '' for no callouts
const RTL = true;              // step 1 sits at the right end when true
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

const page = figma.root.children.find((p) => p.name === FLOWS_PAGE);
if (!page) throw new Error(`Page not found: ${FLOWS_PAGE}`);
await figma.setCurrentPageAsync(page);

const cardSrc = await figma.getNodeByIdAsync(CARD_SOURCE);
if (!cardSrc || cardSrc.type !== 'INSTANCE') throw new Error('CARD_SOURCE must be a Frame card instance');
const cardMain = await cardSrc.getMainComponentAsync();
const cardW = cardSrc.width;
const sectionSrc = cardSrc.parent;
if (!sectionSrc || sectionSrc.type !== 'SECTION') throw new Error('CARD_SOURCE must sit directly in a section');
const calSrc = CALLOUT_SOURCE ? await figma.getNodeByIdAsync(CALLOUT_SOURCE) : null;

const prop = (node, prefix) => Object.keys(node.componentProperties).find((k) => k.startsWith(prefix));
const n = JOURNEY.steps.length, W = 2 * 80 + n * cardW + (n - 1) * GAP;

let bottom = 0;
for (const c of page.children) bottom = Math.max(bottom, c.y + c.height);

const sec = sectionSrc.clone();
sec.name = JOURNEY.name;
for (const c of [...sec.children]) if (!(c.type === 'INSTANCE' && c.name === 'Section header')) c.remove();
sec.x = 0; sec.y = bottom + 200;
const hdr = sec.children.find((c) => c.name === 'Section header');
hdr.setProperties({ [prop(hdr, 'Title')]: JOURNEY.title, [prop(hdr, 'Status')]: JOURNEY.status, [prop(hdr, 'Description')]: JOURNEY.description });

const cards = []; let maxH = 0;
for (let i = 0; i < n; i++) {
  const s = JOURNEY.steps[i]; let card, name;
  if (s.cloneOf) {
    const src = await figma.getNodeByIdAsync(s.cloneOf);
    card = src.clone(); sec.appendChild(card);
    const slot = card.findOne((x) => x.type === 'SLOT'); if (slot.children[0]) slot.children[0].name = s.name;
    name = s.name;
  } else {
    const frame = await figma.getNodeByIdAsync(s.id);
    if (!frame) throw new Error(`Frame not found: ${s.id}`);
    card = cardMain.createInstance(); sec.appendChild(card);
    const slot = card.findOne((x) => x.type === 'SLOT');
    for (const k of [...slot.children]) k.remove();
    slot.appendChild(frame);
    if (s.name) frame.name = s.name;
    name = frame.name;
  }
  card.setProperties({ [prop(card, 'Frame name')]: name });
  card.x = RTL ? W - 80 - cardW - i * (cardW + GAP) : 80 + i * (cardW + GAP);
  card.y = 200; maxH = Math.max(maxH, card.height); cards.push(card);
}

const callouts = [];
if (calSrc) for (const c of JOURNEY.callouts) {
  const call = calSrc.clone(); sec.appendChild(call);
  call.setProperties({ Kind: c.kind || 'Notice', [prop(call, 'Body')]: c.body });
  call.x = cards[c.at].x; call.y = 200 + maxH + 40; callouts.push(call.id);
}
sec.resizeWithoutConstraints(W, 200 + maxH + 40 + (callouts.length ? 80 + 80 : 80));
return { section: sec.id, width: W, height: sec.height, cards: cards.map((c) => `${c.id} ${Math.round(c.height)}`), callouts };
