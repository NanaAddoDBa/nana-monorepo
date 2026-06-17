# Nana Portfolio Production Deployment

This Terraform root deploys the `nana-portfolio` app to Cloud Run.

It uses reusable modules from `infra/modules` and keeps deployment-specific configuration in this folder so future apps can follow the same shape.

## Commands

Run from the repository root:

```powershell
make tf-init APP=nana-portfolio
make tf-plan APP=nana-portfolio
make tf-apply APP=nana-portfolio
```

## Runtime Secrets

Create the Secret Manager secret containers and values out-of-band before applying Terraform:

```powershell
gcloud secrets create nana-portfolio-resend-api-key --replication-policy=automatic
gcloud secrets versions add nana-portfolio-resend-api-key --data-file=-

gcloud secrets create nana-portfolio-telegram-bot-token --replication-policy=automatic
gcloud secrets versions add nana-portfolio-telegram-bot-token --data-file=-

gcloud secrets create nana-portfolio-telegram-chat-id --replication-policy=automatic
gcloud secrets versions add nana-portfolio-telegram-chat-id --data-file=-
```

The deployment expects the application image to exist before apply:

```text
europe-west3-docker.pkg.dev/nana-monorepo/apps/nana-portfolio:latest
```
