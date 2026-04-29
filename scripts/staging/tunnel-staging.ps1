param(
  [string]$Url = "http://localhost:3001",
  [string]$TunnelName = "",
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

  if ($TunnelName) {
    if (-not $ConfigPath) {
      $ConfigPath = Join-Path (Split-Path -Parent (Split-Path -Parent $PSScriptRoot)) ".cloudflared\tunnel.yml"
    }

    if (-not (Test-Path $ConfigPath)) {
      throw "Named tunnel mode needs a config file. Create it first from docs/cloudflared-tunnel.example.yml or point -ConfigPath to your config."
    }

    Info "Opening named Cloudflare Tunnel for staging: $TunnelName"
    Info "Config: $ConfigPath"
    Info "Local staging URL: $Url"

    & cloudflared tunnel --config $ConfigPath run $TunnelName
  } else {
    Info "Opening Cloudflare Tunnel to staging at $Url"
    Info "Keep the staging stack running before starting the tunnel."

    & cloudflared tunnel --url $Url --no-autoupdate
  }

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
