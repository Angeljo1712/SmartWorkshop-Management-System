param(
  [ValidateSet("start", "build", "build-only", "recreate", "stop")]
  [string]$Action = "start"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

# ---------- Paths ----------
$Root        = Split-Path -Parent $PSScriptRoot
$ComposeFile = Join-Path $Root "docker-compose.yml"
$EnvFile     = Join-Path $Root ".env"

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

function Assert-LastDockerCommandSucceeded([string]$ActionLabel) {
  if ($LASTEXITCODE -ne 0) {
    throw "Docker command failed while trying to $ActionLabel (exit code $LASTEXITCODE)."
  }
}

# ---------- Stack ----------
function Start-Stack([switch]$Build) {
  Assert-FileExists $ComposeFile "docker-compose file"
  Assert-CommandExists "docker" "Docker"

  Info "Starting stack..."
  if ($Build) {
    docker compose -f $ComposeFile up --build -d | Out-Host
  } else {
    docker compose -f $ComposeFile up -d | Out-Host
  }
  Assert-LastDockerCommandSucceeded "start local stack"
  Ok "Stack started."
}

function Build-Stack {
  Assert-FileExists $ComposeFile "docker-compose file"
  Assert-CommandExists "docker" "Docker"

  Info "Building stack..."
  docker compose -f $ComposeFile build | Out-Host
  Assert-LastDockerCommandSucceeded "build local stack"
  Ok "Stack built."
}

function Recreate-Stack {
  Assert-FileExists $ComposeFile "docker-compose file"
  Assert-CommandExists "docker" "Docker"

  Info "Recreating stack..."
  docker compose -f $ComposeFile up -d --force-recreate | Out-Host
  Assert-LastDockerCommandSucceeded "recreate local stack"
  Ok "Stack recreated."
}

function Stop-Stack {
  Assert-FileExists $ComposeFile "docker-compose file"
  Assert-CommandExists "docker" "Docker"

  Info "Stopping stack (without removing containers)..."
  docker compose -f $ComposeFile stop | Out-Host
  Assert-LastDockerCommandSucceeded "stop local stack"
  Ok "Stack stopped."
}

# ---------- Main ----------
try {
  if (-not (Test-Path $EnvFile)) {
    Warn ".env not found. If running locally, copy .env.example to .env."
  }
  switch ($Action) {
    "stop" {
      Stop-Stack
      Ok "Done."
    }

    "build" {
      Start-Stack -Build
      Ok "Done."
    }

    "build-only" {
      Build-Stack
      Ok "Done."
    }

    "recreate" {
      Recreate-Stack
      Ok "Done."
    }

    default { # "start"
      Start-Stack
      Ok "Done."
    }
  }

  Write-Host ""
  Write-Host "App:       http://localhost:3000"
  Write-Host "phpMyAdmin: http://localhost:8081"
  Write-Host ""
  Write-Host "Usage:"
  Write-Host "  .\stack.ps1 start"
  Write-Host "  .\stack.ps1 build"
  Write-Host "  .\stack.ps1 stop"
}
catch {
  Write-Host ""
  Write-Host "[ERROR] $($_.Exception.Message)"
  exit 1
}
