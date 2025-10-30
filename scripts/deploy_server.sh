#!/usr/bin/env bash
# deploy_server.sh
# Copy frontend dist and backend to server paths and restart services
# Usage: ./deploy_server.sh [repo_root] [target_root]

set -euo pipefail

REPO_ROOT=${1:-/opt/guestroom}
TARGET_ROOT=${2:-/opt/guestroom}

echo "[deploy_server] Repo root: $REPO_ROOT -> Target root: $TARGET_ROOT"

echo "[deploy_server] Syncing backend..."
rsync -a --delete "$REPO_ROOT/express-backend/" "$TARGET_ROOT/express-backend/"

echo "[deploy_server] Syncing frontend dist..."
if [ -d "$REPO_ROOT/frontend/dist" ]; then
  sudo mkdir -p /var/www/guestroom
  sudo rsync -a --delete "$REPO_ROOT/frontend/dist/" /var/www/guestroom/
fi

echo "[deploy_server] Installing backend deps..."
cd "$TARGET_ROOT/express-backend"
npm ci --production

echo "[deploy_server] Restarting services (systemd if present)..."
if command -v systemctl >/dev/null 2>&1; then
  sudo systemctl daemon-reload || true
  sudo systemctl restart guestroom-backend || true
  sudo systemctl restart guestroom-ngrok || true
else
  echo "systemctl not available; please start backend and ngrok manually or use PM2."
fi

echo "[deploy_server] Done. Verify by checking backend health: http://127.0.0.1:3000/api/health"
