SHELL := /bin/bash
PATH := node_modules/.bin:$(PATH)

.DEFAULT_GOAL := help

.PHONY: PHONY
PHONY:

build: PHONY ## Build the production ready site in /build
	export NODE_ENV=production && webpack

dev-server: PHONY
	export NODE_ENV=dev && webpack-dev-server

test: PHONY ## Run tests.
	mocha -r ts-node/register test/*.ts
t: test

test-watch: PHONY ## Run tests, watching for changes.
	mocha --watch --watch-extensions=ts --reporter=min \
		-r ts-node/register test/*.ts
watch-test: test-watch
watch: test-watch
w: test-watch

help:
	@# Find all targets with descriptions.
	@# Split by ":" and the " ##" pattern.
	@# Print just the target, in blue.
	@# Then print the next fields as the description
	@# in case the description has a few ":"s in it.
	@grep -E '^[^ .]+: .*?## .*$$' $(MAKEFILE_LIST) \
		| sort -d \
		| perl -ne 'chomp;\
			s/^([^:]*:)(?! )//;\
			($$target, $$help) = split(": .*##", $_);\
			printf "[36m%-29s[0m %s\n", $$target, $$help'
