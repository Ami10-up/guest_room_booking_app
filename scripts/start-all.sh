#!/usr/bin/env bash
# Start backend + ngrok quickly (useful for dev servers)

set -euo pipefail

REPO_ROOT=${REPO_ROOT:-/opt/guestroom}
NGROK_HOSTNAME=${NGROK_HOSTNAME:-}

echo "[start-all] REPO_ROOT=$REPO_ROOT"

"$REPO_ROOT/scripts/start-backend.sh" &
sleep 2
"$REPO_ROOT/scripts/start-ngrok.sh" 3000 "$NGROK_HOSTNAME"

echo "[start-all] backend and ngrok started"
