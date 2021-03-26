# Development Setup for Cobbler-Web

## Basic setup

This will give you a setup of both repositories of the main Git branches.

1. Clone Cobbler: `git clone git@github.com:cobbler/cobbler.git`
2. Clone Cobbler Web: `git clone git@github.com:cobbler/cobbler-web.git`
3. Go into the `cobbler` directory and execute the following steps:
   - Build the Docker image: `docker build -f docker/testing/testing.dockerfile -t cobbler-testing .`
   - Run the built image: `docker run -d --name cobbler-testing -v $PWD:/code cobbler-testing`
   - Inspect the container and its IP address: `docker inspect cobbler-testing | grep "IPAddress"`
4. Go into the `cobbler-web` directory and follow these steps:
   - Adjust the file `projects/cobbler-frontend/proxy.conf.json` and in the line with `target` replace the string
     `localhost` with the just filtered IP address.
   - Build the TS-XMLRPC API via: `npm run build typescript-xmlrpc`
   - Build the Cobbler-API project via: `npm run build cobbler-api`
   - Serve the Cobbler frontend via: `npm run start cobbler-frontend`
5. Go to <http://localhost:4200> to see the frontend.
6. Login is:
   - Username: `cobbler`
   - Password: `cobbler`

> **Note**: We currently have not exposed anything from the Docker container for Cobbler because it might affect your
> running network or setup. If we are confident that Cobbler and its managed components can be safely exposed, we will
> change this behaviour!

### Apache configuration for the Cobbler Server

Snippets for the Apache config at `/etc/apache2/vhosts.d/cobbler.conf`:

- Put this to the other `IfmMdule` declarations
```
<IfModule !headers_module>
    LoadModule headers_module /usr/lib64/apache2/mod_headers.so
</IfModule>
```
- Put the following underneath the `<VirtualHost>` line
```
Header set Access-Control-Allow-Origin "*"
```

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
