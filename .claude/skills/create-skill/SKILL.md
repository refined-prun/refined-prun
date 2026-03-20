---
name: create-skill
description: Create a new Claude Code skill (slash command). Guides through designing the SKILL.md — the prompt file that teaches Claude how to perform a complex task. Triggers on "create skill", "new skill", "write a skill", "add a slash command".
---

# Create a Claude Code Skill

A Claude Code skill is a markdown file (SKILL.md) that teaches Claude how to perform a specific, repeatable task via a slash command. Skills live in `.claude/skills/<skill-name>/SKILL.md`.

**What a skill IS:** A prompt — structured instructions that Claude reads and follows when the user invokes a slash command. It can be as simple as a checklist or as complex as a multi-phase interactive workflow.

**What a skill is NOT:** It is not code, not a plugin, not an API integration. It is structured prose that tells Claude what to do, what to ask, what order to do it in, and how to handle errors.

**Principle:** Don't write the SKILL.md until you fully understand the task, have researched the codebase, and have read existing skills. Quality comes from deep context, not templates.

**UX Note:** Use `AskUserQuestion` for all user-facing questions. Ask only what's necessary — infer defaults from context.

## Phase 1: Pre-flight

### Check for existing skills

```bash
ls .claude/skills/ 2>/dev/null || echo "NO_SKILLS_DIR"
```

If `.claude/skills/` doesn't exist, create it. If skills already exist, read 2-3 of them to understand the project's conventions, tone, and structure. Match those conventions in the new skill. If this is the first skill in the project, the writing rules below are the convention baseline.

### Check for name collision

If the user has already suggested a skill name, check if `.claude/skills/<name>/` already exists. If it does, ask whether to overwrite or choose a different name.

## Phase 2: Understand What the User Wants

Use `AskUserQuestion` to gather requirements. Do NOT start writing until you understand the task. Skip any question the user already answered in their initial request.

AskUserQuestion: What task should this skill automate? Describe it in one sentence.
(e.g., "Deploy the app to production", "Set up a new microservice", "Run the full test suite and fix failures")

AskUserQuestion: What should the slash command be called?
- Keep it short: 1-3 words, hyphenated (e.g., `/deploy`, `/add-auth`, `/run-tests`)
- Convention: verb or verb-noun (action-oriented)

Based on the task description, determine the skill type. Only use `AskUserQuestion` if ambiguous:

- **Interactive** — Requires user input during execution (API keys, config choices, confirmations). Use for setup, integrations, anything with external dependencies.
- **Autonomous** — Runs start-to-finish without user input. Use for builds, tests, code generation, migrations.
- **Diagnostic** — Investigates problems and reports findings. Use for debugging, health checks, audits.

## Phase 3: Research the Codebase

Before writing the skill, understand the project it will operate on.

1. **Read the project's CLAUDE.md** (if it exists) — understand the project structure, conventions, key files
2. **Identify the files** the skill will need to read or modify
3. **Read those files** to understand their current structure. A skill that tells Claude to modify `src/config.ts` must know what `src/config.ts` actually looks like. Extract exact code patterns — imports, exports, function signatures, switch cases — that the skill will use as find/replace anchors. Vague references like "the config file" break; exact `// Find:` / `// Replace with:` blocks succeed.
4. **Check for patterns** — if the project uses specific test frameworks, build tools, or service managers, the skill should use those same tools

## Phase 4: Write the SKILL.md

Create `.claude/skills/<skill-name>/SKILL.md` following the structure below.

### Frontmatter (required)

```yaml
---
name: my-skill
description: Deploys the app to production with zero-downtime rollout. Use when user says "deploy", "push to prod", "release". Do NOT use for local dev builds (use /build instead).
---
```

- `name`: Matches the directory name. Lowercase, hyphenated.
- `description`: Follow this formula: **[What it does] + [When to use it] + [Key capabilities]**. Must be under 1024 characters. No XML angle brackets (`<` or `>`).
  - First sentence says what the skill does concretely.
  - Include 3-5 trigger phrases — either naturally ("Use when the user wants to...") or explicitly ('Triggers on "keyword1", "keyword2"').
  - Add negative triggers to prevent over-triggering (e.g., "Do NOT use for X").

Good descriptions:

```yaml
# Good — specific, actionable, with triggers and negative trigger
description: Manages Linear project workflows including sprint planning, task creation, and status tracking. Use when user mentions "sprint", "Linear tasks", "project planning", or asks to "create tickets". Do NOT use for general project discussions without Linear.

# Good — clear value proposition
description: End-to-end customer onboarding workflow. Handles account creation, payment setup, and subscription management. Use when user says "onboard new customer", "set up subscription", or "create account".
```

Bad descriptions:

```yaml
# Too vague — won't trigger reliably
description: Helps with projects.

# Missing triggers — Claude won't know when to load it
description: Creates sophisticated multi-page documentation systems.

# Too technical, no user triggers
description: Implements the Project entity model with hierarchical relationships.
```

**Security restrictions for frontmatter:**
- No XML angle brackets (`<` or `>`) anywhere in frontmatter — frontmatter appears in Claude's system prompt and could inject instructions
- Do not use "claude" or "anthropic" in skill names — these are reserved

### Opening

After the `# Title`, write 1-2 sentences stating what the skill does. Then add bold meta-directives that set behavioral tone:

```markdown
**Principle:** Handle everything automatically. Only pause when user action is genuinely required.

**UX Note:** Use `AskUserQuestion` for all user-facing questions.
```

These are powerful — they override Claude's default tendencies (like asking too many questions or telling the user to run commands themselves). Common directives:

| Directive | When to use |
|-----------|-------------|
| `**Principle:** Handle everything automatically.` | Setup/integration skills — prevent Claude from just listing steps |
| `**Principle:** Prioritize reasoning from context over file reads.` | Analysis skills — prevent unnecessary file I/O |
| `**Principle:** Fix problems, don't report them.` | Autonomous skills — bias toward action |
| `**UX Note:** Use AskUserQuestion for all user-facing questions.` | Any interactive skill — ensures consistent UI |

Use them when the skill needs a specific behavioral posture. Omit them for simple skills where Claude's defaults are fine.

### Structure by Skill Type

Choose the structure that matches the skill type from Phase 2.

#### Interactive Skills (setup, integrations, adding features)

```markdown
## Phase 1: Pre-flight
Check prerequisites. Detect whether the skill was already applied (file exists, config already set, dependency already installed). If fully applied, skip to verification. If partially applied, resume from the incomplete phase.

## Phase 2: Collect Input
Gather configuration via AskUserQuestion. Collect all input before making changes.

## Phase 3: Apply Changes
Make code modifications, install dependencies, create files.

## Phase 4: Configure
Set environment variables, write config files, sync secrets.

## Phase 5: Verify
Test that everything works. Tell user how to test manually.

## Troubleshooting
3-5 common failure modes with diagnosis and fix steps.

## Removal
How to cleanly undo everything the skill added.
```

#### Autonomous Skills (builds, migrations, code generation)

```markdown
## Phase 1: Pre-flight
Check prerequisites. Detect current state. Check if the operation was already performed (output file exists, migration already ran). Warn about uncommitted changes if relevant.

## Phase 2: Execute
Run the core operation. Parse structured output if applicable.

## Phase 3: Handle Errors
Branch on failure modes. Fix what can be fixed automatically, report what can't.

## Phase 4: Verify
Run tests, check build, validate output.

## Phase 5: Report
Summarize what was done, what changed, any warnings.
```

#### Diagnostic Skills (debugging, health checks, audits)

```markdown
## Architecture Overview
Brief context with ASCII diagram showing how components relate.

## Key Locations
Table of log files, config files, and state locations.

## Common Issues
### Issue Name
Symptoms, diagnostic steps, fix commands. Each issue is a subsection.

## Manual Testing
Commands to test components in isolation.

## Quick Diagnostic Script
A single bash script that checks all common issues at once.
```

Not every skill fits these templates exactly — adapt as needed. A simple skill might be 40 lines. A complex setup skill might be 200+. Match the complexity to the task.

### Writing Rules

Follow these rules precisely. They are the difference between a skill that works reliably and one that breaks.

#### 1. Write instructions, not explanations

Bad: "The config file contains the database connection settings which need to be updated when changing environments."

Good: "Read `src/config.ts`. Find the `DATABASE_URL` export. Update its value to the user's provided connection string."

Every sentence should be an action Claude can take. If it's not actionable, cut it.

#### 2. Be specific about file paths and code locations

Bad: "Update the configuration file."

Good: "Read `src/config.ts`. Add the following export after the existing exports:"

When the skill makes targeted code changes, include the exact code to write:

```markdown
Add this import after the other channel imports at the top of `src/index.ts`:

\```typescript
import { TelegramChannel } from './channels/telegram.js';
\```
```

For complex changes, use find/replace anchors so Claude knows exactly where to edit:

```markdown
In `src/ipc.ts`, modify the switch statement's default case:

\```typescript
// Find:
default:
logger.warn({ type: data.type }, 'Unknown IPC task type');

// Replace with:
default:
const handled = await handleCustomIpc(data);
if (!handled) {
logger.warn({ type: data.type }, 'Unknown IPC task type');
}
\```
```

#### 3. Use `AskUserQuestion` for user input — never assume

When the skill needs information from the user, write it explicitly:

```markdown
AskUserQuestion: Do you have an API token, or do you need to create one?
- **I have one** — Collect it now
- **I need to create one** — Guide through creation
```

Format: `AskUserQuestion: <question>` followed by options as bold bullet points with em-dash descriptions.

#### 4. User-facing instructions use blockquotes

When the user must perform a manual action (scan a QR code, click a button in a web UI, paste a token):

```markdown
Tell the user:

> 1. Open your browser and go to https://example.com/settings
> 2. Click **Create Token**
> 3. Copy the token and paste it here

Wait for the user to provide the token.
```

The blockquote is the message shown to the user. "Wait for..." tells Claude to pause.

#### 5. Commands are explicit — Claude runs them, not the user

Bad: "Run the build command."

Good:
```markdown
\```bash
npm run build
\```
```

If a command might fail, say what to check:

```markdown
\```bash
npm run build
\```

If the build fails, read the error output. Common causes:
- Missing dependency — run `npm install` first
- Type error — read the failing file and fix the type issue
```

#### 6. Use conditional branching for variable paths

When the skill needs to handle different situations, use bold conditionals:

```markdown
**If BUILD_OK=false:** Read `logs/build.log` tail for the error.
- Cache issue: `docker builder prune -f` and retry
- Missing files: check the Dockerfile COPY paths

**If BUILD_OK=true but TEST_OK=false:** The image built but won't run.
Check logs — common cause is runtime not fully started. Retry.

**If both pass:** Continue to next phase.
```

For platform-specific commands, use inline comments:

```markdown
\```bash
launchctl kickstart -k gui/$(id -u)/com.myapp  # macOS
# Linux: systemctl --user restart myapp
\```
```

This is one of the most important patterns. Real-world skills constantly branch on detected state, platform, command output, and user choices. Without clear conditional structure, Claude will either guess wrong or ask unnecessary questions.

#### 7. Include verification after every significant action

After modifying code:
```markdown
\```bash
npm test
npm run build
\```

All tests must pass and build must be clean before proceeding.
```

After configuration changes:
```markdown
Tell the user:
> Send a test message to verify the integration works.
```

#### 8. Include Troubleshooting for anything that can fail

List the 3-5 most likely failure modes with diagnostic steps:

```markdown
## Troubleshooting

### Bot not responding

1. Check `API_TOKEN` is set in `.env`
2. Check the service is running: `systemctl status myapp`
3. Check logs: `tail -20 logs/app.log`

### Authentication expired

\```bash
npm run reauth
\```
```

Each entry: symptom as heading, numbered diagnostic steps, fix commands.

#### 9. Include Removal for skills that add features

If the skill adds code, dependencies, or configuration, document how to cleanly remove it:

```markdown
## Removal

1. Delete `src/new-feature.ts`
2. Remove the import from `src/index.ts`
3. Remove `NEW_FEATURE_KEY` from `.env`
4. Uninstall: `npm uninstall some-package`
5. Rebuild: `npm run build`
```

#### 10. Reference other skills when relevant

If the skill builds on or leads into another skill, mention it:

```markdown
AskUserQuestion: Would you like to also add X? This extends the feature you just set up.

If yes, invoke the `/add-x` skill.
```

This composability makes skills more useful together.

### Companion Files

A skill can include more than just SKILL.md. When the task involves substantial code, scripts, or configuration, place them alongside the SKILL.md. Only these directories are part of the standard skill structure:

```
.claude/skills/my-skill/
├── SKILL.md           # Instructions (always required)
├── scripts/           # Executable code (Python, Bash, JS)
├── references/        # Documentation loaded as needed
└── assets/            # Templates, images, data files
```

**`scripts/`** — Executable code that agents can run. Scripts should be self-contained or clearly document dependencies, include helpful error messages, and handle edge cases gracefully.

**`references/`** — Additional documentation agents can read when needed: `REFERENCE.md`, `FORMS.md`, domain-specific files (`finance.md`, `legal.md`, etc.). Keep individual reference files focused — agents load these on demand, so smaller files mean less context usage.

**`assets/`** — Static resources: templates (document templates, config templates), images (diagrams, examples), data files (lookup tables, schemas).

**Do NOT include a README.md inside the skill folder.** All documentation goes in SKILL.md or `references/`.

#### File references

When referencing other files from SKILL.md, use relative paths from the skill root:

```markdown
See [the reference guide](references/REFERENCE.md) for details.

Run the extraction script:
\```bash
scripts/extract.py
\```
```

Keep file references one level deep from SKILL.md. Avoid deeply nested reference chains.

Only create companion files when the content is too large or complex to embed in SKILL.md directly. For small code snippets (< 30 lines), embed them inline in the skill.

**Progressive disclosure:** Keep SKILL.md focused on core instructions — move detailed reference material (API docs, long examples, style guides) to `references/`. Claude loads SKILL.md when it thinks the skill is relevant; linked files are only loaded on demand. Aim to keep SKILL.md under 5,000 words.

### Scope Calibration

Match the skill's detail level to its complexity:

| Skill Type | Typical Length | Example |
|-----------|---------------|---------|
| Process/meta (refine, review) | 30-70 lines | Analyze session, capture findings |
| Diagnostic (debug) | 100-200 lines | Architecture context, common issues, diagnostic scripts |
| Interactive setup | 100-250 lines | Pre-flight, user input, apply, configure, verify, troubleshoot |
| Complex integration | 150-300 lines | Multiple modes, code changes, environment config, testing |

A skill that's too short will leave Claude guessing. A skill that's too long will bury the important instructions. When in doubt, err on the side of more detail for complex tasks and less for simple ones.

## Phase 5: Update Project Documentation

Read the project's `CLAUDE.md` (or equivalent documentation file). If it has a section listing available skills or commands, add the new skill with a one-line description.

If no such section exists, consider adding one — but only if the project already has multiple skills. Don't create documentation infrastructure for a single skill.

## Phase 6: Verify

### Self-review

Re-read the SKILL.md you just wrote. Check each item:

- [ ] Frontmatter has `name` and `description` with trigger phrases
- [ ] Every instruction is an action Claude can take (no passive explanations)
- [ ] File paths are exact (e.g., `src/config.ts`, not "the config file")
- [ ] User input collected via `AskUserQuestion` with explicit options
- [ ] Manual user actions use blockquotes with numbered steps
- [ ] Commands are in fenced code blocks — Claude runs them directly
- [ ] Conditional branches use bold "**If X:**" pattern for variable paths
- [ ] Verification step after each phase that modifies code or config
- [ ] Troubleshooting section with 3-5 common failure modes
- [ ] Removal section (if skill adds features/code)
- [ ] No unnecessary prose — every sentence is actionable or diagnostic
- [ ] Pre-flight check for idempotency (detect if already applied)
- [ ] Structure matches the skill type (interactive/autonomous/diagnostic)
- [ ] No XML tags (`<` `>`) in frontmatter
- [ ] Skill name does not contain "claude" or "anthropic"
- [ ] Description is under 1024 characters
- [ ] No README.md in skill folder

Fix any issues found before showing to the user.

### Review with the user

Show the user the final SKILL.md content and ask:

AskUserQuestion: Does this skill look correct? Would you like to adjust anything?
- **Looks good** — Done
- **I want to change something** — Collect feedback and update

### Test the skill

Tell the user:

> The skill is ready. Test it by running:
>
> `/<skill-name>`
>
> in a new Claude Code conversation.

## Examples of Good vs Bad Skill Writing

### Bad: Vague and passive

```markdown
## Configuration

The application needs to be configured with the appropriate settings.
The user should update their environment variables.
Make sure the service is restarted after changes.
```

### Good: Specific and actionable

```markdown
## Configure Environment

Add to `.env`:

\```bash
API_KEY=<their-key>
\```

Restart the service:

\```bash
launchctl kickstart -k gui/$(id -u)/com.myapp  # macOS
# Linux: systemctl --user restart myapp
\```
```

### Bad: No error handling

```markdown
## Deploy

Run the deploy script:

\```bash
./deploy.sh
\```
```

### Good: Anticipates failure with conditional branches

```markdown
## Deploy

\```bash
./deploy.sh
\```

**If "Permission denied":** Run `chmod +x deploy.sh` and retry.

**If "Connection refused":** Verify VPN is connected: `ping deploy-server.internal`

**If "Build failed":** Run `npm run build` first to check for compile errors.
```
