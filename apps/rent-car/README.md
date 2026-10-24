# Aventra

Aventra is a car-rental browsing and enquiry website built with React, TypeScript, Vite, and Tailwind CSS. Its source is maintained at `apps/rent-car` in [nana-monorepo](https://github.com/NanaAddoDBa/nana-monorepo).

> **Operational status:** Vehicles, photos, locations, and rates are example data. The site prepares enquiries; it does not check live availability, confirm reservations, or process payments. Replace the examples and publish actual rental terms before accepting customers.

## Features

- Responsive fleet and vehicle detail pages
- Filters for location, category, transmission, and daily rate
- Saved vehicles stored in the visitor's browser
- Pickup and return locations, local dates and times, with time-zone-aware base estimates
- Trip details and fleet filters preserved across results, details and review
- Server-backed guest enquiries, idempotent retries and references when the API is enabled
- Clearly identified email/copy fallback while online submission remains disabled
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
# After installing Playwright Chromium browsers: npm run test:e2e
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
| `VITE_ENQUIRY_API_URL` | HTTPS location of the independently deployed API |
| `VITE_ENABLE_LIVE_ENQUIRIES` | Set to true only after API/operator sign-off; defaults to false |
| `VITE_PRODUCTION_READY` | Enable indexing only after launch requirements are met |

The guest enquiry journey now contains an editable trip form, a separate review screen and an API-issued receipt screen. **By default the site still uses a clearly labeled email/copy fallback** and does not claim any record was saved. When a verified enquiry API is configured, the server validates and persists the request, returns a unique reference and queues notifications. Even then, the receipt is not a confirmed vehicle reservation. Backend setup: [rent-car-api/README.md](../rent-car-api/README.md).

## Publishing

Source remains in `NanaAddoDBa/nana-monorepo`; the compiled static site is published to the `gh-pages` branch of the separate [NanaAddoDBa/rent-car-react](https://github.com/NanaAddoDBa/rent-car-react) repository.

The deployment workflow is [Aventra / Publish rent-car-react](https://github.com/NanaAddoDBa/nana-monorepo/actions/workflows/rent-car-pages.yml). It runs when rental source or publishing-workflow changes are merged to `main`, or manually through **Run workflow** on `main`. Runs on other branches skip publishing. Publishing-workflow pull requests run the Aventra typecheck, tests and build before merge.

Each changed build is committed on top of the existing `gh-pages` history using `NanaAddoDBA <nanaaddoldoe@gmail.com>`, with the source commit SHA in its message. Publishing uses a normal push and preserves previous deployments. If the generated files already match the published site, the workflow skips creating a duplicate deployment commit.

The destination repository exists and its GitHub Pages deployment workflow has succeeded. To configure or rotate publishing credentials:

1. Create a fine-grained personal access token restricted to `NanaAddoDBa/rent-car-react`, with repository **Contents: Read and write**.
2. Add that token as the `RENT_CAR_PAGES_TOKEN` **Actions repository secret in `nana-monorepo`**, not in the publishing repository.
3. Run the publishing workflow on the `main` branch. Confirm that the `gh-pages` branch was populated.
4. In `rent-car-react → Settings → Pages`, select **Deploy from a branch**, `gh-pages`, `/(root)`. Review the Pages deployment and verify [the target site](https://nanaaddodba.github.io/rent-car-react/).

A green application build alone does not prove that Pages has published the website. Confirm the destination repository's Pages job separately. Keep the `gh-pages` branch as a generated deployment target; edit the app in the monorepo.

## Commercial release requirements

Before public use, provide verified vehicle inventory, rental prices and availability; actual operator contact details; compliant business and privacy disclosures; complete rental and cancellation policies; and permission to use all imagery. For automated reservations, payments, or accounts, integrate an appropriate secure backend.

See [LAUNCH_CHECKLIST.md](./LAUNCH_CHECKLIST.md).

## Incoming link parameters

The entry URL is normalized before the React router starts. Common marketing tags (UTM parameters and click IDs) are removed from both the normal URL query and HashRouter route query using the browser History API. The cleanup preserves `#/fleet` and other application routes, plus vehicle filters, pickup/return dates and unrelated query parameters. No navigation or extra network request is needed.

## Image licensing

Example fleet images are served from Unsplash and are subject to the [Unsplash License](https://unsplash.com/license). Replace them with properly licensed photographs of actual vehicles before commercial operation. The site uses Lucide icons and locally maintained UI components.
