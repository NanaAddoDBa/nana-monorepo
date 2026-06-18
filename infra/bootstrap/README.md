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
make gcp-bootstrap STEP=iam-least-privilege
make gcp-bootstrap STEP=workload-identity
make gcp-bootstrap STEP=print-github-secrets
```

## IAM Migration

IAM hardening is intentionally split into preparation and cleanup.

First, add the narrow project, state-bucket, and Artifact Registry permissions without removing existing access:

```powershell
make gcp-iam-prepare
```

Then apply the application Terraform so each runtime service account grants `roles/iam.serviceAccountUser` directly to the Terraform and GitHub deploy service accounts. Review and verify a normal deployment before cleanup.

Finally, remove the legacy project-wide `roles/editor`, `roles/artifactregistry.writer`, and `roles/iam.serviceAccountUser` bindings:

```powershell
make gcp-iam-cleanup
```

Cleanup is guarded. It fails unless every discovered `*-runtime` service account has both required service-account bindings. The command is idempotent and can be rerun safely.

If `make` is unavailable, call the script directly:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File infra/bootstrap/gcp-bootstrap.ps1 -ConfigPath infra/bootstrap/gcp-bootstrap.env -Step all
```
