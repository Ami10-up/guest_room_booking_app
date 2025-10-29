<#
  update-ngrok-url.ps1

  Fetch the active ngrok tunnels from the local ngrok API (default: http://127.0.0.1:4040)
  Extract the first HTTPS public_url and update:
    - frontend/.env -> VITE_API_BASE_URL
    - atithi_bhavan_mobile/.env.development -> BASE_URL

  Usage:
    .\update-ngrok-url.ps1 [-RebuildFrontend] [-BuildMobile]

  Notes:
    - Requires ngrok to be running locally with its API accessible at 127.0.0.1:4040
    - Running mobile build requires Flutter in PATH and may be slow.
>

param(
  [switch]$RebuildFrontend,
  [switch]$BuildMobile
)

function Get-NgrokHttpsUrl {
  try {
    $api = 'http://127.0.0.1:4040/api/tunnels'
    $json = Invoke-RestMethod -Uri $api -Method Get -ErrorAction Stop
    # Prefer tunnels where public_url starts with https
    foreach ($t in $json.tunnels) {
      if ($t.public_url -like 'https://*') { return $t.public_url }
    }
    return $null
  } catch {
    Write-Error "Failed to query ngrok API: $_"
    return $null
  }
}

$url = Get-NgrokHttpsUrl
if (-not $url) {
  Write-Error "No active HTTPS ngrok tunnel found. Ensure ngrok is running and the API is reachable at http://127.0.0.1:4040"
  exit 1
}

Write-Output "Found ngrok URL: $url"

# Update frontend/.env
$frontendEnv = Join-Path -Path $PSScriptRoot -ChildPath '..\frontend\.env'
$frontendEnv = (Resolve-Path $frontendEnv).ProviderPath

if (Test-Path $frontendEnv) {
  (Get-Content $frontendEnv) -replace 'VITE_API_BASE_URL=.*', "VITE_API_BASE_URL=$url" | Set-Content $frontendEnv
  Write-Output "Updated $frontendEnv"
} else {
  "VITE_API_BASE_URL=$url" | Out-File -FilePath $frontendEnv -Encoding utf8
  Write-Output "Created $frontendEnv"
}

# Update Flutter mobile .env.development
$mobileEnv = Join-Path -Path $PSScriptRoot -ChildPath '..\atithi_bhavan_mobile\.env.development'
$mobileEnv = (Resolve-Path $mobileEnv -ErrorAction SilentlyContinue)
if ($mobileEnv) { $mobileEnv = $mobileEnv.ProviderPath }

if ($mobileEnv) {
  (Get-Content $mobileEnv) -replace 'BASE_URL=.*', "BASE_URL=$url" | Set-Content $mobileEnv
  Write-Output "Updated $mobileEnv"
} else {
  "BASE_URL=$url" | Out-File -FilePath (Join-Path $PSScriptRoot '..\atithi_bhavan_mobile\.env.development') -Encoding utf8
  Write-Output "Created atithi_bhavan_mobile\.env.development"
}

if ($RebuildFrontend) {
  Write-Output "Rebuilding frontend production bundle..."
  Push-Location (Join-Path $PSScriptRoot '..\frontend')
  npm run build
  Pop-Location
}

if ($BuildMobile) {
  Write-Output "Building Flutter APK (this requires Flutter SDK installed)."
  Push-Location (Join-Path $PSScriptRoot '..\atithi_bhavan_mobile')
  flutter pub get
  flutter build apk --release
  Pop-Location
}

Write-Output "Done."
