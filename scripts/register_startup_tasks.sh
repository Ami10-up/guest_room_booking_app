#!/usr/bin/env bash
# Helper wrapper for Linux to register startup tasks. On Linux we use systemd; this script calls the installer.

set -euo pipefail

REPO_ROOT="/opt/guestroom"

if [ ! -f "$REPO_ROOT/scripts/install-systemd.sh" ]; then
  echo "install-systemd.sh not found in $REPO_ROOT/scripts. Make sure you've copied the repo to $REPO_ROOT." >&2
  exit 1
fi

sudo "$REPO_ROOT/scripts/install-systemd.sh"
