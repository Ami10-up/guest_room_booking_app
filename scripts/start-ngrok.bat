@echo off
REM Start ngrok to tunnel local port 3000 to the internet.
REM Requires ngrok to be installed and authtoken configured.

REM Change these variables as needed or set environment variables before calling the script
set NGROK_PORT=3000
set NGROK_REGION=us
REM Optional: set NGROK_SUBDOMAIN if you have a paid plan and reserved domain
set NGROK_SUBDOMAIN=

cd /d "%~dp0\..\"
echo Starting ngrok tunnel for localhost:%NGROK_PORT%
if "%NGROK_SUBDOMAIN%"=="" (
  ngrok http %NGROK_PORT% --region=%NGROK_REGION%
) else (
  ngrok http %NGROK_PORT% --region=%NGROK_REGION% --hostname=%NGROK_SUBDOMAIN%
)
