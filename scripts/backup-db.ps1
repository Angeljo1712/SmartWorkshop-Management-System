$ErrorActionPreference = "Stop"

$dbName = $env:DB_NAME
$dbUser = $env:DB_USER
$dbPass = $env:DB_PASSWORD
$container = "project_uny_db"
$outFile = Join-Path -Path $PSScriptRoot -ChildPath "..\\database\\backup.sql"

if (-not $dbName) { $dbName = "smartworkshop" }
if (-not $dbUser) { $dbUser = "smartworkshop" }
if (-not $dbPass) { $dbPass = "smartworkshop_pass" }

Write-Host "Backing up database '$dbName' to $outFile"

$dumpCmd = "docker exec -i $container mysqldump --no-tablespaces -u $dbUser -p$dbPass $dbName"

Invoke-Expression "$dumpCmd > `"$outFile`""
Write-Host "Backup completed."
