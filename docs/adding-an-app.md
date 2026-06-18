# Adding and Deploying an App

This guide describes the complete path for adding an application to the monorepo, validating it in CI, creating its Cloud Run infrastructure, and enabling automatic deployment after merge.

## How the Platform Works

Every deployable application provides three contracts:

```text
apps/<app-name>/                 application source and Makefile
apps/<app-name>/pipeline.json   CI and deployment metadata
infra/deployments/prod/<app-name>/ Terraform root for the Cloud Run service
```

The central workflow at `.github/workflows/pipeline.yml` discovers changed apps automatically. Do not add an app-specific workflow file.

Pull requests run `install` and `ci` for affected apps. A merge to `master` builds an image tagged with the Git commit SHA, pushes it to Artifact Registry, updates the existing Cloud Run service, and checks the configured health path.

Terraform creates the service and its runtime identity. Terraform apply is manual and never runs in GitHub Actions.

## Prerequisites

Complete these repository-level steps once, not once per app:

- The GCP project, billing, Artifact Registry repository, and Terraform state bucket exist.
- GitHub Workload Identity Federation is configured for this repository and `master`.
- GitHub repository secrets `GCP_WORKLOAD_IDENTITY_PROVIDER` and `GCP_DEPLOY_SERVICE_ACCOUNT` exist.
- Optional GitHub repository variables `GCP_PROJECT_ID`, `GCP_REGION`, and `ARTIFACT_REGISTRY_REPOSITORY` match the target platform. The pipeline has repository defaults when they are absent.
- `gcloud`, Terraform, and Make are available for initial infrastructure setup.

## 1. Choose the App Identity

Choose one lowercase, hyphenated identifier and use it consistently:

```text
example-api
```

The name must match `^[a-z][a-z0-9-]{0,62}$`.

Use this value for:

```text
apps/example-api/
pipeline.json name
pipeline.json service_name
Terraform service_name
Artifact Registry image name
Terraform deployment directory
Terraform state prefix
```

Keep `service_name` equal to the app name by default. The pipeline always publishes the image as `<repository>/<app-name>:<git-sha>`. A different Cloud Run service name is supported, but the initial Terraform image must then be supplied explicitly.

Choose a runtime service account ID no longer than 30 characters, for example `example-api-runtime`.

## 2. Create the Application Directory

Create:

```text
apps/example-api/
|-- Makefile
|-- pipeline.json
|-- Dockerfile            # when the shared Next.js image is not suitable
|-- .dockerignore
`-- application files
```

The container must:

- Listen on `0.0.0.0`.
- Listen on the `PORT` environment variable supplied by Cloud Run.
- Exit when startup fails.
- Return a successful HTTP response from the configured health path.
- Avoid baking credentials or local `.env` files into the image.

## 3. Implement the Makefile Contract

The central pipeline calls these targets:

```text
install
ci
docker-build
docker-push
```

Local development may additionally provide:

```text
dev
build
test
docker-run
build-cloud
print-config
```

### Next.js or pnpm App

The shared Node.js Makefile expects `install`, `typecheck`, `lint`, and `build` package scripts. Its default Dockerfile expects a Next.js standalone build.

```make
APP ?= example-web

APP_MAKEFILE_DIR := $(dir $(abspath $(lastword $(MAKEFILE_LIST))))
REPO_ROOT ?= $(abspath $(APP_MAKEFILE_DIR)/../..)
APP_DIR ?= $(REPO_ROOT)/apps/$(APP)

include $(REPO_ROOT)/libs/nodejs/Makefile
```

For Next.js, enable standalone output:

```js
const nextConfig = {
  output: "standalone",
};

export default nextConfig;
```

For a Node.js app that is not compatible with the shared standalone Dockerfile, keep the shared Make targets and override the image path in the app Makefile:

```make
DOCKERFILE := $(APP_DIR)/Dockerfile
```

### Go App

The pipeline installs the configured Go version, but there is no shared Go Makefile yet. The app Makefile must implement the required targets directly. For example:

```make
APP ?= example-api
APP_DIR ?= apps/$(APP)
GCP_PROJECT_ID ?= nana-monorepo
GCP_REGION ?= europe-west3
ARTIFACT_REGISTRY_REPOSITORY ?= apps
IMAGE_TAG ?= latest
IMAGE ?= $(GCP_REGION)-docker.pkg.dev/$(GCP_PROJECT_ID)/$(ARTIFACT_REGISTRY_REPOSITORY)/$(APP):$(IMAGE_TAG)

.PHONY: install ci docker-build docker-push

install:
	cd $(APP_DIR) && go mod download

ci:
	cd $(APP_DIR) && go test ./...
	cd $(APP_DIR) && go vet ./...

docker-build:
	docker build -t $(IMAGE) $(APP_DIR)

docker-push:
	docker push $(IMAGE)
```

Move this implementation to `libs/go/Makefile` when more than one Go app needs it.

## 4. Register the App with the Pipeline

Add `apps/<app-name>/pipeline.json`.

### Node.js Example

```json
{
  "name": "example-web",
  "runtime": "nodejs",
  "runtime_version": "22",
  "package_manager_version": "10.18.3",
  "service_name": "example-web",
  "health_path": "/"
}
```

### Go Example

```json
{
  "name": "example-api",
  "runtime": "go",
  "runtime_version": "1.24",
  "service_name": "example-api",
  "health_path": "/healthz"
}
```

Field meanings:

| Field                     | Meaning                                                  |
| ------------------------- | -------------------------------------------------------- |
| `name`                    | App directory and Artifact Registry image name.          |
| `runtime`                 | `nodejs` or `go`.                                        |
| `runtime_version`         | Version installed by GitHub Actions.                     |
| `package_manager_version` | Exact pnpm version; required for Node.js apps.           |
| `service_name`            | Existing Cloud Run service updated after merge.          |
| `health_path`             | Public endpoint used for the post-deployment smoke test. |

Validate registration locally from the repository root:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .github/scripts/detect-apps.ps1 -App example-api
```

The command must return a one-item JSON array.

## 5. Validate the App Locally

Run from the repository root:

```powershell
make install APP=example-api
make ci APP=example-api
make docker-build APP=example-api IMAGE_TAG=local
```

Run the image with the port expected by the app and verify its health endpoint. Do not continue until these commands pass.

## 6. Create the Terraform Deployment Root

Create:

```text
infra/deployments/prod/example-api/
|-- backend.hcl
|-- backend.tf
|-- dependencies.tf
|-- main.tf
|-- outputs.tf
|-- provider.tf
|-- terraform.tfvars
|-- variables.tf
`-- versions.tf
```

Use `infra/deployments/prod/nana-portfolio/` as the current reference. Copy only the source and configuration files listed above. Do not copy `.terraform/`, `tfplan`, `image.auto.tfvars`, or another app's `.terraform.lock.hcl`.

Update at least these values in `terraform.tfvars`:

```hcl
project_id                   = "YOUR_PROJECT_ID"
region                       = "YOUR_REGION"
service_name                 = "example-api"
artifact_registry_repository = "apps"
runtime_service_account_id   = "example-api-runtime"

container_port      = 8080
min_instance_count  = 0
max_instance_count  = 3
allow_public_access = true

env_vars = {
  APP_ENV = "production"
}

secret_env_vars = {}

labels = {
  app         = "example-api"
  managed_by  = "terraform"
  environment = "prod"
}
```

Give every app isolated Terraform state in `backend.hcl`:

```hcl
bucket = "YOUR_TERRAFORM_STATE_BUCKET"
prefix = "prod/example-api"
```

The backend prefix must be unique per app and environment.

## 7. Add Runtime Secrets

Secret values stay outside Git, Terraform state, and GitHub Actions.

For each runtime secret, create or update its Secret Manager value:

```powershell
make add-secret APP=example-api SECRET=DATABASE_URL
```

The default secret ID becomes:

```text
example-api-database-url
```

Reference that ID in `terraform.tfvars`:

```hcl
secret_env_vars = {
  DATABASE_URL = {
    secret_name = "example-api-database-url"
  }
}
```

For an existing or custom secret ID:

```powershell
make add-secret APP=example-api SECRET=DATABASE_URL SECRET_ID=shared-database-url
```

Never commit `.env`, `.env.local`, secret values, service-account keys, or generated credential files.

## 8. Publish the Bootstrap Image

Terraform cannot create a Cloud Run service until its first image exists.

For an app with a working `build-cloud` target:

```powershell
make build-cloud APP=example-api
```

Otherwise build and push `latest` with Docker:

```powershell
gcloud auth configure-docker YOUR_REGION-docker.pkg.dev
make docker-build APP=example-api IMAGE_TAG=latest
make docker-push APP=example-api IMAGE_TAG=latest
```

The expected image is:

```text
REGION-docker.pkg.dev/PROJECT_ID/apps/example-api:latest
```

This mutable tag is only for initial service creation. Normal pipeline deployments use immutable Git commit SHA tags.

## 9. Create the Cloud Run Service

Initialize, review, and apply Terraform manually:

```powershell
make tf-init APP=example-api
make tf-fmt APP=example-api
make tf-validate APP=example-api
make tf-plan APP=example-api
terraform -chdir=infra/deployments/prod/example-api show tfplan
make tf-apply APP=example-api
make service-url APP=example-api
```

Before approving apply, verify:

- The plan targets only the new app's resources.
- The state prefix belongs only to the new app.
- The image path points to the new app.
- `min_instance_count` is `0` unless warm instances are intentional.
- Maximum instances, CPU, memory, timeout, concurrency, and public access are deliberate.
- Every referenced secret exists.

The current pipeline smoke test expects a publicly reachable health endpoint. A private Cloud Run service requires an authenticated smoke-test implementation before onboarding.

Test the returned service URL and health path before enabling automatic deployment.

## 10. Open the Onboarding Pull Request

Use a `feature-...` branch and conventional commits. The pull request should include:

```text
apps/<app-name>/**
apps/<app-name>/pipeline.json
infra/deployments/prod/<app-name>/**
docs changes when the platform contract changes
```

The pull request pipeline should:

1. Detect the new app.
2. Install its configured runtime and dependencies.
3. Run `make ci APP=<app-name>`.
4. Run Terraform formatting and validation because the deployment root changed.
5. Skip deployment because the event is a pull request.

Do not merge until validation succeeds.

## 11. Verify the First Automatic Deployment

After merge to `master`, the same pipeline should:

1. Detect the changed app.
2. Repeat validation.
3. Authenticate to GCP with Workload Identity Federation.
4. Build and push `<app-name>:<git-sha>`.
5. Update the existing Cloud Run service.
6. Request the configured health path until it succeeds or the job fails.

Confirm the GitHub Actions run, Cloud Run revision, deployed image SHA, service logs, and public endpoint.

## Change Detection Rules

Changes under these paths select one app:

```text
apps/<app-name>/**
infra/deployments/<environment>/<app-name>/**
```

Changes to shared platform paths select every registered app:

```text
libs/**
infra/modules/**
infra/scripts/**
Makefile
.github/workflows/pipeline.yml
.github/scripts/detect-apps.ps1
```

Documentation-only changes do not run app jobs unless they accompany an app or shared-platform change.

Terraform checks run only when `infra/**` or `.github/workflows/pipeline.yml` changes. They execute `terraform fmt -check`, initialize each deployment root with `-backend=false`, and run `terraform validate`. CI never runs Terraform plan or apply.

## Operational Commands

Run one registered app manually from GitHub Actions by selecting the `Monorepo pipeline` workflow, choosing **Run workflow** on `master`, and entering its exact app name. Enter `all` to validate and deploy every registered app.

Useful local commands:

```powershell
make print-config APP=example-api
make ci APP=example-api
make service-url APP=example-api
terraform -chdir=infra/deployments/prod/example-api output
gcloud run services logs read example-api --project YOUR_PROJECT_ID --region YOUR_REGION --limit 100
```

## Completion Checklist

- [ ] App directory uses the final lowercase app name.
- [ ] App Makefile implements `install`, `ci`, `docker-build`, and `docker-push`.
- [ ] Container listens on `0.0.0.0:$PORT`.
- [ ] Health endpoint returns HTTP success.
- [ ] `pipeline.json` passes local detection.
- [ ] Local CI and container checks pass.
- [ ] Terraform deployment root and state prefix are app-specific.
- [ ] Secret values exist in Secret Manager and are absent from Git.
- [ ] Bootstrap image exists in Artifact Registry.
- [ ] Terraform plan is reviewed and applied manually.
- [ ] Initial Cloud Run service and health endpoint work.
- [ ] Pull request validation passes.
- [ ] Post-merge image deployment and smoke test pass.
