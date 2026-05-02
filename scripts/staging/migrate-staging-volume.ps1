param(
  [string]$TargetVolumeName = "db_data_staging_v2"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$RepoRoot     = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$EnvFile      = Join-Path $RepoRoot ".env.staging"
$DumpFile     = Join-Path $RepoRoot "database\staging-volume-migration.sql"
$EmptyBoot    = (Resolve-Path (Join-Path $RepoRoot "database\staging-bootstrap-empty.sql")).Path
$StagingStack = Join-Path $PSScriptRoot "stack-staging.ps1"

$SelectedTables = @(
  "service_catalog",
  "service_pricing",
  "users",
  "user_roles",
  "user_profiles",
  "mechanic_profiles",
  "mechanic_qualifications",
  "mechanic_memberships",
  "mechanic_accreditations",
  "mechanic_services_offered",
  "mechanic_services",
  "wallets"
)

function Info($msg) { Write-Host "[INFO] $msg" }
function Ok($msg)   { Write-Host "[ OK ] $msg" }
function Warn($msg) { Write-Host "[WARN] $msg" }

function Assert-FileExists([string]$Path, [string]$Label) {
  if (-not (Test-Path $Path)) { throw "$Label not found: $Path" }
}

function Assert-CommandExists([string]$Command, [string]$Label) {
  if (-not (Get-Command $Command -ErrorAction SilentlyContinue)) {
    throw "$Label command not found in PATH: $Command"
  }
}

function Get-EnvValue([string]$Key, [string]$Default = "") {
  if (-not (Test-Path $EnvFile)) {
    return $Default
  }

  $line = Get-Content $EnvFile | Where-Object {
    $_ -match "^\s*$([regex]::Escape($Key))\s*="
  } | Select-Object -First 1

  if (-not $line) { return $Default }
  return ($line -replace "^\s*$([regex]::Escape($Key))\s*=\s*", "").Trim()
}

function Dump-SelectedTables {
  param(
    [string]$Container,
    [string]$Database,
    [string]$User,
    [string]$Password,
    [string]$Destination
  )

  $tables = $SelectedTables -join " "
  $psi = New-Object System.Diagnostics.ProcessStartInfo
  $psi.FileName = "docker"
  $psi.Arguments = @(
    "exec", "-i",
    "-e", "MYSQL_PWD=$Password",
    $Container,
    "mysqldump", "--no-tablespaces",
    "--single-transaction",
    "--skip-lock-tables",
    "--skip-triggers",
    "--no-create-info",
    "--insert-ignore",
    "--hex-blob",
    "-u", $User,
    $Database
  ) -join ' '
  $psi.UseShellExecute = $false
  $psi.RedirectStandardOutput = $true
  $psi.RedirectStandardError = $true

  $process = New-Object System.Diagnostics.Process
  $process.StartInfo = $psi
  [void]$process.Start()

  $fileStream = [System.IO.File]::Open($Destination, [System.IO.FileMode]::Create, [System.IO.FileAccess]::Write, [System.IO.FileShare]::None)
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
    throw "Failed to dump selected tables."
  }
}

function Invoke-DockerMysqlImport {
  param(
    [string]$Container,
    [string]$Database,
    [string]$User,
    [string]$Password,
    [string]$InputFile
  )

  $psi = New-Object System.Diagnostics.ProcessStartInfo
  $psi.FileName = "docker"
  $psi.Arguments = @(
    "exec", "-i",
    "-e", "MYSQL_PWD=$Password",
    $Container,
    "mysql", "--binary-mode=1", "--force",
    "-u", $User,
    $Database
  ) -join ' '
  $psi.UseShellExecute = $false
  $psi.RedirectStandardInput = $true
  $psi.RedirectStandardOutput = $true
  $psi.RedirectStandardError = $true

  $process = New-Object System.Diagnostics.Process
  $process.StartInfo = $psi
  [void]$process.Start()

  $fileStream = [System.IO.File]::OpenRead($InputFile)
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

Assert-FileExists $EnvFile "staging env file"
Assert-FileExists $StagingStack "staging stack script"
Assert-CommandExists "docker" "Docker"

$dbName = Get-EnvValue "DB_NAME" "smartworkshop_staging"
$dbUser = Get-EnvValue "DB_USER" "smartworkshop_staging"
$dbPass = Get-EnvValue "DB_PASSWORD" "smartworkshop_staging_password"

try {
  Info "Dumping preserved tables from the current staging stack..."
  $env:STAGING_DB_VOLUME = "db_data_staging"
  $env:STAGING_BOOTSTRAP_FILE = $EmptyBoot
  Dump-SelectedTables -Container "smartworkshop_staging_db" -Database $dbName -User $dbUser -Password $dbPass -Destination $DumpFile

  Info "Stopping the current staging stack..."
  & $StagingStack -Action stop | Out-Host
  if ($LASTEXITCODE -ne 0) {
    throw "Failed to stop the current staging stack."
  }

  docker volume inspect $TargetVolumeName | Out-Null
  if ($LASTEXITCODE -eq 0) {
    Info "Removing previous target volume '$TargetVolumeName' before creating the new one."
    docker volume rm $TargetVolumeName | Out-Host
    if ($LASTEXITCODE -ne 0) {
      throw "Failed to remove the previous target volume."
    }
  }

  Info "Starting staging on the new volume '$TargetVolumeName' without bootstrap data..."
  $env:STAGING_DB_VOLUME = $TargetVolumeName
  $env:STAGING_BOOTSTRAP_FILE = $EmptyBoot
  & $StagingStack -Action start | Out-Host
  if ($LASTEXITCODE -ne 0) {
    throw "Failed to start staging on the new volume."
  }

  Info "Importing the preserved data into the new staging database..."
  $exitCode = Invoke-DockerMysqlImport -Container "smartworkshop_staging_db" -Database $dbName -User $dbUser -Password $dbPass -InputFile $DumpFile
  if ($exitCode -ne 0) {
    throw "Import into the new staging database failed with exit code $exitCode."
  }

  Ok "Migration completed. Staging is now using '$TargetVolumeName'."
  Write-Host ""
  Write-Host "Staging app:       http://localhost:3001"
  Write-Host "Staging phpMyAdmin: http://localhost:8082"
}
catch {
  Write-Host ""
  Write-Host "[ERROR] $($_.Exception.Message)"
  exit 1
}
