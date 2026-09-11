#!/usr/bin/env bash
# Setup PR for review: fetch, checkout if needed, merge the base branch, create dirs.
# Usage: setup-pr.sh <pr-number> [--checkout]
#   --checkout: switch to the PR branch (skip if already on it)
# Outputs: PR JSON metadata on success.
set -euo pipefail

number="${1:?Usage: setup-pr.sh <pr-number> [--checkout]}"
checkout="${2:-}"

if [[ ! "$number" =~ ^[0-9]+$ ]]; then
  echo "ERROR: PR number must contain digits only"
  exit 2
fi

if [[ -n "$checkout" && "$checkout" != "--checkout" ]]; then
  echo "ERROR: second argument must be --checkout"
  exit 2
fi

pr_json=$(gh pr view "$number" --json number,title,body,baseRefName,headRefName,author,labels,files 2>&1)
base_ref=$(gh pr view "$number" --json baseRefName --jq '.baseRefName')

git fetch origin "$base_ref"

if [[ "$checkout" == "--checkout" ]]; then
  gh pr checkout "$number"
fi

# Merge the PR base branch and stop on conflict.
if ! git merge "origin/${base_ref}" --no-edit; then
  echo "ERROR: MERGE_CONFLICT — resolve manually"
  git merge --abort 2>/dev/null || true
  exit 1
fi

echo "$pr_json"

# Create artifact directory
mkdir -p ".tmp/pr/${number}"
echo "$number" > ".tmp/pr/current.txt"
