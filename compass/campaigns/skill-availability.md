# Global Design Studio skill availability

State: In-flight.

Tier: next.

## Vision

Design Studio skills resolve from their version-controlled source in both Codex and Claude Code on this workstation, so that a project can use the same current craft procedure without copies or resynchronization.

## Quest Q-54 — complete availability evidence

State: Specced.

Initiated: 2026-08-26. Mechanism decided: 2026-08-30.

Decision: Design Studio is the Suite's readily available workshop for any product project across both agent tools used here, Codex and Claude Code. It is not reached only through a Principal citation from the repository.

Target posture: `C:\Roey\Studio\design-studio` remains the canonical, version-controlled source. Every exposure path reads repository files in place; no copied or cached installation is allowed. Formats, library material, and references remain repository material reached through the selected skill.

Mechanism: each tool receives a directory junction for each skill in its own skill-discovery scope.

- Codex: `~/.agents/skills/<name>` points to `<repo>/skills/<name>`.
- Claude Code: `~/.claude/skills/<name>` points to `<repo>/skills/<name>`. Its CLI source at v2.1.78 was verified to accept junction and symlink entries and scan one level, so links are per-skill rather than one repository-level link. `skill-creator` is excluded because the `claude-plugins-official` plugin already owns that name.
- `bin/link-skills.ps1` creates, repoints, and prunes the junctions for both scopes. It is the deploy-and-repair tool for a new machine and for a package addition or rename. It links and never copies.

Rejected mechanisms:

- `claude plugin install` from a local marketplace copies each plugin into a versioned cache under `~/.claude/plugins/cache/`; it becomes stale until `/plugin update` copies it again.
- `--plugin-dir` loads a plugin in place but only as a `claude` CLI flag at process start. The VSCode extension starts Claude without a shell, its `claudeProcessWrapper` must be a native executable, and a script wrapper cannot carry the flag. The Designer enters through `/principal` in that extension.
- A local plugin package is not ruled out for a future distribution need but is not the current loading mechanism.

Scope: skills load for every session on this workstation, federated or not. They are description-gated, so selection does not preload instructions or create project dependencies.

Governance: the `/principal` entry procedure verifies that Design Studio craft skills resolve. If a needed skill is absent, it names unavailable material context and directs the Designer to run `bin/link-skills.ps1`; the repair takes effect at the next session start. The link script is the mechanism and the entry adapter is the check.

Exit evidence:

1. From a non-Design-Studio repository, both tools list the skills.
2. An explicit invocation and a matching implicit task each load a selected skill.
3. An upstream skill edit is reflected in the next session without a resync step in both tools.
4. A wrapper- or link-absent launch is caught by the `/principal` check.
5. Link removal or disablement has a documented, reversible path through `link-skills.ps1 prune` or manual removal of the junction.

Current evidence: eleven Codex junctions have existed in `~/.agents/skills` since 2026-08-26 and were verified under Codex. Ten Claude Code junctions were created in `~/.claude/skills` on 2026-08-30 by `link-skills.ps1`; the running Claude Code session picked them up live without restart, and `rtl/SKILL.md` resolved through its junction. The earlier workstation-acceptance claim was withdrawn because it covered Codex only; it is now met for both tools on this workstation. Exit items 2 and 4 await the next real Design Studio task and the `/principal` check landing.

Non-goals: do not turn every Design Studio resident into a project dependency, preload full skill instructions into sessions, publish a marketplace, or claim availability on another person's machine. Distribution beyond this locally governed workstation is out of scope.
