@echo off
REM Start the express-backend using node. Run this from repository root.
cd /d "%~dp0\..\express-backend"
echo Starting backend in %cd%
REM Use node directly to avoid PowerShell execution policy issues
node app.js
