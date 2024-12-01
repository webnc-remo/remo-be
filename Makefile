alias = remo

# ignore folder: deploy when deploy
.PHONY: deploy transfer

default: up

bootstrap:
	make install
	make container-up
	make up

up:
	npm run watch:dev

container-up:
	docker-compose up -d --remove-orphans

container-down:
	docker-compose down

ps:
	docker-compose ps

install:
	npm install

db-migrate:
	npm run migration:run

db-create:
	npm run migration:create src/database/migrations/$(name)

db-generate:
	npm run migration:generate src/database/migrations/$(name)

db-revert:
	npm run migration:revert src/database/migrations/$(name)

fork-kill-dev:
	lsof -t -i tcp:3000 | xargs kill

audit:
	npm audit --omit=dev

deploy-test:
	./deploy/deploy-test.sh

check-updates:
	npx npm-check-updates 

update-packages:
	npx npm-check-updates -u
