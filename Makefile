.DEFAULT_GOAL := help

.PHONY: help setup run build test check format lint

help: ## List development commands
	@awk 'BEGIN {FS = ":.*## "} /^[a-zA-Z_-]+:.*## / {printf "  %-12s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

setup: ## Install locked dependencies and the pre-commit hook
	npm ci
	node scripts/setup-hooks.mjs

run: ## Start the local development server on loopback
	npm run dev

build: ## Build the static site into dist
	npm run build

test: ## Run content, search, build-contract, and safeguard tests
	npm test

check: ## Run all CI gates
	npm run check

format: ## Format project code and tooling
	npm run format

lint: ## Check formatting, types, and privacy
	npm run format:check
	npm run typecheck
	npm run privacy:check
