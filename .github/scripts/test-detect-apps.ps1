$ErrorActionPreference = "Stop"
$detector = Join-Path $PSScriptRoot "detect-apps.ps1"
$temporaryRoot = [IO.Path]::GetFullPath([IO.Path]::GetTempPath())
$fixture = Join-Path $temporaryRoot ("detect-apps-" + [Guid]::NewGuid().ToString("N"))
New-Item -ItemType Directory -Path $fixture | Out-Null

function Invoke-TestGit {
  & git @args | Out-Null
  if ($LASTEXITCODE -ne 0) { throw "Git fixture command failed: $($args[0])" }
}

function Assert-Detection {
  param(
    [string]$ChangedPath,
    [string[]]$ExpectedApps,
    [string[]]$ExpectedDeployApps = @(),
    [bool]$ExpectedInfra = $false
  )

  $base = git rev-parse HEAD
  $parent = Split-Path $ChangedPath -Parent
  if ($parent) { New-Item -ItemType Directory -Path $parent -Force | Out-Null }
  Add-Content -LiteralPath $ChangedPath -Value "fixture change"
  Invoke-TestGit add -- $ChangedPath
  Invoke-TestGit commit -qm "test: update fixture path"

  $result = & $detector -BaseSha $base -HeadSha HEAD -IncludeMetadata | ConvertFrom-Json
  $actualApps = @($result.apps | ForEach-Object { $_.name }) -join ","
  $actualDeploy = @($result.deploy_apps | ForEach-Object { $_.name }) -join ","
  if ($actualApps -ne (($ExpectedApps | Sort-Object) -join ",") -or
      $actualDeploy -ne (($ExpectedDeployApps | Sort-Object) -join ",") -or
      $result.infra_changed -ne $ExpectedInfra) {
    throw "Unexpected selection for ${ChangedPath}: $($result | ConvertTo-Json -Compress -Depth 10)"
  }
  Write-Output "PASS: $ChangedPath"
}

Push-Location $fixture
try {
  Invoke-TestGit init -q -b main
  Invoke-TestGit config user.name NanaAddoDBA
  Invoke-TestGit config user.email nanaaddoldoe@gmail.com
  Invoke-TestGit config commit.gpgsign false
  foreach ($name in @("nana-portfolio", "rent-car", "rent-car-api")) {
    $directory = "apps/$name"
    New-Item -ItemType Directory -Path $directory | Out-Null
    $config = @{
      name = $name
      runtime = "nodejs"
      runtime_version = "22"
      package_manager = "npm"
      lockfile = "package-lock.json"
      deploy_enabled = ($name -eq "nana-portfolio")
      service_name = $name
      health_path = "/api/health"
    }
    $config | ConvertTo-Json | Set-Content "$directory/pipeline.json"
    Set-Content "$directory/Makefile" "# test fixture"
  }
  Invoke-TestGit add .
  Invoke-TestGit commit -qm "test: create application fixtures"

  Assert-Detection "docs/setup.md" @()
  Assert-Detection "packages/rental-contracts/src/index.ts" @("rent-car", "rent-car-api")
  Assert-Detection "apps/rent-car/src/index.ts" @("rent-car")
  Assert-Detection "apps/nana-portfolio/app/page.tsx" @("nana-portfolio") @("nana-portfolio")
  Assert-Detection "infra/deployments/prod/nana-portfolio/main.tf" @("nana-portfolio") @("nana-portfolio") $true
  Assert-Detection "libs/nodejs/Makefile" @("nana-portfolio", "rent-car", "rent-car-api") @("nana-portfolio")
  Assert-Detection ".github/workflows/pipeline.yml" @("nana-portfolio", "rent-car", "rent-car-api") @("nana-portfolio") $true
} finally {
  Pop-Location
  $resolvedFixture = [IO.Path]::GetFullPath($fixture)
  if ([IO.Path]::GetDirectoryName($resolvedFixture).TrimEnd([IO.Path]::DirectorySeparatorChar) -ne
      $temporaryRoot.TrimEnd([IO.Path]::DirectorySeparatorChar) -or
      [IO.Path]::GetFileName($resolvedFixture) -notlike "detect-apps-*") {
    throw "Refusing to remove a fixture outside the temporary directory."
  }
  Remove-Item -LiteralPath $resolvedFixture -Recurse -Force
}
