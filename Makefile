install:
	npm ci

gendiff:
	node bin/gendiff.js

publish:
	npm publish --dry-run

test:
	npx jest

lint:
	npx eslint .