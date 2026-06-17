# Nana Monorepo

This repository is Nana Addo's personal monorepo. It will house all personal projects over time, with each project living as a dedicated app, package, or sub-project inside the repository.

## Apps

```text
apps/
`-- nana-portfolio/
    `-- Makefile
```

### `apps/nana-portfolio`

The current portfolio website built with Next.js, React, TypeScript, and Tailwind CSS. Future projects can be added alongside it under `apps/` with their own Dockerfile, Makefile, and deployment configuration.

`nana-portfolio` is the portfolio website project app housed inside this monorepo. Other personal projects will eventually be moved or created here as their own individual sub-projects, and they should still be documented and displayed as individual portfolio projects.

App-specific documentation lives in:

```text
apps/nana-portfolio/README.md
```

## Planned Infrastructure

The repository includes reusable Google Cloud Run infrastructure:

```text
infra/
|-- modules/
`-- environments/
```

Deployment-specific project names, state storage, and secret-management details are intentionally kept out of the public README.

Shared app command templates live under:

```text
libs/
`-- nodejs/
    `-- Makefile
```

## Local App Workflow

Run the current app from the repository root:

```bash
pnpm install
pnpm dev
```

Useful root commands:

```bash
pnpm typecheck
pnpm lint
pnpm build
pnpm ci
```

The root `Makefile` delegates to the selected app Makefile, and the app Makefile includes the shared Node.js command template:

```bash
make build APP=nana-portfolio
```

On Windows, `pnpm` scripts are the primary local workflow unless `make` is installed.

## Monorepo Pipeline

GitHub Actions uses one central workflow:

```text
.github/workflows/pipeline.yml
```

Pull requests validate only affected apps. Merges to `master` validate, build, and deploy affected apps with immutable commit-SHA image tags. Shared library or infrastructure changes validate and deploy every registered app.

Each deployable app registers its pipeline contract in `apps/<app>/pipeline.json` and implements the shared Make targets:

```text
install
ci
docker-build
docker-push
```

This keeps workflow logic constant as the monorepo grows. Node.js and Go runtimes are supported by the central pipeline.
