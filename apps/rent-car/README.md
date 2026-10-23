# Aventra — rental site

A modern, self-contained React + Vite + TypeScript car rental **browse-and-inquire** site. Developed independently as an adaptation of the product experience showcased by [dt4real/rent-car-react](https://github.com/dt4real/rent-car-react).

**Important:** This repository currently contains an *illustrative fleet and prices*, not a connected booking engine. No live availability, reservations, payment processing, or insurance coverage is implied. Do not present it as a live rental operator until the checklist below is completed.

## Features

- Editorial, responsive homepage; booking search by location and date
- Fleet catalogue with URL-persisted filters for location, type, gearbox and daily budget
- Car detail views with specifications and request action
- Saved cars stored locally on the visitor's device
- Date-validated booking inquiries with base-rate estimates and a prepared email request
- Configurable operator email/phone using public Vite environment variables
- Light/dark theme, keyboard focus, native accessible form controls
- Reusable shadcn-style UI primitives and consistent Tailwind v4 theme tokens
- Node built-in tests for rental dates, pricing and car filters
- CI and GitHub Pages deployment workflows

## Local development

Requires Node.js 22+.

1. Change directory to apps/rent-car.
2. Run: npm install
3. Copy .env.example to .env.local and configure the public operator contact details if available.
4. Run: npm run dev
5. Run checks: npm run check

Your locally running site is available at the Vite URL shown in the terminal.

## Architecture

src/
  app/              HashRouter and composition roots
  pages/            Home, fleet, detail, favorites, booking and information
  widgets/          Header, footer, car card and rental search
  features/         Booking request, catalogue filters, favorites and theme
  entities/car/     Car model and illustrative fixtures
  shared/ui/        Reusable shadcn-style components
  shared/lib/       Date utilities and class-name helper
  shared/config/    Public operator configuration

Rules: pages compose widgets/features; widgets depend on features/entities/shared; features depend on entities/shared; shared never imports higher layers. UI primitives do not contain business logic. Each route, component, data model, and utility has a single responsibility.

## shadcn/ui

The project includes compatible components.json, Vite alias @/, Tailwind v4 CSS tokens, and reusable local components in src/shared/ui. They use the shadcn approach (owned source, variant-based Button, Card primitives, etc.). To add further generated components, run the official shadcn CLI from apps/rent-car and verify it honors the configured ui alias. Native selects are intentionally used for keyboard and form reliability.

## Public environment variables

- VITE_BOOKING_EMAIL: operator mailbox used by the email request action
- VITE_CONTACT_PHONE: public rental contact number
- VITE_BASE_PATH: Vite production asset base (defaults to /rent-car-react/)
- VITE_PRODUCTION_READY: set to true *only after* legal and operating requirements are verified, to enable search indexing

Everything prefixed with VITE_ is exposed in the public JavaScript bundle. Never place API keys or secrets in these settings.

If VITE_BOOKING_EMAIL is unset, the request form offers a copyable draft instead of falsely claiming to send anything. When set, the browser opens the user's email client with a prepared message; **the visitor must press Send**. Mail delivery and availability are not checked by the site.

## Publish at https://nanaaddodba.github.io/rent-car-react/

**The application source stays in the monorepo** at `apps/rent-car/`. Publishing uses a separate, public `NanaAddoDBa/rent-car-react` GitHub repository containing only the compiled static website on its `gh-pages` branch. GitHub Pages assigns a default project URL based on the name of the publishing repository.

The `nana-monorepo` repository has other applications and its own potential Pages root. **Do not enable Pages on the monorepo merely to host Aventra.** The workflow `.github/workflows/rent-car-pages.yml` deploys to the dedicated output repository.

### One-time setup required on GitHub

1. While signed in as `NanaAddoDBa`, [create a public repository](https://github.com/new) named **rent-car-react**. Initialize it with a README so it has a default branch. Do not fork the unlicensed upstream source.
2. Create a **fine-grained GitHub personal access token** limited to this new `rent-car-react` repository, granting **Contents: Read and write** (plus the default Metadata access). Set an expiration and keep it secret. Do not paste tokens in chat, commits or public configuration.
3. Open the **source** repository `NanaAddoDBa/nana-monorepo` → **Settings → Secrets and variables → Actions → Secrets**. Create the repository secret **RENT_CAR_PAGES_TOKEN** with your scoped token. The workflow safely skips publication until this secret is configured.
4. Optionally set `AVENTRA_BOOKING_EMAIL`, `AVENTRA_CONTACT_PHONE` and `AVENTRA_PRODUCTION_READY` (default false) as **Actions repository variables** in `nana-monorepo`. These public values are embedded into the browser bundle.
5. From the monorepo **Actions** tab, run **Aventra / Publish rent-car-react** using **Run workflow** on `master`. Alternatively merge a change under `apps/rent-car/`. This validates, builds with the Vite base `/rent-car-react/`, and publishes the generated site to the **gh-pages** branch of `NanaAddoDBa/rent-car-react`. The generated branch is force-updated; do not keep other content there.
6. Once the publishing job succeeds and the destination branch exists, go to **NanaAddoDBa/rent-car-react → Settings → Pages**. Under **Build and deployment**, select **Deploy from a branch** → `gh-pages` → `/(root)` → **Save**. The Pages build runs in this destination repository.
7. After the destination Pages deployment succeeds, open **https://nanaaddodba.github.io/rent-car-react/**. Check the landing page, CSS, images, navigation, `#/fleet` deep links, filtering, favorites and booking request form on mobile and desktop. A passing monorepo build does not prove that the site is online.

The nested monorepo URL `https://nanaaddodba.github.io/nana-monorepo/rent-car-react/` is *not* the same address as your requested `https://nanaaddodba.github.io/rent-car-react/`. This setup intentionally uses the dedicated repository for the exact requested address.

### Continuous deployment

After the initial setup, pushes to `master` touching `apps/rent-car/` or the publishing workflow automatically update the `rent-car-react` site's `gh-pages` branch. Maintain application code only in `nana-monorepo`; the destination repository is generated output.

## Before public commercial launch

- Replace fictional inventory, category claims, prices, locations and representative photos with actual owned or approved vehicle records.
- Connect a trusted booking backend if customers must receive confirmed reservations, availability checks, payment collection or account features.
- Set and test a real operator email and phone number. Verify the full inquiry process with an actual device and mailbox.
- Publish reviewed rental agreements, cancellation/insurance/mileage/deposit rules and mandatory business disclosures for your country.
- Replace the demonstration privacy notice with an accurate privacy policy; review GDPR and third-party image hosting; self-host photos where appropriate.
- Configure domain, SEO metadata, monitoring, backups and accessibility audits before enabling indexing.
- Check CI, main branch, hosting settings and production smoke tests.

See LAUNCH_CHECKLIST.md for a release gate.

## Attribution

Independent code and product design, inspired by the public demonstration https://github.com/dt4real/rent-car-react . That source repository did not expose an explicit LICENSE file at the time of inspection, so its source code and image files were **not** copied here. Representative images are linked from Unsplash under the Unsplash License (https://unsplash.com/license) and should be replaced with approved inventory photographs for commercial use. shadcn/ui is a component design approach; this project owns its component implementations.

## Security

No payment credentials, customer form submissions, or passwords are stored or processed by this static application. Favorites and theme are saved to localStorage; booking draft text stays in React memory. Do not add private keys to any client bundle.