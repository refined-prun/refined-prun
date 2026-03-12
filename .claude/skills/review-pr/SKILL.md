---
name: review-pr
description: Review a GitHub pull request against project guidelines. Creates pr-review.md with findings. Accepts PR number as argument. Triggers on "review pr", "review pull request", "pr review", "check pr". Do NOT use for reviewing code outside a PR context.
---

# Review GitHub Pull Request

Analyze a PR and produce a structured review in `pr-review.md`.

**Principle:** Report everything. The only code change this skill makes is running prettier.

**Principle:** Never assume how the game works. Flag any change that assumes game mechanics without doc backing.

## Phase 1: Pre-flight

```bash
git status --porcelain
```

**If output is non-empty:** Stop. Tell the user: there are uncommitted changes. Commit or stash them first.

```bash
which gh || echo "GH_MISSING"
```

**If GH_MISSING:** Stop. Tell the user: `gh` CLI is required. Install from https://cli.github.com.

## Phase 2: Setup

The PR number comes from the skill argument. If no argument was provided, ask the user for the PR number.

```bash
git fetch origin main
```

```bash
gh pr checkout <number>
```

```bash
git merge origin/main --no-edit
```

**If merge conflict:** Stop. Tell the user: merge conflict with main. Resolve manually.

```bash
gh pr view --json number,title,body,baseRefName,headRefName,author,labels,files 2>&1
```

Save the JSON output. Extract `number`, `title`, `baseRefName` for later use.

```bash
mkdir -p .tmp
```

## Phase 3: Prettier + Commit

```bash
pnpm prettier
```

Check if prettier made any changes:

```bash
git diff --stat
```

**If changes exist:** Stage only prettier-touched files and commit:

```bash
git diff --name-only | xargs git add && git commit -m "prettier"
```

**If no changes:** Skip — working tree is already formatted.

## Phase 4: Gather Context

Run all three in parallel:

```bash
gh pr diff > .tmp/pr-diff.txt
```

```bash
gh pr view --json comments,reviews --jq '.comments[].body, .reviews[].body' > .tmp/pr-comments.txt 2>/dev/null
```

```bash
gh pr view --json files --jq '.files[].path'
```

### Doc Reading Strategy

Always read — these are the reviewer's core references:
- `docs/contributing.md` — code style, design rules, UI/UX philosophy, workflow rules
- `docs/architecture.md` — dependency layers apply to all `src/` changes

Read based on changed paths:

| Changed path pattern | Read |
|---------------------|------|
| `src/features/` | `docs/feature-patterns.md` (full) |
| `src/infrastructure/` | `docs/architecture.md` (Infrastructure Details) |
| `src/features/XIT/` | `docs/feature-patterns.md` (XIT section) |
| Any `.css` or `.module.css` | `docs/feature-patterns.md` (CSS section) |
| `src/core/` or `src/store/` | `docs/architecture.md` (dependency layers) |
| `docs/game/` | Verify against existing `docs/game/` files |

Now read `.tmp/pr-diff.txt`. If it exceeds 800 lines, read in 500-line chunks, processing each chunk before moving on.

## Phase 5: ESLint

```bash
pnpm lint 2>&1 | head -200 > .tmp/eslint-output.txt; echo "EXIT:${PIPESTATUS[0]}" >> .tmp/eslint-output.txt
```

Read `.tmp/eslint-output.txt`. Note exit code and any errors/warnings.

## Phase 6: Analyze

Review the diff against **every rule in the docs you read in Phase 3**. The docs contain Good/Bad examples — use those as the reference. Only flag items that actually appear in the diff. Do not invent issues.

Check these categories. For each, the source of truth is the doc file, not this list:

- **Code Style** — every rule in contributing.md's Code Style section
- **Architecture** — dependency layer direction in architecture.md
- **Feature Patterns** — registration, naming, file organization, DOM helpers, reactivity rules, CSS patterns from feature-patterns.md
- **Feature Design** — one-responsibility, dependencies, settings philosophy from contributing.md
- **UI/UX** — element justification, PrUn palette, tooltips, server comm rules from contributing.md
- **Game Knowledge** — no undocumented game mechanic assumptions; commands match `docs/game/commands.csv`
- **Workflow** — changelog, import sorting, component reuse from contributing.md
- **PR Quality** — descriptive title, body explains "why", focused scope
- **Code Quality** — no over-engineering, no security issues, resources cleaned up

## Phase 7: Write Review

Create `pr-review.md` in the repo root with this structure:

```markdown
# PR Review: #<number> — <title>

**Branch:** <headRefName> → <baseRefName>
**Author:** <author>
**Files changed:** <count>
**Review date:** <today>

## Summary

<1-3 sentence summary of what this PR does>

## ESLint

**Status:** <pass/fail>

<If fail: list errors and warnings grouped by file. Brief — path + message only.>

<If pass: "No errors or warnings.">

## Findings

### Critical

<issues that must be fixed before merge, or "None.">

### Suggestions

<improvements that would be nice but aren't blocking>

### Observations

<neutral notes — things the reviewer noticed, questions for the author>

## Files Reviewed

<bulleted list of changed files with a one-line note each>
```

**If no findings in a section:** Write "None." — do not omit the section.

**Severity guide:**
- **Critical:** Breaks architecture/dependency rules, introduces bugs, security issues, wrong game assumptions, eslint errors
- **Suggestion:** Could be cleaner, missing pattern usage, eslint warnings, minor style issues
- **Observation:** Questions, ambiguities, things worth discussing

## Phase 8: Report

Tell the user:

> PR review written to `pr-review.md`.
>
> **Critical:** <count> | **Suggestions:** <count> | **Observations:** <count>
> **ESLint:** <pass/fail> (<error count> errors, <warning count> warnings)
> **Prettier:** <committed/no changes>

## Troubleshooting

### gh auth error

```bash
gh auth status
```

If not authenticated: `gh auth login`.

### Diff too large to process

If `.tmp/pr-diff.txt` exceeds 3000 lines, focus on files matching `src/features/` and `src/infrastructure/` first. Note skipped files in the review under a "Skipped (large diff)" section.

### PR has no diff

The PR may have been merged or the branch is identical to base. Check:

```bash
gh pr view --json state --jq '.state'
```

Report the state and stop.
