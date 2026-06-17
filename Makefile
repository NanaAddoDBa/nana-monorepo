APP ?= nana-portfolio
APP_DIR ?= apps/$(APP)
STEP ?= all
BOOTSTRAP_CONFIG ?= infra/bootstrap/gcp-bootstrap.env
TF_ENV ?= prod
TF_DIR ?= infra/deployments/$(TF_ENV)/$(APP)
TF_PLAN ?= tfplan
GCP_PROJECT_ID ?= nana-monorepo
SECRET ?=
SECRET_ID ?=
VALUE ?=
SECRET_FILE ?=
SECRETS_FILE ?=
SECRET_NAMES ?= RESEND_API_KEY,TELEGRAM_BOT_TOKEN,TELEGRAM_CHAT_ID

.PHONY: gcp-bootstrap add-secret add-secrets tf-init tf-fmt tf-validate tf-plan tf-apply

gcp-bootstrap:
	powershell -NoProfile -ExecutionPolicy Bypass -File infra/bootstrap/gcp-bootstrap.ps1 -ConfigPath $(BOOTSTRAP_CONFIG) -Step $(STEP)

add-secret:
	powershell -NoProfile -ExecutionPolicy Bypass -File infra/scripts/add-secret-version.ps1 -ProjectId $(GCP_PROJECT_ID) -App $(APP) -SecretName "$(SECRET)" -SecretId "$(SECRET_ID)" -SecretValue "$(VALUE)" -SecretFile "$(SECRET_FILE)"

add-secrets:
	powershell -NoProfile -ExecutionPolicy Bypass -File infra/scripts/add-secret-version.ps1 -ProjectId $(GCP_PROJECT_ID) -App $(APP) -SecretsFile "$(SECRETS_FILE)" -SecretNames "$(SECRET_NAMES)"

tf-init:
	terraform -chdir=$(TF_DIR) init -backend-config=backend.hcl

tf-fmt:
	terraform -chdir=$(TF_DIR) fmt
	terraform fmt -recursive infra/modules

tf-validate:
	terraform -chdir=$(TF_DIR) validate

tf-plan:
	terraform -chdir=$(TF_DIR) plan -var-file=terraform.tfvars -out=$(TF_PLAN)

tf-apply:
	terraform -chdir=$(TF_DIR) apply $(TF_PLAN)

include $(APP_DIR)/Makefile
