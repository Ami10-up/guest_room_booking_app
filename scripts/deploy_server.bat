@echo off
REM Deploy backend and frontend dist to a target server folder (local copy).
REM Usage: deploy_server.bat <target_root>
REM Example: deploy_server.bat D:\server\guestroom

IF "%~1"=="" (
  echo Usage: %~nx0 ^<target_root^>
  exit /b 1
)

SET TARGET=%~1
SET SRC_ROOT=%~dp0\..

echo Deploying backend to %TARGET%\express-backend
mkdir "%TARGET%\express-backend" 2>nul
xcopy "%SRC_ROOT%\express-backend\*" "%TARGET%\express-backend\" /E /I /Y

echo Deploying frontend dist to %TARGET%\frontend-dist
mkdir "%TARGET%\frontend-dist" 2>nul
xcopy "%SRC_ROOT%\frontend\dist\*" "%TARGET%\frontend-dist\" /E /I /Y

echo Copy complete. On server, run the backend with Node and serve frontend-dist statically.
