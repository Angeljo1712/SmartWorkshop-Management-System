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

$psi = New-Object System.Diagnostics.ProcessStartInfo
$psi.FileName = "docker"
$psi.Arguments = @(
  "exec", "-i",
  "-e", "MYSQL_PWD=$dbPass",
  $container,
  "mysqldump", "--no-tablespaces",
  "-u", $dbUser,
  $dbName
) -join ' '
$psi.UseShellExecute = $false
$psi.RedirectStandardOutput = $true
$psi.RedirectStandardError = $true

$process = New-Object System.Diagnostics.Process
$process.StartInfo = $psi
[void]$process.Start()

$fileStream = [System.IO.File]::Open($outFile, [System.IO.FileMode]::Create, [System.IO.FileAccess]::Write, [System.IO.FileShare]::None)
try {
  $process.StandardOutput.BaseStream.CopyTo($fileStream)
}
finally {
  $fileStream.Dispose()
}

$stderr = $process.StandardError.ReadToEnd()
$process.WaitForExit()

if ($stderr) { Write-Host $stderr.TrimEnd() }
if ($process.ExitCode -ne 0) {
  throw "Backup failed with exit code $($process.ExitCode)."
}

Write-Host "Staging backup completed."
