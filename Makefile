APP ?= nana-portfolio
APP_DIR ?= apps/$(APP)
STEP ?= all
BOOTSTRAP_CONFIG ?= infra/bootstrap/gcp-bootstrap.env

.PHONY: gcp-bootstrap

gcp-bootstrap:
	powershell -NoProfile -ExecutionPolicy Bypass -File infra/bootstrap/gcp-bootstrap.ps1 -ConfigPath $(BOOTSTRAP_CONFIG) -Step $(STEP)

include $(APP_DIR)/Makefile
