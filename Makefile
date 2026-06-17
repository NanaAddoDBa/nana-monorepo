APP ?= nana-portfolio
APP_DIR ?= apps/$(APP)
STEP ?= all
BOOTSTRAP_CONFIG ?= infra/bootstrap/gcp-bootstrap.env
TF_ENV ?= prod
TF_DIR ?= infra/deployments/$(TF_ENV)/$(APP)
TF_PLAN ?= tfplan

.PHONY: gcp-bootstrap tf-init tf-fmt tf-validate tf-plan tf-apply

gcp-bootstrap:
	powershell -NoProfile -ExecutionPolicy Bypass -File infra/bootstrap/gcp-bootstrap.ps1 -ConfigPath $(BOOTSTRAP_CONFIG) -Step $(STEP)

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
