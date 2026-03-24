#!/usr/bin/env bash
# Run prettier, commit if needed, then eslint.
# Usage: format-and-lint.sh <pr-number>
# Outputs: PRETTIER_COMMITTED or PRETTIER_CLEAN, then eslint results.
set -euo pipefail

number="${1:?Usage: format-and-lint.sh <pr-number>}"
dir=".tmp/pr/${number}"

# Prettier
pnpm prettier

changed=$(git diff --name-only)
if [[ -n "$changed" ]]; then
  echo "$changed" | xargs git add
  git commit -m "prettier"
  echo "PRETTIER_COMMITTED"
else
  echo "PRETTIER_CLEAN"
fi

# ESLint
pnpm lint > "${dir}/eslint-output.txt" 2>&1; echo "EXIT:$?" >> "${dir}/eslint-output.txt"
echo ""
echo "ESLint output written to ${dir}/eslint-output.txt"
