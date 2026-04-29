param(
  [string]$TunnelName = "smartworkshop-staging",
  [string]$ConfigPath = ""
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Info($msg) { Write-Host "[INFO] $msg" }
function Ok($msg)   { Write-Host "[ OK ] $msg" }

try {
  $cloudflared = Get-Command "cloudflared" -ErrorAction SilentlyContinue
  if (-not $cloudflared) {
    throw "cloudflared is not installed or not in PATH. Install it first from https://developers.cloudflare.com/tunnel/downloads/"
  }

  if (-not $ConfigPath) {
    $ConfigPath = Join-Path $env:USERPROFILE ".cloudflared\tunnel.yml"
  }

  if (-not (Test-Path $ConfigPath)) {
    throw "Cloudflare Tunnel config not found at $ConfigPath"
  }

  Info "Starting named Cloudflare Tunnel..."
  Info "Tunnel: $TunnelName"
  Info "Config: $ConfigPath"
  Info "Local origin: http://localhost:3001"
  Info "Public hostname: staging.smartworkshop.me"

  & cloudflared tunnel --config $ConfigPath run $TunnelName

  if ($LASTEXITCODE -ne 0) {
    throw "cloudflared exited with code $LASTEXITCODE"
  }

  Ok "Tunnel closed."
}
catch {
  Write-Host ""
  Write-Host "[ERROR] $($_.Exception.Message)"
  exit 1
}
