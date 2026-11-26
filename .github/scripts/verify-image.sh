#!/bin/sh
# Smoke-tests a built cobbler-web container image: starts it with and without a
# mounted runtime app-config.json and checks that it comes up cleanly and serves
# both the app and the mounted config. Guards against regressions such as
# https://github.com/cobbler/cobbler-web/issues/680 (webroot not writable by the
# unprivileged container user, breaking the runtime-config copy on startup).
#
# Usage: .github/scripts/verify-image.sh <image-ref>

set -eu

IMAGE="${1:?usage: $0 <image-ref>}"
WORKDIR=$(mktemp -d)
CONFIG_CONTAINER=""
PLAIN_CONTAINER=""
BASE_PATH_CONTAINER=""

cleanup() {
  status=$?
  for c in "$CONFIG_CONTAINER" "$PLAIN_CONTAINER" "$BASE_PATH_CONTAINER"; do
    if [ -n "$c" ]; then
      echo "--- logs: $c ---"
      docker logs "$c" 2>&1 || true
      docker rm -f "$c" >/dev/null 2>&1 || true
    fi
  done
  rm -rf "$WORKDIR"
  exit "$status"
}
trap cleanup EXIT

fail() {
  echo "verify-image: FAIL: $*" >&2
  exit 1
}

wait_for_http() {
  url="$1"
  for _ in $(seq 1 30); do
    if curl -fsS -o /dev/null "$url" 2>/dev/null; then
      return 0
    fi
    sleep 1
  done
  return 1
}

# Asserts that requesting $1 (optionally with extra curl args, e.g. a
# request header) returns a redirect to exactly $2.
check_redirect() {
  url="$1"
  expected="$2"
  shift 2
  actual=$(curl -fsS -o /dev/null -w '%{redirect_url}' "$@" "$url") \
    || fail "request to $url failed"
  [ "$actual" = "$expected" ] \
    || fail "expected $url to redirect to $expected, got '$actual'"
}

echo '{"cobblerUrls": ["https://cobbler-web-ci.example.invalid/cobbler_api"]}' >"$WORKDIR/app-config.json"

echo "verify-image: starting container with mounted runtime config"
CONFIG_CONTAINER=$(docker run -d -p 18080:8080 \
  -e COBBLER_WEB_ABSOLUTE_REDIRECT=off \
  -v "$WORKDIR/app-config.json:/config/app-config.json:ro,Z" "$IMAGE")

wait_for_http "http://localhost:18080/app-config.json" || fail "container with mounted config never became ready"

if docker logs "$CONFIG_CONTAINER" 2>&1 | grep -qi "permission denied"; then
  fail "entrypoint reported a permission error while copying the mounted config"
fi

curl -fsS "http://localhost:18080/app-config.json" -o "$WORKDIR/served-app-config.json" \
  || fail "could not fetch /app-config.json from the running container"

if ! diff -q "$WORKDIR/app-config.json" "$WORKDIR/served-app-config.json" >/dev/null; then
  fail "served /app-config.json does not match the mounted config file"
fi

curl -fsS -o /dev/null "http://localhost:18080/en-US/" || fail "app did not serve /en-US/ with a mounted config"

echo "verify-image: checking locale-redirect behavior (COBBLER_WEB_ABSOLUTE_REDIRECT=off)"
docker exec "$CONFIG_CONTAINER" nginx -t || fail "rendered nginx config is invalid (no base path)"

check_redirect "http://localhost:18080/en-US" "http://localhost:18080/en-US/"
check_redirect "http://localhost:18080/de" "http://localhost:18080/de/"
check_redirect "http://localhost:18080/en" "http://localhost:18080/en-US/"
check_redirect "http://localhost:18080/" "http://localhost:18080/en-US/"
check_redirect "http://localhost:18080/" "http://localhost:18080/de/" -H "Accept-Language: de"

echo "verify-image: starting container without a mounted config"
PLAIN_CONTAINER=$(docker run -d -p 18081:8080 "$IMAGE")

wait_for_http "http://localhost:18081/en-US/" || fail "container without a mounted config never became ready"

if docker logs "$PLAIN_CONTAINER" 2>&1 | grep -qi "permission denied"; then
  fail "entrypoint reported a permission error with no config mounted"
fi

# COBBLER_WEB_ABSOLUTE_REDIRECT defaults to "on" (nginx's own default), which
# builds an absolute Location using nginx's own listen port (8080) rather
# than whatever port a reverse proxy in front of it is actually reached on.
# This container is run with no override, so its redirect target must still
# say :8080 (not the host-mapped 18081) -- confirming the default preserves
# today's behavior and the fix is opt-in, not forced on every deployment.
echo "verify-image: checking default COBBLER_WEB_ABSOLUTE_REDIRECT=on behavior is preserved"
check_redirect "http://localhost:18081/en-US" "http://localhost:8080/en-US/"

echo "verify-image: starting container with a COBBLER_WEB_BASE_PATH subpath"
BASE_PATH_CONTAINER=$(docker run -d -p 18083:8080 \
  -e COBBLER_WEB_BASE_PATH=/cobbler_web \
  -e COBBLER_WEB_ABSOLUTE_REDIRECT=off "$IMAGE")

wait_for_http "http://localhost:18083/cobbler_web/en-US/" || fail "container with a base path never became ready"

docker exec "$BASE_PATH_CONTAINER" nginx -t || fail "rendered nginx config is invalid (with base path)"

check_redirect "http://localhost:18083/cobbler_web" "http://localhost:18083/cobbler_web/"
check_redirect "http://localhost:18083/cobbler_web/" "http://localhost:18083/cobbler_web/en-US/"
check_redirect "http://localhost:18083/cobbler_web/en-US" "http://localhost:18083/cobbler_web/en-US/"
check_redirect "http://localhost:18083/cobbler_web/de" "http://localhost:18083/cobbler_web/de/"
check_redirect "http://localhost:18083/cobbler_web/en" "http://localhost:18083/cobbler_web/en-US/"

echo "verify-image: OK"
