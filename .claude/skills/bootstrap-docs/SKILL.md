---
name: bootstrap-docs
description: Set up the documentation foundation for a project so that explore-project can iterate on it. Creates docs/ with initial architecture overview and exploration manifest. Handles both fresh projects and projects with existing docs. Triggers on "bootstrap exploration", "bootstrap docs", "init docs", "set up documentation". Do NOT use for iterative exploration (use /explore-project instead).
---

# Bootstrap Exploration

Create the documentation foundation for a project. Run once per project to set up the initial structure that `/explore-project` builds on.

**Principle:** Infer as much as possible automatically. Only ask the user when inference fails or the structure is ambiguous.

**UX Note:** Use `AskUserQuestion` for all user-facing questions.

## Phase 1: Pre-flight

Check if `docs/exploration-manifest.md` exists. **If it does:** Tell the user:

> Exploration manifest already exists. Run `/explore-project` to continue exploring.

Stop.

Check if `docs/` directory exists and whether it has `.md` files.

**If docs exist:** Read all `.md` files in `docs/`. Note what's already documented. This skill will only create the manifest — it will NOT overwrite existing docs. Skip to Phase 4.

**If no docs:** Continue to Phase 2.

## Phase 2: Infer Project Context

Try to understand the project without asking the user. Read whichever of these files exist. Stop once you can fill all four items below (what it does, language, build tool, entry points), or when you've exhausted the list:

1. `README.md` or `README` — project description, purpose
2. `package.json` — name, description, scripts, dependencies (JS/TS)
3. `Cargo.toml` — name, description, dependencies (Rust)
4. `go.mod` — module path (Go)
5. `pyproject.toml` or `setup.py` or `setup.cfg` — name, description (Python)
6. `*.sln` or `*.csproj` — project name (C#/Unity)
7. `build.gradle` or `build.gradle.kts` or `pom.xml` — project info (Java/Kotlin)
8. `Makefile` or `CMakeLists.txt` — build targets (C/C++)
9. `composer.json` — name, description (PHP)
10. `Gemfile` — dependencies (Ruby)
11. `pubspec.yaml` — name, description (Dart/Flutter)

From these files, extract:
- **What the project does** (one sentence)
- **Language and framework**
- **Build tool / package manager**
- **Entry points** (main files, scripts)

**If inference gives a clear picture:** Continue to Phase 3.

**If README is missing or vague and no config file provides clarity:**

AskUserQuestion: I couldn't determine what this project does. Can you describe it in one sentence?

## Phase 3: Map Directory Structure

List all directories under the project root, excluding common non-source directories: `node_modules`, `.git`, `dist`, `build`, `.next`, `target`, `__pycache__`, `.gradle`, `bin`, `obj`, `.claude`, `docs`, `vendor`, `.venv`, `env`. Limit depth to 3 levels.

From this, build a map of the project's major areas. For each top-level source directory, read its entry point or index file (if one exists) to understand its purpose.

**If the structure is clear** (standard framework layout, obvious directory names like `src/`, `lib/`, `tests/`, `api/`): Proceed to Phase 4.

**If the structure is ambiguous** (flat layout, non-obvious directory names, multiple potential source roots):

AskUserQuestion: I see these top-level directories. Can you help me understand the structure?

[list the directories]

- What are the main source directories?
- Are any of these generated or third-party?
- Is there a specific entry point?

## Phase 4: Create Documentation

Create `docs/` if it doesn't exist:

```bash
mkdir -p docs
```

### If existing docs were found (Phase 1)

Create only `docs/exploration-manifest.md`. To build the coverage table:
- For each doc file: identify which code directories it describes or references
- For each source directory: check if any doc mentions it
- Mark directories covered by a doc as "Shallow" or "Good" based on detail level
- Mark directories not mentioned in any doc as "None"

Skip README and architecture creation.

### If starting fresh

Create three files:

#### `docs/README.md`

```markdown
# <Project Name> Documentation

<One sentence description from Phase 2.>

## Go-to places

- **Architecture:** `docs/architecture.md`. Tech stack, directory layout, dependency layers, build system.
```

Keep it minimal. `/explore-project` will add entries as it creates new doc files.

#### `docs/architecture.md`

Write a high-level architecture doc covering:

**Tech stack** — Language, framework, key dependencies. Use a short list, not prose.

**Directory layout** — Show the source tree with one-line descriptions per directory. Only include directories that contain source code. Format:

```markdown
## Directory Layout

\```
src/
├── api/          # REST API handlers
├── models/       # Database models and schemas
├── services/     # Business logic
├── utils/        # Shared utilities
└── config/       # Configuration and environment
\```
```

**Entry points** — What files start the application, what scripts are commonly used.

**Dependency direction** — If you can infer which modules depend on which (from imports in entry points), document it. If not, note it as unknown for `/explore-project` to investigate.

Do NOT go deeper than directory-level descriptions. Do NOT read every file to write exhaustive docs. The goal is a correct skeleton that `/explore-project` can flesh out.

**Verify:** After writing the architecture doc, check that every directory listed in the layout actually exists. Remove any that don't. This prevents the very first docs from being wrong.

**Note:** The directory tree example above uses `src/` — adapt the format to match the project's actual layout (e.g., `cmd/`+`internal/` for Go, `Assets/Scripts/` for Unity, flat structure for scripts repos). The example is a format reference, not a template to copy.

#### `docs/exploration-manifest.md`

```markdown
# Exploration Manifest

Last updated: <today's date>

## Documentation Coverage

| Code Area | Doc File | Coverage | Notes |
|-----------|----------|----------|-------|
| <dir/> | architecture.md | Shallow | Directory-level description only |
| <dir/> | — | None | <brief note on what it likely contains> |

## Issues Found

None (initial bootstrap).

## Priority Queue

1. **Gap**: <most important undocumented area> — <why>
2. **Gap**: <next area> — <why>
3. **Deepen**: architecture.md — flesh out dependency layers and key patterns
```

List all source directories in the coverage table. Order the priority queue by likely importance (more files, closer to entry points = higher priority).

## Phase 5: Report

Tell the user:

> Bootstrap complete. Created:
>
> - `docs/README.md` — project overview and doc index
> - `docs/architecture.md` — high-level architecture
> - `docs/exploration-manifest.md` — coverage analysis with N gaps identified
>
> Run `/explore-project` to start filling gaps.

**If only manifest was created** (existing docs case):

> Manifest created at `docs/exploration-manifest.md`. Found N documented areas, N gaps.
>
> Run `/explore-project` to start filling gaps.

## Troubleshooting

### No config files found

The project may use an uncommon build system or be a monorepo subfolder. Ask the user for project context and proceed with what the directory structure reveals.

### Monorepo detected

If the root contains multiple independent projects (e.g., `frontend/`, `backend/`, `mobile/` each with their own config):

AskUserQuestion: This looks like a monorepo. Should I document the whole repo or focus on a specific project?

If focusing on one project, treat that subdirectory as the root for all scanning.

### Very large project (50+ top-level directories)

Focus on the main source directories only. Ask the user which directories matter most if it's not obvious. Don't try to map everything — `/explore-project` handles incremental discovery.

### Project with no clear source directory

Some projects (scripts repos, config repos) don't have a `src/` or `lib/`. Document the flat structure as-is, grouping files by naming pattern or purpose.
