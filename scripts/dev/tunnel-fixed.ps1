param(
  [string]$TunnelName = "smartworkshop-dev",
  [string]$Hostname = "",
  [string]$Url = "http://localhost:3000"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Info($msg) { Write-Host "[INFO] $msg" }
function Ok($msg)   { Write-Host "[ OK ] $msg" }
function Warn($msg) { Write-Host "[WARN] $msg" }

try {
  $cloudflared = Get-Command "cloudflared" -ErrorAction SilentlyContinue
  if (-not $cloudflared) {
    throw "cloudflared is not installed or not in PATH."
  }

  $root = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
  $configDir = Join-Path $root ".cloudflared"
  $configPath = Join-Path $configDir "tunnel.yml"
  $examplePath = Join-Path $root "docs\cloudflared-tunnel.example.yml"

  if (-not (Test-Path $configPath)) {
    Warn "No local tunnel config found at $configPath"
    Info "Create it from the example first:"
    Write-Host "  Copy-Item `"$examplePath`" `"$configPath`""
    Write-Host ""
    Info "Then edit these values:"
    Write-Host "  tunnel: $TunnelName"
    if ($Hostname) {
      Write-Host "  hostname: $Hostname"
    } else {
      Write-Host "  hostname: app.your-domain.com"
    }
    Write-Host "  service: $Url"
    Write-Host ""
    Info "You also need to login and create the tunnel once:"
    Write-Host "  cloudflared tunnel login"
    Write-Host "  cloudflared tunnel create $TunnelName"
    Write-Host "  cloudflared tunnel route dns $TunnelName $($Hostname ? $Hostname : 'app.your-domain.com')"
    exit 0
  }

  Info "Running named tunnel using $configPath"
  Info "Tunnel: $TunnelName"
  Info "Local URL: $Url"
  & cloudflared tunnel --config $configPath run $TunnelName
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
