
[CmdletBinding()]
param (
    [Parameter()][Switch] $New,
    [Parameter()][Switch] $Old
)

if (-not($New -or $Old)) {
    $New = $true
    $Old = $true
}

if ($Old) {
    Push-Location
    Set-Location old
    & npx babel --config-file ./babel.config.js --extensions ".ts" ../engine-source --out-dir ../old-out
    Pop-Location
}

if ($New) {
    Push-Location
    Set-Location new
    & npx babel --config-file ./babel.config.js --extensions ".ts" ../engine-source --out-dir ../new-out
    Pop-Location
}
