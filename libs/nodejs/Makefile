.PHONY: install dev typecheck lint build ci print-config

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

print-config:
	@echo APP=$(APP)
	@echo APP_DIR=$(APP_DIR)
	@echo REPO_ROOT=$(REPO_ROOT)
