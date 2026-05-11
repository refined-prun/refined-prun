#!/usr/bin/env bash
# Setup PR for review: fetch, checkout if needed, merge main, create dirs.
# Usage: setup-pr.sh <pr-number> [--checkout]
#   --checkout: switch to the PR branch (skip if already on it)
# Outputs: PR JSON metadata on success.
set -euo pipefail

number="${1:?Usage: setup-pr.sh <pr-number> [--checkout]}"
checkout="${2:-}"

git fetch origin main

if [[ "$checkout" == "--checkout" ]]; then
  gh pr checkout "$number"
fi

# Merge main — stop on conflict
if ! git merge origin/main --no-edit; then
  echo "ERROR: MERGE_CONFLICT — resolve manually"
  git merge --abort 2>/dev/null || true
  exit 1
fi

# Get PR metadata
pr_json=$(gh pr view --json number,title,body,baseRefName,headRefName,author,labels,files 2>&1)
echo "$pr_json"

# Create artifact directory
mkdir -p ".tmp/pr/${number}"
echo "$number" > ".tmp/pr/current.txt"
