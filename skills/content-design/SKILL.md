---
name: content-design
description: Check that the content inside a designed interface is valid: each string has a type and a source, and none is the agent's commentary on the process. Use before a Figma frame or a built interface that holds text the agent wrote is called reviewable.
metadata:
  takes: "the frame or interface to check, the project's glossary, the data the interface shows"
  hands_on: "a content inventory, slop found, approved replacements"
---

# Content design

This skill is responsible for whether the words inside a designed interface are valid. It starts with one fault, which the Designer calls slop: text that reads as generated and is not backed by the product. It holds a catalogue of such patterns, each a thing the Designer keeps seeing, and a check that finds them. Voice, terminology, microcopy and localization are added here as they are needed.

It does not decide what a product says. The Designer and the project's own content decide that, and this skill checks that what an interface says has a source.

## What a string is

Each string in an interface is one of these types, and each names where it comes from.

| Type | What it is | Where it comes from |
|---|---|---|
| Label | a name for a thing, a column, a control | the project's vocabulary |
| Value | a number, a date, a name, a count | a data field, formatted by a stated rule |
| State | what a thing is now: empty, loading, selected, failed | a set of states the product defines |
| Action | what a control does | the project's vocabulary |
| Help | one sentence that says what a label or a value means | one entry for the label, written once |
| Error | what went wrong and what to do | the rule that raised it |

A judgment is shown as a value or as one of a set of statuses, and the rule that produced it is documented once.

## Steps

1. **Inventory the strings.** List every text in the frame or interface, with where it sits. A string left out of the list is not checked.
   Step: inventory · kind: judgment · takes: the frame or interface to check · hands on: string inventory
2. **Give each string a type and a source.** Name the data field, rule, vocabulary entry or Designer's text it comes from.
   Step: type · kind: judgment · takes: string inventory, the data the interface shows · hands on: typed strings
3. **Test each string against the patterns below.** A string that fails a pattern is slop, and the finding names the pattern.
   Step: test · kind: judgment · takes: typed strings, the project's glossary · hands on: slop found
4. **Offer a replacement for each finding, and stop for the Designer.** The replacement is a label, a value, a status or one help entry with its source named. A string with no source stays out until the Designer decides.
   Step: resolve · kind: owner · takes: slop found · hands on: approved replacements
5. **List the strings again after the changes.** Every string now has a type and a source, and no two name one thing differently.
   Step: re_check · kind: check-judgment · takes: approved replacements, typed strings · hands on: a content inventory

## Rules

1. **Give every string a type and a source before it is placed.** A string with neither cannot be checked against the data or kept in step with it. Test: each string in the inventory has one of the types above and names its source.
2. **Show a judgment as a value or a status from a defined set, and keep its reasoning in one help entry.** A conclusion written into the interface is a claim no rule backs. Test: no string states a conclusion that a stated rule did not produce.
3. **Take a string that has no source to the Designer.** An agent's wording is not a source. Test: each string left in the interface names a data field, a rule, a vocabulary entry or the Designer's text.
4. **Use the glossary's word for a thing, in every string.** Two names for one thing read as two things. Test: no two strings in the interface name one thing differently.

## Patterns

Each pattern has a name, a definition, a test an agent can apply to one string, what is allowed instead, and a pair from one situation.

### Narrated interface

**Definition.** Interface text that is the agent's commentary on the process: prose that explains, hedges or concludes about what the data shows, written in the voice of an observer, and bound to no data field, rule or vocabulary. A traditional platform shows the same facts as a label, a value, a status and one help entry. The narration cannot be checked against the data, and it reads as generated.

**Test.** Remove the sentence and put a label, a value, a status or one help entry in its place. If the interface loses nothing the data and the rules supply, the sentence was narration. A sentence that states a conclusion, a caveat or a reason that no rule produced is narration.

**Allowed instead.** The numbers and names as values. A status from a defined set, such as declared, observed or suggested. One help sentence for a column or a label, written once and reused.

*Situation: what a stretch of repeated reads says under the session log.*
*Do:* the status "observed", then the values "9 reads in 4 turns" and "15.5 s between the turns", with one help entry on "observed": "Seen in the transcript, not declared by a file."
*Don't:* "No read used a path an earlier one returned, so one turn could have held them."

*Situation: what the session table says under its columns.*
*Do:* a help entry on the column "Tool time": "Time that tools ran. Waiting for you is shown apart."
*Don't:* "Tool time is the time tools ran, and leaves out your answers and the gaps before your next message, which are the waiting. A row opens that session."
