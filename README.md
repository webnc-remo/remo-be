
# ReMo Backend

## Getting started

```bash
# 1. Clone the repository.
git clone git@github.com:webnc-remo/remo-be.git

# 2. Enter your remo-be folder.
cd remo-be

# 3. Create Environment variables file.
cp .env.example .env

# 4. Install & use node v20.13.1
nvm install & nvm use

# 5. Run first time.
make bootstrap
```

### Development
```bash
# 4. Run development server and open http://localhost:3000
make up

# 5. Read the documentation linked below for "Setup and development".
```

### Build

```
make build
```

## Features

<dl>
  <!-- <dt><b>Quick scaffolding</b></dt>
  <dd>Create modules, services, controller - right from the CLI!</dd> -->

  <dt><b>Instant feedback</b></dt>
  <dd>Enjoy the best DX (Developer eXperience) and code your app at the speed of thought! Your saved changes are reflected instantaneously.</dd>

  <dt><b>JWT Authentication</b></dt>
  <dd>Installed and configured JWT authentication.</dd>

  <dt><b>Next generation Typescript</b></dt>
  <dd>Always up to date typescript version.</dd>

  <dt><b>Industry-standard routing</b></dt>
  <dd>It's natural to want to add pages (e.g. /about`) to your application, and routing makes this possible.</dd>

  <dt><b>Environment Configuration</b></dt>
  <dd>development, staging and production environment configurations</dd>

  <dt><b>Swagger Api Documentation</b></dt>
  <dd>Already integrated API documentation. To see all available endpoints visit http://localhost:3000/documentation</dd>

  <dt><b>Linter</b></dt>
  <dd>eslint + prettier = ❤️</dd>
</dl>

## Documentation

This project includes a `docs` folder with more details on:

1.  [Setup and development](docs/development.md)
1.  [Architecture](docs/architecture.md)
1.  [Naming Cheatsheet](docs/naming-cheatsheet.md)

## References
https://narhakobyan.github.io/awesome-nest-boilerplate/
