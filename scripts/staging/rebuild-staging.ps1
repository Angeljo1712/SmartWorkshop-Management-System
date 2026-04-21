param()

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$StackScript = Join-Path $PSScriptRoot "stack-staging.ps1"

if (-not (Test-Path $StackScript)) {
  throw "staging stack script not found: $StackScript"
}

& $StackScript -Action build
