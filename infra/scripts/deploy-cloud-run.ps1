param(
  [string]$ProjectId,
  [string]$Region,
  [string]$Repository,
  [string]$App,
  [string]$TerraformDirectory,
  [string]$PlanFile = "tfplan"
)

$ErrorActionPreference = "Stop"

function Get-CommandSource {
  param(
    [string]$Name,
    [string]$FallbackPath
  )

  $command = Get-Command $Name -ErrorAction SilentlyContinue

  if ($command) {
    return $command.Source
  }

  if (![string]::IsNullOrWhiteSpace($FallbackPath) -and (Test-Path $FallbackPath)) {
    return $FallbackPath
  }

  throw "$Name was not found. Install $Name and restart your terminal."
}

function Invoke-CommandChecked {
  param(
    [string]$Command,
    [Parameter(ValueFromRemainingArguments = $true)][string[]]$Arguments
  )

  & $Command @Arguments

  if ($LASTEXITCODE -ne 0) {
    throw "Command failed: $Command $($Arguments -join ' ')"
  }
}

function Get-LatestImageDigest {
  $image = "$Region-docker.pkg.dev/$ProjectId/$Repository/$App"
  $tagsJson = (& $script:Gcloud artifacts docker tags list $image `
      --project $ProjectId `
      --format "json")
  $tags = $tagsJson | ConvertFrom-Json
  $latest = $tags | Where-Object { $_.tag -like "*/tags/latest" } | Select-Object -First 1

  if (!$latest) {
    throw "No latest tag found for image: $image"
  }

  $digest = ($latest.version -split "/versions/", 2)[1]

  if ([string]::IsNullOrWhiteSpace($digest)) {
    throw "Could not parse digest from Artifact Registry version: $($latest.version)"
  }

  return "$image@$digest"
}

if ([string]::IsNullOrWhiteSpace($ProjectId)) {
  throw "Missing ProjectId."
}

if ([string]::IsNullOrWhiteSpace($Region)) {
  throw "Missing Region."
}

if ([string]::IsNullOrWhiteSpace($Repository)) {
  throw "Missing Repository."
}

if ([string]::IsNullOrWhiteSpace($App)) {
  throw "Missing App."
}

if ([string]::IsNullOrWhiteSpace($TerraformDirectory)) {
  throw "Missing TerraformDirectory."
}

if (!(Test-Path $TerraformDirectory)) {
  throw "Terraform directory does not exist: $TerraformDirectory"
}

$script:Gcloud = Get-CommandSource `
  -Name "gcloud" `
  -FallbackPath (Join-Path $env:LOCALAPPDATA "Google\Cloud SDK\google-cloud-sdk\bin\gcloud.cmd")

$terraform = Get-CommandSource -Name "terraform" -FallbackPath $null
$image = Get-LatestImageDigest
$imageOverridePath = Join-Path $TerraformDirectory "image.auto.tfvars"

Set-Content -LiteralPath $imageOverridePath -Value "image = `"$image`"" -NoNewline

Write-Host "Deploying image: $image"
Invoke-CommandChecked `
  -Command $terraform `
  -Arguments @("-chdir=$TerraformDirectory", "plan", "-var-file=terraform.tfvars", "-out=$PlanFile")

Invoke-CommandChecked `
  -Command $terraform `
  -Arguments @("-chdir=$TerraformDirectory", "apply", $PlanFile)
