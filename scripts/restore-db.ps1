$ErrorActionPreference = "Stop"

$dbName = $env:DB_NAME
$dbUser = $env:DB_USER
$dbPass = $env:DB_PASSWORD
$container = "project_uny_db"
$inFile = Join-Path -Path $PSScriptRoot -ChildPath "..\\database\\backup.sql"

if (-not $dbName) { $dbName = "smartworkshop" }
if (-not $dbUser) { $dbUser = "smartworkshop" }
if (-not $dbPass) { $dbPass = "smartworkshop_pass" }

if (-not (Test-Path $inFile)) {
  throw "Backup file not found: $inFile"
}

Write-Host "Restoring database '$dbName' from $inFile"

$restoreCmd = "docker exec -i $container mysql -u $dbUser -p$dbPass $dbName"
Invoke-Expression "`"$inFile`" | $restoreCmd"

Write-Host "Restore completed."
