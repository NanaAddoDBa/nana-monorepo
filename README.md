# Nana Monorepo

This repository is Nana Addo's personal monorepo. It will house all personal projects over time, with each project living as a dedicated app, package, or sub-project inside the repository.

## Apps

```text
apps/
|-- authnexus/
|   `-- .source-revision
|-- mobile-expense-tracker/
|   `-- Makefile
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

### `apps/mobile-expense-tracker`

A mobile-first expense tracker and budget manager built with Vite, React, TypeScript, Tailwind CSS, and Vitest. The app currently uses mock services and local persistence while keeping explicit boundaries for a future backend and external integrations.

Its source history was preserved when it moved into this monorepo. App-specific documentation lives in:

```text
apps/mobile-expense-tracker/README.md
```

The standalone [`Mobile-expence-tracker`](https://github.com/NanaAddoDBa/Mobile-expence-tracker) repository is the source of truth for this app. Pushes to its `main` branch trigger a synchronization pull request that is merged after the monorepo pipeline passes. An hourly scheduled check recovers any missed trigger. The monorepo keeps its own `Makefile`, `pipeline.json`, and `.source-revision` integration files.

### `apps/authnexus`

AuthNexus is a reusable, production-capable identity and authentication platform. The standalone
[`authnexus`](https://github.com/NanaAddoDBa/authnexus) repository is its only source of truth.
`apps/authnexus` is a downstream ordinary-files mirror of an exact green source revision recorded
in `.source-revision`; do not develop AuthNexus from this directory.

The mirror excludes the source repository's `.github` automation and never synchronizes changes
back to the source. AuthNexus is intentionally not registered in the current Node.js/Go deployment
registry during Phase A, so its standalone CI remains the authoritative validation gate. See
[AuthNexus Downstream Mirror](docs/authnexus-mirror.md) for the update, credential, recovery, and
pipeline-boundary rules.

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

Run the portfolio from the repository root:

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
make ci APP=mobile-expense-tracker
```

On Windows, `pnpm` scripts are the primary local workflow unless `make` is installed.

## Monorepo Pipeline

GitHub Actions uses one central workflow:

```text
.github/workflows/pipeline.yml
```

Pull requests validate only affected apps. Merges to `master` validate affected apps and deploy only those with deployment enabled, using immutable commit-SHA image tags. Shared library or infrastructure changes validate every registered app and deploy each deployment-enabled app.

Each pipeline-integrated app registers its validation contract in `apps/<app>/pipeline.json`. Apps with `deploy_enabled: true` additionally implement the Docker targets:

```text
install
ci
docker-build  # deployable apps
docker-push   # deployable apps
```

This keeps workflow logic constant as the monorepo grows. Node.js apps may use npm or pnpm, and Go runtimes are also supported by the central pipeline.

The AuthNexus mirror is not a registered deployment app in Phase A because its mixed Next.js and
ASP.NET Core runtime has no accepted monorepo deployment contract yet. Its standalone repository
validates that product independently.

The complete onboarding procedure for a new app is documented in [Adding and Deploying an App](docs/adding-an-app.md).
