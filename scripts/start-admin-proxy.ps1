Param(
  [string]$AdminUser = "admin",
  [string]$AdminPass = "adminpass",
  [int]$Port = 8080,
  [string]$BackendUrl = "http://localhost:3000",
  [string]$DistPath = "$(Resolve-Path "$(Join-Path (Split-Path -Parent $PSScriptRoot) 'frontend' 'dist')")"
)

Write-Host "Starting admin proxy..."
Set-Location -Path $PSScriptRoot

if (-Not (Test-Path "node.exe")) {
  Write-Host "Node not found in PATH. Make sure Node.js is installed and available." -ForegroundColor Yellow
}

if (-Not (Test-Path "node_modules")) {
  Write-Host "Installing npm dependencies for admin-proxy (this may take a moment)..."
  npm install --prefix $PSScriptRoot --no-audit --no-fund
}

$env:ADMIN_USER = $AdminUser
$env:ADMIN_PASS = $AdminPass
$env:ADMIN_PROXY_PORT = $Port
$env:BACKEND_URL = $BackendUrl
$env:DIST_PATH = $DistPath

Write-Host "Admin proxy config: user=$AdminUser port=$Port backend=$BackendUrl dist=$DistPath"

Start-Process -NoNewWindow -FilePath "node" -ArgumentList "admin-proxy.js" -WorkingDirectory $PSScriptRoot

Write-Host "Admin proxy started (node admin-proxy.js). Use Ctrl+C to stop in this session or run as background process." -ForegroundColor Green
