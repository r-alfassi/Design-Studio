#!/usr/bin/env node
/**
 * pptx-to-md.ts
 *
 * Converts a .pptx into a layout-aware Markdown representation designed for
 * AI context, not human skimming. A PPTX is a zip of XML parts, so this
 * needs no PowerPoint-specific runtime -- just a zip reader and an XML parser.
 *
 * Design goals (see SKILL.md for the full rationale):
 *  - Reading order is computed from shape POSITION (top-to-bottom, then
 *    left-to-right within a row-band), not from XML document order (which is
 *    z-order / draw order and often wrong for reading).
 *  - Every element is tagged with a ROLE (title, body text, table, chart,
 *    image, connector, group) instead of being flattened into plain text.
 *  - Spatial relationships that carry meaning (two-column layout, a callout
 *    positioned next to a table) are stated explicitly in words, not as
 *    coordinates.
 *  - Tables and charts are converted into structured data (markdown tables),
 *    not dropped or captioned.
 */

import AdmZip from "adm-zip";
import { XMLParser } from "fast-xml-parser";
import * as fs from "fs";
import * as path from "path";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Rect {
  x: number; // EMU
  y: number;
  cx: number;
  cy: number;
}

type ShapeKind = "text" | "table" | "chart" | "picture" | "connector" | "group";
type Role = "title" | "subtitle" | "body" | "text" | "notes";

interface ExtractedShape {
  id: string;
  name: string;
  kind: ShapeKind;
  role?: Role;
  rect?: Rect;
  text?: string; // for text shapes: rendered with bullets/indentation preserved
  maxFontSize?: number;
  bold?: boolean;
  tableMd?: string;
  chartDesc?: string;
  pictureDesc?: string;
  children?: ExtractedShape[]; // for groups (flattened text only, see README caveat)
  connectorEndpoints?: { start?: string; end?: string };
}

const EMU_PER_INCH = 914400;

// ---------------------------------------------------------------------------
// XML parsing setup
// ---------------------------------------------------------------------------

const REPEATABLE_TAGS = new Set([
  "a:p", "a:r", "a:tr", "a:tc", "a:gridCol",
  "p:sp", "p:pic", "p:graphicFrame", "p:cxnSp", "p:grpSp",
  "c:ser", "c:pt",
]);

function makeParser() {
  return new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    allowBooleanAttributes: true,
    trimValues: false,
    isArray: (name) => REPEATABLE_TAGS.has(name),
  });
}

function readXml(zip: AdmZip, entryPath: string): any | null {
  const entry = zip.getEntry(entryPath);
  if (!entry) return null;
  const xml = zip.readAsText(entry);
  return makeParser().parse(xml);
}

// ---------------------------------------------------------------------------
// Slide ordering + size
// ---------------------------------------------------------------------------

function getSlideOrder(zip: AdmZip): string[] {
  const pres = readXml(zip, "ppt/presentation.xml");
  const relsXml = readXml(zip, "ppt/_rels/presentation.xml.rels");
  const relEntries: any[] = relsXml?.Relationships?.Relationship
    ? Array.isArray(relsXml.Relationships.Relationship)
      ? relsXml.Relationships.Relationship
      : [relsXml.Relationships.Relationship]
    : [];
  const ridToTarget = new Map<string, string>();
  for (const r of relEntries) ridToTarget.set(r["@_Id"], r["@_Target"]);

  const sldIdList = pres?.["p:presentation"]?.["p:sldIdLst"]?.["p:sldId"];
  const ids: any[] = sldIdList ? (Array.isArray(sldIdList) ? sldIdList : [sldIdList]) : [];

  const files: string[] = [];
  for (const s of ids) {
    const rid = s["@_r:id"];
    const target = ridToTarget.get(rid);
    if (target) files.push("ppt/" + target.replace(/^\.?\//, ""));
  }
  if (files.length > 0) return files;

  // Fallback: sort by numeric suffix if presentation.xml parsing failed
  return zip
    .getEntries()
    .map((e) => e.entryName)
    .filter((n) => /^ppt\/slides\/slide\d+\.xml$/.test(n))
    .sort((a, b) => {
      const na = parseInt(a.match(/(\d+)/)![1], 10);
      const nb = parseInt(b.match(/(\d+)/)![1], 10);
      return na - nb;
    });
}

function getSlideSize(zip: AdmZip): { cx: number; cy: number } {
  const pres = readXml(zip, "ppt/presentation.xml");
  const sz = pres?.["p:presentation"]?.["p:sldSz"];
  return {
    cx: sz ? parseInt(sz["@_cx"], 10) : 12192000, // default 16:9 widescreen
    cy: sz ? parseInt(sz["@_cy"], 10) : 6858000,
  };
}

function getSlideRels(zip: AdmZip, slideFile: string): Map<string, string> {
  const slideName = path.basename(slideFile);
  const relsPath = `ppt/slides/_rels/${slideName}.rels`;
  const relsXml = readXml(zip, relsPath);
  const rels: any[] = relsXml?.Relationships?.Relationship
    ? Array.isArray(relsXml.Relationships.Relationship)
      ? relsXml.Relationships.Relationship
      : [relsXml.Relationships.Relationship]
    : [];
  const map = new Map<string, string>();
  for (const r of rels) map.set(r["@_Id"], r["@_Target"]);
  return map;
}

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

function getRect(xfrm: any): Rect | undefined {
  if (!xfrm) return undefined;
  const off = xfrm["a:off"];
  const ext = xfrm["a:ext"];
  if (!off || !ext) return undefined;
  return {
    x: parseInt(off["@_x"], 10) || 0,
    y: parseInt(off["@_y"], 10) || 0,
    cx: parseInt(ext["@_cx"], 10) || 0,
    cy: parseInt(ext["@_cy"], 10) || 0,
  };
}

function asArray<T>(v: T | T[] | undefined): T[] {
  if (v === undefined) return [];
  return Array.isArray(v) ? v : [v];
}

/** Extract plain text + bullet/indent-aware markdown from a p:txBody. */
function extractText(txBody: any): { text: string; maxFontSize: number; bold: boolean } {
  if (!txBody) return { text: "", maxFontSize: 0, bold: false };
  const paras = asArray(txBody["a:p"]);
  const lines: string[] = [];
  let maxFontSize = 0;
  let anyBold = false;

  for (const p of paras) {
    const pPr = p["a:pPr"];
    const hasBullet = !!(pPr && (pPr["a:buChar"] || pPr["a:buAutoNum"]));
    const marL = pPr ? parseInt(pPr["@_marL"], 10) || 0 : 0;
    const indentLevel = Math.round(marL / 342900); // ~0.375in per level, PowerPoint default

    const runs = asArray(p["a:r"]);
    const runTexts: string[] = [];
    for (const r of runs) {
      const t = r["a:t"];
      const txt = typeof t === "string" ? t : t?.["#text"] ?? "";
      runTexts.push(txt);
      const rPr = r["a:rPr"];
      if (rPr) {
        const sz = parseInt(rPr["@_sz"], 10);
        if (!isNaN(sz) && sz > maxFontSize) maxFontSize = sz;
        if (rPr["@_b"] === "1" || rPr["@_b"] === true) anyBold = true;
      }
    }
    const lineText = runTexts.join("");
    if (lineText.trim() === "" && runs.length === 0) {
      continue; // skip fully empty spacer paragraphs
    }
    const indent = "  ".repeat(Math.max(0, indentLevel));
    lines.push(hasBullet ? `${indent}- ${lineText}` : `${indent}${lineText}`);
  }

  return { text: lines.join("\n"), maxFontSize: maxFontSize / 100, bold: anyBold };
}

function getPlaceholderType(sp: any): string | undefined {
  return sp?.["p:nvSpPr"]?.["p:nvPr"]?.["p:ph"]?.["@_type"];
}

function escapeMdCell(s: string): string {
  return s.replace(/\|/g, "\\|").replace(/\n/g, "<br>");
}

// ---------------------------------------------------------------------------
// Table extraction
// ---------------------------------------------------------------------------

function extractTable(tbl: any): string {
  const rows = asArray(tbl["a:tr"]);
  const mdRows: string[][] = [];
  for (const row of rows) {
    const cells = asArray(row["a:tc"]);
    const cellTexts = cells.map((c) => {
      const { text } = extractText(c["a:txBody"]);
      return escapeMdCell(text.replace(/^- /gm, "").trim());
    });
    mdRows.push(cellTexts);
  }
  if (mdRows.length === 0) return "";

  // Strip trailing columns that are empty across all rows
  let colCount = mdRows[0].length;
  while (colCount > 1 && mdRows.every((row) => (row[colCount - 1] ?? "") === "")) colCount--;
  const trimmed = mdRows.map((row) => row.slice(0, colCount));

  const header = trimmed[0];
  const sep = header.map(() => "---");
  const lines = [
    `| ${header.join(" | ")} |`,
    `| ${sep.join(" | ")} |`,
    ...trimmed.slice(1).map((r) => `| ${r.join(" | ")} |`),
  ];
  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// Chart extraction
// ---------------------------------------------------------------------------

function findChartType(plotArea: any): string | undefined {
  const candidates = [
    "c:barChart", "c:lineChart", "c:pieChart", "c:pie3DChart", "c:areaChart",
    "c:scatterChart", "c:bubbleChart", "c:doughnutChart", "c:radarChart", "c:stockChart",
  ];
  for (const c of candidates) {
    if (plotArea[c]) return c.replace("c:", "").replace("Chart", "");
  }
  return undefined;
}

function extractChart(chartXml: any): string {
  const chartSpace = chartXml?.["c:chartSpace"];
  const plotArea = chartSpace?.["c:chart"]?.["c:plotArea"];
  if (!plotArea) return "[Chart: could not parse chart data]";

  const chartType = findChartType(plotArea) ?? "unknown";
  const chartTagKey = Object.keys(plotArea).find((k) => k.endsWith("Chart"));
  const chartNode = chartTagKey ? plotArea[chartTagKey] : undefined;
  const seriesList = asArray(chartNode?.["c:ser"]);

  if (seriesList.length === 0) return `[Chart type: ${chartType} — no series data found]`;

  // Categories: use the first series' categories (assume shared across series)
  const firstSer = seriesList[0];
  const catRef = firstSer["c:cat"]?.["c:strRef"] ?? firstSer["c:cat"]?.["c:multiLvlStrRef"];
  const catCache = catRef?.["c:strCache"] ?? catRef?.["c:multiLvlStrCache"];
  let categories: string[] = [];
  if (catCache) {
    const lvl = catCache["c:lvl"] ?? catCache; // multiLvl has an extra c:lvl wrapper
    const pts = asArray(lvl["c:pt"]);
    categories = pts.map((p: any) => (typeof p["c:v"] === "string" ? p["c:v"] : String(p["c:v"] ?? "")));
  }

  const seriesData: { name: string; values: string[] }[] = [];
  for (const ser of seriesList) {
    const nameStrCache = ser["c:tx"]?.["c:strRef"]?.["c:strCache"];
    const namePts = asArray(nameStrCache?.["c:pt"]);
    const rawName = namePts[0]?.["c:v"];
    const name = typeof rawName === "string" ? rawName : rawName != null ? String(rawName) : ser["c:tx"]?.["c:v"] ?? "Series";
    const valCache = ser["c:val"]?.["c:numRef"]?.["c:numCache"];
    const pts = asArray(valCache?.["c:pt"]);
    const values = pts.map((p: any) => String(p["c:v"] ?? ""));
    seriesData.push({ name, values });
  }

  const header = ["Category", ...seriesData.map((s) => s.name)];
  const rows: string[][] = categories.map((cat, i) => [
    cat,
    ...seriesData.map((s) => s.values[i] ?? ""),
  ]);

  const lines = [
    `[Chart type: ${chartType}]`,
    `| ${header.join(" | ")} |`,
    `| ${header.map(() => "---").join(" | ")} |`,
    ...rows.map((r) => `| ${r.join(" | ")} |`),
  ];
  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// Per-slide shape extraction
// ---------------------------------------------------------------------------

function extractShapesFromTree(
  spTree: any,
  zip: AdmZip,
  rels: Map<string, string>
): ExtractedShape[] {
  const shapes: ExtractedShape[] = [];

  for (const sp of asArray(spTree["p:sp"])) {
    const id = sp["p:nvSpPr"]?.["p:cNvPr"]?.["@_id"] ?? "?";
    const name = sp["p:nvSpPr"]?.["p:cNvPr"]?.["@_name"] ?? "";
    const rect = getRect(sp["p:spPr"]?.["a:xfrm"]);
    const { text, maxFontSize, bold } = extractText(sp["p:txBody"]);
    if (text.trim() === "") {
      const prst = sp["p:spPr"]?.["a:prstGeom"]?.["@_prst"] as string | undefined;
      if (prst && /arrow|connector/i.test(prst) && rect) {
        shapes.push({ id, name, kind: "connector", rect, connectorEndpoints: {} });
      }
      continue; // skip other empty decorative shapes (lines, plain rectangles, etc.)
    }
    const phType = getPlaceholderType(sp);
    let role: Role = "text";
    if (phType === "title" || phType === "ctrTitle") role = "title";
    else if (phType === "subTitle") role = "subtitle";
    else if (phType === "body") role = "body";
    shapes.push({ id, name, kind: "text", role, rect, text, maxFontSize, bold });
  }

  for (const pic of asArray(spTree["p:pic"])) {
    const id = pic["p:nvPicPr"]?.["p:cNvPr"]?.["@_id"] ?? "?";
    const name = pic["p:nvPicPr"]?.["p:cNvPr"]?.["@_name"] ?? "";
    const descr = pic["p:nvPicPr"]?.["p:cNvPr"]?.["@_descr"];
    const rect = getRect(pic["p:spPr"]?.["a:xfrm"]);
    shapes.push({
      id,
      name,
      kind: "picture",
      rect,
      pictureDesc: descr ? `[Image: ${descr}]` : `[Image: ${name || "untitled"}]`,
    });
  }

  for (const gf of asArray(spTree["p:graphicFrame"])) {
    const id = gf["p:nvGraphicFramePr"]?.["p:cNvPr"]?.["@_id"] ?? "?";
    const name = gf["p:nvGraphicFramePr"]?.["p:cNvPr"]?.["@_name"] ?? "";
    const rect = getRect(gf["p:xfrm"]);
    const graphicData = gf["a:graphic"]?.["a:graphicData"];
    const uri: string = graphicData?.["@_uri"] ?? "";

    if (uri.includes("/table") && graphicData["a:tbl"]) {
      shapes.push({ id, name, kind: "table", rect, tableMd: extractTable(graphicData["a:tbl"]) });
    } else if (uri.includes("/chart")) {
      const rid = graphicData["c:chart"]?.["@_r:id"];
      const target = rid ? rels.get(rid) : undefined;
      let chartDesc = "[Chart: unresolved reference]";
      if (target) {
        const chartPath = "ppt/" + target.replace(/^\.?\.?\//, "").replace(/^ppt\//, "");
        const normalizedPath = target.startsWith("../") ? "ppt/" + target.replace("../", "") : chartPath;
        const chartXml = readXml(zip, normalizedPath) ?? readXml(zip, `ppt/charts/${path.basename(target)}`);
        if (chartXml) chartDesc = extractChart(chartXml);
      }
      shapes.push({ id, name, kind: "chart", rect, chartDesc });
    } else {
      shapes.push({ id, name, kind: "table", rect, tableMd: "[Embedded object: unsupported type (e.g. SmartArt or OLE object) — not extracted]" });
    }
  }

  for (const cxn of asArray(spTree["p:cxnSp"])) {
    const id = cxn["p:nvCxnSpPr"]?.["p:cNvPr"]?.["@_id"] ?? "?";
    const name = cxn["p:nvCxnSpPr"]?.["p:cNvPr"]?.["@_name"] ?? "";
    const rect = getRect(cxn["p:spPr"]?.["a:xfrm"]);
    const cNvCxnSpPr = cxn["p:nvCxnSpPr"]?.["p:cNvCxnSpPr"];
    const start = cNvCxnSpPr?.["a:stCxn"]?.["@_id"];
    const end = cNvCxnSpPr?.["a:endCxn"]?.["@_id"];
    shapes.push({ id, name, kind: "connector", rect, connectorEndpoints: { start, end } });
  }

  for (const grp of asArray(spTree["p:grpSp"])) {
    const id = grp["p:nvGrpSpPr"]?.["p:cNvPr"]?.["@_id"] ?? "?";
    const name = grp["p:nvGrpSpPr"]?.["p:cNvPr"]?.["@_name"] ?? "";
    const rect = getRect(grp["p:grpSpPr"]?.["a:xfrm"]);
    const children = extractShapesFromTree(grp, zip, rels);
    if (children.length === 0) continue;
    shapes.push({ id, name, kind: "group", rect, children });
  }

  // Resolve connector endpoint IDs to sibling shape names/labels where possible,
  // since "shape 7" means nothing to an agent but "the table" or "North America" does.
  const idToLabel = new Map<string, string>();
  for (const s of shapes) {
    if (s.kind === "text") idToLabel.set(s.id, (s.text ?? "").split("\n")[0].replace(/^- /, "").slice(0, 40));
    else if (s.kind === "table") idToLabel.set(s.id, "the table");
    else if (s.kind === "chart") idToLabel.set(s.id, "the chart");
    else if (s.kind === "picture") idToLabel.set(s.id, s.name || "the image");
  }
  for (const s of shapes) {
    if (s.kind === "connector" && s.connectorEndpoints) {
      const { start, end } = s.connectorEndpoints;
      if (start && idToLabel.has(start)) s.connectorEndpoints.start = idToLabel.get(start);
      if (end && idToLabel.has(end)) s.connectorEndpoints.end = idToLabel.get(end);
    }
  }

  return shapes;
}

// ---------------------------------------------------------------------------
// Reading order + spatial labeling
// ---------------------------------------------------------------------------

function sortReadingOrder(shapes: ExtractedShape[]): ExtractedShape[] {
  const withRect = shapes.filter((s) => s.rect);
  const withoutRect = shapes.filter((s) => !s.rect);

  // Band shapes into rows: sort by top, then greedily group shapes whose
  // vertical span overlaps the running row band by more than ~40%.
  const sorted = [...withRect].sort((a, b) => a.rect!.y - b.rect!.y);
  const rows: ExtractedShape[][] = [];
  for (const shape of sorted) {
    const r = shape.rect!;
    let placed = false;
    for (const row of rows) {
      const rowTop = Math.min(...row.map((s) => s.rect!.y));
      const rowBottom = Math.max(...row.map((s) => s.rect!.y + s.rect!.cy));
      const overlap =
        Math.min(rowBottom, r.y + r.cy) - Math.max(rowTop, r.y);
      const smallerHeight = Math.min(rowBottom - rowTop, r.cy);
      if (smallerHeight > 0 && overlap / smallerHeight > 0.4) {
        row.push(shape);
        placed = true;
        break;
      }
    }
    if (!placed) rows.push([shape]);
  }
  for (const row of rows) row.sort((a, b) => a.rect!.x - b.rect!.x);
  rows.sort((a, b) => Math.min(...a.map((s) => s.rect!.y)) - Math.min(...b.map((s) => s.rect!.y)));

  return [...rows.flat(), ...withoutRect];
}

function columnLabel(rect: Rect | undefined, slideCx: number): string | undefined {
  if (!rect) return undefined;
  const center = rect.x + rect.cx / 2;
  const third = slideCx / 3;
  if (center < third) return "left";
  if (center > 2 * third) return "right";
  return "center";
}

/** Detect simple two/three-column bands: shapes in the same row-group whose
 *  x-ranges don't overlap get an explicit "Left/Right/Middle column" label. */
function labelColumns(row: ExtractedShape[]): Map<string, string> {
  const labels = new Map<string, string>();
  if (row.length < 2) return labels;
  const withRect = row.filter((s) => s.rect);
  if (withRect.length < 2) return labels;
  const sorted = [...withRect].sort((a, b) => a.rect!.x - b.rect!.x);
  const namesByCount: Record<number, string[]> = {
    2: ["Left column", "Right column"],
    3: ["Left column", "Middle column", "Right column"],
  };
  const names = namesByCount[sorted.length];
  if (names) {
    sorted.forEach((s, i) => labels.set(s.id, names[i]));
  } else if (sorted.length > 3) {
    sorted.forEach((s, i) => labels.set(s.id, `Column ${i + 1} of ${sorted.length}`));
  }
  return labels;
}

// ---------------------------------------------------------------------------
// Rendering a slide to markdown
// ---------------------------------------------------------------------------

function renderShape(s: ExtractedShape, columnTag?: string, depth = 0): string[] {
  const indent = "  ".repeat(depth);
  const tagParts: string[] = [];
  if (s.role === "title") tagParts.push("Title");
  else if (s.role === "subtitle") tagParts.push("Subtitle");
  else if (columnTag) tagParts.push(columnTag);

  const lines: string[] = [];
  switch (s.kind) {
    case "text": {
      const tag = tagParts.length ? `[${tagParts.join(", ")}] ` : "";
      const textLines = (s.text ?? "").split("\n");
      if (s.role === "title") {
        lines.push(`${indent}### ${s.text}`);
      } else if (textLines.length > 1) {
        // Multi-paragraph text: extractText already applied "- " bullets and
        // indentation where the deck itself used them. Just add the tag as a
        // one-line label above, don't wrap the whole block in another bullet.
        if (tag) lines.push(`${indent}${tag.trim()}`);
        lines.push(...textLines.map((l) => `${indent}${l}`));
      } else {
        lines.push(`${indent}- ${tag}${textLines[0]}`);
      }
      break;
    }
    case "table": {
      const tag = tagParts.length ? `[Table, ${tagParts.join(", ")}]` : "[Table]";
      lines.push(`${indent}${tag}`);
      lines.push(...(s.tableMd ?? "").split("\n").map((l) => `${indent}${l}`));
      break;
    }
    case "chart": {
      const tag = tagParts.length ? `${tagParts.join(", ")}` : "";
      lines.push(`${indent}${(s.chartDesc ?? "").split("\n")[0]}${tag ? ` (${tag})` : ""}`);
      lines.push(...(s.chartDesc ?? "").split("\n").slice(1).map((l) => `${indent}${l}`));
      break;
    }
    case "picture": {
      lines.push(`${indent}${s.pictureDesc}${tagParts.length ? ` [${tagParts.join(", ")}]` : ""}`);
      break;
    }
    case "connector": {
      const startEnd = s.connectorEndpoints;
      if (startEnd?.start || startEnd?.end) {
        lines.push(`${indent}[Connector: shape ${startEnd.start ?? "?"} -> shape ${startEnd.end ?? "?"}]`);
      } else {
        lines.push(`${indent}[Connector / line shape]`);
      }
      break;
    }
    case "group": {
      lines.push(`${indent}[Group${tagParts.length ? `, ${tagParts.join(", ")}` : ""}]`);
      for (const child of s.children ?? []) {
        lines.push(...renderShape(child, undefined, depth + 1));
      }
      break;
    }
  }
  return lines;
}

function renderSlide(
  slideNum: number,
  shapes: ExtractedShape[],
  slideCx: number,
  notes?: string
): string {
  const ordered = sortReadingOrder(shapes);

  // Title detection fallback: if no shape was tagged "title" via placeholder
  // type, promote the topmost text shape with the largest font size.
  const hasTitle = ordered.some((s) => s.role === "title");
  if (!hasTitle) {
    const textShapes = ordered.filter((s) => s.kind === "text");
    if (textShapes.length > 0) {
      const topBand = Math.min(...textShapes.map((s) => s.rect?.y ?? Infinity));
      const candidate = textShapes.find(
        (s) => (s.rect?.y ?? Infinity) - topBand < 200000 // within ~0.2in of top-most shape
      );
      if (candidate && (candidate.maxFontSize ?? 0) >= 20) candidate.role = "title";
    }
  }

  const title = ordered.find((s) => s.role === "title");
  const heading = title ? (title.text ?? "").replace(/^- /, "") : `(untitled)`;

  // Build row bands again (for column labeling) using the same logic as sort.
  const withRect = ordered.filter((s) => s.rect);
  const rows: ExtractedShape[][] = [];
  for (const shape of withRect) {
    let placed = false;
    for (const row of rows) {
      if (row.includes(shape)) { placed = true; break; }
    }
    if (placed) continue;
    const row = [shape];
    for (const other of withRect) {
      if (other === shape || rows.some((r) => r.includes(other))) continue;
      const a = shape.rect!, b = other.rect!;
      const overlap = Math.min(a.y + a.cy, b.y + b.cy) - Math.max(a.y, b.y);
      const smaller = Math.min(a.cy, b.cy);
      if (smaller > 0 && overlap / smaller > 0.4) row.push(other);
    }
    rows.push(row);
  }

  const columnTags = new Map<string, string>();
  for (const row of rows) {
    const labels = labelColumns(row);
    for (const [id, label] of labels) columnTags.set(id, label);
  }

  const lines: string[] = [`## Slide ${slideNum}: ${heading}`, ""];

  const multiColRow = rows.some((r) => r.length > 1 && labelColumns(r).size > 0);
  if (multiColRow) lines.push(`**Layout:** multi-column`, "");

  for (const s of ordered) {
    if (s.role === "title") continue; // already used as heading
    lines.push(...renderShape(s, columnTags.get(s.id)));
    lines.push("");
  }

  if (notes && notes.trim()) {
    lines.push("", `**Speaker notes:** ${notes.trim()}`);
  }

  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// Notes extraction
// ---------------------------------------------------------------------------

function extractNotes(zip: AdmZip, slideFile: string): string | undefined {
  const slideNum = slideFile.match(/slide(\d+)\.xml$/)?.[1];
  if (!slideNum) return undefined;
  const notesPath = `ppt/notesSlides/notesSlide${slideNum}.xml`;
  const notesXml = readXml(zip, notesPath);
  const spTree = notesXml?.["p:notes"]?.["p:cSld"]?.["p:spTree"];
  if (!spTree) return undefined;
  const texts: string[] = [];
  for (const sp of asArray(spTree["p:sp"])) {
    const phType = getPlaceholderType(sp);
    if (phType === "body") {
      const { text } = extractText(sp["p:txBody"]);
      if (text.trim()) texts.push(text.trim());
    }
  }
  return texts.join("\n");
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function convert(pptxPath: string): string {
  const zip = new AdmZip(pptxPath);
  const slideFiles = getSlideOrder(zip);
  const { cx: slideCx } = getSlideSize(zip);

  const deckName = path.basename(pptxPath, path.extname(pptxPath));
  const out: string[] = [`# ${deckName}`, ""];

  slideFiles.forEach((slideFile, i) => {
    const slideXml = readXml(zip, slideFile);
    const spTree = slideXml?.["p:sld"]?.["p:cSld"]?.["p:spTree"];
    if (!spTree) return;
    const rels = getSlideRels(zip, slideFile);
    const shapes = extractShapesFromTree(spTree, zip, rels);
    const notes = extractNotes(zip, slideFile);
    out.push(renderSlide(i + 1, shapes, slideCx, notes), "");
  });

  return out.join("\n");
}

// CLI entry point
if (require.main === module) {
  const input = process.argv[2];
  const output = process.argv[3];
  if (!input) {
    console.error("Usage: tsx pptx-to-md.ts <input.pptx> [output.md]");
    process.exit(1);
  }
  const md = convert(path.resolve(input));
  if (output) {
    fs.writeFileSync(path.resolve(output), md, "utf-8");
    console.error(`Wrote ${output}`);
  } else {
    console.log(md);
  }
}

export { convert };
