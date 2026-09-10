---
name: distill
description: Analyze session learnings and capture corrections, guidelines, and open questions as actionable items. Triggers on "distill", "distill session", "consolidate learnings", "session review".
---

# Distill Session Learnings

**Recommended:** Sonnet max effort. Opus only for complex architectural sessions.

Distill this session into corrections, new knowledge, and guidelines. Prioritize reasoning from context over file reads.

## Phase 1: Pre-flight

Scan the conversation context for a previous distill report (look for `**Distilled N items from this session.**`).

**If found:** Only analyze content after that report. Ignore everything before it.

**If not found:** Analyze the full session.

## Phase 2: Analyze the Session

Output a structured analysis. Do NOT read any files — work from the conversation context only.

For each finding, write one line in this format:

```
[CORRECTION] <what was wrong> → <what is correct>
[NEW FACT] <the fact> — <where it should be recorded>
[GUIDELINE] <the rule in one sentence>
[OPEN QUESTION] <what needs verification>
```

If nothing substantive was learned (trivial session, test run, single quick fix), say so and stop. Do not fabricate findings.

## Phase 3: Re-acquire Write Targets

Only if Phase 4 needs to edit a doc whose contents are no longer in context (e.g. read early in the session and since compressed).

Run `find docs/ -name "*.md" | sort` to locate the right file. Read at most 2 docs, using `limit: 80`, to find the edit target. Do not read for verification — the session already proved the finding. Skip this phase entirely if you can already construct the edit from context.

## Phase 4: Capture Findings

For each finding from Phase 2, choose the right action:

**Corrections to existing docs/code:**
- Edit the file directly. Show the user what changed.

**New facts or guidelines worth keeping:**
- If it belongs in `CLAUDE.md` → edit it in.
- If it belongs in a `docs/` file → edit it in.
- If it's too minor for docs → create a `TaskCreate` item so the user can decide.

**Open questions:**
- Create a `TaskCreate` item with subject `Investigate: <question>`.

Prefer direct edits over todos. A todo that says "update X" is worse than just updating X.

Never write to `MEMORY.md` or any memory file as part of distill. Project docs are the only write target.

## Phase 5: Report

```
**Distilled N items from this session.**

- Edits: list files changed (1 line each)
- Todos: N open questions to investigate
```
