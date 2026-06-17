param(
  [string]$InfraDirectory = "infra"
)

$ErrorActionPreference = "Stop"

function Invoke-Terraform {
  param([Parameter(ValueFromRemainingArguments = $true)][string[]]$Arguments)

  & $script:Terraform @Arguments

  if ($LASTEXITCODE -ne 0) {
    throw "Terraform command failed: terraform $($Arguments -join ' ')"
  }
}

$terraformCommand = Get-Command terraform -ErrorAction SilentlyContinue

if (!$terraformCommand) {
  throw "terraform was not found. Install Terraform and restart your terminal."
}

if (!(Test-Path $InfraDirectory)) {
  throw "Infrastructure directory does not exist: $InfraDirectory"
}

$script:Terraform = $terraformCommand.Source
$deploymentDirectory = Join-Path $InfraDirectory "deployments"
$deploymentRoots = @(
  Get-ChildItem -Path $deploymentDirectory -Directory | ForEach-Object {
    Get-ChildItem -Path $_.FullName -Directory | Where-Object {
      Test-Path (Join-Path $_.FullName "versions.tf")
    }
  }
)

if ($deploymentRoots.Count -eq 0) {
  throw "No Terraform deployment roots found under $deploymentDirectory."
}

Write-Host "Checking Terraform formatting..."
Invoke-Terraform fmt -check -recursive $InfraDirectory

foreach ($deploymentRoot in $deploymentRoots) {
  Write-Host "Initializing $($deploymentRoot.FullName) without a backend..."
  Invoke-Terraform "-chdir=$($deploymentRoot.FullName)" init -backend=false -input=false -no-color

  Write-Host "Validating $($deploymentRoot.FullName)..."
  Invoke-Terraform "-chdir=$($deploymentRoot.FullName)" validate -no-color
}
