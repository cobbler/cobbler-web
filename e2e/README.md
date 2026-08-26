# cobbler-frontend e2e tests

Playwright tests that run against a **real Cobbler 3.3.x backend** — not a mock. Tests create and
delete real objects, using an `e2e-<worker>-<timestamp>-<random>-<type>` naming convention
(`fixtures/naming.ts`) so parallel runs don't collide, plus a global teardown sweep
(`global-teardown.ts`) for anything a crashed/cancelled run leaves behind.

## Prerequisites

A Cobbler 3.3.x backend reachable at `http://localhost/cobbler_api` with default `cobbler`/`cobbler`
credentials — e.g. the `cobbler-dev-stack` container built from the Cobbler backend repo's
`release33` branch (see that repo's `docker/develop/develop.dockerfile` and
`docker/develop/scripts/setup-supervisor.sh`), or CI's pulled
`registry.opensuse.org/systemsmanagement/cobbler/github-ci/containers/cobbler-test-github:release33`
image.

## Running locally

```bash
npm run build typescript-xmlrpc
npm run build cobbler-api
npm run e2e            # full suite, auto-starts/stops `ng serve`
npx playwright test --ui                              # interactive debugging
npx playwright test e2e/specs/items/item-crud.spec.ts  # scope to one file
```

`npm run e2e:ci` runs the same suite against a production build, headless, matching CI.

## Safe to re-run repeatedly

The suite mutates the real backend but cleans up after itself (per-test deletes plus the global
teardown sweep). If a run is killed mid-way (e.g. Ctrl+C), leftover `e2e-*`-named objects are
cleared by the next full run's teardown, or restart the backend container.

## Layout

- `fixtures/` — XML-RPC client (`xmlrpc-client.ts`, a plain Node client — NOT the Angular
  `CobblerApiService`, which needs Angular's DI/HttpClient context), auth (real UI login once per
  worker, cached via Playwright's `storageState`), naming, and ancestor-chain creation
  (Distro → Profile → System) via direct XML-RPC.
- `item-configs/` — one config per "standard" item type (create-dialog fields, one editable field,
  parent dependency). Drives the single parametrized `specs/items/item-crud.spec.ts`.
- `page-objects/` — `ItemCrudPage` (generic, config-driven) and `LoginPage`.
- `specs/` — auth, settings (read-only), item CRUD, and action-trigger page specs.

Template/Snippet (file-content RPCs, not Item objects) and NetworkInterface (a sub-resource of
System) don't fit the generic `item-configs` model and have their own dedicated specs.
