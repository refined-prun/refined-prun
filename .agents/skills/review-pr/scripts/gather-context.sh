#!/usr/bin/env bash
# Gather PR context artifacts in parallel.
# Usage: gather-context.sh <pr-number>
# Creates: pr-diff.txt, pr-comments.txt, prints changed file list.
set -euo pipefail

number="${1:?Usage: gather-context.sh <pr-number>}"
dir=".tmp/pr/${number}"

if [[ ! "$number" =~ ^[0-9]+$ ]]; then
  echo "ERROR: PR number must contain digits only"
  exit 2
fi

mkdir -p "$dir"

gh pr diff "$number" > "${dir}/pr-diff.txt" &
pid_diff=$!

gh pr view "$number" --json comments,reviews --jq '(.comments[] | "@\(.author.login):\n\(.body)\n"), (.reviews[] | "@\(.author.login) (review):\n\(.body)\n")' > "${dir}/pr-comments.txt" 2>/dev/null &
pid_comments=$!

files=$(gh pr view "$number" --json files --jq '.files[].path')

wait $pid_diff
wait $pid_comments

echo "FILES:"
echo "$files"
echo ""
echo "Artifacts written to ${dir}/"
