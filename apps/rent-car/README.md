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
- VITE_BASE_PATH: Vite production asset base (defaults to /nana-monorepo/)
- VITE_PRODUCTION_READY: set to true *only after* legal and operating requirements are verified, to enable search indexing

Everything prefixed with VITE_ is exposed in the public JavaScript bundle. Never place API keys or secrets in these settings.

If VITE_BOOKING_EMAIL is unset, the request form offers a copyable draft instead of falsely claiming to send anything. When set, the browser opens the user's email client with a prepared message; **the visitor must press Send**. Mail delivery and availability are not checked by the site.

## Deploy to GitHub Pages

This app is under [NanaAddoDBa/nana-monorepo](https://github.com/NanaAddoDBa/nana-monorepo) in apps/rent-car. The repo-level workflow .github/workflows/rent-car-pages.yml builds the app and deploys its dist/ on merges to master.

1. Review and merge the associated feature pull request.
2. In repository Settings > Pages > Build and deployment, choose **GitHub Actions**.
3. In Settings > Secrets and variables > Actions > Variables, set AVENTRA_BOOKING_EMAIL and AVENTRA_CONTACT_PHONE, as appropriate. Optionally AVENTRA_PRODUCTION_READY=true after launch sign-off.
4. Trigger 'Aventra / GitHub Pages' if it has not yet run. Confirm the published URL in the workflow deployment result.
5. Verify the deployed asset paths, navigation and email handoff on mobile and desktop.

The expected project Pages address, **once Pages is enabled and the workflow succeeds**, is https://nanaaddodba.github.io/nana-monorepo/ . This is not claimed to be live before verification.

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