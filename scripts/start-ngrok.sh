#!/usr/bin/env bash
# Start ngrok tunnel for backend (Linux)
# Usage: ./start-ngrok.sh [port] [hostname] [logfile]

set -euo pipefail

PORT=${1:-3000}
HOSTNAME=${2:-}
LOGFILE=${3:-/var/log/guestroom-ngrok.log}

NGROK_BIN=${NGROK_BIN:-/usr/local/bin/ngrok}

if [ ! -x "$NGROK_BIN" ]; then
  echo "ngrok binary not found at $NGROK_BIN. Please install ngrok and set NGROK_BIN if needed." >&2
  exit 1
fi

echo "[start-ngrok] Starting ngrok for port $PORT"

if [ -n "$HOSTNAME" ]; then
  echo "[start-ngrok] Using reserved hostname: $HOSTNAME"
  nohup "$NGROK_BIN" http "$PORT" --hostname="$HOSTNAME" > "$LOGFILE" 2>&1 &
else
  nohup "$NGROK_BIN" http "$PORT" > "$LOGFILE" 2>&1 &
fi

echo "[start-ngrok] ngrok started (logs: $LOGFILE)"
