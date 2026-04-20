$ErrorActionPreference = "Stop"

$stagingEnvFile = Join-Path -Path $PSScriptRoot -ChildPath "..\.env.staging"
$container = "smartworkshop_staging_db"
$inFile = Join-Path -Path $PSScriptRoot -ChildPath "..\database\staging-backup.sql"

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
$rootPass = Get-EnvValue "DB_ROOT_PASSWORD" "smartworkshop_staging_root_password"

if (-not (Test-Path $inFile)) {
  throw "Backup file not found: $inFile"
}

Write-Host "Restoring staging database '$dbName' from $inFile"

# Stream file content into the mysql client inside the container.
# Use cmd redirection to preserve binary data in the dump.
$cmdLine = "docker exec -i $container mysql -u $dbUser -p$dbPass $dbName < `"$inFile`""
cmd /c $cmdLine
if ($LASTEXITCODE -ne 0) {
  Write-Host "User restore failed (exit $LASTEXITCODE), trying root..."
  $cmdLine = "docker exec -i $container mysql -u root -p$rootPass $dbName < `"$inFile`""
  cmd /c $cmdLine
  if ($LASTEXITCODE -ne 0) {
    throw "Root restore failed with exit code $LASTEXITCODE."
  }
}

Write-Host "Staging restore completed."
