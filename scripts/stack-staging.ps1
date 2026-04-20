param(
  [ValidateSet("start", "build", "stop")]
  [string]$Action = "start"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$Root        = Split-Path -Parent $PSScriptRoot
$StagingFile = Join-Path $Root "docker-compose.staging.yml"
$EnvFile     = Join-Path $Root ".env.staging"
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

function Start-Staging([switch]$Build) {
  Assert-FileExists $StagingFile "staging compose file"
  Assert-FileExists $EnvFile "staging env file"
  Assert-CommandExists "docker" "Docker"

  Info "Starting staging stack..."
  $cmd = @(
    "docker", "compose",
    "--project-name", $ProjectName,
    "--env-file", $EnvFile,
    "-f", $StagingFile
  )
  if ($Build) {
    $cmd += @("up", "--build", "-d")
  } else {
    $cmd += @("up", "-d")
  }
  & $cmd[0] $cmd[1..($cmd.Length - 1)] | Out-Host
  Assert-LastDockerCommandSucceeded "start staging stack"
  Ok "Staging stack started."
}

function Stop-Staging {
  Assert-FileExists $StagingFile "staging compose file"
  Assert-FileExists $EnvFile "staging env file"
  Assert-CommandExists "docker" "Docker"

  Info "Stopping staging stack..."
  docker compose --project-name $ProjectName --env-file $EnvFile -f $StagingFile down --remove-orphans | Out-Host
  Assert-LastDockerCommandSucceeded "stop staging stack"
  Ok "Staging stack stopped."
}

try {
  if (-not (Test-Path $EnvFile)) {
    Warn ".env.staging not found. Copy .env.staging.example to .env.staging and adjust values."
  }

  switch ($Action) {
    "stop" { Stop-Staging }
    "build" { Start-Staging -Build }
    default { Start-Staging }
  }

  Write-Host ""
  Write-Host "Staging app:       http://localhost:3001"
  Write-Host "Staging phpMyAdmin: http://localhost:8082"
}
catch {
  Write-Host ""
  Write-Host "[ERROR] $($_.Exception.Message)"
  exit 1
}
