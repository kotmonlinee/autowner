#!/bin/bash
# Start Claude Code with AutOwner team agents loaded
cd /Users/amy.wang/autowner
AGENTS=$(cat .claude/agents.json | python3 -c "import sys,json; print(json.dumps(json.load(sys.stdin)))")
exec claude --agents "$AGENTS" "$@"
