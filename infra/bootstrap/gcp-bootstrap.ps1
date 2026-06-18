param(
  [string]$ConfigPath = "infra/bootstrap/gcp-bootstrap.env",
  [ValidateSet(
    "all",
    "enable-apis",
    "state-bucket",
    "artifact-registry",
    "service-accounts",
    "iam-least-privilege",
    "iam-cleanup",
    "workload-identity",
    "print-github-secrets"
  )]
  [string]$Step = "all",
  [switch]$ConfirmIamCleanup
)

$ErrorActionPreference = "Stop"

function Get-GcloudCommand {
  $command = Get-Command gcloud -ErrorAction SilentlyContinue

  if ($command) {
    return $command.Source
  }

  $localCommand = Join-Path $env:LOCALAPPDATA "Google\Cloud SDK\google-cloud-sdk\bin\gcloud.cmd"

  if (Test-Path $localCommand) {
    return $localCommand
  }

  throw "gcloud was not found. Install Google Cloud CLI and restart your terminal."
}

function Read-BootstrapConfig {
  param([string]$Path)

  if (!(Test-Path $Path)) {
    throw "Config file not found: $Path. Copy infra/bootstrap/gcp-bootstrap.env.example to $Path first."
  }

  $config = @{}

  Get-Content $Path | ForEach-Object {
    $line = $_.Trim()

    if (!$line -or $line.StartsWith("#")) {
      return
    }

    $parts = $line -split "=", 2

    if ($parts.Length -ne 2) {
      throw "Invalid config line: $line"
    }

    $config[$parts[0].Trim()] = $parts[1].Trim()
  }

  return $config
}

function Get-RequiredConfig {
  param(
    [hashtable]$Config,
    [string]$Name
  )

  if (!$Config.ContainsKey($Name) -or [string]::IsNullOrWhiteSpace($Config[$Name])) {
    throw "Missing required config value: $Name"
  }

  return $Config[$Name]
}

function Get-OptionalConfig {
  param(
    [hashtable]$Config,
    [string]$Name,
    [string]$DefaultValue
  )

  if (!$Config.ContainsKey($Name) -or [string]::IsNullOrWhiteSpace($Config[$Name])) {
    return $DefaultValue
  }

  return $Config[$Name]
}

function Invoke-Gcloud {
  param([Parameter(ValueFromRemainingArguments = $true)][string[]]$Arguments)

  & $script:Gcloud @Arguments

  if ($LASTEXITCODE -ne 0) {
    throw "gcloud command failed: gcloud $($Arguments -join ' ')"
  }
}

function Test-GcloudResource {
  param([Parameter(ValueFromRemainingArguments = $true)][string[]]$Arguments)

  try {
    $previousErrorActionPreference = $ErrorActionPreference
    $ErrorActionPreference = "Continue"
    & $script:Gcloud @Arguments *> $null
  } catch {
    return $false
  } finally {
    $ErrorActionPreference = $previousErrorActionPreference
  }

  return $LASTEXITCODE -eq 0
}

function Enable-RequiredApis {
  Write-Host "Enabling required Google Cloud APIs..."

  Invoke-Gcloud services enable `
    run.googleapis.com `
    cloudbuild.googleapis.com `
    artifactregistry.googleapis.com `
    secretmanager.googleapis.com `
    iamcredentials.googleapis.com `
    sts.googleapis.com `
    --project $script:ProjectId
}

function Ensure-StateBucket {
  $bucketUri = "gs://$script:StateBucket"

  if (Test-GcloudResource storage buckets describe $bucketUri) {
    Write-Host "Terraform state bucket already exists: $bucketUri"
  } else {
    Write-Host "Creating Terraform state bucket: $bucketUri"
    Invoke-Gcloud storage buckets create $bucketUri `
      --project $script:ProjectId `
      --location $script:Region `
      --uniform-bucket-level-access
  }

  Write-Host "Enabling versioning on Terraform state bucket..."
  Invoke-Gcloud storage buckets update $bucketUri --versioning
}

function Ensure-ArtifactRegistry {
  if (Test-GcloudResource artifacts repositories describe $script:ArtifactRepository --location $script:Region --project $script:ProjectId) {
    Write-Host "Artifact Registry repository already exists: $script:ArtifactRepository"
    return
  }

  Write-Host "Creating Artifact Registry repository: $script:ArtifactRepository"
  Invoke-Gcloud artifacts repositories create $script:ArtifactRepository `
    --repository-format docker `
    --location $script:Region `
    --project $script:ProjectId `
    --description "Application container images"
}

function Ensure-ServiceAccount {
  param(
    [string]$AccountId,
    [string]$DisplayName
  )

  $email = "$AccountId@$script:ProjectId.iam.gserviceaccount.com"

  if (Test-GcloudResource iam service-accounts describe $email --project $script:ProjectId) {
    Write-Host "Service account already exists: $email"
    return $email
  }

  Write-Host "Creating service account: $email"
  Invoke-Gcloud iam service-accounts create $AccountId `
    --display-name $DisplayName `
    --project $script:ProjectId

  return $email
}

function Add-ProjectIamBinding {
  param(
    [string]$Member,
    [string]$Role
  )

  Write-Host "Granting $Role to $Member"
  Invoke-Gcloud projects add-iam-policy-binding $script:ProjectId `
    --member $Member `
    --role $Role `
    --quiet
}

function Test-ProjectIamBinding {
  param(
    [string]$Member,
    [string]$Role
  )

  $result = (& $script:Gcloud projects get-iam-policy $script:ProjectId `
      --flatten "bindings[].members" `
      --filter "bindings.role=$Role AND bindings.members=$Member" `
      --format "value(bindings.role)").Trim()

  return ![string]::IsNullOrWhiteSpace($result)
}

function Remove-ProjectIamBinding {
  param(
    [string]$Member,
    [string]$Role
  )

  if (!(Test-ProjectIamBinding -Member $Member -Role $Role)) {
    Write-Host "Project IAM binding already absent: $Role for $Member"
    return
  }

  Write-Host "Removing project IAM binding: $Role from $Member"
  Invoke-Gcloud projects remove-iam-policy-binding $script:ProjectId `
    --member $Member `
    --role $Role `
    --quiet
}

function Ensure-TerraformCustomRole {
  $permissions = @(
    "resourcemanager.projects.get",
    "secretmanager.secrets.get",
    "secretmanager.secrets.getIamPolicy",
    "secretmanager.secrets.setIamPolicy"
  ) -join ","

  if (Test-GcloudResource iam roles describe $script:TerraformCustomRoleId --project $script:ProjectId) {
    Write-Host "Updating Terraform custom role: $script:TerraformCustomRoleId"
    Invoke-Gcloud iam roles update $script:TerraformCustomRoleId `
      --project $script:ProjectId `
      --title "Terraform Cloud Run manager" `
      --description "Read project metadata and manage IAM on application secrets." `
      --permissions $permissions `
      --stage GA
  } else {
    Write-Host "Creating Terraform custom role: $script:TerraformCustomRoleId"
    Invoke-Gcloud iam roles create $script:TerraformCustomRoleId `
      --project $script:ProjectId `
      --title "Terraform Cloud Run manager" `
      --description "Read project metadata and manage IAM on application secrets." `
      --permissions $permissions `
      --stage GA
  }
}

function Add-BucketIamBinding {
  param(
    [string]$Member,
    [string]$Role
  )

  Write-Host "Granting $Role on gs://$script:StateBucket to $Member"
  Invoke-Gcloud storage buckets add-iam-policy-binding "gs://$script:StateBucket" `
    --member $Member `
    --role $Role `
    --quiet
}

function Add-ArtifactRepositoryIamBinding {
  param(
    [string]$Member,
    [string]$Role
  )

  Write-Host "Granting $Role on Artifact Registry repository $script:ArtifactRepository to $Member"
  Invoke-Gcloud artifacts repositories add-iam-policy-binding $script:ArtifactRepository `
    --location $script:Region `
    --project $script:ProjectId `
    --member $Member `
    --role $Role `
    --quiet
}

function Ensure-ServiceAccounts {
  $terraformEmail = Ensure-ServiceAccount `
    -AccountId $script:TerraformServiceAccountId `
    -DisplayName "Terraform deployer"

  $deployEmail = Ensure-ServiceAccount `
    -AccountId $script:DeployServiceAccountId `
    -DisplayName "GitHub Cloud Run deployer"

  $terraformMember = "serviceAccount:$terraformEmail"
  $deployMember = "serviceAccount:$deployEmail"
  $terraformCustomRole = "projects/$script:ProjectId/roles/$script:TerraformCustomRoleId"

  Ensure-TerraformCustomRole

  Add-ProjectIamBinding -Member $terraformMember -Role "roles/run.admin"
  Add-ProjectIamBinding -Member $terraformMember -Role "roles/iam.serviceAccountAdmin"
  Add-ProjectIamBinding -Member $terraformMember -Role $terraformCustomRole
  Add-BucketIamBinding -Member $terraformMember -Role "roles/storage.objectAdmin"
  Add-ArtifactRepositoryIamBinding -Member $terraformMember -Role "roles/artifactregistry.reader"

  Add-ProjectIamBinding -Member "serviceAccount:$deployEmail" -Role "roles/run.developer"
  Add-ArtifactRepositoryIamBinding -Member $deployMember -Role "roles/artifactregistry.writer"
}

function Assert-RuntimeServiceAccountBindings {
  $runtimeAccounts = @(& $script:Gcloud iam service-accounts list `
      --project $script:ProjectId `
      --filter "email~-runtime@" `
      --format "value(email)" | Where-Object { ![string]::IsNullOrWhiteSpace($_) })

  if ($runtimeAccounts.Count -eq 0) {
    throw "No runtime service accounts were found. Apply Terraform before IAM cleanup."
  }

  $requiredMembers = @(
    "serviceAccount:$script:TerraformServiceAccountId@$script:ProjectId.iam.gserviceaccount.com",
    "serviceAccount:$script:DeployServiceAccountId@$script:ProjectId.iam.gserviceaccount.com"
  )

  foreach ($runtimeAccount in $runtimeAccounts) {
    foreach ($member in $requiredMembers) {
      $binding = (& $script:Gcloud iam service-accounts get-iam-policy $runtimeAccount `
          --project $script:ProjectId `
          --flatten "bindings[].members" `
          --filter "bindings.role=roles/iam.serviceAccountUser AND bindings.members=$member" `
          --format "value(bindings.role)").Trim()

      if ([string]::IsNullOrWhiteSpace($binding)) {
        throw "$runtimeAccount is missing roles/iam.serviceAccountUser for $member. Apply Terraform before IAM cleanup."
      }
    }
  }
}

function Remove-LegacyBroadIam {
  if (!$ConfirmIamCleanup) {
    throw "IAM cleanup requires -ConfirmIamCleanup after Terraform apply and deployment verification."
  }

  Ensure-ServiceAccounts
  Assert-RuntimeServiceAccountBindings

  $terraformMember = "serviceAccount:$script:TerraformServiceAccountId@$script:ProjectId.iam.gserviceaccount.com"
  $deployMember = "serviceAccount:$script:DeployServiceAccountId@$script:ProjectId.iam.gserviceaccount.com"

  Remove-ProjectIamBinding -Member $terraformMember -Role "roles/editor"
  Remove-ProjectIamBinding -Member $deployMember -Role "roles/artifactregistry.writer"
  Remove-ProjectIamBinding -Member $deployMember -Role "roles/iam.serviceAccountUser"
}

function Ensure-WorkloadIdentity {
  if (Test-GcloudResource iam workload-identity-pools describe $script:WifPoolId --location global --project $script:ProjectId) {
    Write-Host "Workload Identity Pool already exists: $script:WifPoolId"
  } else {
    Write-Host "Creating Workload Identity Pool: $script:WifPoolId"
    Invoke-Gcloud iam workload-identity-pools create $script:WifPoolId `
      --location global `
      --display-name "GitHub Actions" `
      --project $script:ProjectId
  }

  $attributeMapping = "google.subject=assertion.sub,attribute.actor=assertion.actor,attribute.repository=assertion.repository,attribute.ref=assertion.ref"
  $attributeCondition = "assertion.repository == '$script:GithubRepository' && assertion.ref == 'refs/heads/$script:GithubDeployBranch'"

  if (Test-GcloudResource iam workload-identity-pools providers describe $script:WifProviderId --location global --workload-identity-pool $script:WifPoolId --project $script:ProjectId) {
    Write-Host "Updating Workload Identity Provider: $script:WifProviderId"
    Invoke-Gcloud iam workload-identity-pools providers update-oidc $script:WifProviderId `
      --location global `
      --workload-identity-pool $script:WifPoolId `
      --attribute-mapping $attributeMapping `
      --attribute-condition $attributeCondition `
      --project $script:ProjectId
  } else {
    Write-Host "Creating Workload Identity Provider: $script:WifProviderId"
    Invoke-Gcloud iam workload-identity-pools providers create-oidc $script:WifProviderId `
      --location global `
      --workload-identity-pool $script:WifPoolId `
      --display-name "GitHub" `
      --attribute-mapping $attributeMapping `
      --attribute-condition $attributeCondition `
      --issuer-uri "https://token.actions.githubusercontent.com" `
      --project $script:ProjectId
  }

  $projectNumber = (& $script:Gcloud projects describe $script:ProjectId --format "value(projectNumber)").Trim()
  $principal = "principalSet://iam.googleapis.com/projects/$projectNumber/locations/global/workloadIdentityPools/$script:WifPoolId/attribute.repository/$script:GithubRepository"

  foreach ($accountId in @($script:TerraformServiceAccountId, $script:DeployServiceAccountId)) {
    $email = "$accountId@$script:ProjectId.iam.gserviceaccount.com"
    Write-Host "Allowing GitHub repository to impersonate $email"
    Invoke-Gcloud iam service-accounts add-iam-policy-binding $email `
      --project $script:ProjectId `
      --role "roles/iam.workloadIdentityUser" `
      --member $principal
  }
}

function Write-GithubSecrets {
  $providerName = (& $script:Gcloud iam workload-identity-pools providers describe $script:WifProviderId `
      --location global `
      --workload-identity-pool $script:WifPoolId `
      --project $script:ProjectId `
      --format "value(name)").Trim()

  Write-Host ""
  Write-Host "Add these GitHub repository secrets:"
  Write-Host "GCP_WORKLOAD_IDENTITY_PROVIDER=$providerName"
  Write-Host "GCP_TERRAFORM_SERVICE_ACCOUNT=$script:TerraformServiceAccountId@$script:ProjectId.iam.gserviceaccount.com"
  Write-Host "GCP_DEPLOY_SERVICE_ACCOUNT=$script:DeployServiceAccountId@$script:ProjectId.iam.gserviceaccount.com"
}

$script:Gcloud = Get-GcloudCommand
$config = Read-BootstrapConfig -Path $ConfigPath

$script:ProjectId = Get-RequiredConfig -Config $config -Name "GCP_PROJECT_ID"
$script:Region = Get-RequiredConfig -Config $config -Name "GCP_REGION"
$script:StateBucket = Get-RequiredConfig -Config $config -Name "TF_STATE_BUCKET"
$script:ArtifactRepository = Get-RequiredConfig -Config $config -Name "ARTIFACT_REGISTRY_REPOSITORY"
$script:GithubRepository = Get-RequiredConfig -Config $config -Name "GITHUB_REPOSITORY"
$script:GithubDeployBranch = Get-OptionalConfig -Config $config -Name "GITHUB_DEPLOY_BRANCH" -DefaultValue "master"
$script:WifPoolId = Get-RequiredConfig -Config $config -Name "WIF_POOL_ID"
$script:WifProviderId = Get-RequiredConfig -Config $config -Name "WIF_PROVIDER_ID"
$script:TerraformServiceAccountId = Get-RequiredConfig -Config $config -Name "TERRAFORM_SERVICE_ACCOUNT_ID"
$script:DeployServiceAccountId = Get-RequiredConfig -Config $config -Name "DEPLOY_SERVICE_ACCOUNT_ID"
$script:TerraformCustomRoleId = Get-OptionalConfig -Config $config -Name "TERRAFORM_CUSTOM_ROLE_ID" -DefaultValue "terraformCloudRunManager"

Invoke-Gcloud config set project $script:ProjectId

switch ($Step) {
  "enable-apis" { Enable-RequiredApis }
  "state-bucket" { Ensure-StateBucket }
  "artifact-registry" { Ensure-ArtifactRegistry }
  "service-accounts" { Ensure-ServiceAccounts }
  "iam-least-privilege" { Ensure-ServiceAccounts }
  "iam-cleanup" { Remove-LegacyBroadIam }
  "workload-identity" { Ensure-WorkloadIdentity }
  "print-github-secrets" { Write-GithubSecrets }
  "all" {
    Enable-RequiredApis
    Ensure-StateBucket
    Ensure-ArtifactRegistry
    Ensure-ServiceAccounts
    Ensure-WorkloadIdentity
    Write-GithubSecrets
  }
}
