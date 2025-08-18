#!/bin/sh
# vim:sw=2:ts=2:sts=2:et

set -eu

entrypoint_log() {
  if [ -z "${NGINX_ENTRYPOINT_QUIET_LOGS:-}" ]; then
    echo "$@"
  fi
}

ME=$(basename "$0")

if [ -f "/config/app-config.json" ]; then
  entrypoint_log "$ME: info: Copying config to webroot"
  cp /config/app-config.json /usr/share/nginx/html/app-config.json
else
  entrypoint_log "$ME: info: No config file found"
fi
