---
name: which-side-is-newer
description: Decides which side, the Figma design or the product's code and `DESIGN.md`, is ahead for a component, so the direction of a formalizing or of a design-debt row is known. Use before formalizing a component and when writing a design-debt row.
---

# Which side is newer

This covers one judgment: for one component, which side was changed most recently and why, Figma or the product. It ends when the agent has stated a direction with its evidence, or has put the disagreement to the Designer. It runs on what is already loaded and the two sides it can read, and it fixes no output.

1. **Compare like with like.** Take the Figma frame or component, the built version in the code, and the component's entry in `DESIGN.md`, if there is one. A comparison of different things proves nothing.
2. **Read when each side last changed, and not only how it looks.** A difference in look does not say which side is ahead. Use the code's change history and the Figma file's own history where the tools can read it.
3. **Ask what each side was changed for.** An accepted sprint outcome puts Figma ahead. A change made in the product after the last Figma update puts the code ahead.
4. **State the finding as a direction, with its evidence.** Say "Figma is ahead", "the code is ahead" or "unknown", and name what that rests on.
5. **Put a conflict to the Designer.** When the evidence disagrees or is missing, do not guess. Show both sides and ask which is right, as the stopping rules require.
6. **Let the direction decide what comes next.** If Figma is ahead, production owes the difference, and a design-debt row says so. If the code is ahead, Figma is stale, and it is updated from the code before the component is formalized.

If one side cannot be read, such as a file with no change history or code that is not available, say so and ask the Designer. Do not state a direction the evidence does not support.

*Do:* "The code is ahead: the chip's spacing changed in the product after the last Figma capture, so Figma is stale for this component."
*Don't:* "The code looks newer."
