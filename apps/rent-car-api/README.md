# Aventra Enquiry API

Fastify + PostgreSQL API for Milestone 1. The server saves enquiries and returns genuine, non-sequential references. It **does not** verify vehicle availability, collect payments or confirm reservations.

The rate catalogue is illustrative; submissions are gated by `ALLOW_SAMPLE_ENQUIRIES=false` until actual operator inventory and policies are verified.

## Routes

- `GET /healthz` — liveness probe
- `GET /v1/locations` — supported location IDs/time zones
- `POST /v1/quotes` — server-calculated base estimate
- `POST /v1/enquiries` — validated enquiry with `Idempotency-Key: <UUID v4>` (returns 201 or 200 on replay)

No public personal-data lookup endpoint is included. A reference number alone cannot authorize access to a customer's record.

## Local development

Use Node.js 22+, Docker and an isolated development PostgreSQL database.

```sh
cd apps/rent-car-api
docker compose up -d postgres
npm ci
```

Set `DATABASE_URL=postgresql://aventra:dev_only_password@localhost:5432/aventra` and `FRONTEND_ORIGINS=http://localhost:5173` in your shell. Set `ALLOW_SAMPLE_ENQUIRIES=true` **only in isolated development**. Run `npm run migrate` and `npm run dev`. Verify `GET http://localhost:8080/healthz`.

The monorepo integration workflow provisions a disposable database and runs the migrations, API tests and transaction/outbox assertions. Set `TEST_DATABASE_URL` locally for the PostgreSQL integration test. Never point tests at production.

## Persistence and email delivery

Enquiries and two notification-outbox records (customer and operator) are inserted atomically. Duplicate submissions using the same key and payload return the same receipt. Conflicting reuse returns HTTP 409. No customer PII is returned in the receipt.

Notification delivery is separate from enquiry submission. Configure `DATABASE_URL`, `SMTP_URL`, `NOTIFICATION_FROM` and `OPERATOR_EMAIL` before executing `npm run notify`. Run the worker as a scheduled, separately managed job. Delivery retries are bounded; email receipt is not guaranteed merely because an enquiry was stored.

## Container build and staging

Build with the **monorepo root as Docker context**:

```sh
docker build -f apps/rent-car-api/Dockerfile -t aventra-api:local .
```

The API is registered for monorepo validation but `deploy_enabled=false`. Do not enable deployment until you have a secured PostgreSQL instance, a Secret Manager integration, migrations and backup policies, verified operator data, configured SMTP, and a scheduled worker. Check the health endpoint and complete an isolated end-to-end staging submission before promotion. A Vite `VITE_ENQUIRY_API_URL` is public; database credentials never belong in Vite configuration.
