APP ?= mobile-expense-tracker

APP_MAKEFILE_DIR := $(dir $(abspath $(lastword $(MAKEFILE_LIST))))
REPO_ROOT ?= $(abspath $(APP_MAKEFILE_DIR)/../..)
APP_DIR ?= $(REPO_ROOT)/apps/$(APP)

.PHONY: install dev typecheck lint test build ci

install:
	npm --prefix $(APP_DIR) ci

dev:
	npm --prefix $(APP_DIR) run dev

typecheck:
	npm --prefix $(APP_DIR) run typecheck

lint:
	npm --prefix $(APP_DIR) run lint
	npm --prefix $(APP_DIR) run lint:styles

test:
	npm --prefix $(APP_DIR) run test

build:
	npm --prefix $(APP_DIR) run build

ci: typecheck lint test build
