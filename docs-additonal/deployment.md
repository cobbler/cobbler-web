# Deployment

There are at the moment no configuration files that can be edited.

## Bare-Metal

TBD

## Docker / Podman

The container runs as an unprivileged user (UID 101) and listens on port 8080.

With Docker:

```
docker run -d -p 8080:8080 ghcr.io/cobbler/cobbler-web:main
```

With Podman:

```
podman run -d -p 8080:8080 ghcr.io/cobbler/cobbler-web:main
```

### Running with Read-Only Filesystem

For enhanced security, the container supports running with a read-only filesystem:

```
podman run -d -p 8080:8080 \
  --read-only \
  --tmpfs /tmp:rw,noexec,nosuid,size=64m \
  --tmpfs /var/cache/nginx:rw,noexec,nosuid,size=64m \
  ghcr.io/cobbler/cobbler-web:main
```

## Helm Chart

The detailed instructions for this are found here: <https://github.com/cobbler/charts>

The most minimal example is:

1. `helm repo add cobbler https://cobbler.github.io/charts/`
2. `helm install cobbler/cobbler-web --generate-name`

## Configuration

The Angular-based Web UI is making all connections from the users browser. Without configuration the Web UI is assuming
that the Cobbler Server is reachable at `http://localhost/cobbler_api`.

To change that please mount a file into the container at `/config/app-config.json`. This file should have the following
content:

```json
{
  "cobblerUrls": ["http://cobbler.example.org/cobbler_api"]
}
```

The setting ``cobblerUrls` is a list of strings, so you can configure multiple Cobbler instances or a single instance
with multiple URLs. To change the used URL, please log out of the Web UI and log back in with a different one.

Example for Docker/Podman:

```shell
podman run -d -p 8080:8080 \
  -v $(pwd)/app-config.json:/config/app-config.json:ro \
  ghcr.io/cobbler/cobbler-web:<tag>
```

Example for Helm:

```yml
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: cobbler-web-config-json
data:
  app-config.json: |
    {
      "cobblerUrls": [
        "http://cobbler.example.org/cobbler_api"
      ]
    }
```

And the `values.yml` then contain a paragraph like so:

```yml
volumes:
  - name: config
    configMap:
      name: cobbler-web-config-json
volumeMounts:
  - name: config
    mountPath: /config
```

## Reverse Proxy Under a Subpath

By default the Web UI expects to be served at the root of its domain (e.g. `https://host/`). To serve it
under a path prefix instead (e.g. `https://host/cobbler_web/`), set the `COBBLER_WEB_BASE_PATH` environment
variable on the container. It must start with `/` and must **not** have a trailing slash, e.g.
`/cobbler_web`. It should stay a simple path segment (no regex metacharacters), since it is substituted
into the container's nginx configuration. Leaving it unset (the default) preserves the current root
behavior.

With Docker/Podman:

```shell
podman run -d -p 8080:8080 \
  -e COBBLER_WEB_BASE_PATH=/cobbler_web \
  ghcr.io/cobbler/cobbler-web:<tag>
```

With Helm, add to `values.yml`:

```yml
env:
  - name: COBBLER_WEB_BASE_PATH
    value: /cobbler_web
```

The container then rewrites its own `<base href>` and internal redirects to match, so a reverse proxy in
front of it no longer needs to rewrite any HTML — it only needs to forward the subpath through unchanged
(no path stripping). For example, with Apache:

```apache
<Location "/cobbler_web/">
    ProxyPass        "http://127.0.0.1:8080/cobbler_web/"
    ProxyPassReverse "http://127.0.0.1:8080/cobbler_web/"
</Location>
```

Note that the `/config/app-config.json` mount path described above is an internal container path and is
unaffected by `COBBLER_WEB_BASE_PATH`.

## Common issues

### CORS

In a production environment this should not be an issue as the Cobbler backend is supposed to have the header
`Access-Control-Allow-Origin=*`. Please verify if this header is present if you encounter issues.

The issue of CORS [cannot be solved inside the Web UI](https://angular.dev/tools/cli/deployment#requesting-data-from-a-different-server-cors),
as such each administrator must debug and fix these issues for their own setup.
