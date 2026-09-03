#!/bin/sh
# dispatch-codex.sh - run a Codex worker on a task brief in its own git worktree.
#
# Template-owned (project-template-a): replaced verbatim by template migrations.
#
# usage: ./dispatch-codex.sh <slice> <brief-file> [-m MODEL] [-e EFFORT] [-s SANDBOX] [-b BASE]
#        ./dispatch-codex.sh --remove <slice>
#
# Creates the worktree .agent-worktrees/<slice> on branch codex/<slice> from BASE
# (default HEAD), then runs `codex exec` there in the foreground with the brief on
# stdin. Output lands in .agent-worktrees/_runs/<slice>/: report.md (the worker's
# final message), events.jsonl (Codex's event stream), stderr.log. The exit status
# is Codex's. An orchestrator runs this in the background so several workers can
# run at once, and is woken when it exits.
#
# --remove removes the worktree without force (it must be clean and integrated),
# prunes stale metadata, and leaves the branch for the orchestrator to delete.
#
# Defaults: MODEL=gpt-5.6-sol EFFORT=high SANDBOX=workspace-write BASE=HEAD.
# Sandbox values: read-only, workspace-write, danger-full-access.
set -eu

usage() {
    sed -n '2,20p' "$0" | sed 's/^# \{0,1\}//' >&2
    exit 2
}

MODEL=gpt-5.6-sol
EFFORT=high
SANDBOX=workspace-write
BASE=HEAD
REMOVE=no

[ $# -ge 1 ] || usage
if [ "$1" = "--remove" ]; then
    REMOVE=yes
    shift
fi
[ $# -ge 1 ] || usage
SLICE=$1
shift
case "$SLICE" in
    ''|*[!A-Za-z0-9._-]*|.*)
        echo "error: slice name must match [A-Za-z0-9._-]+ and not start with a dot: '$SLICE'" >&2
        exit 2
        ;;
esac

REPO=$(git rev-parse --show-toplevel 2>/dev/null) || { echo "error: not inside a Git repository" >&2; exit 2; }
WORKTREE="$REPO/.agent-worktrees/$SLICE"
RUN_DIR="$REPO/.agent-worktrees/_runs/$SLICE"
BRANCH="codex/$SLICE"

if [ "$REMOVE" = yes ]; then
    [ $# -eq 0 ] || usage
    git -C "$REPO" worktree remove "$WORKTREE"
    git -C "$REPO" worktree prune
    echo "removed worktree $WORKTREE; branch $BRANCH kept (delete it with: git branch -d $BRANCH)"
    exit 0
fi

[ $# -ge 1 ] || usage
BRIEF=$1
shift
while [ $# -gt 0 ]; do
    case "$1" in
        -m) MODEL=$2; shift 2 ;;
        -e) EFFORT=$2; shift 2 ;;
        -s) SANDBOX=$2; shift 2 ;;
        -b) BASE=$2; shift 2 ;;
        *) echo "error: unknown option '$1'" >&2; usage ;;
    esac
done

[ -r "$BRIEF" ] || { echo "error: brief file not readable: $BRIEF" >&2; exit 2; }
command -v codex >/dev/null 2>&1 || { echo "error: codex CLI not found on PATH" >&2; exit 127; }
[ ! -e "$WORKTREE" ] || { echo "error: worktree already exists: $WORKTREE" >&2; exit 2; }
if git -C "$REPO" show-ref --verify --quiet "refs/heads/$BRANCH"; then
    echo "error: branch already exists: $BRANCH" >&2
    exit 2
fi

mkdir -p "$RUN_DIR"
git -C "$REPO" worktree add "$WORKTREE" -b "$BRANCH" "$BASE"
echo "worktree: $WORKTREE"
echo "branch:   $BRANCH"
echo "model:    $MODEL ($EFFORT reasoning, $SANDBOX sandbox)"
echo "report:   $RUN_DIR/report.md"
echo "events:   $RUN_DIR/events.jsonl"

STATUS=0
codex exec -C "$WORKTREE" -s "$SANDBOX" -m "$MODEL" -c "model_reasoning_effort=$EFFORT" \
    --json -o "$RUN_DIR/report.md" - < "$BRIEF" > "$RUN_DIR/events.jsonl" 2> "$RUN_DIR/stderr.log" || STATUS=$?

echo
echo "codex exited with status $STATUS"
if [ -s "$RUN_DIR/report.md" ]; then
    echo "---- report ----"
    cat "$RUN_DIR/report.md"
    echo
else
    echo "(no report written; see $RUN_DIR/stderr.log)"
fi
exit "$STATUS"
