# Aventra

Aventra is a car-rental browsing and enquiry website built with React, TypeScript, Vite, and Tailwind CSS. Its source is maintained at `apps/rent-car` in [nana-monorepo](https://github.com/NanaAddoDBa/nana-monorepo).

> **Operational status:** Vehicles, photos, locations, and rates are example data. The site prepares enquiries; it does not check live availability, confirm reservations, or process payments. Replace the examples and publish actual rental terms before accepting customers.

## Features

- Responsive fleet and vehicle detail pages
- Filters for location, category, transmission, and daily rate
- Saved vehicles stored in the visitor's browser
- Pickup and return date validation with indicative price estimates
- Enquiry text prepared for email, or copied when an operator email is not configured
- Light and dark themes
- Reusable UI primitives in `src/shared/ui`

## Development

Requires Node.js 22 or later.

```sh
cd apps/rent-car
npm install
cp .env.example .env.local
npm run dev
```

The Windows equivalent of the copy command is `copy .env.example .env.local`.

```sh
npm run typecheck
npm run test
npm run build
npm run check
```

Only public operator contact details belong in `.env.local`. Every `VITE_*` variable is embedded in the client bundle. Do not put credentials or private keys in these variables.

## Architecture

```text
src/
├── app/        Routing and application providers
├── pages/      Routed pages and page-specific sections
├── widgets/    Header, footer, search form, and vehicle card
├── features/   Booking enquiries, catalogue filters, favorites, theme
├── entities/   Vehicle models and example fleet records
└── shared/     UI primitives, common utilities, and configuration
```

Components import down the layer hierarchy: pages → widgets → features → entities → shared. Shared components do not depend on application features. Each feature contains its own model, logic, or UI where needed.

The shared UI follows the shadcn/ui source-owned component approach, with a `components.json` configuration, Tailwind design tokens, and Radix primitives where appropriate. Avoid putting feature logic inside shared UI components.

## Configuration

| Variable | Purpose |
|---|---|
| `VITE_BOOKING_EMAIL` | Public address used for prepared enquiry emails |
| `VITE_CONTACT_PHONE` | Public operator phone number |
| `VITE_BASE_PATH` | Vite asset base (defaults to `/rent-car-react/`) |
| `VITE_PRODUCTION_READY` | Enable indexing only after launch requirements are met |

The enquiry form launches the visitor's mail application with a prepared message. The visitor must **send the message**. There is no server-side submission, reservation, or payment service.

## Publishing

Source remains in `NanaAddoDBa/nana-monorepo`; the compiled static site is published to the `gh-pages` branch of the separate [NanaAddoDBa/rent-car-react](https://github.com/NanaAddoDBa/rent-car-react) repository.

The deployment workflow is [Aventra / Publish rent-car-react](https://github.com/NanaAddoDBa/nana-monorepo/actions/workflows/rent-car-pages.yml). It runs when rental source changes are merged to `master`, or manually through **Run workflow**.

The destination repository already exists. To authorize deployment:

1. Create a fine-grained personal access token restricted to `NanaAddoDBa/rent-car-react`, with repository **Contents: Read and write**.
2. Add that token as the `RENT_CAR_PAGES_TOKEN` **Actions repository secret in `nana-monorepo`**, not in the publishing repository.
3. Run the publishing workflow on the `master` branch. Confirm that the `gh-pages` branch was populated.
4. In `rent-car-react → Settings → Pages`, select **Deploy from a branch**, `gh-pages`, `/(root)`. Review the Pages deployment and verify [the target site](https://nanaaddodba.github.io/rent-car-react/).

A green application build does not mean Pages has published the website. Keep the `gh-pages` branch as a generated deployment target; edit the app in the monorepo.

## Commercial release requirements

Before public use, provide verified vehicle inventory, rental prices and availability; actual operator contact details; compliant business and privacy disclosures; complete rental and cancellation policies; and permission to use all imagery. For automated reservations, payments, or accounts, integrate an appropriate secure backend.

See [LAUNCH_CHECKLIST.md](./LAUNCH_CHECKLIST.md).

## Image licensing

Example fleet images are served from Unsplash and are subject to the [Unsplash License](https://unsplash.com/license). Replace them with properly licensed photographs of actual vehicles before commercial operation. The site uses Lucide icons and locally maintained UI components.
