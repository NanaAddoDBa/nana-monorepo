APP ?= mobile-expense-tracker

APP_MAKEFILE_DIR := $(dir $(abspath $(lastword $(MAKEFILE_LIST))))
REPO_ROOT ?= $(abspath $(APP_MAKEFILE_DIR)/../..)
APP_DIR ?= $(REPO_ROOT)/apps/$(APP)
SERVER_DIR ?= $(APP_DIR)/server

.PHONY: install dev typecheck lint test build ci

install:
	npm --prefix $(APP_DIR) ci
ifneq ($(wildcard $(SERVER_DIR)/package.json),)
	npm --prefix $(APP_DIR)/server ci
	npm --prefix $(APP_DIR)/server run prisma:generate
endif

dev:
	npm --prefix $(APP_DIR) run dev

typecheck:
	npm --prefix $(APP_DIR) run typecheck

lint:
	npm --prefix $(APP_DIR) run lint
	npm --prefix $(APP_DIR) run lint:styles

test:
	npm --prefix $(APP_DIR) run test
ifneq ($(wildcard $(SERVER_DIR)/package.json),)
	npm --prefix $(APP_DIR)/server run test
endif

build:
	npm --prefix $(APP_DIR) run build
ifneq ($(wildcard $(SERVER_DIR)/package.json),)
	npm --prefix $(APP_DIR)/server run build
endif

ci: typecheck lint test build
