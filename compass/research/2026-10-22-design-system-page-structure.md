# What design-system documentation pages standardize

Researched 2026-10-22 for the decision on what the studio presentation kit holds for design-system pages (`standards/studio-presentation.md`, Q-68). Kind: descriptive source study. Limit: 4 rounds of search and 8 reads, used in full. Local evidence first: Sharon's design-system Figma file and the Karma Warrior Figma file, both read-only.

## Local evidence

- **Sharon, Components page.** A page header, then white section cards (Actions, Data Display, Inputs, Scheduling). Each section has a title and one line saying what it holds. A component block has a heading, one line on its variants, and the variants laid out plainly, inside Figma's own dashed component-set outline. Foundations is one frame with color swatches and token names, spacing bars with name and value, and a type scale with role, size and weight.
- **Karma Warrior, Components page.** One section marked "provisional v0.1", with a side card giving the build order, and a column of component cards. Each card has an eyebrow naming its kind (primitive, atom, assembly), the component name, one line of description, a preview, and a usage line. Foundations uses cards in a grid, a callout banner for a standard, a labelled list of accepted exceptions, and a status in the title.

## Outside evidence

Official pages read: Carbon (button guidelines, spacing overview), Atlassian (button examples), Primer (button overview). Polaris and Material 3 official pages could not be read (a redirect, a closed socket, and a page that renders by script), so neither is counted. A general search of design-system documentation advice returned mostly blog posts, which are treated as conventions and not as standards.

- **Title block and one-line intro.** All three official pages open with the component name and one sentence. Carbon's title block also carries a "Stable" label and a last-updated date.
- **Status.** Carbon shows a status label and date on the page. Atlassian shows "Caution", "Beta" and "Deprecated" labels in its side navigation. Primer shows a status row per platform marked "ready". Morningstar's status page defines Stable, Beta and Deprecated, with a last-updated column and New and Updated markers.
- **Several views, not one box.** Carbon splits a component into Guidelines, Specifications, Code and Accessibility. Atlassian splits it into Examples, Code, Usage and Changelog. Primer splits it into Overview, Guidelines and Accessibility.
- **What a page holds.** The common core is the name, a one-line description, live examples of the variants, and usage guidance in prose. Only Carbon shows an anatomy diagram and do and don't image pairs on the page. Atlassian and Primer show neither. Blog advice recommends both, and recommends about one picture for every five to ten text-only guidelines.
- **Callouts.** Carbon puts an info note near the top ("some examples are not yet available for production use"). Atlassian puts a feature-flag note and a deprecation notice inline. Carbon's FAQ states when an exception to the spacing scale is allowed.
- **Token display.** Carbon shows spacing tokens as a table of name, rem value, px value and an example image, with no swatches or bars. No second outside source for token display was found in the budget.
- **Also present, not asked about.** An "On this page" contents list, related components, a feedback widget, and links to code and Figma.

## What was not found

A second outside source for how tokens are displayed, and any official source for Polaris or Material 3. Inference: the kit's token tile rests on the local files, and on one outside source.
