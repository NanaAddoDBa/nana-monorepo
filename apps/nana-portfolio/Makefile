APP ?= nana-portfolio

APP_MAKEFILE_DIR := $(dir $(abspath $(lastword $(MAKEFILE_LIST))))
REPO_ROOT ?= $(abspath $(APP_MAKEFILE_DIR)/../..)
APP_DIR ?= $(REPO_ROOT)/apps/$(APP)

include $(REPO_ROOT)/libs/nodejs/Makefile
