#!/usr/bin/env bash
# Start the GuestRoom Node backend (development helper)
# Expected to be run on a Linux host where the app is located under /opt/guestroom

set -euo pipefail

REPO_ROOT=${REPO_ROOT:-/opt/guestroom}
BACKEND_DIR="$REPO_ROOT/express-backend"

cd "$BACKEND_DIR"

echo "[start-backend] Starting backend from $BACKEND_DIR"

# Install deps if node_modules missing (safe no-op if already installed)
if [ ! -d node_modules ]; then
  echo "[start-backend] Installing npm dependencies..."
  npm ci
fi

# Prefer running via systemd/pm2 in production. This script runs node directly for quick starts.
NODE_CMD=${NODE_CMD:-node}
${NODE_CMD} app.js
