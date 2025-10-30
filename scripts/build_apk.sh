#!/usr/bin/env bash
# Build signed Android APK for atithi_bhavan_mobile
# This script assumes Flutter SDK and Android SDK are installed and available in PATH.

set -euo pipefail

APP_DIR="/opt/guestroom/atithi_bhavan_mobile"
if [ -d "$APP_DIR" ]; then
  cd "$APP_DIR"
else
  echo "Directory $APP_DIR not found; please run this script from a machine with the Flutter project or update APP_DIR." >&2
  exit 1
fi

echo "Running flutter pub get..."
flutter pub get

# Optional: set BASE_URL via environment or prompt
if [ -z "${VITE_API_BASE_URL-}" ]; then
  echo "Provide backend BASE_URL (e.g. https://your.api.host) or press Enter to use default http://localhost:3000:" 
  read -r BASE_URL_INPUT
  BASE_URL=${BASE_URL_INPUT:-http://localhost:3000}
else
  BASE_URL="$VITE_API_BASE_URL"
fi

echo "Building release APK with BASE_URL=$BASE_URL"
# Example: pass to Dart define used by app. Adjust key name if app expects different variable.
flutter build apk --release --target-platform android-arm,android-arm64 --dart-define=BASE_URL="$BASE_URL"

APK_PATH="build/app/outputs/flutter-apk/app-release.apk"
if [ -f "$APK_PATH" ]; then
  echo "APK built at: $APK_PATH"
else
  echo "APK not found at $APK_PATH; check build output." >&2
  exit 2
fi

echo "Done. Remember to sign the APK if using a different signing configuration or upload the AAB for Play Store." 
