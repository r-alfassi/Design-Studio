import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const product = path.join(here, "..", "compass", "product");
const index = path.join(product, "README.md");
const core = ["purpose.md", "audience.md", "scope.md", "constraints.md"];
const onDemand = ["principles.md", "requirements.md", "journeys.md", "features.md", "system.md"];
const description = (name) => {
  const text = fs.readFileSync(path.join(product, name), "utf8");
  const match = text.match(/^---\r?\ndescription: (.+)\r?\nfollows:/m);
  if (!match) throw new Error(`${name} has no description frontmatter`);
  return match[1];
};
const rows = (names) => names.filter((name) => fs.existsSync(path.join(product, name)))
  .map((name) => `- \`${name}\`: ${description(name)}`);
const parts = ["## Core", ...rows(core)];
const deferred = rows(onDemand);
if (deferred.length) parts.push("", "## On demand", ...deferred);
const generated = parts.join("\n");
const current = fs.readFileSync(index, "utf8");
const next = current.replace(/<!-- generated:start -->[\s\S]*?<!-- generated:end -->/, `<!-- generated:start -->\n\n${generated}\n\n<!-- generated:end -->`);
if (next === current) console.log("ok: Compass product index is current");
else { fs.writeFileSync(index, next); console.log("updated: Compass product index"); }
