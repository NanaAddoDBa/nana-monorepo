APP ?= remix-of-ai-video-studio-landing-page
APP_DIR := $(dir $(abspath $(lastword $(MAKEFILE_LIST))))

.PHONY: install ci build test dev preview

install:
	cd "$(APP_DIR)" && npm ci --no-audit --no-fund

ci:
	cd "$(APP_DIR)" && npm run check
	cd "$(APP_DIR)" && npm run build

build:
	cd "$(APP_DIR)" && npm run build

test:
	cd "$(APP_DIR)" && npm test

dev:
	cd "$(APP_DIR)" && npm run dev

preview:
	cd "$(APP_DIR)" && npm run preview