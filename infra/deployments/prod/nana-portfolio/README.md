# Nana Portfolio Production Deployment

This Terraform root deploys the `nana-portfolio` app to Cloud Run.

It uses reusable modules from `infra/modules` and keeps deployment-specific configuration in this folder so future apps can follow the same shape.

## Commands

Run from the repository root:

```powershell
make tf-init APP=nana-portfolio
make tf-plan APP=nana-portfolio
make tf-apply APP=nana-portfolio
make service-url APP=nana-portfolio
```

## Runtime Secrets

Create the Secret Manager values before applying Terraform:

```powershell
make add-secret APP=nana-portfolio SECRET=RESEND_API_KEY
make add-secret APP=nana-portfolio SECRET=TELEGRAM_BOT_TOKEN
make add-secret APP=nana-portfolio SECRET=TELEGRAM_CHAT_ID
```

For one-off local use, `VALUE="..."` is supported, but the prompt form is safer because it keeps the value out of shell history.

To import multiple values from an env-style file, use:

```powershell
make add-secrets APP=nana-portfolio SECRETS_FILE=.env.production
```

The file should contain `KEY=value` lines. Blank lines and lines starting with `#` are ignored.

By default, bulk import only uploads `RESEND_API_KEY`, `TELEGRAM_BOT_TOKEN`, and `TELEGRAM_CHAT_ID`. To override that list for another app, pass a comma-separated `SECRET_NAMES` value.

The deployment expects the application image to exist before apply:

```text
europe-west3-docker.pkg.dev/nana-monorepo/apps/nana-portfolio:latest
```

Build and push that image with:

```powershell
make build-cloud APP=nana-portfolio
```

Build, pin the pushed image digest, and apply the Cloud Run deployment with:

```powershell
make deploy APP=nana-portfolio
```
