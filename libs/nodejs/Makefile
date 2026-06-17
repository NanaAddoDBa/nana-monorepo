GCP_PROJECT_ID ?= nana-monorepo
GCP_REGION ?= europe-west3
ARTIFACT_REGISTRY_REPOSITORY ?= apps
IMAGE_TAG ?= latest
IMAGE ?= $(GCP_REGION)-docker.pkg.dev/$(GCP_PROJECT_ID)/$(ARTIFACT_REGISTRY_REPOSITORY)/$(APP):$(IMAGE_TAG)
DOCKERFILE ?= $(REPO_ROOT)/libs/nodejs/docker/standalone/Dockerfile
CLOUD_BUILD_CONFIG ?= $(REPO_ROOT)/libs/nodejs/docker/standalone/cloudbuild.yaml

.PHONY: install dev typecheck lint build ci docker-auth docker-build docker-push docker-run image-build-cloud print-config

ifeq ($(OS),Windows_NT)
PATH := $(REPO_ROOT)/node_modules/.bin;$(PATH)
else
PATH := $(REPO_ROOT)/node_modules/.bin:$(PATH)
endif

install:
	pnpm --dir $(APP_DIR) install --frozen-lockfile

dev:
	pnpm --dir $(APP_DIR) dev

typecheck:
	pnpm --dir $(APP_DIR) typecheck

lint:
	pnpm --dir $(APP_DIR) lint

build:
	pnpm --dir $(APP_DIR) build

ci: typecheck lint build

docker-auth:
	gcloud auth configure-docker $(GCP_REGION)-docker.pkg.dev

docker-build:
	docker build -f $(DOCKERFILE) -t $(IMAGE) $(APP_DIR)

docker-push:
	docker push $(IMAGE)

docker-run:
	docker run --rm -p 3000:3000 --env-file $(APP_DIR)/.env.local $(IMAGE)

image-build-cloud:
	gcloud builds submit $(REPO_ROOT) --project $(GCP_PROJECT_ID) --config $(CLOUD_BUILD_CONFIG) --substitutions _APP_DIR=$(APP_DIR),_IMAGE=$(IMAGE)

print-config:
	@echo APP=$(APP)
	@echo APP_DIR=$(APP_DIR)
	@echo REPO_ROOT=$(REPO_ROOT)
	@echo DOCKERFILE=$(DOCKERFILE)
	@echo CLOUD_BUILD_CONFIG=$(CLOUD_BUILD_CONFIG)
	@echo IMAGE=$(IMAGE)
