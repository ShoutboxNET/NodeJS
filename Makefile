# Include .env file if it exists
ifneq (,$(wildcard .env))
    include .env
    export
endif

# Check for required environment variables
check-env:
	@if [ -z "$(SHOUTBOX_API_KEY)" ]; then \
		echo "Error: SHOUTBOX_API_KEY is not set"; \
		exit 1; \
	fi
	@if [ -z "$(SHOUTBOX_FROM)" ]; then \
		echo "Error: SHOUTBOX_FROM is not set"; \
		exit 1; \
	fi
	@if [ -z "$(SHOUTBOX_TO)" ]; then \
		echo "Error: SHOUTBOX_TO is not set"; \
		exit 1; \
	fi

# Install dependencies
install:
	npm install

# Update dependencies
update:
	npm update

# Build the project
build:
	npm run build

test:
	npm test -- 
	#--testPathIgnorePatterns=react.test.tsx

test-react:
	tsx src/__tests__/react.test.tsx

test-all: test test-react

# Run tests (requires environment variables)
# test: check-env
# 	npm test

# Run direct API example
run-direct-example: check-env
	npx tsx examples/sendEmailDirect.ts

# Run API client example
run-api-example: check-env
	npx tsx examples/sendEmail.ts

# Run SMTP example
run-smtp-example: check-env
	npx tsx examples/sendEmailSMTP.ts

# Run example with attachments
run-attachments-example: check-env
	npx tsx examples/sendEmailAttachments.ts

# Run example with CC
run-cc-example: check-env
	npx tsx examples/sendEmailCc.ts

# Run example with reply-to
run-replyto-example: check-env
	npx tsx examples/sendEmailReplyTo.ts

# Run example with text
run-text-example: check-env
	npx tsx examples/sendEmailText.ts

# Clean up
clean:
	#rm -rf node_modules/
	rm -rf dist/
	rm -f package-lock.json

# Show help
help:
	@echo "Available commands:"
	@echo "  make install      - Install dependencies"
	@echo "  make update      - Update dependencies"
	@echo "  make build       - Build the project"
	@echo "  make test        - Run tests (requires env vars)"
	@echo "  make run-direct-example  - Run direct API example"
	@echo "  make run-api-example    - Run API client example"
	@echo "  make run-smtp-example   - Run SMTP example"
	@echo "  make run-attachments-example - Run attachments example"
	@echo "  make run-cc-example    - Run CC example"
	@echo "  make run-replyto-example - Run reply-to example"
	@echo "  make run-text-example   - Run text example"
	@echo "  make clean       - Clean build artifacts"
	@echo ""
	@echo "Required environment variables (can be set in .env file):"
	@echo "  SHOUTBOX_API_KEY - Your Shoutbox API key"
	@echo "  SHOUTBOX_FROM    - Sender email address"
	@echo "  SHOUTBOX_TO      - Recipient email address"

.PHONY: check-env install update build test run-direct-example run-api-example run-smtp-example run-attachments-example run-cc-example run-replyto-example run-text-example clean help

