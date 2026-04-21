param()

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$RepoRoot    = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$StagingFile = Join-Path $RepoRoot "docker-compose.staging.yml"
$EnvFile     = Join-Path $RepoRoot ".env.staging"
$ProjectName = "smartworkshop-staging"

function Info($msg) { Write-Host "[INFO] $msg" }
function Ok($msg)   { Write-Host "[ OK ] $msg" }
function Warn($msg) { Write-Host "[WARN] $msg" }

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

try {
  Assert-FileExists $StagingFile "staging compose file"
  Assert-FileExists $EnvFile "staging env file"
  Assert-CommandExists "docker" "Docker"

  Info "Resetting staging stack..."
  docker compose --project-name $ProjectName --env-file $EnvFile -f $StagingFile down --volumes --remove-orphans | Out-Host
  Assert-LastDockerCommandSucceeded "remove staging stack and volumes"

  Info "Recreating staging stack from scratch..."
  docker compose --project-name $ProjectName --env-file $EnvFile -f $StagingFile up --build -d | Out-Host
  Assert-LastDockerCommandSucceeded "start fresh staging stack"

  Ok "Staging stack reset completed."
  Write-Host ""
  Write-Host "Staging app:       http://localhost:3001"
  Write-Host "Staging phpMyAdmin: http://localhost:8082"
}
catch {
  Write-Host ""
  Write-Host "[ERROR] $($_.Exception.Message)"
  exit 1
}
