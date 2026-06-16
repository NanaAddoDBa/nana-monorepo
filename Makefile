APP ?= nana-portfolio
APP_DIR := apps/$(APP)

.PHONY: install dev typecheck lint build ci print-config

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
