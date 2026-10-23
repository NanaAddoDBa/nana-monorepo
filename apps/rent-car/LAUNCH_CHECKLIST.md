# Aventra — release checklist

## Code and validation

- [x] Responsive homepage, fleet, details, favorites, and enquiry pages
- [x] Shared UI components and modular feature boundaries
- [x] Validated pickup/return dates, indicative estimates, and enquiry preparation
- [x] GitHub Actions typecheck, tests, and build
- [x] Separate public `NanaAddoDBa/rent-car-react` publishing repository

## Hosting

- [x] Configure `RENT_CAR_PAGES_TOKEN` in the source monorepo Actions secrets
- [x] Publish the static build to the destination `gh-pages` branch
- [x] Complete destination GitHub Pages build and deployment
- [ ] Verify https://nanaaddodba.github.io/rent-car-react/ on desktop and mobile

## Operator and legal readiness

- [ ] Replace example vehicles, features, prices, cities, and photographs
- [ ] Confirm permission to use every vehicle photo; prefer approved owned images
- [ ] Configure and test the actual enquiry email and phone number
- [ ] Define manual confirmation procedures or implement live availability
- [ ] Publish required business disclosures, privacy information, and rental terms
- [ ] Confirm deposits, insurance, drivers, mileage, surcharges, and cancellation policies
- [ ] Validate accessibility, responsive behavior, SEO, and third-party asset loading
- [ ] Set `VITE_PRODUCTION_READY=true` only after operational and legal sign-off

## Optional transactional features

- [ ] Secure reservation service and availability checks
- [ ] Payment provider and payment reconciliation
- [ ] Administrative inventory and pricing controls

The example catalogue is not a booking engine. A deployed website is not, by itself, a completed commercial release.
