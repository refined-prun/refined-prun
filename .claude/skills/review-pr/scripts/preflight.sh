#!/usr/bin/env bash
# Pre-flight checks for PR review.
# Outputs structured status. Non-zero exit = blocking issue.
set -euo pipefail

errors=()

# Check for uncommitted changes
status=$(git status --porcelain)
if [[ -n "$status" ]]; then
  errors+=("DIRTY_WORKTREE: uncommitted changes present")
  echo "$status"
fi

# Check gh CLI
if ! command -v gh &>/dev/null; then
  errors+=("GH_MISSING: gh CLI not found — install from https://cli.github.com")
fi

if [[ ${#errors[@]} -gt 0 ]]; then
  printf '\n'
  for e in "${errors[@]}"; do
    echo "ERROR: $e"
  done
  exit 1
fi

echo "OK: pre-flight passed"