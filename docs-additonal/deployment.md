# Deployment

There are at the moment no configuration files that can be edited.

## Bare-Metal

TBD

## Docker / Podman

With Docker:

```
docker run -d -p 8080:80 ghcr.io/cobbler/cobbler-web:main
```

With Podman:

```
podman run -d -p 8080:80 ghcr.io/cobbler/cobbler-web:main
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
podman run -d -p 8080:80 -v $(pwd)/app-config.json:/config/app-config.json:ro ghcr.io/cobbler/cobbler-web:<tag>
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

## Common issues

### CORS

In a production environment this should not be an issue as the Cobbler backend is supposed to have the header
`Access-Control-Allow-Origin=*`. Please verify if this header is present if you encounter issues.

The issue of CORS [cannot be solved inside the Web UI](https://angular.dev/tools/cli/deployment#requesting-data-from-a-different-server-cors),
as such each administrator must debug and fix these issues for their own setup.
