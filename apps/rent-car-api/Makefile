APP_DIR := $(dir $(abspath $(lastword $(MAKEFILE_LIST))))
.PHONY: install ci build test dev docker-build docker-push
install:
	cd $(APP_DIR) && npm install --no-audit --no-fund
ci:
	cd $(APP_DIR) && npm run ci
build:
	cd $(APP_DIR) && npm run build
test:
	cd $(APP_DIR) && npm run test
dev:
	cd $(APP_DIR) && npm run dev
# Deploy must remain disabled until database and runtime configuration are verified.
docker-build:
	@echo "Deployment not enabled; configure service and Docker contract first."; exit 1
docker-push:
	@echo "Deployment not enabled."; exit 1
