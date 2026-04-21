$ErrorActionPreference = "Stop"

$RepoRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$stagingEnvFile = Join-Path -Path $RepoRoot -ChildPath ".env.staging"
$container = "smartworkshop_staging_db"
$inFile = Join-Path -Path $RepoRoot -ChildPath "database\staging-backup.sql"

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

function Invoke-DockerMysqlRestore {
  param(
    [string]$User,
    [string]$Password,
    [switch]$UseRoot
  )

  $mysqlArgs = @(
    "exec", "-i",
    "-e", "MYSQL_PWD=$Password",
    $container,
    "mysql", "--binary-mode=1", "--force",
    "-u", $User,
    $dbName
  )

  $psi = New-Object System.Diagnostics.ProcessStartInfo
  $psi.FileName = "docker"
  $psi.Arguments = ($mysqlArgs | ForEach-Object {
    if ($_ -match '\s') { '"' + ($_ -replace '"', '\"') + '"' } else { $_ }
  }) -join ' '
  $psi.UseShellExecute = $false
  $psi.RedirectStandardInput = $true
  $psi.RedirectStandardOutput = $true
  $psi.RedirectStandardError = $true

  $process = New-Object System.Diagnostics.Process
  $process.StartInfo = $psi
  [void]$process.Start()

  $fileStream = [System.IO.File]::OpenRead($inFile)
  try {
    $fileStream.CopyTo($process.StandardInput.BaseStream)
  }
  finally {
    $fileStream.Dispose()
    $process.StandardInput.Close()
  }

  $stdout = $process.StandardOutput.ReadToEnd()
  $stderr = $process.StandardError.ReadToEnd()
  $process.WaitForExit()

  if ($stdout) { Write-Host $stdout.TrimEnd() }
  if ($stderr) { Write-Host $stderr.TrimEnd() }

  return $process.ExitCode
}

$dbName = Get-EnvValue "DB_NAME" "smartworkshop_staging"
$dbUser = Get-EnvValue "DB_USER" "smartworkshop_staging"
$dbPass = Get-EnvValue "DB_PASSWORD" "smartworkshop_staging_password"
$rootPass = Get-EnvValue "DB_ROOT_PASSWORD" "smartworkshop_staging_root_password"

if (-not (Test-Path $inFile)) {
  throw "Backup file not found: $inFile"
}

Write-Host "Restoring staging database '$dbName' from $inFile"

$exitCode = Invoke-DockerMysqlRestore -User $dbUser -Password $dbPass
if ($exitCode -ne 0) {
  Write-Host "User restore failed (exit $exitCode), trying root..."
  $exitCode = Invoke-DockerMysqlRestore -User "root" -Password $rootPass -UseRoot
  if ($exitCode -ne 0) {
    throw "Root restore failed with exit code $exitCode."
  }
}

Write-Host "Staging restore completed."
