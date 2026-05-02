param(
  [string]$Url = "http://localhost:3000",
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
    throw "cloudflared is not installed or not in PATH. Install it first from https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/"
  }

  if ($TunnelName) {
    if (-not $ConfigPath) {
      $ConfigPath = Join-Path (Split-Path -Parent (Split-Path -Parent $PSScriptRoot)) ".cloudflared\tunnel.yml"
    }

    if (-not (Test-Path $ConfigPath)) {
      throw "Named tunnel mode needs a config file. Create it first from the example in docs/cloudflared-tunnel.example.yml or point -ConfigPath to your config."
    }

    Info "Opening named Cloudflare Tunnel: $TunnelName"
    Info "Config: $ConfigPath"
    Info "The tunnel hostname must be defined in the config file."
    Info "If you need public links in emails or redirects, set APP_BASE_URL and CORS_ORIGIN to the public hostname in .env before starting the app."

    & cloudflared tunnel --config $ConfigPath run $TunnelName
  } else {
    Info "Opening Cloudflare Tunnel to $Url"
    Info "Keep the app running locally before starting the tunnel."
    Info "If you need public links in emails or redirects, set APP_BASE_URL and CORS_ORIGIN to the tunnel URL in .env before starting the app."

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
