Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$RepoRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$StagingScript = Join-Path $RepoRoot "scripts\staging\stack-staging.ps1"
$TunnelScript = Join-Path $RepoRoot "scripts\staging\run-staging-tunnel.ps1"

function Info($msg) { Write-Host "[INFO] $msg" }
function Ok($msg)   { Write-Host "[ OK ] $msg" }

function Assert-FileExists([string]$Path, [string]$Label) {
  if (-not (Test-Path $Path)) {
    throw "$Label not found: $Path"
  }
}

try {
  Assert-FileExists $StagingScript "staging stack script"
  Assert-FileExists $TunnelScript "staging tunnel script"

  Info "Opening staging window..."
  Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-ExecutionPolicy", "Bypass",
    "-File", $StagingScript,
    "-Action", "start"
  ) -WorkingDirectory $RepoRoot | Out-Null

  Info "Opening tunnel window..."
  Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-ExecutionPolicy", "Bypass",
    "-File", $TunnelScript
  ) -WorkingDirectory $RepoRoot | Out-Null

  Ok "Staging and tunnel windows launched."
  Write-Host "Wait for staging to report http://localhost:3001, then open https://staging.smartworkshop.me"
}
catch {
  Write-Host ""
  Write-Host "[ERROR] $($_.Exception.Message)"
  exit 1
}
