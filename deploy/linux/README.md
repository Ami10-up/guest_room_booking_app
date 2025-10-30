# Linux Deployment Guide — Guest Room Booking App

This document contains copy-paste commands and step-by-step instructions to deploy the backend (Node/Express) and frontend (Vite `dist`) on an Ubuntu/Debian-based server.

Paths used in examples
- App root on server: `/opt/guestroom`
- Backend: `/opt/guestroom/express-backend`
- Frontend static files (nginx root): `/var/www/guestroom`
- Systemd units: `/etc/systemd/system/guestroom-backend.service` and `guestroom-ngrok.service`

Steps
1. Install prerequisites

```bash
sudo apt update
sudo apt install -y build-essential curl git nginx sqlite3 jq rsync

# Node 18 (example)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Optional: install Flutter (for APK builds) — follow Flutter installation docs
```

2. Copy files to server

Use `scp`, `rsync` or Git to copy the repo to `/opt/guestroom`.

3. Make scripts executable

```bash
sudo chmod +x /opt/guestroom/scripts/*.sh
```

4. Install and configure ngrok

Download ngrok, move to `/usr/local/bin/ngrok`, then:
```bash
ngrok config add-authtoken <YOUR_NGROK_AUTHTOKEN>
```

5. Install systemd units (automated helper provided)

Run the install script to copy example units and enable services:
```bash
sudo /opt/guestroom/scripts/install-systemd.sh
```

6. Deploy frontend dist to nginx root

```bash
sudo mkdir -p /var/www/guestroom
sudo rsync -a --delete /opt/guestroom/frontend/dist/ /var/www/guestroom/
sudo chown -R www-data:www-data /var/www/guestroom
sudo systemctl reload nginx
```

7. Use the deploy helper to update backend and frontend

```bash
sudo /opt/guestroom/scripts/deploy_server.sh /opt/guestroom /opt/guestroom
```

8. Verify

```bash
curl http://127.0.0.1:3000/api/health
sudo journalctl -u guestroom-backend -f
sudo journalctl -u guestroom-ngrok -f
```

9. Rollback

Keep a backup of `/opt/guestroom/express-backend/db/guestroom.sqlite` before deployment. If needed, stop services and restore the backup.

```bash
sudo systemctl stop guestroom-backend guestroom-ngrok
sudo cp /opt/guestroom/backups/guestroom.pre-deploy.sqlite /opt/guestroom/express-backend/db/guestroom.sqlite
sudo systemctl start guestroom-backend
```

Notes
- Use a dedicated Linux user instead of `www-data` if preferred.
- For production, consider using PM2 or Docker; systemd units here run Node directly for simplicity.
