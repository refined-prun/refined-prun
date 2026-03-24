#!/usr/bin/env bash
# Gather PR context artifacts in parallel.
# Usage: gather-context.sh <pr-number>
# Creates: pr-diff.txt, pr-comments.txt, prints changed file list.
set -euo pipefail

number="${1:?Usage: gather-context.sh <pr-number>}"
dir=".tmp/pr/${number}"

gh pr diff > "${dir}/pr-diff.txt" &
pid_diff=$!

gh pr view --json comments,reviews --jq '.comments[].body, .reviews[].body' > "${dir}/pr-comments.txt" 2>/dev/null &
pid_comments=$!

files=$(gh pr view --json files --jq '.files[].path')
pid_files=$!

wait $pid_diff
wait $pid_comments

echo "FILES:"
echo "$files"
echo ""
echo "Artifacts written to ${dir}/"
