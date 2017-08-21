SHELL := /bin/bash
PATH := node_modules/.bin:$(PATH)

.DEFAULT_GOAL := help

.PHONY: _
_:

build: _ ## Build the production ready site in /build
	export NODE_ENV=production && webpack

dev-server: _
	export NODE_ENV=dev && webpack-dev-server
dev: dev-server

test: _ ## Run tests.
	mocha -r ts-node/register test/*.ts
t: test

test-watch: _ ## Run tests, watching for changes.
	mocha --watch --watch-extensions=ts --reporter=min \
		-r ts-node/register test/*.ts
watch-test: test-watch
watch: test-watch
w: test-watch

run: _
	node build/


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
