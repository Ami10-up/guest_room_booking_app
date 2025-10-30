@echo off
REM Build signed/unsigned release APK for the Flutter mobile app.
REM Usage:
REM   build_apk.bat [--dart-define=https://your-base-url]
REM Examples:
REM   build_apk.bat --dart-define=https://determinatively-humpiest-lannie.ngrok-free.dev

SETLOCAL
SET REPO_ROOT=%~dp0\..
SET FLUTTER_PROJECT=%REPO_ROOT%\atithi_bhavan_mobile

REM Parse --dart-define arg if provided
SET BASE_URL=
FOR %%A IN (%*) DO (
  CALL :parseArg "%%~A"
)
GOTO :doBuild

:parseArg
SET ARG=%~1
echo %ARG% | findstr /b /c:"--dart-define=" >nul
IF ERRORLEVEL 1 (GOTO :eof) ELSE (
  for /f "tokens=1* delims==" %%K in ('echo %ARG%') do set BASE_URL=%%L
)
GOTO :eof

:doBuild
echo Building Flutter APK for project: %FLUTTER_PROJECT%
pushd "%FLUTTER_PROJECT%"
echo Running: flutter pub get
flutter pub get

IF "%BASE_URL%"=="" (
  echo No BASE_URL override provided. Using project default.
  flutter build apk --release
) ELSE (
  echo Overriding BASE_URL with %BASE_URL%
  flutter build apk --release --dart-define=BASE_URL=%BASE_URL%
)

popd
echo Build finished. Check build/app/outputs/flutter-apk/
ENDLOCAL
