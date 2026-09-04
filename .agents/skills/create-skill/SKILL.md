---
name: create-skill
description: Create a repository-local Codex skill in .agents/skills. Use for "create skill", "new skill", "write a skill", or "add a Codex workflow" requests. Do not use for installing an existing external skill.
---

# Create a Repository Skill

Create a focused Codex skill for this repository. Preserve the user's scope and make the skill useful to a future Codex session with no conversation context.

## Analyze the Request

1. Read `AGENTS.md` and follow its required workflow.
2. Read `docs/README.md` and the task-relevant project docs.
3. Inspect two or three existing skills in `.agents/skills/` to match project conventions.
4. Identify the task, trigger boundary, inputs, outputs, side effects, and verification method.
5. Ask a concise question only when a missing answer would materially change the skill.

## Design the Skill

Choose a lowercase, hyphenated name under 64 characters. Use the same name for the directory and frontmatter.

Create this minimum structure:

```text
.agents/skills/<skill-name>/
`-- SKILL.md
```

Add resources only when they have a concrete use:

```text
scripts/       Repeated deterministic operations.
references/    Detailed guidance needed only in some modes.
assets/        Files copied or adapted into generated output.
agents/        Optional Codex UI metadata.
```

Do not add placeholders, a skill README, or duplicate documentation.

## Write SKILL.md

Use required YAML frontmatter:

```yaml
---
name: skill-name
description: State what the skill does, when it applies, and an important exclusion when needed.
---
```

Write the body as direct instructions. Include only information that changes Codex's decisions or improves the result.

- State required inputs and produced outputs.
- Use exact repository paths when the workflow depends on them.
- Preserve authorization boundaries. Require explicit approval immediately before destructive actions, commits, pushes, external messages, or other material mutations that the user's request did not already authorize.
- Define clear stop conditions for risky or retrying operations.
- Use `$skill-name` for explicit Codex invocation examples.
- Say "ask the user" instead of naming a host-specific input tool.
- Link conditional details from `references/` and explain when to read them.
- Keep automatic invocation enabled unless the user requests explicit-only invocation.

For optional `agents/openai.yaml`, preserve existing fields. Add only metadata or policy that the user requests.

## Add Scripts When Needed

Put repeated or fragile logic in `scripts/`. Make each script fail safely, validate its arguments, and print actionable errors.

Run each new or changed script with representative safe inputs. At minimum, run the language syntax checker.

## Review Before Writing

Present the proposed skill name, trigger scope, files, side effects, and verification steps. Wait for user acceptance when `AGENTS.md` requires it.

After acceptance, create or update the files with `apply_patch`.

## Validate

Run the bundled skill validator when it is available:

```bash
python3 "$CODEX_HOME/skills/.system/skill-creator/scripts/quick_validate.py" \
  ".agents/skills/<skill-name>"
```

If `CODEX_HOME` is not set, locate the installed `skill-creator/scripts/quick_validate.py` without modifying configuration, then run it.

Also verify:

- The directory name matches `name`.
- The description is concise and discriminating.
- Every linked file exists.
- No unfinished scaffold text remains.
- Scripts pass syntax and behavior checks.
- `git diff --check` passes.

Report the created files and show the explicit invocation form: `$skill-name`.
