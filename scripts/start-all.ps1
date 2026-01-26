param(
  [switch]$Build
)

$root = Split-Path -Parent $PSScriptRoot
$composeFile = Join-Path $root "infra\docker-compose.yml"

Write-Host "Starting backend stack..."
if ($Build) {
  docker compose -f $composeFile up --build -d
} else {
  docker compose -f $composeFile up -d
}

Write-Host "Starting frontend..."
Start-Process -NoNewWindow -FilePath "node" -ArgumentList "server.js" -WorkingDirectory (Join-Path $root "frontend")

Write-Host "Done."
Write-Host "Frontend: http://localhost:5173"
Write-Host "Backend:  http://localhost:3000"
Write-Host "phpMyAdmin: http://localhost:8081"

"- Normal (sin build):
    .\scripts\start-all.ps1
    
  - Con build:
    .\scripts\start-all.ps1 -Build"