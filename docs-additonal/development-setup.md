# Development Setup for Cobbler-Web

## Requirements

Please install the following things system-wide and prior to working with any of our guide:

- docker: Follow [this](https://docs.docker.com/get-docker/) guide or use your package manager to install it.
- node: Use [this](https://nodejs.org/en/download/) download link or use your package manager to install it.
- npm: Should be bundled along with `node`.
- angular/cli: Use [this](https://angular.io/guide/setup-local#install-the-angular-cli) link to install it.

## Basic setup

This will give you a setup of both repositories of the main Git branches.

1. Clone Cobbler: `git clone git@github.com:cobbler/cobbler.git`
2. Clone Cobbler Web: `git clone git@github.com:cobbler/cobbler-web.git`
3. Go into the `cobbler` directory and execute the following steps:
   - Build the Docker image: `docker build -f docker/testing/testing.dockerfile -t cobbler-testing .`
   - Run the built image: `docker run -d --name cobbler-testing -p 80:80 -p 443:443 -v $PWD:/code cobbler-testing`
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

Currently, there is nothing which should need an advanced setup.

## Error handling

### CORS

When you are running Angular applications this is a common issue. Please check the following things:

- if the request is blocked by the browser or the server (so Cobbler).
- if the request is lacking the required headers, check the Apache webserver configuration in the Cobbler testing
  container at `/etc/apache2/vhosts.d/cobbler.conf`
- if the request is resulting in a 404, check the `proxy.conf.json` for the correct URL.

We will only be guiding you as a developer very limited here as this is a very environment specific setting. Most of the
time will be "Here is a random Stackoverflow link, please read and debug yourself.".
