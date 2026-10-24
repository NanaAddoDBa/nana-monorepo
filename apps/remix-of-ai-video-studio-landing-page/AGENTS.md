# Project architecture

- Run app tooling from the application root; the app Makefile derives its directory from its own location so inclusion from a monorepo cannot redirect relative paths.
- Keep GitHub validation metadata app-local in pipeline.json; deployment requires separately configured hosting rather than enabling an unconfigured Cloud Run service.
- Keep relocation regression tests in tests/project-paths.test.mjs using Node's test runner so CI can validate folder resolution without additional test dependencies.
- Integrate monorepo root commands with scoped npm --prefix scripts instead of introducing dependency hoisting; retain existing root defaults, and verify routing in tests/workspace-routing.test.mjs when the app runs in the monorepo.