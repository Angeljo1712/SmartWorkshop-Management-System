$ErrorActionPreference = "Stop"

$RepoRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$stagingEnvFile = Join-Path -Path $RepoRoot -ChildPath ".env.staging"
$container = "smartworkshop_staging_db"
$outFile = Join-Path -Path $RepoRoot -ChildPath "database\staging-backup.sql"

function Get-EnvValue([string]$Key, [string]$Default = "") {
  if (-not (Test-Path $stagingEnvFile)) {
    return $Default
  }

  $line = Get-Content $stagingEnvFile | Where-Object {
    $_ -match "^\s*$([regex]::Escape($Key))\s*="
  } | Select-Object -First 1

  if (-not $line) { return $Default }
  return ($line -replace "^\s*$([regex]::Escape($Key))\s*=\s*", "").Trim()
}

$dbName = Get-EnvValue "DB_NAME" "smartworkshop_staging"
$dbUser = Get-EnvValue "DB_USER" "smartworkshop_staging"
$dbPass = Get-EnvValue "DB_PASSWORD" "smartworkshop_staging_password"

Write-Host "Backing up staging database '$dbName' to $outFile"

$dumpCmd = "docker exec -i $container mysqldump --no-tablespaces -u $dbUser -p$dbPass $dbName"

Invoke-Expression "$dumpCmd > `"$outFile`""
Write-Host "Staging backup completed."
