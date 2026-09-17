#!/bin/sh
# vim:sw=2:ts=2:sts=2:et

set -eu

entrypoint_log() {
  if [ -z "${NGINX_ENTRYPOINT_QUIET_LOGS:-}" ]; then
    echo "$@"
  fi
}

ME=$(basename "$0")

if [ -n "${COBBLER_WEB_BASE_PATH:-}" ]; then
  entrypoint_log "$ME: info: Rewriting <base href> to ${COBBLER_WEB_BASE_PATH}"
  for locale in en-US de; do
    index="/usr/share/nginx/html/$locale/index.html"
    if [ -f "$index" ]; then
      sed -i "s#<base href=\"/$locale/\"#<base href=\"${COBBLER_WEB_BASE_PATH}/$locale/\"#" "$index"
    fi
  done
else
  entrypoint_log "$ME: info: COBBLER_WEB_BASE_PATH not set, skipping base href rewrite"
fi
