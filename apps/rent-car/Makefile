APP ?= rent-car
APP_DIR := $(dir $(abspath $(lastword $(MAKEFILE_LIST))))

.PHONY: install ci build test dev

install:
	cd $(APP_DIR) && npm install --no-audit --no-fund

ci:
	cd $(APP_DIR) && npm run check

build:
	cd $(APP_DIR) && npm run build

test:
	cd $(APP_DIR) && npm run test

dev:
	cd $(APP_DIR) && npm run dev
