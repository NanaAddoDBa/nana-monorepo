APP ?= rent-car-api
APP_DIR := $(dir $(abspath $(lastword $(MAKEFILE_LIST))))
REPO_ROOT := $(abspath $(APP_DIR)/../..)
GCP_PROJECT_ID ?= nana-monorepo
GCP_REGION ?= europe-west3
ARTIFACT_REGISTRY_REPOSITORY ?= apps
IMAGE_TAG ?= local
IMAGE ?= $(GCP_REGION)-docker.pkg.dev/$(GCP_PROJECT_ID)/$(ARTIFACT_REGISTRY_REPOSITORY)/$(APP):$(IMAGE_TAG)

.PHONY: install ci build test dev docker-build docker-push
install:
	cd $(APP_DIR) && npm ci --no-audit --no-fund
ci:
	cd $(APP_DIR) && npm run ci
build:
	cd $(APP_DIR) && npm run build
test:
	cd $(APP_DIR) && npm run test
dev:
	cd $(APP_DIR) && npm run dev
docker-build:
	docker build -f $(APP_DIR)/Dockerfile -t $(IMAGE) $(REPO_ROOT)
docker-push:
	docker push $(IMAGE)
