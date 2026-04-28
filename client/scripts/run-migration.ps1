# run-migration.ps1
# Executes migrate-tokens.py from the client/ directory
# Usage: cd client && pwsh scripts/run-migration.ps1

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$clientDir = Split-Path -Parent $scriptDir

Push-Location $clientDir

Write-Host "Running design token migration..." -ForegroundColor Cyan
python scripts/migrate-tokens.py

Pop-Location
