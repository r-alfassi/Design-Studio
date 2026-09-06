const pptxgen = require("pptxgenjs");
const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.3 x 7.5

// Slide 1: simple title + bullets
let s1 = pres.addSlide();
s1.addText("Q3 Business Review", { x: 0.5, y: 0.3, w: 12, h: 0.8, fontSize: 32, bold: true });
s1.addText(
  [
    { text: "Revenue grew 18% year over year", options: { bullet: true, breakLine: true } },
    { text: "Customer churn down to 4.2%", options: { bullet: true, breakLine: true } },
    { text: "New product line launched in July", options: { bullet: true } },
  ],
  { x: 0.7, y: 1.5, w: 8, h: 3, fontSize: 18 }
);

// Slide 2: two-column comparison
let s2 = pres.addSlide();
s2.addText("Regional Performance", { x: 0.5, y: 0.3, w: 12, h: 0.8, fontSize: 32, bold: true });
s2.addText("North America", { x: 0.5, y: 1.3, w: 5.8, h: 0.5, fontSize: 20, bold: true });
s2.addText("Grew 12% YoY, driven by enterprise deals and expansion in the Midwest region.", {
  x: 0.5, y: 1.9, w: 5.8, h: 2, fontSize: 16,
});
s2.addText("EMEA", { x: 6.7, y: 1.3, w: 5.8, h: 0.5, fontSize: 20, bold: true });
s2.addText("Declined 3% due to currency headwinds and slower enterprise sales cycles.", {
  x: 6.7, y: 1.9, w: 5.8, h: 2, fontSize: 16,
});

// Slide 3: table + connected callout
let s3 = pres.addSlide();
s3.addText("Q3 Regional Detail", { x: 0.5, y: 0.3, w: 12, h: 0.8, fontSize: 32, bold: true });
s3.addTable(
  [
    [{ text: "Region", options: { bold: true } }, { text: "Revenue", options: { bold: true } }, { text: "YoY", options: { bold: true } }],
    ["North America", "$4.2M", "+12%"],
    ["EMEA", "$2.1M", "-3%"],
  ],
  { x: 0.7, y: 1.5, w: 7, h: 1.5, fontSize: 14 }
);
s3.addShape(pres.ShapeType.rect, { x: 8.2, y: 1.6, w: 4, h: 1.2, fill: { color: "FFF2CC" }, line: { color: "BF9000" } });
s3.addText("EMEA decline flagged as key risk for Q4 planning", { x: 8.3, y: 1.65, w: 3.8, h: 1.1, fontSize: 12, italic: true });
s3.addShape(pres.ShapeType.rightArrow, { x: 7.75, y: 2.1, w: 0.4, h: 0.3, fill: { color: "BF9000" } });

// Slide 4: chart
let s4 = pres.addSlide();
s4.addText("Revenue by Quarter", { x: 0.5, y: 0.3, w: 12, h: 0.8, fontSize: 32, bold: true });
s4.addChart(pres.ChartType.bar, [
  { name: "Revenue", labels: ["Q1", "Q2", "Q3", "Q4"], values: [3.1, 3.6, 4.2, 4.5] },
], { x: 1, y: 1.5, w: 10, h: 4.5, showTitle: false, showValue: true, chartColors: ["2E75B6"] });

const path = require("path");
pres.writeFile({ fileName: path.join(__dirname, "..", "test_deck.pptx") }).then(() => console.log("done"));
