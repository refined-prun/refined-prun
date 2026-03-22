#!/usr/bin/env bash
# Manage review worktree.
# Usage: worktree.sh <create|remove> <pr-number>
set -euo pipefail

action="${1:?Usage: worktree.sh <create|remove> <pr-number>}"
number="${2:?Usage: worktree.sh <create|remove> <pr-number>}"
ws=".tmp/pr/${number}/workspace"

case "$action" in
  create)
    # Clean up any stale worktree first
    git worktree remove "$ws" --force 2>/dev/null || true
    rm -rf "$ws" 2>/dev/null || true
    # Create detached worktree at current HEAD
    if ! git worktree add "$ws" HEAD --detach; then
      echo "ERROR: worktree creation failed. Listing worktrees:"
      git worktree list
      exit 1
    fi
    echo "OK: worktree created at ${ws}"
    ;;
  remove)
    git worktree remove "$ws" --force 2>/dev/null || true
    rm -rf "$ws" 2>/dev/null || true
    echo "OK: worktree removed"
    ;;
  *)
    echo "ERROR: unknown action '${action}'. Use 'create' or 'remove'."
    exit 1
    ;;
esac
