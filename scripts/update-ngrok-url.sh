#!/usr/bin/env bash
# update-ngrok-url.sh
# Query local ngrok API and update frontend and mobile env files with the public tunnel URL
# Usage: ./update-ngrok-url.sh [repo_root]

set -euo pipefail

REPO_ROOT=${1:-/opt/guestroom}
NGROK_API=${NGROK_API:-http://127.0.0.1:4040/api/tunnels}

echo "[update-ngrok-url] Repo root: $REPO_ROOT"

if ! command -v jq >/dev/null 2>&1; then
  echo "Please install 'jq' (sudo apt install -y jq) to run this script." >&2
  exit 1
fi

resp=$(curl -sS "$NGROK_API" || true)
if [ -z "$resp" ]; then
  echo "Could not reach ngrok local API at $NGROK_API" >&2
  exit 1
fi

public_url=$(echo "$resp" | jq -r '.tunnels[0].public_url // empty')
if [ -z "$public_url" ]; then
  echo "No tunnel public_url found in ngrok API response." >&2
  exit 1
fi

echo "[update-ngrok-url] Found public_url: $public_url"

# Update frontend .env if present
FRONTEND_ENV="$REPO_ROOT/frontend/.env"
if [ -f "$FRONTEND_ENV" ]; then
  echo "VITE_API_BASE_URL=$public_url" > "$FRONTEND_ENV"
  echo "[update-ngrok-url] Updated $FRONTEND_ENV"
fi

# Update mobile .env.development if present
MOBILE_ENV="$REPO_ROOT/atithi_bhavan_mobile/.env.development"
if [ -f "$MOBILE_ENV" ]; then
  sed -i -E "s#^BASE_URL=.*#BASE_URL=$public_url#" "$MOBILE_ENV" || echo "BASE_URL=$public_url" >> "$MOBILE_ENV"
  echo "[update-ngrok-url] Updated $MOBILE_ENV"
fi

echo "[update-ngrok-url] Done"
