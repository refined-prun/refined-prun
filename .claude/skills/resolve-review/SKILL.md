---
name: resolve-review
description: Apply resolutions to findings in .tmp/pr-review.md. The user writes resolution notes first, then this skill applies the fixes, commits each separately, and removes resolved findings. Triggers on "resolve review", "fix review", "apply review", "resolve findings". Do NOT use without an existing .tmp/pr-review.md (run /review-pr first).
---

# Resolve PR Review Findings

Read `.tmp/pr-review.md`, find findings that have resolution notes written by the user, apply each fix, commit it, and remove the finding from the review file. Skip findings without resolution notes.

**Principle:** The user has already decided what to do — the `**Resolution:**` field contains their instructions. Execute them, don't second-guess.

**Principle:** Never assume how the game works. If a resolution requires game knowledge not in the docs, stop and ask.

## Phase 1: Pre-flight

```bash
git status --porcelain
```

**If output is non-empty:** Warn the user about uncommitted changes but do not stop — resolving review findings on a dirty tree is acceptable since we're actively working on the PR.

Check that `.tmp/pr-review.md` exists. Read it.

**If missing:** Stop. Tell the user:

> No review file found. Run `/review-pr` first to generate `.tmp/pr-review.md`.

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

> No findings have resolution notes. Write resolution instructions in `.tmp/pr-review.md` first, then re-run.

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

Do NOT read all project docs upfront. The `**Basis:**` field on each finding tells you exactly what to read.

For each actionable finding, check its Basis and read only what's needed:

- **Basis cites a doc rule** (e.g., `contributing.md > Code Style > Loops`): Read that specific doc file.
- **Basis cites a PR comment** (e.g., `maintainer comment: "..."`): Read `.tmp/pr-comments.txt` if not already loaded.
- **Basis is a code observation** (e.g., `parseFloat(null) returns NaN`): No doc read needed — the fix is self-contained.
- **Basis cites architecture** (e.g., `architecture.md > Dependency Layers`): Read `docs/architecture.md`.
- **Basis cites game knowledge**: Read the referenced `docs/game/` file. If Basis says "no doc found", ask the user before proceeding.

Deduplicate: if multiple findings cite the same doc, read it once.

Read the source files referenced in actionable findings. For each finding that quotes code, read the full file so you have complete context.

## Phase 4: Resolve Findings

Process each actionable finding in order (Critical first, then Suggestions, then Observations).

For each finding:

### 4a: Apply the Fix

Use the `**Basis:**` to understand the rule and the `**Resolution:**` to understand what the user wants done. Apply the code changes.

### 4b: Format and Verify

```bash
pnpm prettier
```

```bash
pnpm lint 2>&1 | tail -20
```

**If lint fails on the changed file:** Fix the lint error before proceeding.

### 4c: Commit

Stage all changed source files (including prettier changes, but not `.tmp/pr-review.md`) and commit:

```bash
git add <changed files>
git commit -m "<concise message describing the fix>"
```

Commit message should describe the code change, not the review finding. Examples:
- `Add null guard to parseFloat calls in disableInvalidPopidSliders`
- `Fix import order in basic/index.ts`
- `Use === instead of == for undefined check`

### 4d: Remove Finding from Review

After a successful commit, remove the entire finding block from `.tmp/pr-review.md` — from the bold title through the `---` separator (inclusive). If the section (Critical/Suggestions/Observations) becomes empty after removal, replace its content with "None."

Do NOT commit the `.tmp/pr-review.md` changes — just keep the file updated on disk as a running tracker.

## Phase 5: Report

Tell the user:

> **Resolved:** N findings (N commits)
> **Skipped:** N findings (no resolution notes)
>
> Updated `.tmp/pr-review.md` — resolved findings removed.

**If skipped findings remain:**

> Run `/resolve-review` again after adding resolution notes to the remaining findings.

**If all findings resolved:**

> All findings resolved. Consider running `/review-pr` to check for new issues introduced by the fixes.

## Troubleshooting

### Finding references code that no longer exists

The PR may have been updated since the review. Re-read the file. If the code no longer matches, tell the user and skip the finding — do not remove it from the review.

### Fix introduces a new issue

If fixing one finding creates a problem elsewhere (e.g., fixing an import order breaks another finding's code reference), fix the cascade immediately. Do not leave broken state between findings.

### Resolution note is ambiguous

If the user's resolution note is unclear and you cannot determine the intended fix, skip the finding and tell the user:

> Skipped "<title>" — resolution note is ambiguous. Please clarify in `.tmp/pr-review.md`.

### Review file is from a different PR

The Phase 1 branch check should catch this. If it slips through and you notice mid-resolution, stop and tell the user.
