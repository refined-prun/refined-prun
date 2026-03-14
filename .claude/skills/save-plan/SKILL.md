---
name: save-plan
description: Save the current session's analysis or plan to .tmp/plans/ for use in a future chat session. Triggers on "save plan", "save this for later", "write plan to file", "persist plan". Do NOT use for distilling learnings (use /distill) or for general file writes.
---

# Save Plan for Future Session

Capture the current session's analysis, plan, or findings into a dated markdown file under `.tmp/plans/` so a future contextless agent can pick it up and execute.

**Principle:** The plan must be self-contained. A future agent with zero context should be able to read it and act.

## Phase 1: Identify the Plan Content

Look through the conversation for analysis results, implementation plans, or research findings worth persisting.

**If nothing actionable exists:** Tell the user there's nothing to save and stop.

**If multiple plans exist:** Ask which one to save, or save them as separate files.

## Phase 2: Collect Metadata

AskUserQuestion: What should this plan be called? (short slug, e.g. "unimport-expansion", "refactor-stores")

Use today's date to form the filename: `YY-MM-DD-<slug>.md`

Example: `26-03-14-unimport-expansion.md`

## Phase 3: Write the Plan

Create `.tmp/plans/<filename>`.

```bash
mkdir -p .tmp/plans
```

Structure the plan with these sections (omit any that don't apply):

1. **Title and one-line summary** — what this plan is about
2. **Context** — why this plan exists, what analysis produced it
3. **Findings / Data** — the core content (tables, lists, analysis results)
4. **Implementation Steps** — concrete, numbered steps with exact file paths, code patterns, and commands
5. **Verification** — how to confirm the work is done correctly

Writing rules:
- Use exact file paths, not "the config file"
- Include code snippets with enough context to locate them (surrounding lines, function names)
- Reference line numbers only when stable (config files); avoid for frequently-edited files
- If the plan modifies code, show the before/after or the exact insertion point
- Include the build/test command to verify

## Phase 4: Confirm

Show the user the file path and a 2-3 line summary of what was saved.

```
Saved to `.tmp/plans/YY-MM-DD-<slug>.md`
```
