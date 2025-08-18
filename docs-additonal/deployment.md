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

## Common issues

### CORS

In a production environment this should not be an issue as the Cobbler backend is supposed to have the header
`Access-Control-Allow-Origin=*`. Please verify if this header is present if you encounter issues.

The issue of CORS [cannot be solved inside the Web UI](https://angular.dev/tools/cli/deployment#requesting-data-from-a-different-server-cors),
as such each administrator must debug and fix these issues for their own setup.
