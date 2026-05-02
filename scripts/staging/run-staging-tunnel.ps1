param(
  [string]$TunnelName = "smartworkshop-staging",
  [string]$ConfigPath = ""
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Info($msg) { Write-Host "[INFO] $msg" }
function Ok($msg)   { Write-Host "[ OK ] $msg" }

function Resolve-CredentialPathInConfig([string]$Path) {
  $raw = Get-Content -LiteralPath $Path -Raw
  $match = [regex]::Match($raw, '(?im)^\s*credentials-file:\s*(.+?)\s*$')
  if (-not $match.Success) {
    return @{ Path = $Path; Changed = $false }
  }

  $originalCredentialPath = $match.Groups[1].Value.Trim().Trim('"')
  if (Test-Path -LiteralPath $originalCredentialPath) {
    return @{ Path = $Path; Changed = $false }
  }

  $credentialFileName = Split-Path -Leaf $originalCredentialPath
  $candidatePath = Join-Path (Join-Path $env:USERPROFILE ".cloudflared") $credentialFileName
  if (-not (Test-Path -LiteralPath $candidatePath)) {
    throw "Tunnel credentials file '$originalCredentialPath' doesn't exist. Also tried '$candidatePath' and it was not found."
  }

  $escapedOriginal = [regex]::Escape($originalCredentialPath)
  $fixedConfig = [regex]::Replace($raw, "(?im)^(\s*credentials-file:\s*)$escapedOriginal(\s*)$", "`$1$candidatePath`$2")
  if ($fixedConfig -eq $raw) {
    return @{ Path = $Path; Changed = $false }
  }

  $tempConfigPath = Join-Path $env:TEMP "cloudflared-staging-$([Guid]::NewGuid().ToString('N')).yml"
  Set-Content -LiteralPath $tempConfigPath -Value $fixedConfig -Encoding UTF8
  Info "credentials-file path adjusted for this user profile: $candidatePath"
  return @{ Path = $tempConfigPath; Changed = $true }
}

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

  $resolvedConfig = Resolve-CredentialPathInConfig -Path $ConfigPath
  $runConfigPath = $resolvedConfig.Path

  Info "Starting named Cloudflare Tunnel..."
  Info "Tunnel: $TunnelName"
  Info "Config: $runConfigPath"
  Info "Local origin: http://localhost:3001"
  Info "Public hostname: staging.smartworkshop.me"

  & cloudflared tunnel --config $runConfigPath run $TunnelName

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
