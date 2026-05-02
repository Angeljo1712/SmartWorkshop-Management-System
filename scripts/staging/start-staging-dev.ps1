Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$PreviousVolume = $env:STAGING_DB_VOLUME

try {
  $env:STAGING_DB_VOLUME = "db_data_staging_v2"
  & (Join-Path $PSScriptRoot "stack-staging.ps1") -Action start
}
finally {
  if ($null -ne $PreviousVolume -and $PreviousVolume -ne "") {
    $env:STAGING_DB_VOLUME = $PreviousVolume
  }
  else {
    Remove-Item Env:STAGING_DB_VOLUME -ErrorAction SilentlyContinue
  }
}
