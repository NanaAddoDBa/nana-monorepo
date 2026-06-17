param(
  [string]$BaseSha,
  [string]$HeadSha = "HEAD",
  [string]$App = "changed"
)

$ErrorActionPreference = "Stop"
$allowedRuntimes = @("nodejs", "go")
$configFiles = @(Get-ChildItem -Path "apps/*/pipeline.json" -File)

if ($configFiles.Count -eq 0) {
  Write-Output "[]"
  exit 0
}

$configsByName = @{}

foreach ($configFile in $configFiles) {
  $config = Get-Content -Raw $configFile.FullName | ConvertFrom-Json
  $directoryName = Split-Path $configFile.DirectoryName -Leaf

  foreach ($requiredField in @("name", "runtime", "runtime_version", "service_name", "health_path")) {
    if ([string]::IsNullOrWhiteSpace($config.$requiredField)) {
      throw "$($configFile.FullName) is missing required field: $requiredField"
    }
  }

  if ($config.name -ne $directoryName) {
    throw "$($configFile.FullName) name must match its app directory: $directoryName"
  }

  if ($config.name -notmatch "^[a-z][a-z0-9-]{0,62}$") {
    throw "$($configFile.FullName) name must be a lowercase app identifier."
  }

  if ($config.service_name -notmatch "^[a-z][a-z0-9-]{0,62}$") {
    throw "$($configFile.FullName) service_name must be a valid Cloud Run service name."
  }

  if ($config.runtime_version -notmatch "^[0-9]+(?:\.[0-9]+){0,2}$") {
    throw "$($configFile.FullName) runtime_version must be numeric."
  }

  if ($config.runtime -eq "nodejs" -and $config.package_manager_version -notmatch "^[0-9]+\.[0-9]+\.[0-9]+$") {
    throw "$($configFile.FullName) package_manager_version must be an exact semantic version for Node.js apps."
  }

  if ($config.runtime -notin $allowedRuntimes) {
    throw "$($configFile.FullName) runtime must be one of: $($allowedRuntimes -join ', ')"
  }

  if ($config.health_path -notmatch "^/[A-Za-z0-9._~!$&'()*+,;=:@%/-]*$") {
    throw "$($configFile.FullName) health_path must be a valid absolute URL path."
  }

  if (!(Test-Path "apps/$($config.name)/Makefile")) {
    throw "apps/$($config.name) must provide a Makefile."
  }

  $configsByName[$config.name] = $config
}

function Get-AllConfigs {
  return @($configsByName.Keys | Sort-Object | ForEach-Object { $configsByName[$_] })
}

if ($App -eq "all") {
  $selectedConfigs = Get-AllConfigs
} elseif ($App -ne "changed") {
  if (!$configsByName.ContainsKey($App)) {
    throw "Unknown app '$App'. Add apps/$App/pipeline.json before running it through the pipeline."
  }

  $selectedConfigs = @($configsByName[$App])
} else {
  $invalidBaseSha = [string]::IsNullOrWhiteSpace($BaseSha) -or $BaseSha -match "^0+$"

  if ($invalidBaseSha) {
    $selectedConfigs = Get-AllConfigs
  } else {
    $changedFiles = @(git diff --name-only $BaseSha $HeadSha)

    if ($LASTEXITCODE -ne 0) {
      throw "Unable to determine changed files between $BaseSha and $HeadSha."
    }

    $sharedPathChanged = $changedFiles | Where-Object {
      $_ -match "^(libs/|infra/modules/|infra/scripts/|Makefile$|\.github/workflows/pipeline\.yml$|\.github/scripts/detect-apps\.ps1$)"
    }

    if ($sharedPathChanged) {
      $selectedConfigs = Get-AllConfigs
    } else {
      $changedAppNames = @(
        $changedFiles | ForEach-Object {
          if ($_ -match "^apps/([^/]+)/") {
            $Matches[1]
          } elseif ($_ -match "^infra/deployments/[^/]+/([^/]+)/") {
            $Matches[1]
          }
        } | Where-Object { $configsByName.ContainsKey($_) } | Sort-Object -Unique
      )

      $selectedConfigs = @($changedAppNames | ForEach-Object { $configsByName[$_] })
    }
  }
}

Write-Output (ConvertTo-Json -InputObject @($selectedConfigs) -Compress -Depth 10)
