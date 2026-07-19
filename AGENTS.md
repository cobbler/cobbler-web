# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Cobbler-Web is the Angular-based web UI for [Cobbler](https://github.com/cobbler/cobbler), a Linux provisioning
server. The UI talks directly to the Cobbler server's XML-RPC API from the browser — there is no
backend-for-frontend; all requests originate client-side.

## Workspace layout

This is a single Angular CLI workspace (`angular.json`) with three projects that **must be built in dependency
order**:

1. **`typescript-xmlrpc`** (library, `projects/typescript-xmlrpc`) — generic XML-RPC client: serializes/deserializes
   XML-RPC payloads over `HttpClient` (`AngularXmlrpcService`). No knowledge of Cobbler.
2. **`cobbler-api`** (library, `projects/cobbler-api`) — depends on `typescript-xmlrpc`. `CobblerApiService`
   (`projects/cobbler-api/src/lib/cobbler-api.service.ts`) exposes one method per Cobbler XML-RPC call
   (get/find/save/remove/modify for every item type, background\_\* task triggers, auth, events...). It's several
   thousand lines and almost entirely repetitive boilerplate: each method builds params, calls
   `client.methodCall(...)`, and maps the `MethodResponse`/`MethodFault` union into a typed result or a thrown
   `Error`. When adding a new Cobbler XML-RPC method, copy the shape of a neighboring method of the same kind
   (getter / finder / background action) rather than inventing a new pattern. Item shapes live in
   `projects/cobbler-api/src/lib/custom-types/` (`items.ts`, `misc.ts`, `settings.ts`, `signatures.ts`).
3. **`cobbler-frontend`** (application, `projects/cobbler-frontend`) — the actual Angular app. It imports
   `typescript-xmlrpc` and `cobbler-api` **by package name**, which TypeScript resolves via `tsconfig.json` `paths`
   to the **built output in `dist/`**, not the library source. This means: after changing anything in
   `typescript-xmlrpc` or `cobbler-api`, you must rebuild those libraries before the frontend picks up the change
   (see Commands below) — editing the source alone will not affect a running `ng serve` or the frontend's
   type-checking.

The app bootstraps as a standalone Angular app (`projects/cobbler-frontend/src/main.ts`, `bootstrapApplication`) —
there is no `AppModule`. Routes live in `app-routing.module.ts` and are registered via `provideRouter`.

## Commands

All commands are run from the repo root via `npm run <script> <project>` (wrapping `ng <script> <project>`).

```bash
npm install                              # install deps (also run after pulling lockfile changes)

# Build (order matters — cobbler-api and cobbler-frontend depend on typescript-xmlrpc build output)
npm run build typescript-xmlrpc
npm run build cobbler-api
npm run build cobbler-frontend            # or: npm run build cobbler-frontend --configuration=production

npm run start cobbler-frontend            # ng serve, http://localhost:4200, proxies /cobbler_api per proxy.conf.json

npm run test typescript-xmlrpc            # vitest, watch mode
npm run test cobbler-api
npm run test cobbler-frontend
npm run test:ci <project>                 # single run + coverage (lcov under coverage/<project>)

npm run lint <project>                    # eslint (@angular-eslint + prettier) for one workspace project
npx prettier . --check                    # whole-repo formatting check (separate CI job from eslint)
npx prettier . --write                    # auto-format

npm run doc                               # generate Compodoc site (docs-additonal/ is included as extra pages)
```

To run a single spec file, use the underlying test runner directly, e.g.
`npx vitest run projects/typescript-xmlrpc/src/lib/serializer.spec.ts`.

There are currently no e2e tests (the Protractor e2e job in CI is explicitly disabled).

CI (`.github/workflows/testing.yml`, `lint.yml`) runs exactly the sequence above per project: `npm ci` → build
`typescript-xmlrpc` → build `cobbler-api` → build/test/lint the target project. Mirror that order locally when
validating changes that touch more than one project.

## Local dev environment (talking to a real Cobbler server)

The frontend needs a running Cobbler XML-RPC server to log into. Per `docs-additonal/development-setup.md`, the
standard way to get one locally is the `cobbler` repo's Docker dev container:

```bash
docker build -f docker/develop/develop.dockerfile -t cobbler-dev .
docker run -it --rm --name cobbler-dev -p 80:80 -p 443:443 -v ${PWD}:/code cobbler-dev
./docker/develop/scripts/setup-supervisor.sh
```

Default dev login is `cobbler` / `cobbler`. `projects/cobbler-frontend/src/proxy.conf.json` proxies `/cobbler_api`
to `http://localhost:80/cobbler_api` for `ng serve`.

## Runtime configuration

There are no build-time environment configs beyond Angular's standard `environment.ts`/`environment.prod.ts` file
replacement. Instead, the deployed server URL(s) come from a JSON file fetched at runtime by `AppConfigService`
(`projects/cobbler-frontend/src/app/services/app-config.service.ts`), which merges
`assets/configs/app-config.json` (baked into the build) with `/app-config.json` (optionally mounted at deploy
time, e.g. into the container at `/config/app-config.json` — see `docs-additonal/deployment.md`). The active
server URL and auth token are then persisted in `localStorage` by `UserService`
(`projects/cobbler-frontend/src/app/services/user.service.ts`) and read by `cobblerUrlFactory`/`COBBLER_URL`
(`projects/cobbler-api/src/lib/lib.config.ts`) when constructing `CobblerApiService`.

## Frontend architecture: item CRUD screens

Most of `projects/cobbler-frontend/src/app/items/<item-type>/` follows the same structure for each Cobbler object
type (distro, profile, system, repository, image, file, menu, package, management-class, template, snippet,
network-interface):

- `<item>-shell.component.ts` — a thin `<router-outlet>` wrapper so nested routes (e.g. a profile's `autoinstall`
  sub-view) share layout/breadcrumb context. Some item types nest a second shell around their edit route (see
  `profile/edit/profile-edit-shell.component.ts`, `system/edit/system-edit-shell.component.ts`) when the edit page
  itself has child routes.
- `overview/<item>-overview.component.ts` — lists items (table/tree), backed by `CobblerApiService.get_<item>s()`/
  `find_items_paged()`.
- `edit/<item>-edit.component.ts` — load-by-name-from-route, edit, and save/remove via the matching
  `CobblerApiService` methods.
- `create/<item>-create.component.ts` — creation flow, where present.

Routes for all item types are declared together as nested children under `path: 'items'` in
`app-routing.module.ts`; breadcrumb labels are supplied per-route via `data.breadcrumb` (either a `$localize`
string, `{ alias: 'itemName' }` to substitute the route param, or `{ skip: true }`/`{ disable: true }`). Follow
the existing nesting pattern (shell → overview/edit → optional sub-shells) when adding a new item type or a new
sub-view of an existing one, rather than flattening routes.

Reusable, item-agnostic UI (dialogs, key/value editors, autocomplete, the autoinstall viewer, the help button)
lives under `projects/cobbler-frontend/src/app/common/`.

`AuthGuardService` (`services/auth-guard.service.ts`) guards nearly every route via `canActivate`, checking the
stored token against `CobblerApiService.token_check`.

## Internationalization

The app uses Angular's built-in `$localize` i18n (not ngx-translate). Source locale is `en-US`; German (`de`)
lives at `projects/cobbler-frontend/src/locale/messages.de.xlf` and is wired up in `angular.json` under the
`cobbler-frontend` project's `i18n` block. Translatable strings use `$localize` with an explicit `@@id` (e.g.
`` $localize`:@@breadcrumb.items.distro:Distros` ``) — always give new strings an explicit, namespaced `@@id`
matching the existing dotted convention (e.g. `breadcrumb.items.<name>`) rather than an auto-generated one, so
the id stays stable across `extract-i18n` runs. Use the `extract-i18n` architect target
(`ng extract-i18n cobbler-frontend`) to refresh `messages.xlf` after adding strings. Translation sync with
Weblate is configured in `weblate.yaml`.

## Style / lint conventions

- Formatting is Prettier with default settings (`.prettierrc` is `{}`) — don't hand-format, run Prettier.
- ESLint config (root `.eslintrc.json`) applies to the frontend app; each library project has its own
  `.eslintrc.json`. Component/directive selectors in library code use the `lib` prefix; the frontend app is
  configured with `cobbler` as its schematics prefix for new components generated via `ng generate`.
- `allowedCommonJsDependencies: ["lodash"]` is explicitly whitelisted in `angular.json` — avoid adding further
  CommonJS deps without extending that list.
