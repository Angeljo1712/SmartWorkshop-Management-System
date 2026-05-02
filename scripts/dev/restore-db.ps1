$ErrorActionPreference = "Stop"

$RepoRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$envFile = Join-Path -Path $RepoRoot -ChildPath ".env"
$container = "project_uny_db"
$inFile = Join-Path -Path $RepoRoot -ChildPath "database\\backup.sql"

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
$rootPass = Get-EnvValue "DB_ROOT_PASSWORD" "smartworkshop_root"

if (-not (Test-Path $inFile)) {
  throw "Backup file not found: $inFile"
}

Write-Host "Restoring database '$dbName' from $inFile"

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

Write-Host "Restore completed."
