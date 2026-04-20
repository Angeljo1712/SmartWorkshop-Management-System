$ErrorActionPreference = "Stop"

$envFile = Join-Path -Path $PSScriptRoot -ChildPath "..\.env"
$container = "project_uny_db"
$outFile = Join-Path -Path $PSScriptRoot -ChildPath "..\\database\\backup.sql"

function Get-EnvValue([string]$Key, [string]$Default = "") {
  if (-not (Test-Path $envFile)) {
    return $Default
  }

  $line = Get-Content $envFile | Where-Object {
    $_ -match "^\s*$([regex]::Escape($Key))\s*="
  } | Select-Object -First 1

  if (-not $line) { return $Default }
  return ($line -replace "^\s*$([regex]::Escape($Key))\s*=\s*", "").Trim()
}

$dbName = Get-EnvValue "DB_NAME" "smartworkshop"
$dbUser = Get-EnvValue "DB_USER" "smartworkshop"
$dbPass = Get-EnvValue "DB_PASSWORD" "smartworkshop_pass"

Write-Host "Backing up database '$dbName' to $outFile"

$dumpCmd = "docker exec -i $container mysqldump --no-tablespaces -u $dbUser -p$dbPass $dbName"

Invoke-Expression "$dumpCmd > `"$outFile`""
Write-Host "Backup completed."
