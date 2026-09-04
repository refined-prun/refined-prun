#!/usr/bin/env bash
# Run prettier, commit if needed, then eslint.
# Usage: format-and-lint.sh <pr-number>
# Outputs: PRETTIER_COMMITTED or PRETTIER_CLEAN, then eslint results.
set -euo pipefail

number="${1:?Usage: format-and-lint.sh <pr-number>}"
dir=".tmp/pr/${number}"

if [[ ! "$number" =~ ^[0-9]+$ ]]; then
  echo "ERROR: PR number must contain digits only"
  exit 2
fi

mkdir -p "$dir"

# Prettier
pnpm prettier

if ! git diff --quiet; then
  git diff --name-only -z | xargs -0 git add --
  git commit -m "prettier"
  echo "PRETTIER_COMMITTED"
else
  echo "PRETTIER_CLEAN"
fi

# ESLint
set +e
pnpm lint > "${dir}/eslint-output.txt" 2>&1
lint_exit=$?
set -e
echo "EXIT:${lint_exit}" >> "${dir}/eslint-output.txt"
echo ""
echo "ESLint output written to ${dir}/eslint-output.txt"
