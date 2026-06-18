APP ?= nana-portfolio
APP_DIR ?= apps/$(APP)
STEP ?= all
BOOTSTRAP_CONFIG ?= infra/bootstrap/gcp-bootstrap.env
TF_ENV ?= prod
TF_DIR ?= infra/deployments/$(TF_ENV)/$(APP)
TF_PLAN ?= tfplan
GCP_PROJECT_ID ?= nana-monorepo
GCP_REGION ?= europe-west3
ARTIFACT_REGISTRY_REPOSITORY ?= apps
SECRET ?=
SECRET_ID ?=
VALUE ?=
SECRET_FILE ?=
SECRETS_FILE ?=
SECRET_NAMES ?= RESEND_API_KEY,TELEGRAM_BOT_TOKEN,TELEGRAM_CHAT_ID

ifeq ($(OS),Windows_NT)
POWERSHELL ?= powershell
POWERSHELL_ARGS ?= -NoProfile -ExecutionPolicy Bypass
else
POWERSHELL ?= pwsh
POWERSHELL_ARGS ?= -NoProfile
endif

.PHONY: gcp-bootstrap gcp-cost-controls gcp-iam-prepare gcp-iam-cleanup add-secret add-secrets deploy service-url tf-init tf-fmt tf-validate tf-validate-all tf-plan tf-apply

gcp-bootstrap:
	$(POWERSHELL) $(POWERSHELL_ARGS) -File infra/bootstrap/gcp-bootstrap.ps1 -ConfigPath $(BOOTSTRAP_CONFIG) -Step $(STEP)

gcp-cost-controls:
	$(POWERSHELL) $(POWERSHELL_ARGS) -File infra/bootstrap/gcp-bootstrap.ps1 -ConfigPath $(BOOTSTRAP_CONFIG) -Step cost-controls

gcp-iam-prepare:
	$(POWERSHELL) $(POWERSHELL_ARGS) -File infra/bootstrap/gcp-bootstrap.ps1 -ConfigPath $(BOOTSTRAP_CONFIG) -Step iam-least-privilege

gcp-iam-cleanup:
	$(POWERSHELL) $(POWERSHELL_ARGS) -File infra/bootstrap/gcp-bootstrap.ps1 -ConfigPath $(BOOTSTRAP_CONFIG) -Step iam-cleanup -ConfirmIamCleanup

add-secret:
	$(POWERSHELL) $(POWERSHELL_ARGS) -File infra/scripts/add-secret-version.ps1 -ProjectId $(GCP_PROJECT_ID) -App $(APP) -SecretName "$(SECRET)" -SecretId "$(SECRET_ID)" -SecretValue "$(VALUE)" -SecretFile "$(SECRET_FILE)"

add-secrets:
	$(POWERSHELL) $(POWERSHELL_ARGS) -File infra/scripts/add-secret-version.ps1 -ProjectId $(GCP_PROJECT_ID) -App $(APP) -SecretsFile "$(SECRETS_FILE)" -SecretNames "$(SECRET_NAMES)"

deploy: build-cloud
	$(POWERSHELL) $(POWERSHELL_ARGS) -File infra/scripts/deploy-cloud-run.ps1 -ProjectId $(GCP_PROJECT_ID) -Region $(GCP_REGION) -Repository $(ARTIFACT_REGISTRY_REPOSITORY) -App $(APP) -TerraformDirectory "$(TF_DIR)" -PlanFile "$(TF_PLAN)"

service-url:
	terraform -chdir=$(TF_DIR) output -raw service_uri

tf-init:
	terraform -chdir=$(TF_DIR) init -backend-config=backend.hcl

tf-fmt:
	terraform -chdir=$(TF_DIR) fmt
	terraform fmt -recursive infra/modules

tf-validate:
	terraform -chdir=$(TF_DIR) validate

tf-validate-all:
	$(POWERSHELL) $(POWERSHELL_ARGS) -File infra/scripts/validate-terraform.ps1

tf-plan:
	terraform -chdir=$(TF_DIR) plan -var-file=terraform.tfvars -out=$(TF_PLAN)

tf-apply:
	terraform -chdir=$(TF_DIR) apply $(TF_PLAN)

include $(APP_DIR)/Makefile
