# Admin Panel & Mobile App Migration + Auto-start Guide

This document explains how to migrate the admin panel (backend + frontend) to another PC, build the mobile APK, set up a permanent ngrok tunnel, and configure automatic startup of the backend and ngrok on Windows.

---

## 1) Commit status
Make sure you've committed all local changes before migrating:

```
git add -A
git commit -m "Save local changes before migration"
```

If you push to a remote repo, use `git push` to keep a copy in the cloud.

## 2) Copy repository to target PC

Options:
- Clone from your remote Git host (recommended):

```
git clone <repo-url>
git checkout Yash_1
```

- Or copy the entire folder (including `express-backend/db/guestroom.sqlite`) to the target PC.

Important: Copy `express-backend/db/guestroom.sqlite` if you want to keep existing users/bookings.

## 3) Backend setup on target PC

1. Install Node.js (LTS) and npm.
2. From repository root:

```
cd express-backend
npm install
```

3. Create a `.env` in `express-backend` (optional but recommended):

```
PORT=3000
JWT_SECRET=replace-with-a-secure-secret
NODE_ENV=production
```

4. Start backend (manual):

```
node app.js
```

Or use the helper script from repo root (Windows):

```
scripts\start-backend.bat
```

Confirm server is up:

```
curl http://localhost:3000/api/health
```

## 4) Frontend setup (for local dev or static hosting)

1. Ensure Node and npm are installed.
2. From repository root:

```
cd frontend
npm install
```

3. Set `frontend/.env` to point to the backend API (local):

```
VITE_API_BASE_URL=http://localhost:3000
```

4. Start dev server:

```
npm run dev
```

5. Or build production static files:

```
npm run build
```

Static files will live in `frontend/dist` and can be served by any static server.

## 5) Mobile APK build (Flutter project present)

This repository contains `atithi_bhavan_mobile/` which is a Flutter app. To build an APK:

Prerequisites on the build machine:
- Install Flutter SDK and add it to PATH
- Install Android SDK/Android Studio and configure an Android emulator or device

Steps:

```
cd atithi_bhavan_mobile
flutter pub get
flutter build apk --release
```

The generated APK will be at `build/app/outputs/flutter-apk/app-release.apk` (or similar). Install on an Android device.

Important: The mobile app must point to the public backend URL (ngrok or your domain). Update mobile config to use the ngrok URL (HTTPS) — see next section on ngrok.

## 6) Setting up a permanent ngrok HTTPS tunnel

For a stable public address you should use a paid ngrok plan to reserve a domain or use a custom domain. The free plan gives ephemeral URLs which change.

Steps:

1. Sign up for ngrok and get your authtoken: https://dashboard.ngrok.com/get-started/your-authtoken
2. Install ngrok on the host PC and run:

```
ngrok config add-authtoken <YOUR_AUTHTOKEN>
```

3. For a permanent hostname (paid plan), reserve a subdomain and use the `--hostname` option in the start script.

4. Start ngrok to expose backend port 3000:

```
scripts\start-ngrok.bat
```

Or to use a reserved hostname:

```
ngrok http 3000 --hostname your-reserved-domain.example.com
```

Note: The mobile app and any external users must use the HTTPS ngrok URL (or your domain) as the API base URL.

## 7) Auto-start backend and ngrok on Windows startup

Two approaches: Task Scheduler (built-in) or NSSM (service wrapper). Task Scheduler is easiest.

Option A — Task Scheduler (recommended, no extra software):

1. Open Task Scheduler → Create Task.
2. General: name it `Start GuestRoom Backend` and choose "Run whether user is logged on or not".
3. Triggers: New → At startup.
4. Actions: New → Start a program:

Program/script:
```
cmd.exe
```
Add arguments:
```
/c "D:\path\to\repo\scripts\start-backend.bat"
```

5. (Optional) Add a second task `Start ngrok` that runs `scripts\start-ngrok.bat` at startup.

Note: Use absolute paths and ensure the service account has access to the repo.

Option B — NSSM (run as Windows service):

1. Download NSSM (https://nssm.cc/) and install.
2. Install service for backend:

```
nssm install GuestRoomBackend "C:\Program Files\nodejs\node.exe" "D:\path\to\repo\express-backend\app.js"
nssm set GuestRoomBackend AppDirectory D:\path\to\repo\express-backend
nssm start GuestRoomBackend
```

3. For ngrok, install another service pointing to `ngrok.exe http 3000 --region=us` or your reserved host.

Advantages: Services run even without interactive login.

## 8) Device migration notes (mobile users)

- Mobile users will use the public HTTPS URL provided by ngrok (or your domain). The backend remains on your host PC.
- Ensure firewall rules allow ngrok to bind and accept traffic.
- If using reserved domain, configure DNS / TLS as recommended by ngrok.

## 9) Security notes

- Use a real `JWT_SECRET` and keep it out of source control.
- Limit CORS origins if possible (don't leave `origin: '*'` in production if you can target the mobile/web client domain).
- Secure SQLite DB file and backup regularly.

---

If you want, I can:
- Create Task Scheduler commands (PowerShell) to register the tasks automatically.
- Add NSSM install instructions with exact commands.
- Create a small PowerShell script that creates a Windows service for ngrok using NSSM.
- Commit the helper scripts and README (I added them under `scripts/` and `README_ADMIN_MIGRATION.md`).
