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

The setting `cobblerUrls` is a list of Cobbler server entries, so you can configure multiple Cobbler instances or a
single instance with multiple URLs. Each entry is either a plain string (a URL, meaning password-only login — the
shape shown above) or an object `{ "url": "...", "authMode": "...", "ssoLoginUrl": "..." }` if that particular
server should offer Kerberos/GSSAPI single sign-on. To change the used URL, please log out of the Web UI and log
back in with a different one.

See [Kerberos / SSO Login](#kerberos--sso-login) below for the per-server `authMode` and `ssoLoginUrl` fields.

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

## Kerberos / SSO Login

The Web UI can offer a Kerberos/GSSAPI single sign-on login **instead of** the username/password form, configured
**per Cobbler server** — one entry in `cobblerUrls` can use Kerberos SSO while another (in the same dropdown) uses
normal username/password login, e.g. one server for staff on the Kerberos-joined network and another for
external/VPN access via password. A single server is always either password-based or SSO-based, never both. The
browser itself never sees Kerberos tickets: it makes a
`withCredentials` request to a small `ssoLoginUrl` endpoint that must be provided by a reverse proxy (or the
Cobbler server itself) sitting in front of the Cobbler backend, using SPNEGO to negotiate with the browser and
returning `{ "username": ..., "token": ... }` on success. Enable it per server via `authMode` and `ssoLoginUrl` on
that server's `cobblerUrls` entry in `app-config.json` (see [Configuration](#configuration) above):

```json
{
  "cobblerUrls": [
    "https://legacy.example.com/cobbler_api",
    {
      "url": "https://kerberized.example.com/cobbler_api",
      "authMode": "sso",
      "ssoLoginUrl": "/cobbler-sso/login"
    }
  ]
}
```

A plain string entry (like `"https://legacy.example.com/cobbler_api"` above) is shorthand for
`{ "url": "...", "authMode": "password" }` — password-only, the default/unchanged behavior — so existing
deployments' `cobblerUrls` lists keep working with zero migration. Mixing password-only and SSO-configured servers
in the same `cobblerUrls` list is fully supported and expected.

- `authMode: "password"` (default when omitted, or a plain string entry) — password form only; SSO is never
  attempted for that server.
- `authMode: "sso"` — the manual username/password form is **hidden** for that server, and an SSO attempt is made
  once that server has been selected and confirmed reachable (see below). This is not merely a UI preference — it
  reflects a hard backend constraint: the `authentication.passthru` module required to bridge either supported SSO
  backend ignores the submitted username entirely and only checks the password against a server-side shared
  secret, and Cobbler loads exactly one authentication module system-wide (no chaining). Once `passthru` is
  configured on that backend, the manual form can never authenticate a real user against it — a single server is
  therefore always either password-based or SSO-based, never both. The server field itself stays visible in every
  state (it selects which configured Cobbler backend to talk to, not a credential).
- **The Web UI never attempts SSO against a server until that server's reachability check succeeds.** Selecting an
  SSO-configured server immediately hides the manual form (it's non-functional for that server either way), but
  the actual SSO negotiation request is only fired once the existing server-reachability check confirms the
  selected server is reachable. This means there is no risk of a premature or misdirected SSO negotiation attempt
  against the wrong or an unreachable backend — e.g. while the user is still typing/picking a server, or if the
  configured server is temporarily down.
- **With only one `cobblerUrls` entry, a confirmed-reachable SSO attempt fires automatically.** With more than one
  entry, it does not — the page instead shows a "Sign in via Kerberos" button and waits for the user to click it.
  Without this, whichever server was last used (auto-selected from `localStorage` on load) would silently attempt
  SSO before the user has a chance to notice or pick a different server from the dropdown, which is especially
  risky when only one of several configured servers uses SSO. The button is only enabled once that server's
  reachability check has succeeded, same as the automatic path.

The exact SSO bridge that terminates SPNEGO and issues Cobbler tokens depends on which Cobbler backend is fronting
the Web UI:

### release33 / Apache-bridge backend

On a `release33`-line Cobbler server, the SSO bridge is typically implemented as a small CGI/WSGI script fronted
by `mod_auth_gssapi` in Apache. Two `<Location>` blocks are needed: one for the SSO bridge endpoint itself, and one
to keep the static Angular app reachable **without** Kerberos negotiation — the app has to load and run in the
browser before it can call the bridge, so gating the app behind SPNEGO too would create a chicken-and-egg problem.

```apache
# Kerberos-protected SSO bridge: negotiates with the browser and mints a Cobbler token.
<Location "/cobbler-sso/login">
    AuthType GSSAPI
    AuthName "Cobbler SSO"
    GssapiCred KRB5_KTNAME:/etc/krb5.keytab
    GssapiUseS4U2Proxy off
    Require valid-user

    ProxyPass        "http://127.0.0.1:8081/cobbler-sso/login"
    ProxyPassReverse "http://127.0.0.1:8081/cobbler-sso/login"
</Location>

# The static Angular app must stay reachable without Kerberos negotiation so it can load first.
<Location "/">
    ProxyPass        "http://127.0.0.1:8080/"
    ProxyPassReverse "http://127.0.0.1:8080/"
</Location>
```

Matching `/config/app-config.json`:

```json
{
  "cobblerUrls": [
    {
      "url": "https://cobbler.example.org/cobbler_api",
      "authMode": "sso",
      "ssoLoginUrl": "/cobbler-sso/login"
    }
  ]
}
```

### main / containerized backend

On the `main`-line, containerized Cobbler backend, SSO termination is expected to be handled by a Traefik reverse
proxy in front of the `cobblerd` HTTP API, using Traefik's `forwardAuth` middleware (or an equivalent SPNEGO-aware
sidecar) backed by a mounted Kerberos keytab, forwarding to an `/sso_login` route that mints the Cobbler token.
The keytab must be mounted read-only into whichever container performs the GSSAPI negotiation, and the service
principal it contains must match the vhost hostname (see checklist below).

Matching `/config/app-config.json`:

```json
{
  "cobblerUrls": [
    {
      "url": "https://cobbler.example.org/cobbler_api",
      "authMode": "sso",
      "ssoLoginUrl": "/sso_login"
    }
  ]
}
```

### Security checklist (both flavors)

- **HTTPS end-to-end.** Kerberos negotiation headers and the resulting Cobbler token must never travel over plain
  HTTP, including between the reverse proxy and the backend if they are on different hosts.
- **Matching service principal.** The Kerberos service principal used for the SPNEGO negotiation (e.g.
  `HTTP/cobbler.example.org@REALM`) must exactly match the hostname of the vhost users actually connect to — a
  mismatch causes negotiation failures that are easy to misdiagnose as a Web UI bug.
- **Never trust a client-supplied identity header.** Do not configure the reverse proxy (Apache, Traefik, or
  otherwise) to accept an incoming `Remote-User`/`X-Remote-User` header from the client as the authenticated
  identity. Only the identity the auth layer itself establishes during the GSSAPI/SPNEGO exchange is trustworthy;
  anything read from a request header can be spoofed by a client that reaches the bridge directly.
- **Keep `ssoLoginUrl` same-origin.** The SSO request is made with `withCredentials: true`, so `ssoLoginUrl`
  should be a root-relative path (e.g. `/sso_login`) served from the same origin as the Web UI, not a
  cross-origin URL — combining cross-origin requests with credentials widens the attack surface unnecessarily.
- **There is no working password fallback for a server once SSO is configured on it.** `authMode: "sso"` hides the
  manual login form entirely for that server entry, because the backend's `passthru`-based design makes it
  non-functional for real users regardless of `authMode` (see above). Off-domain or non-Kerberos clients selecting
  that server will see the SSO "unavailable"/"error" message with no way to log in manually — confirm the
  Kerberos/SPNEGO happy path actually works for your intended user population _before_ enabling `authMode: "sso"`
  on a server entry in production, since there is no fallback to fall back on for that server. Keep a plain-string
  (password-only) entry alongside it in `cobblerUrls` if some users need a
  non-Kerberos path.
- **Logging out suppresses auto-SSO for exactly the next page load.** Without this, a still-valid browser Kerberos
  ticket would make the login page immediately re-attempt (and typically succeed at) SSO again after logout,
  making logout a no-op on an SSO-configured server. Clicking "Log out" therefore sets a one-time, `sessionStorage`
  -backed flag that the very next load of the login page consumes: that one load does not auto-attempt SSO. The
  manual form itself only changes for an SSO-configured server, where it stays **hidden** as a substitute — it
  would still be non-functional there. For an SSO-configured server, the page shows an explicit "You have been
  logged out" message. Both its wording and its recovery button adapt to how many servers are configured: with
  only one `cobblerUrls` entry (where the server field itself is hidden, since there's nothing to pick) it invites
  reloading via a "Reload page" button; with more than one entry it instead mentions picking a different server
  from the dropdown, which stays visible and functional throughout, and shows the same "Sign in via Kerberos"
  button used elsewhere (see below) rather than "Reload page" — clicking it re-attempts SSO directly, bypassing
  the suppression flag for that one explicit click (the flag only ever suppresses _automatic_ re-attempts, never a
  user's explicit request to sign back in). A password-only server shows the same generic "You have been logged
  out" message too (with its fully functional form still visible underneath) purely so the login form's size
  doesn't visibly change as the user browses between an SSO-configured and a password-only entry in the server
  dropdown right after logging out. The flag is cleared as soon as it's read, so a subsequent reload or navigation
  resumes normal automatic SSO behavior.

## Common issues

### CORS

In a production environment this should not be an issue as the Cobbler backend is supposed to have the header
`Access-Control-Allow-Origin=*`. Please verify if this header is present if you encounter issues.

The issue of CORS [cannot be solved inside the Web UI](https://angular.dev/tools/cli/deployment#requesting-data-from-a-different-server-cors),
as such each administrator must debug and fix these issues for their own setup.
