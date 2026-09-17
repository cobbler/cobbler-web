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

cleanup() {
  status=$?
  for c in "$CONFIG_CONTAINER" "$PLAIN_CONTAINER"; do
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

echo '{"cobblerUrls": ["https://cobbler-web-ci.example.invalid/cobbler_api"]}' >"$WORKDIR/app-config.json"

echo "verify-image: starting container with mounted runtime config"
CONFIG_CONTAINER=$(docker run -d -p 18080:8080 -v "$WORKDIR/app-config.json:/config/app-config.json:ro,Z" "$IMAGE")

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

echo "verify-image: starting container without a mounted config"
PLAIN_CONTAINER=$(docker run -d -p 18081:8080 "$IMAGE")

wait_for_http "http://localhost:18081/en-US/" || fail "container without a mounted config never became ready"

if docker logs "$PLAIN_CONTAINER" 2>&1 | grep -qi "permission denied"; then
  fail "entrypoint reported a permission error with no config mounted"
fi

echo "verify-image: OK"
