---
name: explore-project
description: Iteratively explore and document a codebase. Each run reads all existing docs, finds the highest-priority gap or issue, confirms with the user, and produces one documentation improvement. Accepts optional area argument to focus exploration. Triggers on "explore project", "explore codebase", "explore code", "document codebase". Do NOT use for one-off code questions or reading specific files.
---

# Explore Project

Iteratively build and improve project documentation optimized for AI agents. Each run performs one focused action: fix stale docs, fill a documentation gap, or deepen a shallow section.

**Principle:** Read everything first, then make one focused improvement per run. Quality over quantity.

**UX Note:** Use `AskUserQuestion` to confirm the planned action before executing. The user can decline and you pick the next priority.

## Phase 1: Pre-flight

Check that `docs/` directory exists.

**If it doesn't:** Tell the user:

> No `docs/` directory found. Run `/bootstrap-docs` first to set up the documentation foundation.

Stop.

Check that `docs/exploration-manifest.md` exists.

**If it doesn't:** Tell the user:

> No exploration manifest found. Run `/bootstrap-docs` first to create the initial manifest.

Stop.

## Phase 2: Load Context

### Read all documentation

List all `.md` files in `docs/` including subdirectories. Read each file except `exploration-manifest.md` (that's metadata, not documentation — read it separately for its priority queue). Build a mental model of what's documented, what areas are covered, and at what depth.

### Scan code structure

Map the project's directory structure. List all directories (not individual files) under the project root, excluding common non-source directories: `node_modules`, `.git`, `dist`, `build`, `.next`, `target`, `__pycache__`, `.gradle`, `bin`, `obj`, `.claude`, `docs`, `vendor`, `.venv`, `env`. Limit depth to 3-4 levels.

From this output, identify:
- Top-level directories and their purpose (infer from names)
- Approximate size of each area (list files in a directory to count them if needed)
- File types and languages used

Do NOT list individual files at this phase — that belongs in Phase 5 when exploring a specific area.

If the skill was invoked with an argument (e.g., `/explore-project auth`), narrow the scan to that area. Still read all docs for full context.

**If the argument doesn't match any directory:** Fuzzy-match against directory names. If no reasonable match, list the top-level code directories and ask the user which one they meant.

## Phase 3: Gap Analysis

Compare documentation against the code structure. For each code area, classify into one of:

**Stale/Wrong** — Doc references files, directories, or patterns that no longer exist or have changed significantly. To detect:
- Verify that file paths and directory paths mentioned in docs actually exist (cheap, do this first)
- Only if a doc describes specific code patterns (e.g., "all handlers follow X structure"): read 1-2 files from that area to verify the pattern still holds

**Gap** — Code area with zero or negligible documentation. To detect:
- Compare top-level code directories against documented areas
- Check for modules imported by documented code that are themselves undocumented
- Look for directories with 5+ files that have no doc coverage

**Shallow** — Doc covers an area but misses significant patterns, modules, or conventions within it. To detect:
- The documented directory has subdirectories or distinct file groups that the doc doesn't mention
- The directory has 10+ files but the doc only gives a brief paragraph
- The doc mentions a module's existence without explaining its patterns, conventions, or key abstractions

### Regenerate Manifest

Write `docs/exploration-manifest.md` with the current analysis:

```markdown
# Exploration Manifest

Last updated: <today's date>

## Documentation Coverage

| Code Area | Doc File | Coverage | Notes |
|-----------|----------|----------|-------|
| <dir/> | <file.md or "—"> | Good / Shallow / None | <brief note> |

## Issues Found

- <doc file>: <description of stale/wrong content>

## Priority Queue

1. **<Fix/Gap/Deepen>**: <description>
2. **<Fix/Gap/Deepen>**: <description>
3. **<Fix/Gap/Deepen>**: <description>
```

Include at least the top 5 priority items. Classify each as Fix, Gap, or Deepen.

**If no issues and no gaps found:** Tell the user:

> Documentation looks comprehensive. No significant gaps or issues found. Consider running with a specific area argument (e.g., `/explore-project <area>`) to go deeper on a particular topic.

Update the manifest to reflect full coverage and stop.

## Phase 4: Decide & Confirm

Pick the highest-priority action from the manifest. Default priority order:

1. **Fix** stale/wrong docs — wrong docs are worse than no docs
2. **Gap** — undocumented code areas, ordered by importance (more files, more cross-references = higher priority)
3. **Deepen** — shallow sections that would benefit from more detail

If the skill was invoked with an argument, prioritize actions related to that area regardless of the default priority order.

Present the breakdown and recommendation:

AskUserQuestion: Found: **N stale**, **N gaps**, **N shallow**

Recommended: **[Fix / Gap / Deepen]** — [brief description of the top-priority action]
Target: [doc file to create or modify]

- **Approve** — proceed with recommendation
- **Fix / Gap / Deepen** — pick a different category (I'll choose the best item from it)
- **Custom** — tell me what to explore instead

**If user picks a category:** Pick the highest-priority item within that category and proceed.

**If user says Custom:** Apply the custom focus to the existing analysis. Re-rank the priority queue to prioritize items related to the user's request. Do NOT re-run Phase 2-3 from scratch.

## Phase 5: Execute

### Read the code

Read the relevant source files for the chosen area. For a typical module:
- Read 3-5 representative files to understand the patterns
- Check imports/exports to understand dependencies
- Look for recurring structures (common function signatures, class patterns, naming conventions)

For large areas (20+ files), sample strategically: read the entry point / index file first, then files that look representative based on naming.

### Write or update documentation

Follow these rules for AI-optimized documentation:

**Structure:**
- Use clear headers that describe the content (not generic headers like "Overview")
- Use tables for structured information (mappings, options, configurations)
- Use bulleted lists for enumerable items
- Use code blocks with language tags for paths and examples
- Keep sections self-contained — an AI agent should be able to read one section without needing the full doc

**Content:**
- File paths relative to project root (e.g., `src/auth/middleware.ts`)
- Describe patterns with enough detail that an AI agent can replicate them
- Show relationships between modules (who imports what, data flow direction)
- Include "when to use" or "use this when" guidance
- Small code examples only when they illustrate a non-obvious pattern
- Do NOT list every function or file — document patterns and conventions
- Do NOT write prose paragraphs when a table or list would be clearer

**Scope per action:**
- **Fix:** Minimal — change only the wrong parts, preserve everything else
- **Gap:** Write one focused doc section or file. Cover the area's purpose, structure, key patterns, and relationships
- **Deepen:** Add 1-3 subsections to an existing doc. Focus on the most impactful missing information

**Target depth:** Enough that an AI agent given a task in this area can start working by reading the doc + at most 2-3 source files for orientation. Do not go deeper than that.

**New file vs existing file:** Add a section to an existing doc if the area is closely related to what that doc already covers. Create a new doc file if the area is a distinct concern OR adding to an existing doc would push it past ~300 lines. When in doubt, add to existing.

**If creating a new doc file:** Add it to `docs/README.md` in the appropriate section with a one-line description.

**If the area is too large for one run:** Document the most important parts (entry points, core patterns, key abstractions) and leave deeper details for the next run. Note what was left for later in the manifest.

## Phase 6: Update Manifest

Regenerate `docs/exploration-manifest.md` to reflect the changes made. Update:
- Coverage table (new area should now show as Good or Shallow instead of None)
- Remove resolved issues
- Recalculate priority queue

## Phase 7: Report

```
- **Area:** <area name>
- **Action:** <what was done in 1 sentence>
- **Files:** <docs created or modified>
- **Next:** <what the next highest-priority action would be>
```

## Troubleshooting

### Massive codebase (hundreds of directories)

Focus on top-level structure only. Limit directory scan to depth 2. Sample a few files from each major directory to understand patterns. Don't try to map everything — document the top-level architecture first, deeper structure in later runs.

### Can't determine what a module does

Read the module's entry point (index file, main file, or the file with the most imports). Check for README files within the directory. If still unclear, document what you can observe and note the uncertainty in the manifest.

### Docs and code completely out of sync

Prioritize fixing the most-referenced doc first (usually architecture or README). Don't try to fix everything in one run — each run fixes one thing.

### Project has no clear structure

Some projects are flat or unconventionally organized. Document what you see: file groupings by naming convention, import clusters, or any other organizing principle. Note the lack of structure as a finding.

### Docs are getting disorganized

If during gap analysis you notice mixed concerns, orphaned sections, or docs that have grown unwieldy from repeated explore-project runs, suggest that the user run `/restructure-docs` before continuing exploration.
