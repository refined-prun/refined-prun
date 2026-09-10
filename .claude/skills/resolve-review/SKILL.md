---
name: resolve-review
description: Apply resolutions to findings in .tmp/pr/<number>/pr-review.md. The user writes resolution notes first, then this skill applies the fixes, commits each separately, and removes resolved findings. Accepts optional PR number argument. Triggers on "resolve review", "fix review", "apply review", "resolve findings". Do NOT use without an existing review file (run /review-pr first).
---

# Resolve PR Review Findings

Determine the target PR number, then read `.tmp/pr/<number>/pr-review.md`. Find findings that have resolution notes written by the user, apply each fix, commit it, and remove the finding from the review file. Skip findings without resolution notes.

**Principle:** The user has already decided what to do — the `**Resolution:**` field contains their instructions. Execute them, don't second-guess.

**Principle:** Never assume how the game works. If a resolution requires game knowledge not in the docs, stop and ask.

## Phase 1: Pre-flight

```bash
git status --porcelain
```

**If output is non-empty:** Warn the user about uncommitted changes but do not stop — resolving review findings on a dirty tree is acceptable since we're actively working on the PR.

Determine the target PR number:

- **Argument provided:** Use the argument as the PR number.
- **No argument:** If `.tmp/pr/current.txt` exists, read the PR number from it. Otherwise, detect from the current branch:

```bash
gh pr view --json number --jq '.number' 2>/dev/null
```

If none found, stop and ask the user for the PR number.

Check that `.tmp/pr/<number>/pr-review.md` exists. Read it.

**If missing:** Stop. Tell the user:

> No review file found at `.tmp/pr/<number>/pr-review.md`. Run `/review-pr <number>` first.

Check that the current branch matches the review's `**Branch:**` line.

**If mismatch:** Stop. Tell the user:

> Current branch does not match the review. Checkout the PR branch first.

## Phase 2: Parse Findings

Extract all findings from the three sections: Critical, Suggestions, Observations.

For each finding, extract:
- **Section** (Critical / Suggestions / Observations)
- **Title** (the bold text)
- **Basis** (text after `**Basis:**` — the reasoning breadcrumb from the review)
- **Resolution** (text after `**Resolution:**`)

Classify each finding:
- **Actionable** — `**Resolution:**` has non-empty text (the user wrote instructions)
- **Skipped** — `**Resolution:**` is empty or blank

**If no actionable findings:** Tell the user:

> No findings have resolution notes. Write resolution instructions in `.tmp/pr/<number>/pr-review.md` first, then re-run.

Stop.

Show the user a summary:

```
PR #<number> — <N> actionable, <M> skipped

Will resolve:
  1. [C] <title> → <resolution summary, first ~60 chars>
  2. [S] <title> → <resolution summary>

Skipped (no resolution):
  - [C] <title>
  - [O] <title>
```

## Phase 3: Gather Context from Basis

Batch-read everything upfront so Phase 4 never blocks on file I/O.

### 3a: Collect file sets

Scan all actionable findings and build two deduplicated lists:

- **Source files** — every file path referenced in finding titles, code quotes, or `**Basis:**` fields.
- **Doc files** — determined by Basis citations:
  - Basis cites a doc rule (e.g., `contributing.md > Code Style > Loops`): add that doc file.
  - Basis cites a PR comment: add `.tmp/pr/<number>/pr-comments.txt`.
  - Basis cites architecture: add `docs/architecture.md`.
  - Basis cites game knowledge: add the referenced `docs/game/` file. If Basis says "no doc found", add to a "ask user" list.
  - Basis is a code observation: no doc needed.

### 3b: Batch read

Read all collected source files and doc files in parallel. Read full files — Phase 4 will need surrounding context for edits.

**If any source file doesn't exist:** Note it — the finding may reference code that was already changed. Phase 4 will handle this per-finding.

**If "ask user" list is non-empty:** Ask the user about undocumented game mechanics before proceeding to Phase 4.

## Phase 4: Resolve Findings — ONE AT A TIME

**CRITICAL: Process exactly one finding through ALL steps (4a→4b→4c) before starting the next.** Never batch findings. Never apply multiple fixes before committing. The loop is: pick one finding → classify → fix/dismiss → commit → pick next finding. The review file is updated once in Phase 5 after all findings are done.

Process in order: Critical first, then Suggestions, then Observations.

Track each finding's outcome as you go: **fixed**, **dismissed**, or **skipped** (no changes after applying).

### 4a: Classify the Resolution

Determine the resolution type from the user's text:

- **Dismissal** — resolution says "dismiss", "ignore", "its okay", "not applicable", or similar language indicating the finding should be dropped without code changes.
- **Fix** — resolution contains instructions for code changes.

### 4b: Apply Fix (fixes only)

Use the `**Basis:**` to understand the rule and the `**Resolution:**` to understand what the user wants done. Apply code changes.

```bash
git diff --stat
```

**If no changes after applying:** The resolution may reference another finding that handles it (e.g., "will be fixed in suggestion 1"). Record as **skipped** and go to 4d.

**If changes exist:**

```bash
pnpm prettier
```

```bash
pnpm lint 2>&1 | tail -20
```

**If lint fails on the changed file:** Fix the lint error before proceeding.

### 4c: Commit (fixes with changes only)

Stage all changed source files (including prettier changes, but not `.tmp/pr/<number>/pr-review.md`) and commit:

```bash
git add <changed files>
git commit -m "<concise message describing the fix>

Co-Authored-By: <model name> <noreply@anthropic.com>"
```

Where `<model name>` is your current model identity (e.g., "Claude Opus 4.6 (1M context)"). Use whatever model name and context size (if available) you were introduced with in the system prompt.

Commit message should describe the code change, not the review finding. Always include the `Co-Authored-By` trailer. Examples:
- `Add null guard to parseFloat calls in disableInvalidPopidSliders`
- `Fix import order in basic/index.ts`
- `Use === instead of == for undefined check`

### 4d: Next Finding

Go back to 4a with the next actionable finding. Repeat until all actionable findings are processed.

## Phase 5: Update Review File

After all findings are resolved, update `.tmp/pr/<number>/pr-review.md` in a single pass:

1. For each **fixed** or **skipped** finding: remove the entire finding block — from the bold title through the `---` separator (inclusive).
2. For each **dismissed** finding: remove the finding block from its section, then append a one-liner to the `## Dismissed` section at the bottom of the file (create the section before `## Files Reviewed` if it doesn't exist):

```markdown
## Dismissed
- <finding title> — <resolution text, truncated to ~80 chars>
```

3. If any section (Critical/Suggestions/Observations) becomes empty after removals, replace its content with "None."
4. Renumber remaining findings sequentially starting from 1, continuous across sections (Critical, then Suggestions, then Observations).

Do NOT commit the review file changes.

## Phase 6: Report

Tell the user:

> **Resolved:** N findings (N commits)
> **Dismissed:** N findings (no code changes)
> **Skipped:** N findings (no resolution notes)
>
> Updated `.tmp/pr/<number>/pr-review.md` — resolved findings removed, dismissed findings compacted.

**If skipped findings remain:**

> Run `/resolve-review` again after adding resolution notes to the remaining findings.

**If all findings resolved or dismissed:**

> All findings addressed. Consider running `/review-pr` to check for new issues introduced by the fixes.

## Troubleshooting

### Finding references code that no longer exists

The PR may have been updated since the review. Re-read the file. If the code no longer matches, tell the user and skip the finding — do not remove it from the review.

### Fix introduces a new issue

If fixing one finding creates a problem elsewhere (e.g., fixing an import order breaks another finding's code reference), fix the cascade immediately. Do not leave broken state between findings.

### Resolution note is ambiguous

If the user's resolution note is unclear and you cannot determine the intended fix, skip the finding and tell the user:

> Skipped "<title>" — resolution note is ambiguous. Please clarify in `.tmp/pr/<number>/pr-review.md`.

### Review file is from a different PR

The Phase 1 branch check should catch this. If it slips through and you notice mid-resolution, stop and tell the user.
