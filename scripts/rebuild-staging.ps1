param()

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$Root = Split-Path -Parent $PSScriptRoot
$StackScript = Join-Path $Root "scripts\stack-staging.ps1"

if (-not (Test-Path $StackScript)) {
  throw "staging stack script not found: $StackScript"
}

& $StackScript -Action build
