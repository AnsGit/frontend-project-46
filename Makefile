install:
	npm ci

publish:
	npm publish --dry-run

test:
	npx jest

test-coverage:
	npm test -- --coverage --coverageProvider=v8

lint:
	npx eslint .