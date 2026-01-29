param(
  [ValidateSet("start", "build", "stop", "stop-hard")]
  [string]$Action = "start"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

# ---------- Paths ----------
$Root        = Split-Path -Parent $PSScriptRoot
$ComposeFile = Join-Path $Root "infra\docker-compose.yml"
$PidFile     = Join-Path $PSScriptRoot ".frontend.pid"
$FrontendDir = Join-Path $Root "frontend"
$FrontendPort = 5173

# ---------- Output helpers ----------
function Info($msg) { Write-Host "[INFO] $msg" }
function Ok($msg)   { Write-Host "[ OK ] $msg" }
function Warn($msg) { Write-Host "[WARN] $msg" }

# ---------- Helpers ----------
function Assert-FileExists([string]$Path, [string]$Label) {
  if (-not (Test-Path $Path)) { throw "$Label not found: $Path" }
}

function Assert-CommandExists([string]$Command, [string]$Label) {
  if (-not (Get-Command $Command -ErrorAction SilentlyContinue)) {
    throw "$Label command not found in PATH: $Command"
  }
}

function Stop-ProcessByPort([int]$Port) {
  # Requires Windows PowerShell 5+ / PowerShell 7 on Windows
  $listeners = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue

  if (-not $listeners) {
    Warn "No process listening on port $Port."
    return
  }

  # Sometimes multiple listeners can exist (rare), so handle all unique PIDs
  $pids = $listeners | Select-Object -ExpandProperty OwningProcess -Unique
  foreach ($p in $pids) {
    try {
      Stop-Process -Id $p -Force -ErrorAction Stop
      Ok "Stopped process listening on port $Port (PID $p)."
    } catch {
      Warn "Could not stop process on port $Port (PID $p)."
    }
  }
}

# ---------- Backend ----------
function Start-Backend([switch]$Build) {
  Assert-FileExists $ComposeFile "docker-compose file"
  Assert-CommandExists "docker" "Docker"

  Info "Starting backend stack..."
  if ($Build) {
    docker compose -f $ComposeFile up --build -d | Out-Host
  } else {
    docker compose -f $ComposeFile up -d | Out-Host
  }
  Ok "Backend stack started."
}

function Stop-Backend {
  Assert-FileExists $ComposeFile "docker-compose file"
  Assert-CommandExists "docker" "Docker"

  Info "Stopping backend stack (without removing containers)..."
  docker compose -f $ComposeFile stop | Out-Host
  Ok "Backend stack stopped."
}

# ---------- Frontend ----------
function Start-Frontend {
  Assert-CommandExists "node" "Node.js"
  Assert-FileExists (Join-Path $FrontendDir "server.js") "Frontend entry (server.js)"

  # Evita reventar si ya está ocupado
  $already = Get-NetTCPConnection -LocalPort $FrontendPort -State Listen -ErrorAction SilentlyContinue
  if ($already) {
    Warn "Port $FrontendPort is already in use. Frontend is probably already running."
    return
  }

  Info "Starting frontend..."
  $proc = Start-Process `
    -NoNewWindow `
    -FilePath "node" `
    -ArgumentList "server.js" `
    -WorkingDirectory $FrontendDir `
    -PassThru

  $proc.Id | Set-Content -Encoding ASCII $PidFile
  Ok "Frontend started (PID $($proc.Id))."
}

function Stop-FrontendNormal {
  if (-not (Test-Path $PidFile)) {
    Warn "No frontend PID file found."
    return
  }

  $frontendPid = (Get-Content $PidFile | Select-Object -First 1)
  if (-not $frontendPid) {
    Warn "Frontend PID file is empty."
    Remove-Item -Force $PidFile
    return
  }

  Info "Stopping frontend (PID $frontendPid)..."
  try {
    Stop-Process -Id $frontendPid -ErrorAction Stop
    Ok "Frontend stopped."
  } catch {
    Warn "Frontend process not running (PID $frontendPid)."
  } finally {
    Remove-Item -Force $PidFile -ErrorAction SilentlyContinue
  }
}

function Stop-FrontendHard {
  Info "Hard-stopping frontend (by port $FrontendPort)..."
  Stop-ProcessByPort -Port $FrontendPort

  # Limpia el PID file aunque esté viejo
  if (Test-Path $PidFile) {
    Remove-Item -Force $PidFile -ErrorAction SilentlyContinue
  }
}

# ---------- Main ----------
try {
  switch ($Action) {
    "stop" {
      Stop-Backend
      Stop-FrontendNormal
      Ok "Done."
    }

    "stop-hard" {
      Stop-Backend
      Stop-FrontendHard
      Ok "Done."
    }

    "build" {
      Start-Backend -Build
      Start-Frontend
      Ok "Done."
    }

    default { # "start"
      Start-Backend
      Start-Frontend
      Ok "Done."
    }
  }

  Write-Host ""
  Write-Host "Frontend:   http://localhost:5173"
  Write-Host "Backend:    http://localhost:3000"
  Write-Host "phpMyAdmin: http://localhost:8081"
  Write-Host ""
  Write-Host "Usage:"
  Write-Host "  .\stack.ps1 start"
  Write-Host "  .\stack.ps1 build"
  Write-Host "  .\stack.ps1 stop"
  Write-Host "  .\stack.ps1 stop-hard"
}
catch {
  Write-Host ""
  Write-Host "[ERROR] $($_.Exception.Message)"
  exit 1
}

