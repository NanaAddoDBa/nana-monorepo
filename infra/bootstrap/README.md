# GCP Bootstrap

This folder contains the small pre-Terraform bootstrap for Google Cloud.

Use it for resources Terraform needs before Terraform can run:

- Required Google Cloud APIs
- Terraform state bucket
- Artifact Registry repository
- Bootstrap service accounts
- GitHub Workload Identity Federation

Do not store secret values here. Application secrets belong in Google Secret Manager and should be added out-of-band.

## Usage

Copy the example config:

```powershell
Copy-Item infra/bootstrap/gcp-bootstrap.env.example infra/bootstrap/gcp-bootstrap.env
```

Review `infra/bootstrap/gcp-bootstrap.env`, then run:

```powershell
make gcp-bootstrap STEP=all
```

Run a single step:

```powershell
make gcp-bootstrap STEP=enable-apis
make gcp-bootstrap STEP=state-bucket
make gcp-bootstrap STEP=artifact-registry
make gcp-bootstrap STEP=service-accounts
make gcp-bootstrap STEP=workload-identity
make gcp-bootstrap STEP=print-github-secrets
```

If `make` is unavailable, call the script directly:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File infra/bootstrap/gcp-bootstrap.ps1 -ConfigPath infra/bootstrap/gcp-bootstrap.env -Step all
```
