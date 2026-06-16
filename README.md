# Nana Monorepo

This repository is being structured as a monorepo for Nana Addo's portfolio and future deployable applications.

## Apps

```text
apps/
└── nana-portfolio/
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
├── modules/
└── environments/
```

Target defaults:

- GCP project: `addo-monorepo`
- Region: `europe-west3`
- Terraform state bucket: `addo-monorepo-tf-state`
- Artifact Registry repository: `apps`
- Terraform apply: manual only
- Secret values: managed out-of-band through Google Secret Manager

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

The root `Makefile` mirrors these simple targets for environments with `make` installed.
