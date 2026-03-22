---
name: augment-review
description: Extract human review comments from working copy and append as findings to pr-review.md. User adds comments in source files, runs this skill to capture them, then working copy is reset. Validates all changes are comments-only. Triggers on "augment review", "add review comments", "human review", "add findings". Do NOT use without an existing review file (run /review-pr first).
---

# Augment PR Review with Human Comments

Read the working copy diff, extract every added comment as a structured finding, append to `pr-review.md`, and reset the working copy.

**Principle:** The user's comments ARE the review. Parse them faithfully, classify accurately, and generate a proper Basis for each.

**Principle:** Safety first. If the diff contains anything other than added comment lines, refuse to proceed.

## Phase 1: Pre-flight

Determine the target PR number:

- **Argument provided:** Use the argument as the PR number.
- **No argument:** If `.tmp/pr/current.txt` exists, read the PR number from it. Otherwise:

```bash
gh pr view --json number --jq '.number' 2>/dev/null
```

If none found, stop and ask the user for the PR number.

Check that `.tmp/pr/<number>/pr-review.md` exists. Read it.

**If missing:** Stop. Tell the user:

> No review file found at `.tmp/pr/<number>/pr-review.md`. Run `/review-pr <number>` first.

Check for working copy changes:

```bash
git diff > .tmp/pr/<number>/augment-diff.txt
```

**If the file is empty:** Stop. Tell the user:

> No working copy changes found. Add comments to source files first, then re-run.

## Phase 2: Validate — comments-only gate

Read `.tmp/pr/<number>/augment-diff.txt`. Every change must be an added comment line. No exceptions.

### Validation rules

1. **No removed lines.** If any line starts with `-` (excluding `---` file headers), FAIL.
2. **No modified lines.** Only pure additions are allowed — a hunk that removes a line and adds a replacement is a code change, not a comment.
3. **Every added line must be a comment.** For each `+` line (excluding `+++` file headers):
   - Trim the `+` prefix and leading/trailing whitespace.
   - Skip if the line is empty (blank lines between comments are fine).
   - Determine comment syntax from the current file's extension:
     - `.ts`, `.tsx`, `.js`, `.jsx`: `//`, `/* */`
     - `.vue`: `//`, `/* */`, `<!-- -->`
     - `.css`, `.module.css`: `/* */`
     - `.html`: `<!-- -->`
   - Check if the trimmed line matches one of these patterns:
     - Starts with `//`
     - Starts with `/*` (block comment open)
     - Starts with `*` or ends with `*/` (block comment continuation/close)
     - Starts with `<!--` or ends with `-->`
   - Track block comment state per file: lines between `/*` and `*/` (or `<!--` and `-->`) are valid even without leading `*`.

**If validation fails:** Stop. List every offending file and line:

> Cannot proceed — the following changes are not comments:
>
> - `src/features/PROD/PROD.vue:45` — `const x = 1;`
> - `src/core/production.ts:12` — (removed line)
>
> Only add comments. Revert non-comment changes and re-run.

## Phase 2.5: Reset working copy

Validation passed — all changes are comment-only additions. Reset immediately so the user can continue working.

```bash
git checkout .
```

From this point forward, use `.tmp/pr/<number>/augment-diff.txt` for all diff parsing. Do NOT run `git diff` again.

## Phase 3: Extract findings

For each added comment (or group of consecutive comment lines in the same file):

### 3a: Record location

- File path (from `diff --git a/... b/...` header)
- Line number (compute from hunk `@@ -a,b +c,d @@` headers, counting lines through the hunk)
- Comment text (strip comment syntax: `//`, `/*`, `*/`, `*`, `<!--`, `-->`)

### 3b: Read context

Read the source file around the comment location (~5 lines before and after). This context informs the Basis.

### 3c: Classify severity

Determine severity from the comment's tone and content:

- **Critical:** Contains words/phrases like "bug", "broken", "wrong", "incorrect", "crash", "fails", "security", "missing guard", "will break", "null", "undefined", "race condition"
- **Suggestion:** Contains words/phrases like "should", "could", "better", "consider", "refactor", "rename", "simplify", "prefer", "move", "extract", "cleanup"
- **Observation:** Everything else — questions ("why?", "what if"), notes, neutral observations, "interesting", "hm"

When ambiguous, prefer Observation over Suggestion, and Suggestion over Critical.

### 3d: Generate Basis

Do NOT write `**Basis:** Human comment`. Generate a proper basis that explains what the comment is flagging, using the code context. Format: `Human review — <what the comment is about, referencing the specific code>`.

Examples:
- `Human review — getOrders() at line 45 returns PlanetaryOrder | undefined but is dereferenced without a null guard`
- `Human review — formatTime reimplements duration formatting; project has formatEta in @src/utils/format`
- `Human review — unclear why this filter runs at both PROD.vue and ProductionList.vue levels`

### 3e: Group consecutive comments

If multiple consecutive added comment lines appear in the same file (no non-comment lines between them), merge them into a single finding. Use the first line's location. Concatenate the comment text.

## Phase 4: Deduplicate and enrich existing findings

Read all existing findings from `.tmp/pr/<number>/pr-review.md`.

For each extracted finding, check if an existing finding already covers the same concern:
- Same file referenced
- Overlapping line range (within ~10 lines)
- Similar topic (the comment's essence matches an existing finding's title or description)

**If duplicate with empty `**Resolution:**`:** Check whether the user's comment implies a clear, mechanical fix (e.g., `// use formatEta instead`, `// remove this`, `// add null check`). If so, fill in the existing finding's `**Resolution:**` field with the appropriate instruction. Count this as an "enriched" finding, not a new or skipped one.

**If duplicate with existing resolution:** Skip the finding silently.

**If not a duplicate:** Keep it for Phase 5.

## Phase 5: Append to pr-review.md

For each non-duplicate finding:

1. Create a finding block in the standard format:

```markdown
**<N>. <concise title derived from comment>**

`<file>:<line>`:

<quote the relevant code context, 1-3 lines>

<the comment's content, expanded into a clear description>

**Basis:** <generated basis from Phase 3d>

**Resolution:** <pre-filled if obvious, empty otherwise>

---
```

### Pre-filled resolutions

If the human comment or the code context makes the fix obvious and mechanical, pre-fill the `**Resolution:**` field. The same rules from `/review-pr` apply:

Pre-fill when:
- The comment explicitly states what to do (e.g., `// use formatEta instead` → `**Resolution:** Replace formatTime with formatEta from @src/utils/format.`)
- The comment flags a missing guard and the fix is mechanical (e.g., `// null check` → `**Resolution:** Add nullish guard before access.`)
- The comment says to remove/rename something specific (e.g., `// dead code` → `**Resolution:** Remove unused function.`)

Do NOT pre-fill when:
- The comment is a question ("why is this here?")
- The comment flags a design issue with multiple valid fixes
- The comment requires game knowledge or domain judgment
- The fix is ambiguous from the comment alone

2. Append to the appropriate severity section in `.tmp/pr/<number>/pr-review.md`:
   - Critical findings go under `### Critical`
   - Suggestions go under `### Suggestions`
   - Observations go under `### Observations`

3. If a section currently says "None.", replace "None." with the first finding for that section.

4. Renumber all findings sequentially starting from 1, continuous across sections (Critical, then Suggestions, then Observations).

Write the updated file.

## Phase 6: Report

Tell the user:

> Augmented `.tmp/pr/<number>/pr-review.md` with N findings from human review.
>
> **Critical:** <count> | **Suggestions:** <count> | **Observations:** <count>
> **Auto-resolvable:** <count> (run `/resolve-review` to apply)
> **Enriched:** <count> (added resolution to existing findings)
> **Skipped (duplicates):** <count>
>
> Working copy was reset in Phase 2.5. Run `/augment-review` again to add more, or write resolution notes and run `/resolve-review`.

**If all findings were duplicates (and none enriched):**

> All comments matched existing findings — nothing new to add.

## Troubleshooting

### Diff contains non-comment changes

The user may have started editing code alongside comments. Tell them to stash or revert the code changes first:

```bash
git stash
```

Then re-add only the comment changes and re-run.

### Block comment not detected

If the user writes a multi-line block comment and validation fails on interior lines, check that block comment state tracking is working. Interior lines of `/* */` blocks (lines that don't start with `*`) may need manual inspection.

### pr-review.md format mismatch

If the review file doesn't have the expected `### Critical` / `### Suggestions` / `### Observations` sections, the file may have been manually edited. Look for the section headers and append after the last finding in each section. If a section is missing entirely, do not create it — warn the user.