# Nana Monorepo

This repository is being structured as a monorepo for Nana Addo's portfolio and future deployable applications.

## Apps

```text
apps/
`-- nana-portfolio/
    `-- Makefile
```

### `apps/nana-portfolio`

The current portfolio website built with Next.js, React, TypeScript, and Tailwind CSS.

App-specific documentation lives in:

```text
apps/nana-portfolio/README.md
```

## Planned Infrastructure

The repository is being prepared for reusable Google Cloud Run infrastructure:

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
