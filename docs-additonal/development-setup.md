# Development Setup for Cobbler-Web

## Requirements

Please install the following things system-wide and prior to working with any of our guide:

- docker: Follow [this](https://docs.docker.com/get-docker/) guide or use your package manager to install it.
- node: Use [this](https://nodejs.org/en/download/) download link or use your package manager to install it.
- npm: Should be bundled along with `node`.
- angular/cli: Use [this](https://angular.io/guide/setup-local#install-the-angular-cli) link to install it.

## Basic setup

> Please ensure that if you are on Windows that you have set the git setting `core.autocrlf` to `false` and `core.eol` to `lf`!

This will give you a setup of both repositories of the main Git branches.

1. Clone Cobbler: `git clone git@github.com:cobbler/cobbler.git`
2. Clone Cobbler Web: `git clone git@github.com:cobbler/cobbler-web.git`
3. Go into the `cobbler` directory and execute the following steps:
   - Cobbler's `main` branch is natively containerized: build and start the development Compose stack
     (`cobblerd`, `http-api`, Traefik, ...) with `docker compose -f compose.dev.yml up --build -d`.
   - This exposes the XML-RPC API at `http://localhost/cobbler_api`, which is what this project's
     `proxy.conf.json` already points at, so no frontend-side configuration is needed.
   - The stack runs detached; follow the daemon's log with: `docker compose -f compose.dev.yml logs -f cobblerd`
   - See `docs/user-guide/docker-deployment.rst` in the `cobbler` repository for the full reference on this stack.
4. Go into the `cobbler-web` directory and follow these steps:
   - Run an `npm install` to install the development and runtime dependencies.
   - Build the TS-XMLRPC API via: `npm run build typescript-xmlrpc`
   - Build the Cobbler-API project via: `npm run build cobbler-api`
   - Serve the Cobbler frontend via: `npm run start cobbler-frontend`
5. Go to <http://localhost:4200> to see the frontend.
6. Login is:
   - Username: `cobbler`
   - Password: `cobbler`

## Advanced setup

When developing the Web Frontend it is needed sometimes to switch between different release codestreams. In the following, a few examples of the current codestreams can be seen:

### Main

> This assumes that you are in the root folder of the backend repository.

Cobbler's `main` branch runs as a set of natively containerized services instead of the single supervisord-managed
container used on older codestreams:

```
git checkout main
docker compose -f compose.dev.yml up --build -d
```

Tear it down again with `docker compose -f compose.dev.yml down`. See `docs/user-guide/docker-deployment.rst` for
the full reference on this stack.

### release33

> This assumes that you are in the root folder of the backend repository.

Cobbler 3.3.x predates the native-container stack above and still uses the old supervisord-managed development
container. Pair it with the `1.x.x` release series of Cobbler Web -- later Cobbler Web releases target Cobbler's
natively containerized `main` branch and are not guaranteed to work against 3.3.x.

```
git checkout release33
docker build -f docker/develop/develop.dockerfile -t cobbler-dev:release33 .
docker run -it --rm --name cobbler-dev -p 80:80 -p 443:443 -v ${PWD}:/code cobbler-dev:release33
make clean
./docker/develop/scripts/setup-supervisor.sh
```

## Error handling

### CORS

When you are running Angular applications this is a common issue. Please check the following things:

- if the request is blocked by the browser or the server (so Cobbler).
- if the request is lacking the required headers, check the Apache webserver configuration in the Cobbler testing
  container at `/etc/apache2/vhosts.d/cobbler.conf`
- if the request is resulting in a 404, check the `proxy.conf.json` for the correct URL.

We will only be guiding you as a developer very limited here as this is a very environment specific setting. Most of the
time will be "Here is a random Stackoverflow link, please read and debug yourself.".
