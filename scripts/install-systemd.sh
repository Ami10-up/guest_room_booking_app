#!/usr/bin/env bash
# Install systemd unit files for Guest Room Booking App and enable services.

set -euo pipefail

REPO_ROOT="/opt/guestroom"
UNITS_DIR="${REPO_ROOT}/deploy/linux"

if [ ! -d "$UNITS_DIR" ]; then
  echo "Expected units directory $UNITS_DIR not found. Exiting." >&2
  exit 1
fi

echo "Copying unit files to /etc/systemd/system..."
sudo cp "$UNITS_DIR/guestroom-backend.service" /etc/systemd/system/guestroom-backend.service
sudo cp "$UNITS_DIR/guestroom-ngrok.service" /etc/systemd/system/guestroom-ngrok.service

echo "Reloading systemd daemon..."
sudo systemctl daemon-reload

echo "Enabling and starting services..."
sudo systemctl enable --now guestroom-backend.service
sudo systemctl enable --now guestroom-ngrok.service

echo "Done. Use 'sudo journalctl -u guestroom-backend -f' to follow logs." 
