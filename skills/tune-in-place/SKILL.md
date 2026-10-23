---
name: tune-in-place
description: Tunes a project's visuals directly in its code, on a branch, showing each change running, and brings it in only when the Designer approves. Use when the Designer wants to see a visual change live in the running product, or the project was never decomposed into Figma.
---

# Tune in place

This is the way into visual work for a change that is seen live in the running product. The agent works on a branch, shows each change running, and the Designer's merge is the approval. It never touches the main line before that. Its stop rules are `standards/stopping-rules.md`, and its way in was chosen under `frameworks/which-way-in.md`. It does not define the project's intent and it does not release anything.

1. **Name the surface and what feels off.** State the screen or component in the running product and what the Designer wants changed, in a sentence. If the request does not say, ask once. Done when the Designer has let the sentence stand.
2. **Read the project's visual system.** Read `DESIGN.md` and the code that defines tokens and components, so the change uses what exists. Done when you can say which tokens and components the surface uses. A change that would alter a shared token or component is not a one-off: say so and stop for the Designer, because `DESIGN.md` is approved work.
3. **Make a branch.** Name it for the surface, such as `design/step-bar-spacing`, and follow the project's own branch convention if it has one. Make no change on the main line. Done when the work is on the branch and the main line is untouched.
4. **Change, then show it running.** Make the smallest change that does the job, then show it in the running product: start the project's own preview and give the Designer the address, or capture a screenshot of the surface, at the sizes and in the direction the project supports. Say in plain words what changed. Use a visual refinement skill, if the project has one, to make the change itself. Done when the Designer can see the change without reading a diff.
5. **Loop on the same branch.** Apply the Designer's reaction on the branch and show it again. Stay inside the named surface. A change outside it is a new surface, so ask first.
6. **Wait for the approval.** The Designer approves by merging, or by saying to merge. Never merge unasked. Done when the Designer has merged, or has said to abandon the branch, in which case leave it unmerged and say so.
7. **Propose the `DESIGN.md` update.** When the merged change altered the visual system, such as a token, a component or a rule, propose the edit to `DESIGN.md`, in the format its tools read, and wait for the Designer's yes before writing it.

A tuned-in-place change has no design-debt row, because the design is the code. The trail is the project's own history, and nothing else needs recording.

If the project has no way to run its UI, say so and ask how the Designer wants to see the change. Do not describe a result that has not been shown.
