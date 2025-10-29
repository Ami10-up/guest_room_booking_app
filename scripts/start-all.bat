@echo off
REM Start backend and ngrok in separate windows. Run from repository root.

set REPO_ROOT=%~dp0\..

echo Launching backend in a new window...
start "Start Backend" cmd /k "%REPO_ROOT%\scripts\start-backend.bat"

echo Launching ngrok in a new window...
start "Start ngrok" cmd /k "%REPO_ROOT%\scripts\start-ngrok.bat"

echo All started. Close these windows to stop services.
