param(
  [string]$ProjectId,
  [string]$App,
  [string]$SecretName,
  [string]$SecretId,
  [string]$SecretValue,
  [string]$SecretFile,
  [string]$SecretsFile,
  [string]$SecretNames
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

function ConvertTo-SecretId {
  param(
    [string]$AppName,
    [string]$Name
  )

  if ([string]::IsNullOrWhiteSpace($Name)) {
    throw "Missing SECRET. Use make add-secret SECRET=RESEND_API_KEY"
  }

  $normalizedName = $Name.Trim().ToLowerInvariant() -replace "_", "-"

  return "$AppName-$normalizedName"
}

function Invoke-Gcloud {
  param([Parameter(ValueFromRemainingArguments = $true)][string[]]$Arguments)

  & $script:Gcloud @Arguments

  if ($LASTEXITCODE -ne 0) {
    throw "gcloud command failed: gcloud $($Arguments -join ' ')"
  }
}

function Test-SecretExists {
  param([string]$Name)

  try {
    $previousErrorActionPreference = $ErrorActionPreference
    $ErrorActionPreference = "Continue"
    & $script:Gcloud secrets describe $Name --project $ProjectId *> $null
  } catch {
    return $false
  } finally {
    $ErrorActionPreference = $previousErrorActionPreference
  }

  return $LASTEXITCODE -eq 0
}

function Add-SecretVersionFromValue {
  param(
    [string]$Name,
    [string]$Value
  )

  $temporaryFile = New-TemporaryFile

  try {
    Set-Content -LiteralPath $temporaryFile -Value $Value -NoNewline
    Invoke-Gcloud secrets versions add $Name --project $ProjectId --data-file $temporaryFile
  } finally {
    Remove-Item -LiteralPath $temporaryFile -Force -ErrorAction SilentlyContinue
  }
}

function Add-SecretVersionFromPrompt {
  param([string]$Name)

  $secureValue = Read-Host "Enter value for $Name" -AsSecureString
  $bstr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secureValue)

  try {
    $plainValue = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($bstr)
    Add-SecretVersionFromValue -Name $Name -Value $plainValue
  } finally {
    if ($bstr -ne [IntPtr]::Zero) {
      [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr)
    }
  }
}

function Read-EnvFile {
  param([string]$Path)

  if ([string]::IsNullOrWhiteSpace($Path)) {
    throw "Missing SECRETS_FILE. Use make add-secrets SECRETS_FILE=.env.production"
  }

  if (!(Test-Path $Path)) {
    throw "SECRETS_FILE does not exist: $Path"
  }

  $entries = @()

  Get-Content $Path | ForEach-Object {
    $line = $_.Trim()

    if (!$line -or $line.StartsWith("#")) {
      return
    }

    $parts = $line -split "=", 2

    if ($parts.Length -ne 2 -or [string]::IsNullOrWhiteSpace($parts[0])) {
      throw "Invalid secret line in $Path`: $line"
    }

    $entries += [PSCustomObject]@{
      Name  = $parts[0].Trim()
      Value = $parts[1]
    }
  }

  return $entries
}

function Ensure-Secret {
  param([string]$Name)

  if (!(Test-SecretExists -Name $Name)) {
    Write-Host "Creating Secret Manager secret: $Name"
    Invoke-Gcloud secrets create $Name --project $ProjectId --replication-policy automatic
  }
}

function Get-AllowedSecretNames {
  param([string]$Names)

  if ([string]::IsNullOrWhiteSpace($Names)) {
    return $null
  }

  $allowed = @{}

  $Names -split "," | ForEach-Object {
    $name = $_.Trim()

    if (![string]::IsNullOrWhiteSpace($name)) {
      $allowed[$name] = $true
    }
  }

  return $allowed
}

if ([string]::IsNullOrWhiteSpace($ProjectId)) {
  throw "Missing GCP project ID. Set GCP_PROJECT_ID=your-project-id."
}

if ([string]::IsNullOrWhiteSpace($App)) {
  throw "Missing APP. Set APP=nana-portfolio."
}

$script:Gcloud = Get-GcloudCommand

if (![string]::IsNullOrWhiteSpace($SecretsFile)) {
  $entries = Read-EnvFile -Path $SecretsFile
  $allowedSecretNames = Get-AllowedSecretNames -Names $SecretNames

  foreach ($entry in $entries) {
    if ($allowedSecretNames -ne $null -and !$allowedSecretNames.ContainsKey($entry.Name)) {
      Write-Host "Skipping non-secret env value: $($entry.Name)"
      continue
    }

    $entrySecretId = ConvertTo-SecretId -AppName $App -Name $entry.Name

    Ensure-Secret -Name $entrySecretId
    Add-SecretVersionFromValue -Name $entrySecretId -Value $entry.Value
    Write-Host "Added new version for Secret Manager secret: $entrySecretId"
  }

  return
}

$resolvedSecretId = if ([string]::IsNullOrWhiteSpace($SecretId)) {
  ConvertTo-SecretId -AppName $App -Name $SecretName
} else {
  $SecretId.Trim()
}

Ensure-Secret -Name $resolvedSecretId

if (![string]::IsNullOrWhiteSpace($SecretFile)) {
  if (!(Test-Path $SecretFile)) {
    throw "SECRET_FILE does not exist: $SecretFile"
  }

  Invoke-Gcloud secrets versions add $resolvedSecretId --project $ProjectId --data-file $SecretFile
} elseif (![string]::IsNullOrEmpty($SecretValue)) {
  Add-SecretVersionFromValue -Name $resolvedSecretId -Value $SecretValue
} else {
  Add-SecretVersionFromPrompt -Name $resolvedSecretId
}

Write-Host "Added new version for Secret Manager secret: $resolvedSecretId"
