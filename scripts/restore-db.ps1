$ErrorActionPreference = "Stop"

$dbName = $env:DB_NAME
$dbUser = $env:DB_USER
$dbPass = $env:DB_PASSWORD
$rootPass = $env:DB_ROOT_PASSWORD
$container = "project_uny_db"
$inFile = Join-Path -Path $PSScriptRoot -ChildPath "..\\database\\backup.sql"

if (-not $dbName) { $dbName = "smartworkshop" }
if (-not $dbUser) { $dbUser = "smartworkshop" }
if (-not $dbPass) { $dbPass = "smartworkshop_pass" }
if (-not $rootPass) { $rootPass = "smartworkshop_root" }

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
