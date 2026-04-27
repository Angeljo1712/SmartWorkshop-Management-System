param(
  [string]$BackupFile = "",
  [string]$VolumeName = ""
)

$ErrorActionPreference = "Stop"
if (Get-Variable -Name PSNativeCommandUseErrorActionPreference -ErrorAction SilentlyContinue) {
  $PSNativeCommandUseErrorActionPreference = $false
}

$RepoRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$stagingEnvFile = Join-Path -Path $RepoRoot -ChildPath ".env.staging"
$container = "smartworkshop_staging_db"
$backupDir = Join-Path -Path $RepoRoot -ChildPath "database"
$stackScript = Join-Path -Path $PSScriptRoot -ChildPath "stack-staging.ps1"

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

function Get-LatestBackupFile {
  if (-not (Test-Path $backupDir)) {
    return $null
  }

  if ($requestedVolumeName -and $requestedVolumeName.Trim() -ne "") {
    $volumePattern = "staging-backup-$($requestedVolumeName.Trim())-*.sql"
    $volumeFiles = Get-ChildItem -Path $backupDir -Filter $volumePattern -File | Sort-Object LastWriteTime -Descending
    if ($volumeFiles.Count -gt 0) {
      return $volumeFiles[0].FullName
    }
  }

  $preferredPattern = "staging-backup-*.sql"
  $files = Get-ChildItem -Path $backupDir -Filter $preferredPattern -File | Sort-Object LastWriteTime -Descending
  if ($files.Count -gt 0) {
    return $files[0].FullName
  }

  $legacyFile = Join-Path -Path $backupDir -ChildPath "staging-backup.sql"
  if (Test-Path $legacyFile) {
    return $legacyFile
  }

  return $null
}

function Ensure-StagingDbContainerRunning {
  if (-not (Get-Command "docker" -ErrorAction SilentlyContinue)) {
    throw "Docker command not found in PATH."
  }

  $runningInspect = (& docker inspect -f "{{.State.Running}}" $container 2>$null)
  $inspectExitCode = $LASTEXITCODE
  $running = ($runningInspect | Select-Object -First 1)
  if ($inspectExitCode -eq 0 -and $running.Trim().ToLowerInvariant() -eq "true") {
    return
  }

  if ($inspectExitCode -eq 0) {
    Write-Host "Container '$container' is stopped. Starting it..."
    docker start $container | Out-Host
    if ($LASTEXITCODE -ne 0) {
      throw "Failed to start container '$container' (exit code $LASTEXITCODE)."
    }
  }
  else {
    if (-not (Test-Path $stackScript)) {
      throw "Staging stack script not found: $stackScript"
    }

    Write-Host "Container '$container' does not exist. Starting staging stack..."
    & $stackScript -Action start | Out-Host
    if ($LASTEXITCODE -ne 0) {
      throw "Failed to start staging stack (exit code $LASTEXITCODE)."
    }
  }

  $runningAfterStartInspect = (& docker inspect -f "{{.State.Running}}" $container 2>$null)
  $inspectAfterStartExitCode = $LASTEXITCODE
  $runningAfterStart = ($runningAfterStartInspect | Select-Object -First 1)
  if ($inspectAfterStartExitCode -ne 0 -or $runningAfterStart.Trim().ToLowerInvariant() -ne "true") {
    throw "Container '$container' is not running after startup."
  }
}

function Wait-ForMysqlReady {
  param(
    [int]$MaxAttempts = 30,
    [int]$DelaySeconds = 2
  )

  for ($i = 1; $i -le $MaxAttempts; $i++) {
    docker exec -e MYSQL_PWD=$dbPass $container mysqladmin ping -h localhost -u $dbUser --silent 2>$null | Out-Null
    if ($LASTEXITCODE -eq 0) {
      return
    }

    docker exec -e MYSQL_PWD=$rootPass $container mysqladmin ping -h localhost -u root --silent 2>$null | Out-Null
    if ($LASTEXITCODE -eq 0) {
      return
    }

    Start-Sleep -Seconds $DelaySeconds
  }

  throw "MySQL in container '$container' did not become ready after $($MaxAttempts * $DelaySeconds) seconds."
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

  $copyException = $null
  $fileStream = [System.IO.File]::OpenRead($inFile)
  try {
    $fileStream.CopyTo($process.StandardInput.BaseStream)
  }
  catch [System.IO.IOException] {
    # The child process may exit early (auth/db errors), which closes stdin.
    # Capture this but continue to read stderr/stdout for the real cause.
    $copyException = $_.Exception
  }
  finally {
    $fileStream.Dispose()
    try { $process.StandardInput.Close() } catch {}
  }

  $stdout = $process.StandardOutput.ReadToEnd()
  $stderr = $process.StandardError.ReadToEnd()
  $process.WaitForExit()

  if ($stdout) { Write-Host $stdout.TrimEnd() }
  if ($stderr) { Write-Host $stderr.TrimEnd() }

  if ($copyException -and $process.ExitCode -eq 0) {
    Write-Host "Restore input stream interrupted: $($copyException.Message)"
    return 1
  }

  return $process.ExitCode
}

$dbName = Get-EnvValue "DB_NAME" "smartworkshop_staging"
$dbUser = Get-EnvValue "DB_USER" "smartworkshop_staging"
$dbPass = Get-EnvValue "DB_PASSWORD" "smartworkshop_staging_password"
$rootPass = Get-EnvValue "DB_ROOT_PASSWORD" "smartworkshop_staging_root_password"
$requestedVolumeName = if ($VolumeName -and $VolumeName.Trim() -ne "") {
  $VolumeName.Trim()
} else {
  Get-EnvValue "STAGING_DB_VOLUME" "db_data_staging"
}

if ($BackupFile -and $BackupFile.Trim() -ne "") {
  $inFile = $BackupFile.Trim()
}
else {
  $inFile = Get-LatestBackupFile
}

if (-not $inFile) {
  throw "Backup file not found in $backupDir"
}

Ensure-StagingDbContainerRunning
Wait-ForMysqlReady

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
